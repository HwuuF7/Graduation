<template>
    <!-- @scroll="scrollY($el)" -->
    <div class="sort">
        <mt-navbar v-model="activeSort" fixed>
            <mt-tab-item v-for='eachName in differSub' :key='eachName' :id="eachName">{{eachName}}</mt-tab-item>
        </mt-navbar>
        <!-- @scroll.native="scrollY($el)" -->
        <mt-tab-container v-model="activeSort">
            <mt-tab-container-item v-for='(eachName,eachIndex) in differSub' :key='eachName' :id="eachName">
                <div v-infinite-scroll="loadMore" infinite-scroll-disabled="currentModelInfo.loading"
                    infinite-scroll-distance="10" :infinite-scroll-immediate-check='true'
                    :class="`info-scroll info_scroll_${eachIndex}`" :ref="`info_scroll_${eachIndex}`"
                    @scroll.self.stop="scrollY($event)">
                    <div v-show="!currentModelInfo.loadEnd && currentModelInfo.loadInfo.length === 0" class="loading">
                        <span></span>
                    </div>
                    <detail-info v-for="info in currentModelInfo.loadInfo" :key="info.infoId" :model='info'
                        @click.native.stop='$router.push(`/info/${info.infoId}`)' />
                    <div v-if="currentModelInfo.loadEnd && currentModelInfo.loadInfo.length === 0" class="no-info">
                        <!-- 放图片 -->
                        <img src="@/assets/imgs/empty-image.png" alt="">
                        <p>暂无数据</p>
                    </div>
                </div>
            </mt-tab-container-item>
        </mt-tab-container>
    </div>
</template>

