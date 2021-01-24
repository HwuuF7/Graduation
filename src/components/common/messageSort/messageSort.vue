<template>
    <!-- 模块限为5个 -->
    <!-- 1-校园招聘 2-优惠信息 3-打听求助 4-寻人寻物 5-二手闲置 -->

    <!-- 发消息表单 -->
    <div class='messageSort'>
        <mt-field label="意图" disableClear @focus.native.capture="selectPurpose" v-model="messageForm.purpose">
        </mt-field>
        <mt-field label="行业" disableClear @focus.native.capture="selectProfession" v-model="messageForm.innerTag"
            v-show='showInnerTags'>
        </mt-field>


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
            <mt-field label="价格" placeholder="价格" v-model="messageForm.price">
                <mt-checklist v-model="messageForm.discuss" :options="['面议']"></mt-checklist>
            </mt-field>
        </div>

        <!-- 共有的模块 -->
        <div class="shared-sort">
            <mt-field label="联系人" v-model="messageForm.linkman" placeholder='你的姓名'></mt-field>
            <mt-field label="联系电话" v-model="messageForm.phone" placeholder='手机号或者微信号'></mt-field>
            <mt-cell title="标签" v-show="showTags">
                <span class="message-tag" @click.stop="selectTags" v-for="(tag,tagIndex) in specificTags"
                    :key="tagIndex" :data-tag='tag'>{{tag}}</span>
            </mt-cell>
            <!-- 这里要进行额外实现 ！！！！！！！-->
            <!-- <mt-field label='图片上传' v-model='messageForm.pictures'>
                <addPictures />
            </mt-field> -->
            <div class="upload">
                <p class="upload-title">图片上传</p>
                <addPictures ref='addPictures' :maxSelect='6' />
            </div>


            <mt-field type='textarea' rows='5' v-model.trim='messageForm.description' :placeholder='specificDesc'>
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
    import addPictures from '@/components/common/addPictures/addPictures.vue';
    export default {
        components: {
            addPictures
        },
        data() {
            return {
                // 路由跳转获取的参数
                getSort: '',
                messageForm: {
                    purpose: '请选择',
                    linkman: '',
                    phone: '',
                    tags: [],
                    pictures: null,
                    description: '',
                },
                // 意图选择显示
                purposeSheetVisible: false,
                // 小分类选择显示
                innerTagVisible: false,


                // 预先准备的大分类选择静态数据（Map类型）
                prePurposeActionsMap: null,
                // 预先准备的转换静态数据（Map类型） ex:'招聘=>recruit' 方便小分类选择 和 模块默认信息
                preConvertMap: null,
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
                specificDesc: '请选择意图'
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
        //生命周期 - 挂载完成（访问DOM元素）
        mounted() {

        },
        methods: {
            // 初始化静态数据
            initStaticInfo() {
                console.log('初始化');

                // 大分类
                let purposeBig = {
                    "jobs": ['招聘', '求职'],
                    "unused": ['出售', '求购'],
                    "finds": ['寻人', '寻物', '失物招领'],
                    "counts": ['优惠分享', '砍几刀'],
                    "helps": ['打听', '求助']
                }

                // 意图（大分类）选择的格式数组
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

                // 小分类
                let innerTagsSm = {
                    "recruit": ['家教', '实习', '兼职'],
                    "job": ['找家教', '找实习', '找兼职', '其他'],
                    "unused-sell": ['课本书籍', '手机数码', '文体户外', '生活用品', '服装配饰', '美容保健', '交通工具', '其他'],
                    "unused-buy": ['课本书籍', '手机数码', '文体户外', '生活用品', '服装配饰', '美容保健', '交通工具', '其他'],
                }
                // innerTags(小分类)选择的格式数组
                let innerTagsActionsArr = []
                for (const innerTag in innerTagsSm) {
                    let tempActions = innerTagsSm[innerTag].map(act => {
                        return {
                            name: act,
                            method: this.selectMethod('s', act)
                        }
                    })
                    innerTagsActionsArr.push([innerTag, tempActions])
                }

                // ChinesePurpose->EnglishMap转换
                let convertArr = [
                    ['招聘', 'recruit'],
                    ['求职', 'job'],
                    ['出售', 'unused-sell'],
                    ['求购', 'unused-buy'],
                    ['寻人', 'find-man'],
                    ['寻物', 'find-good'],
                    ['失物招领', 'find-losts'],
                    ['优惠分享', 'count-share'],
                    ['砍几刀', 'count-cut'],
                    ['打听', 'seek'],
                    ['求助', 'help']
                ]

                // 每个模块相应的默认标签和详情提示
                let moduleInfoArr = [
                    ['recruit', {
                        tags: ['五险一金', '包吃', '包住', '双休', '年底双薪', '住房补助', '话费补助', '交通补助'],
                        defaultDesc: '请说明招聘岗位、任职要求、公司介绍等'
                    }],
                    ['job', {
                        tags: ['沟通力强', '学习力强', '执行力强'],
                        defaultDesc: '个人介绍、工作经历、职位等信息'
                    }],
                    ['unused-sell', {
                        tags: ['二手书籍', '电子产品', '生活用品', '准新正品', '当面验货'],
                        defaultDesc: '请简要说明您的物品名称、参数、价格等信息'
                    }],
                    ['unused-buy', {
                        tags: ['二手书籍', '电子产品', '生活用品', '准新正品', '当面验货'],
                        defaultDesc: '请简要说明您的物品名称、参数、价格等信息'
                    }],
                    ['find-man', {
                        tags: [],
                        defaultDesc: '人物的特征信息..'
                    }],
                    ['find-good', {
                        tags: [],
                        defaultDesc: '物品信息描述..'
                    }],
                    ['find-losts', {
                        tags: [],
                        defaultDesc: '物品的特征信息及领取地点信息..'
                    }],
                    ['count-share', {
                        tags: [],
                        defaultDesc: '请务必说明优惠内容、时间及地点'
                    }],
                    ['count-cut', {
                        tags: [],
                        defaultDesc: '活动描述'
                    }],
                    ['seek', {
                        tags: [],
                        defaultDesc: '打听的人或事'
                    }],
                    ['help', {
                        tags: [],
                        defaultDesc: '求助描述'
                    }],
                ]

                // 初始化大分类选择
                this.prePurposeActionsMap = new Map(purposeActionsArr)
                // 初始化小分类选择
                this.preInnerTagsActionsMap = new Map(innerTagsActionsArr)
                // 初始化转换Map
                this.preConvertMap = new Map(convertArr)
                // 初始化对应模块的默认信息
                this.preModuleInfoMap = new Map(moduleInfoArr)
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
                        this.messageForm.purpose = purTag
                        this.surePurpose()
                    }
                } else {
                    // 小分类
                    return () => {
                        this.messageForm.innerTag = purTag
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
            test() {
                console.log('test---');
            },
            // 确认是招聘还是求职
            surePurpose() {

                // 获取到转换后的EnglishVal 招聘->recruit
                let tagKey = this.preConvertMap.get(this.messageForm.purpose)

                // 获取小分类
                if (this.preInnerTagsActionsMap.has(tagKey)) {
                    this.innerTagsActions = this.preInnerTagsActionsMap.get(tagKey)
                }

                // 赋值对应的模块信息
                if (this.preModuleInfoMap.has(tagKey)) {
                    this.specificTags = this.preModuleInfoMap.get(tagKey).tags
                    this.specificDesc = this.preModuleInfoMap.get(tagKey).defaultDesc
                }

            },
            // 确认发布
            sendMessage() {
                if (this.messageForm.discuss) {
                    this.messageForm.discuss = this.messageForm.discuss.length > 0;
                }
                this.messageForm.pictures = this.$refs.addPictures.sendPictures()
                console.log('发布2', this.messageForm);

                // 发布完后跳转首页
                // this.$router.push('/info')
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
                let moduleArr = [
                    ['jobs', {
                        innerTag: '请选择小分类22'
                    }],
                    ['unused', {
                        price: '',
                        discuss: []
                    }],
                ]
                let moduleMap = new Map(moduleArr)
                let addForm = moduleMap.has(moduleSort) && moduleMap.get(moduleSort);
                if (addForm) {
                    this.messageForm = Object.assign(this.messageForm, addForm);
                    console.log('改变后的表单：', this.messageForm);
                }
            },
            // 根据不同模块展示不同的表单
            showSpecificSort(sortName) {
                return sortName === this.getSort
            }
        },
        computed: {
            // 是否展示选择具体(小)分类 比如文体户外、生活用品
            showInnerTags() {
                return this.messageForm.purpose !== '请选择' && this.innerTagsActions.length > 0
            },
            // 是否展示标签 比如二手书籍、准新正品 和上面不一样
            showTags() {
                return this.messageForm.purpose !== '请选择' && this.specificTags.length > 0
            },
            showSort(sortName) {
                return this.showSpecificSort
            },

        },
        watch: {
            money(v) {
                console.log('pr:--', v);
            }
        }
    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    @import './messageSort.scss'
</style>