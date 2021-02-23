<template>
    <!-- 模块限为5个 -->
    <!-- 1-校园招聘 2-优惠信息 3-打听求助 4-寻人寻物 5-二手闲置 -->

    <!-- 发消息表单 -->
    <div class='messageSort'>
        <mt-cell title="意图" @click.native.capture="selectPurpose">
            <p ref="catogory">{{messageForm.catogory}}</p>
        </mt-cell>
        <mt-cell title="分类" @click.native.capture="selectProfession" v-show='showInnerTags'>
            <p ref="innerTag">{{messageForm.innerTag}}</p>
        </mt-cell>
        <!-- <mt-field label="意图" placeholder='请选择消息意图' disableClear 
            v-model="messageForm.catogory">
        </mt-field> -->
        <!-- <mt-field label="分类" placeholder='请选择具体分类' disableClear @focus.native.capture="selectProfession"
            v-model="messageForm.innerTag" v-show='showInnerTags'>
        </mt-field> -->


        <!-- 分模块 -->
        <!-- 拼车模块 -->
        <!-- <div class="cars-sort" v-if="showSort('cars')">
            <mt-field label="出发地" placeholder="输入2到16个字" v-model="messageForm.departure"></mt-field>
            <mt-field label="目的地" placeholder="输入2到16个字" v-model="messageForm.destination"></mt-field>
            <mt-field label="出发时间" type='date' v-model="messageForm.startTime" disableClear></mt-field>
            <mt-field label="人数/空车位" v-model="messageForm.extendVacancy"></mt-field>
        </div> -->

        <!-- 出/租房模块 -->
        <!--  <div class="houses-sort" v-if="showSort('houses')">
            <mt-field label="租金/月" placeholder="租金/月" v-model="messageForm.rent">
                <mt-checklist v-model="messageForm.discuss" :options="['面议']">
                </mt-checklist>
            </mt-field>
        </div> -->

        <!-- 闲置二手模块 -->
        <div class="unused-sort" v-if="showSort('unused')">
            <mt-field label="价格" placeholder="请输入价格或选择面议" v-model="messageForm.price" :disabled='discuss'>
                <div class='unused-discuss'>
                    <input type="checkbox" name="discuss" id="discussRadio" hidden v-model="discuss">
                    <label for="discussRadio">
                        <div class="check-icon"></div>
                        <span>面议</span>
                    </label>
                </div>
            </mt-field>
        </div>

        <!-- 共有的模块 -->
        <div class="shared-sort">
            <!-- <mt-field label="联系人" v-model="messageForm.linkman" placeholder='你的姓名'></mt-field> -->
            <!-- <mt-field label="联系电话" v-model="messageForm.phone" placeholder='手机号或者微信号'></mt-field> -->
            <mt-cell title="标签" v-show="showTags">
                <span class="message-tag" @click.stop="selectTags" v-for="(tag,tagIndex) in specificTags"
                    :key="tagIndex" :data-tag='tag'>{{tag}}</span>
            </mt-cell>
            <div class="upload">
                <p class="upload-title">图片上传</p>
                <addPictures ref='addPictures' :maxSelect='6' />
            </div>
            <mt-field type='textarea' rows='5' v-model.trim='originContent' :placeholder='specificDesc'>
            </mt-field>
        </div>

        <!-- 显示意图选择 -->
        <mt-actionsheet :actions="purposeActions" v-model="purposeSheetVisible"></mt-actionsheet>
        <mt-actionsheet :actions="innerTagsActions" v-model="innerTagVisible" class="innerTagsSheet"></mt-actionsheet>
        <div class="surePost">
            <mt-button type='primary' @click="sendMessage">确定发布</mt-button>
        </div>

    </div>
</template>