<script>
    import detailInfo from '@/components/common/detailInfo/detailInfo.vue';
    export default {
        components: {
            detailInfo
        },
        data() {
            return {
                constModule: {
                    'news': {
                        type: 'news',
                        sortArr: ['校内', '省内', '国内']
                    },
                    'jobs': {
                        type: 'job',
                        // sortArr: ['家教', '兼职', '实习', '其他'],
                        sortArr: ['校园招聘'],
                    },
                    'cars': {
                        type: 'cars',
                        sortArr: ['缺人', '缺车'],
                    },
                    'houses': {
                        type: 'houses',
                        sortArr: ['出租', '求租', '合租'],
                    },
                    'unused': {
                        type: 'unUsed',
                        // sortArr: ['课本书籍', '手机数码', '文体户外', '生活用品', '服装配饰', '美容保健', '出行工具', '其他']
                        sortArr: ['闲置出售', '闲置求购'],
                    },
                    'counts': {
                        type: 'preferential',
                        // sortArr: ['酒店客栈', '休闲娱乐', '生活服务', '购物', '旅游', '其他'],
                        sortArr: ['优惠信息'],
                    },
                    'finds': {
                        type: 'lostingFind',
                        // sortArr: ['寻人', '找物', '宠物', '失物招领'],
                        sortArr: ['寻人', '寻物', '失物招领'],
                    },
                    'helps': {
                        type: 'help',
                        sortArr: ['打听', '求助'],
                    },
                    'chats': {
                        type: 'chats',
                        sortArr: ['吐槽', '讨论', '聊天'],
                    },
                    'dinners': {
                        type: 'dinners',
                        sortArr: ['约饭', '约玩'],
                    },
                },
                // 当前的显示分类[打听/求助]
                activeSort: null,
                // 子页面对应子分类导航栏[数组]
                differSub: null,
                // 记录当前的catogory索引 用于保存scrollTop 默认为0
                cateIndex: 0,
                scrollTop: 0,
                // 是否滑动过
                isScroll: false,
                // 用来存储当前模块分类下的信息(Map类型)
                saveInfoMap: null,
                // 当前展示的数据
                currentModelInfo: {},
            }
        },
        // 从详情页返回时 维持原浏览高度
        beforeRouteEnter(to, from, next) {
            //  从详情页返回 使用缓存数据
            if (from.name === 'InfoMore') {
                to.meta.isBack = true;
                next()

            } else {
                to.meta.isBack = false;
                next(vm => {
                    // 只有这样被改变 后面的watch才会监听到
                    vm.activeSort = null;
                })
            }

        },
        activated() {
            if (this.$route.meta.isBack) {
                // 从详情页返回时 滚动条高度维持
                // this.$refs[`info_scroll_${this.cateIndex}`][0].scrollTop = this.scrollTop
                this.$refs[`info_scroll_${this.cateIndex}`][0].scrollTop = this.currentModelInfo.scrollTop;
            } else {
                // 拉取数据
                let {
                    module: toModule
                } = this.$route.query;


                // 生成当前模块下的存储信息
                this.saveInfoMap = this.createInfoMap(this.constModule[toModule]);
                // 对应导航栏
                this.differSub = this.constModule[toModule].sortArr;
                // 当前的分类默认为第0项(这里改变了watch并不生效)
                this.activeSort = this.differSub[0];
                // 将当前分类的数据取出来
                this.currentModelInfo = this.saveInfoMap.get(this.activeSort);
            }
            console.log('sort激活', this.activeSort, this.currentModelInfo);
        },
        beforeRouteLeave(to, from, next) {
            if (to.name === 'InfoMore') {
                // 记录离开前的滚动条高度
                // this.scrollTop = this.$refs[`info_scroll_${this.cateIndex}`][0].scrollTop
                this.currentModelInfo.scrollTop = this.$refs[`info_scroll_${this.cateIndex}`][0].scrollTop;
                // 保存数据  切换的时候会进行获取高度
                this.saveInfoMap.set(this.activeSort, this.currentModelInfo)
                console.log('before===', this.currentModelInfo.scrollTop);
            }
            next()
        },
        deactivated() {
            // console.log(this.$refs['info_scroll_0'][0].scrollTop, this.$refs['info_scroll_1'][0].scrollTop);
            // console.log('deactive', this.activeSort);
        },
        methods: {
            scrollY(ev) {
                // console.log(ev.target.scrollTop);
                // 将当前的滚动条进行保存 watch的时候进行存储
                this.isScroll = true;
                this.scrollTop = ev.target.scrollTop;
                // console.log('滑动了？？', ev.target.scrollTop);
            },
            // 初始化存储的InfoMap 
            // 传入的参数为写死的当前模块信息
            createInfoMap(moduleInfo) {
                let sortArr = moduleInfo.sortArr.map(sort => {
                    // 中转对象
                    let transferObj = {
                        // 获取的必要表单数据
                        getForm: {
                            // 当前激活的某一项导航
                            catogory: sort,
                            // 对应的模块大分类
                            type: moduleInfo.type,
                            // 从哪开始加载
                            pageBegin: 0,
                            // 加载条目
                            pageSize: 20,
                        },
                        // 当前加载的数据
                        loadInfo: [],
                        // 当前分类加载完
                        loadEnd: false,
                        // 是否可以继续加载
                        loading: false,
                        // 当前分类的滚动条高度
                        scrollTop: 0,
                    }

                    return [sort, transferObj]
                })
                return new Map(sortArr)
            },
            // 获取当前分类对应数据 不传第二个参数就意味着在获取同一分类的更多数据
            // 传入参数为get表单数据
            async getInfo(getForm) {
                // console.log(this.type, activeName);
                // 找到子分类对应的索引
                // const subIndex = this.differSub.findIndex(subName => subName === activeName);
                // 发送ModuleName和索引去获取数据
                // 比如/news/0 =>校内新闻 /1 => 省内新闻
                // 格式和之前首页展示的一样
                // this.modelInfo=xx

                const res = await this.$http.get('/catogory/catogoryPage', {
                    params: getForm
                }).catch(err => console.log(err))
                if (!res) return this.$reToast('获取信息失败！', 'icon-close')
                // 解构出数据
                const {
                    data: infos
                } = res;
                if (infos.length > 0) {
                    // 更新数据
                    this.currentModelInfo.loadInfo = this.currentModelInfo.loadInfo.concat(infos);
                    if (infos.length !== getForm.pageSize) {
                        // 拉取的数据少于指定数目 则意味着加载完了
                        this.currentModelInfo.loadEnd = true;
                        this.$reToast('数据加载完拉~!', 'icon-tixing')
                        // 禁止启用加载更多了
                        this.currentModelInfo.loading = true;
                    } else {
                        // 可以继续下滑懒加载
                        this.currentModelInfo.loading = false;
                    }
                    this.currentModelInfo.getForm.pageBegin += infos.length;
                } else {
                    // 没有数据可拉取
                    this.currentModelInfo.loadEnd = true;
                    // 这里凑整的获取完数据 直接提醒无数据
                    this.$reToast('无更多数据拉!', 'icon-tixing')
                    // 禁止启用加载更多了
                    this.currentModelInfo.loading = true;
                }
                console.log(this.currentModelInfo);
                // 重新设置map
                this.saveInfoMap.set(this.activeSort, this.currentModelInfo)
            },
            // 懒加载更多数据
            async loadMore() {
                console.log('触发加载更多');
                this.currentModelInfo.loading = true;
                await this.getInfo(this.currentModelInfo.getForm)
            },
        },
        watch: {
            // 监听切换分类时的数据改变
            async activeSort(newAct, oldAct) {
                if (newAct === null) return;
                if (oldAct !== null && this.isScroll) {
                    // console.log('jinlai', this.scrollTop);
                    // 保存旧的页面滚动高度
                    let oldModelInfo = this.saveInfoMap.get(oldAct);
                    oldModelInfo.scrollTop = this.scrollTop;
                    this.saveInfoMap.set(oldAct, oldModelInfo)
                    // 清除
                    this.isScroll = false;
                    this.scrollTop = 0;
                }
                // 替换显示的数据
                this.currentModelInfo = this.saveInfoMap.get(newAct)
                // 找出cate索引值
                this.cateIndex = this.differSub.findIndex((sub) => sub === newAct)
                // 从详情页跳转回来的时候 切换至另一个页面时需要赋值高度（解决BUG 
                // --> 图片拉取失败时会重新发起请求 造成渲染的位置便宜）
                this.$nextTick(() => {
                    this.$refs[`info_scroll_${this.cateIndex}`][0].scrollTop = this.currentModelInfo
                        .scrollTop
                    //    console.log('c==', this.currentModelInfo.scrollTop);
                })
                // 解构
                let {
                    loadEnd,
                    loadInfo,
                    getForm
                } = this.currentModelInfo
                // 判断是否是第一次进入
                if (!loadEnd && loadInfo.length === 0) {
                    // console.log('发请求了？');
                    // 发起请求获取数据
                    await this.getInfo(getForm)
                }
            },


        }

    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    @import './sort.scss';

    p.testP {
        height: 100px;
        border-bottom: 1px solid #654062;
    }
</style>