<script>
    /*  
        // 联系人
        linkman: '',
        // 联系电话
        phone: '', 
    */
    import addPictures from '@/components/common/addPictures/addPictures.vue';
    import fixedData from './messageData.js';
    export default {
        components: {
            addPictures
        },
        data() {
            return {
                // 路由跳转获取的参数
                getSort: '',
                // 闲置二手交易模块时 价格选择了面议
                discuss: false,
                // 因为要对表情进行编码 因此要新开一个字段来双向绑定内容
                originContent: '',
                messageForm: {
                    // 用户标识 
                    openId: '',
                    // 大分类 -->catogory ['招聘','求职']
                    catogory: '请选择消息意图',
                    // 标签 
                    tags: [],
                    // 图片
                    pictures: [],
                    // 相关描述
                    content: '',
                },
                // 意图选择显示
                purposeSheetVisible: false,
                // 小分类选择显示
                innerTagVisible: false,


                // 预先准备的大分类选择静态数据（Map类型）
                prePurposeActionsMap: null,
                // 预先准备的小分类选择静态数据（Map类型）
                preInnerTagsActionsMap: null,
                // 预先准备的模块标签和默认详情提示静态数据（Map类型）
                preModuleInfoMap: null,
                // 意图选择 大分类
                purposeActions: [],
                // innerTags选择 小分类
                innerTagsActions: [],


                // 确切的模块信息 由意图Purpose来决定
                specificTags: [],
                specificDesc: '请选择意图',
            }
        },
        //生命周期 - 创建完成（访问当前this实例）
        created() {
            ({
                module: this.getSort
            } = this.$route.query);
            console.log('当前模块--', this.getSort);
            // 根据模块应用不同的表单
            this.changeMessageForm(this.getSort)
            // 初始化静态数据
            this.initStaticInfo();

            // 根据模块拿到大分类数据
            this.purposeActions = this.prePurposeActionsMap.get(this.getSort)
        },

        methods: {
            // 初始化静态数据
            initStaticInfo() {
                console.log('初始化');
                // 从固定数据中取出子分类(二手闲置下=>{出售,求购})
                let {
                    categorys: purposeBig,
                    uniqueInfo
                } = fixedData

                // 初始化对应模块的默认信息
                this.preModuleInfoMap = new Map(uniqueInfo)

                // 注册点击事件 意图（大分类）选择的格式数组
                let purposeActionsArr = []
                for (const purpose in purposeBig) {
                    let tempActions = purposeBig[purpose].map(act => {
                        return {
                            name: act,
                            method: this.selectMethod('B', act)
                        }
                    })
                    purposeActionsArr.push([purpose, tempActions])
                }
                // 初始化大分类选择
                this.prePurposeActionsMap = new Map(purposeActionsArr)

                // 注册点击事件 innerTags(小分类)选择的格式数组
                let innerTagsActionsArr = []
                for (const [key, value] of this.preModuleInfoMap.entries()) {
                    if (value['innerTags'].length > 0) {
                        let arr = value['innerTags'].map(act => {
                            return {
                                name: act,
                                method: this.selectMethod('s', act)
                            }
                        })
                        innerTagsActionsArr.push([key, arr])
                    }
                }
                // 初始化小分类选择
                this.preInnerTagsActionsMap = new Map(innerTagsActionsArr)

            },
            // 请选择的method封装
            // 接收参数为 ：
            // 第一个参数代表 大分类['B'] / 小分类 ['s']
            // 第二个参数对应代表 [purpose] / [innerTag] 
            // 返回参数为一个函数
            selectMethod(bORs, purTag) {

                if (bORs === 'B') {
                    // 大分类
                    return () => {
                        this.messageForm.catogory = purTag;
                        console.log(this.$refs.catogory);
                        this.$refs.catogory.style.color = '#000';
                        this.surePurpose()
                    }
                } else {
                    // 小分类
                    return () => {
                        this.messageForm.innerTag = purTag
                        this.$refs.innerTag.style.color = '#000';
                    }
                }

            },
            // 选择意图 大分类 招聘/求职
            selectPurpose() {
                console.log('选择意图');
                this.purposeSheetVisible = true;
            },
            // 选择小分类  家教/实习/兼职
            selectProfession() {
                console.log('选择小分类');
                this.innerTagVisible = true;
            },
            // 确认是招聘还是求职
            surePurpose() {

                let {
                    catogory
                } = this.messageForm
                // 获取小分类
                if (this.preInnerTagsActionsMap.has(catogory)) {
                    this.innerTagsActions = this.preInnerTagsActionsMap.get(catogory)
                } else {
                    //  选完大分类 没有二级分类 则将二级分类设置为一级分类相同 发送至后端
                    this.messageForm.innerTag = catogory
                }
                const specificInfo = this.preModuleInfoMap.get(catogory)
                this.specificTags = specificInfo['tags'];
                this.specificDesc = specificInfo['defaultDesc']
            },
            // 确认发布
            async sendMessage() {

                // 用户登录之后 解构出用户信息 
                const {
                    userInfo
                } = this.$store.state
                console.log('发送时的openID===', userInfo);
                // 赋值给表单数据
                this.messageForm.openId = userInfo.openId
                // this.messageForm.openId = 'oAXSp6Wo7ugTt8hQ2EJw5Jmim4YE'

                // 改造发送数据
                if (this.discuss) {
                    this.messageForm.price = '面议'
                }
                // 对发布内容进行表情编码
                this.messageForm.content = this.$emojiEncode(this.originContent);

                const picForm = this.$refs.addPictures.sendPictures()

                // post请求头配置
                let config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }

                let finalRes;
                // 没有图片 直接发
                if (picForm.length === 0) {
                    // 数据转化
                    const postMsg = new URLSearchParams(this.messageForm).toString()
                    finalRes = await this.$http.post('/info/release', postMsg, config).catch(
                        err => {
                            console.log(err);
                        })


                } else {
                    // 先发图片
                    const res = await this.$http.post('/info/view/uploadImg', picForm, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                    // 这里是请求错误
                    if (!res) {
                        return this.sendErr()

                    }
                    // 解构出图片
                    const {
                        data: pictures
                    } = res
                    // 这里是返回出错
                    if (pictures.length < 1) {
                        return this.sendErr()

                    }
                    // 改造数据
                    this.messageForm.pictures = pictures;
                    // 数据转化
                    const postMsg = new URLSearchParams(this.messageForm).toString()
                    finalRes = await this.$http.post('/info/release', postMsg, config).catch(err => {
                        console.log(err);
                    })
                    console.log('发布2', this.messageForm);
                }

                // 这里是请求错误
                if (!finalRes) {
                    return this.sendErr()
                }

                // 解构出返回结果
                const {
                    data: result
                } = finalRes
                if (result.status === 200) {
                    return this.sendPss()
                }

            },
            // 选中标签
            selectTags(ev) {
                //  切换类
                ev.currentTarget.classList.toggle('message-tag-selected');
                const getTag = ev.currentTarget.dataset.tag;
                const getIndex = this.messageForm.tags.findIndex(tag => tag === getTag);
                if (getIndex !== -1) {
                    // 数组有重复项
                    this.messageForm.tags.splice(getIndex, 1)
                } else {
                    this.messageForm.tags.push(getTag)
                }
                // console.log(this.messageForm.tags);
            },
            // 增加提交表单字段 
            // 参数为 模块名
            changeMessageForm(moduleSort) {
                // 从固定数据解构出模块对应的表单字段
                let {
                    attachForm
                } = fixedData
                let moduleMap = new Map(attachForm)
                let addForm = moduleMap.has(moduleSort) && moduleMap.get(moduleSort);
                if (addForm) {
                    this.messageForm = Object.assign({}, this.messageForm, addForm);
                    console.log('改变后的表单：', this.messageForm);
                }
            },
            // 根据不同模块展示不同的表单
            showSpecificSort(sortName) {
                return sortName === this.getSort
            },
            // 抽离重复代码->发送信息失败的提示信息
            sendErr() {
                this.$reToast('发送信息失败', ' icon-tixing');
                console.log('重置的userInfo===', this.$store.state.userInfo);
                // 重置数据
                this.originContent = '';
                this.messageForm = {
                    // 用户标识 
                    openId: this.$store.state.userInfo.openId,
                    // openId: 'oAXSp6Wo7ugTt8hQ2EJw5Jmim4YE',
                    // 大分类 -->catogory ['招聘','求职']
                    catogory: '请选择',
                    // 标签 
                    tags: [],
                    // 图片
                    pictures: [],
                    // 相关描述
                    content: '',
                };
                this.discuss = false;
                this.specificTags = [];
                this.specificDesc = '请选择意图';
                // 调用添加图片组件的清除formData
                this.$refs.addPictures.deleteFormData()
                this.changeMessageForm(this.getSort)
            },
            // 发送信息成功的提示信息
            sendPss() {
                this.$reToast('发送信息成功', ' icon-queren')
                // 发布完后跳转首页
                this.$router.push('/info')
            },
        },
        computed: {
            // 是否展示选择具体(小)分类 比如文体户外、生活用品
            showInnerTags() {
                return this.messageForm.catogory !== '请选择消息意图' && this.innerTagsActions.length > 0
            },
            // 是否展示标签 比如二手书籍、准新正品 和上面不一样
            showTags() {
                return this.messageForm.catogory !== '请选择消息意图' && this.specificTags.length > 0
            },
            showSort(sortName) {
                return this.showSpecificSort
            },
        },
        watch: {
            'messageForm.discuss'(newDis) {
                console.log(this.messageForm);
                if (newDis) {
                    this.messageForm.price = ''
                }
            }
        }
    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    @import './messageSort.scss'
</style>