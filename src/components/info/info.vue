<template>
    <div class="page-all">

        <!-- <div class="page-scroll"> -->
        <!-- 内容主体区域 -->
        <div class="main">
            <mt-tab-container v-model="selected">

                <!-- 信息页 -->
                <mt-tab-container-item id="UESTC" class="uestc-info" v-infinite-scroll="loadMore"
                    infinite-scroll-disabled="loading" infinite-scroll-distance="10"
                    :infinite-scroll-immediate-check='true' v-if="selected === 'UESTC'" @scroll="scrollY($el)"
                    ref="scroll_item">


                    <!-- 搜索框 -->
                    <div class="homepage-search">
                        <div class="search-cell">
                            <div class="search-field">
                                <div class="search-icon mintui mintui-search "></div>
                                <div class="search-content">
                                    <input type="search" placeholder="请输入搜索关键词" v-model.trim='searchVal'
                                        @keyup.enter="searchInfo">
                                    <span class="iconfont icon-qingchu" v-show="clearIconShow"
                                        @click="searchVal = ''"></span>
                                </div>
                                <span class="search-sure" @click="searchInfo">确定</span>
                            </div>
                        </div>
                    </div>


                    <!-- 轮播图 -->
                    <div class='homepage-swipper'>
                        <mt-swipe :auto="4000">
                            <mt-swipe-item v-for="swipper in swipperInfo" :key='swipper.id'>
                                <a :href="swipper.linkUrl">
                                    <img :src="swipper.imgUrl" alt="你一定会脱单的">
                                </a>
                            </mt-swipe-item>
                        </mt-swipe>
                    </div>


                    <!-- 小菜单区域 -->
                    <div class="homepage-menu" @click.stop.capture="sortPush">
                        <div class="homepage-menuItem" v-for="(menu,menuIndex) in homepageMenu" :key='menuIndex'
                            :data-sort='menu.sort'>
                            <span :class="['iconfont',menu.icon, 'fz-15']"></span>
                            <p>{{menu.content}}</p>
                        </div>
                    </div>

                    <!-- 间隔线 -->
                    <div class="line-10"></div>

                    <!-- 详情信息 -->
                    <div class="homepage-moreinfo">

                        <detail-info v-for="info in topInfo" :key="info.infoId" isSetTop :model='info'
                            @click.native.stop="$router.push(`/info/${info.infoId}`)"></detail-info>
                        <detail-info v-for="info in mainInfo" :key='info.infoId' :model='info'
                            @click.native.stop="$router.push(`/info/${info.infoId}`)"></detail-info>

                    </div>


                    <!-- 加载动画 -->
                    <div class="loadingMore">
                        <mt-spinner v-show="!mainInfoEnd" type="snake" color='#ffabe1' :size='32'>
                        </mt-spinner>
                        <p v-show="mainInfoEnd">- 没有更多了 -</p>
                    </div>

                    <!-- 无处不在的底部发送消息按钮 -->
                    <div class="sendMessageBtn" v-show="showSendBtn">
                        <mt-button plain type='primary' size='small' @click.native="sendMessage">发消息</mt-button>
                    </div>
                </mt-tab-container-item>



                <!-- 聊天页 -->
                <mt-tab-container-item id="CHAT">
                    <chat v-if="!!$store.state.userInfo && showChat" ref='chat' />
                    <!-- <chat-yan :refresh='refreshChat' /> -->
                </mt-tab-container-item>

                <!-- 我的 -->
                <mt-tab-container-item id="MINE">
                    <mine v-if="!!$store.state.userInfo &&showMine" />
                </mt-tab-container-item>

            </mt-tab-container>
        </div>
        <!-- </div> -->


        <!-- 底部跳转栏区域 -->
        <mt-tabbar v-model="selected" fixed>
            <mt-tab-item id="UESTC">
                <span slot="icon" class="iconfont icon-zhuye fz-12"></span>
                <span>成电</span>
            </mt-tab-item>
            <mt-tab-item id="CHAT">
                <span slot="icon" class="iconfont icon-drxx59 fz-12"></span>
                <span>CHAT</span>
                <mt-badge size="large" type='error' v-if="$store.state.userInfo && $store.state.unReadCount.total > 0">
                    {{$store.state.unReadCount.total}}</mt-badge>
            </mt-tab-item>
            <mt-tab-item id="MINE">
                <span slot="icon" class="iconfont icon-wode fz-12"></span>
                <span>我的</span>
            </mt-tab-item>
        </mt-tabbar>

        <!-- 发消息弹出框 -->
        <mt-popup v-model="sendMessageVisible" popup-transition="popup-fade" class="sendMessagePop">
            <div class="messageTitle">发布成电</div>
            <div class="messageMain">
                <router-link class='sortItem' v-for="(sort,sortKey,index) in messageSort" :key="index"
                    :to="{path: 'sendMessage',query: {module: `${sortKey}`}}">
                    {{sort}}</router-link>
            </div>
        </mt-popup>
    </div>

</template>

<script>
    import detailInfo from '@/components/common/detailInfo/detailInfo.vue';
    import mine from '@/components/mine/mine.vue';
    import chat from '@/components/chat/chat.vue';
    // import chatYan from '@/components/chat/chatyanshi.vue';
    export default {
        components: {
            detailInfo,
            mine,
            chat,
        },
        data() {
            return {
                // 加载更多的滚动状态 false代表会继续加载 
                loading: false,
                // 是否显示发信息按钮 配合加载更多数据时使用
                showSendBtn: true,
                // 默认展示首页信息
                selected: 'UESTC',
                // 搜索值
                searchVal: '',

                // 轮播图数据
                swipperInfo: [],
                // 分类菜单
                homepageMenu: [{
                        sort: 'jobs',
                        icon: 'icon-zhaopin',
                        content: '招聘求职'
                    },
                    {
                        sort: 'unused',
                        icon: 'icon-ershoushebei',
                        content: '二手闲置'
                    },
                    {
                        sort: 'counts',
                        icon: 'icon-dangjiyouhui',
                        content: '优惠信息'
                    },
                    {
                        sort: 'finds',
                        icon: 'icon-dibudaohanglan-',
                        content: '寻人寻物'
                    },
                    {
                        sort: 'helps',
                        icon: 'icon-Z',
                        content: '打听求助'
                    }
                ],

                // 置顶信息
                topInfo: [],
                // 获取非置顶信息时的查询条件
                mainForm: {
                    // 每页30条
                    pageSize: 30,
                    // 第一页
                    page: 1,
                },
                // 非置顶数据拉取完毕的标志
                mainInfoEnd: false,
                // 非置顶信息
                mainInfo: [],


                // 记录点击的帖子ID 用于事件委托跳转
                pushInfoId: '',
                // 发消息弹出框
                sendMessageVisible: false,
                messageSort: {
                    'jobs': '招聘求职',
                    // 'cars': '校内拼车',
                    // 'houses': '校园租房',
                    'unused': '闲置二手',
                    'counts': '优惠信息',
                    'finds': '寻人找物',
                    'helps': '打听求助',
                    // 'chats': '闲来有聊',
                    // 'dinners': '约饭走起'
                },
                // 根据登录状态是否显示"我的/CHAT"
                showMine: false,
                showChat: true,
                scrollTop: 0,
                isFromLogin: false,
                isCreated:true,
            }
        },
        beforeRouteEnter(to, from, next) {
            // console.log(from);
            // 如果是从详情页返回 主页 则代表使用缓存数据
            if (from.name === 'InfoMore') {
                console.log('from===', from.meta);
                // 判断是否使用缓存
                if (from.meta.useAlive) {
                    to.meta.isBack = true;
                    to.meta.keepalive = true;
                    next(vm => {
                        vm.searchVal = '';
                        vm.sendMessageVisible = false;
                    })
                } else {
                    from.meta.useAlive = true;
                    to.meta.isBack = false;
                    to.meta.keepalive =false;
                    next(vm => {
                        vm.mainInfoEnd = false;
                        vm.loading = false;
                        vm.searchVal = '';
                        vm.sendMessageVisible = false;
                        vm.mainInfo = [];
                        vm.mainForm.page = 1;
                       /*  vm.showChat = false;
                        vm.$nextTick(() => {
                            vm.showChat = true;
                            vm.showMine = true;
                        }) */
                    })
                }
                console.log('fromInfoMore', to.meta);
               
            } else if (from.path === '/') {
                sessionStorage.clear()
                next();
            } else if (from.path === '/login') {
                next(vm => {
                    vm.isFromLogin = true;
                    if (sessionStorage.getItem('tag')) {
                        vm.selected = sessionStorage.getItem('tag')
                        sessionStorage.removeItem('tag')
                    }
                });
            }else if (from.name === 'aboutMe') {
                // console.warn('from aboutMe',to.meta);
                to.meta.isBack = true;
                next(vm=> {
                    vm.showChat = false;
                    vm.$nextTick(() => {
                        vm.showChat = true;
                        vm.showMine = true;
                    })
                });
            }else {
                to.meta.isBack = false;
                next(vm => {
                    vm.mainInfoEnd = false;
                    vm.loading = false;
                    vm.searchVal = '';
                    vm.sendMessageVisible = false;
                    vm.mainInfo = [];
                    vm.mainForm.page = 1;
                    vm.showChat = false;
                    vm.$nextTick(() => {
                        vm.showChat = true;
                        vm.showMine = true;
                    })
                })
            }

        },
        async created() {
            // this.scrollTop = 0;
           /*  await this.initial();
            console.log('create==');
            this.$route.meta.keepalive = true;
            this.isCreated = true;
            let sTop = JSON.parse(localStorage.getItem('scrollTop'));
            // console.log('sc--',typeof JSON.parse(localStorage.getItem('scrollTop')));
            if(sTop > 0) {
                this.$nextTick(()=> {
                    this.$refs.scroll_item.$el.scrollTop =sTop;
                    console.log('mounted--');
                })
                localStorage.setItem('scrollTop',JSON.stringify(0))
            } */
        },
        async mounted() {
          /*   let sTop = JSON.parse(localStorage.getItem('scrollTop'));
            // console.log('sc--',typeof JSON.parse(localStorage.getItem('scrollTop')));
            if(sTop > 0) {
                this.$nextTick(()=> {
                    this.$refs.scroll_item.$el.scrollTop =sTop;
                    console.log('mounted--');
                })
            }
            localStorage.setItem('scrollTop',JSON.stringify(0)) */
           /*  if(!this.$route.meta.keepalive) {
                this.scrollTop = 0;
                this.initial();
                this.$route.meta.keepalive = true;
                console.log('-===>?',this.$route.meta);
            } */
            this.isCreated = true;

            await this.initial();
            console.log('create==');
            this.$route.meta.keepalive = true;
            let sTop = JSON.parse(localStorage.getItem('scrollTop'));
            // console.log('sc--',typeof JSON.parse(localStorage.getItem('scrollTop')));
            if(sTop > 0) {
                // this.$nextTick(()=> {
                    this.$refs.scroll_item.$el.scrollTop =sTop;
                    console.log('mounted--');
                // })
                localStorage.setItem('scrollTop',JSON.stringify(0))
            }
        },
        activated() {
            // 如果是从详情页回来的 则维持原有浏览高度
            // if (this.selected === 'UESTC') {
            if(!this.isCreated) {
                if (this.$route.meta.isBack) {
                    if(!!this.$refs.scroll_item) {
                        this.$refs.scroll_item.$el.scrollTop = this.scrollTop;
                    }
                } else {
                    this.scrollTop = 0;
                    // 如果不是从详情页返回的 重新拉取数据
                    this.initial()
                    this.$route.meta.keepalive = true;
                }
                if(localStorage.getItem('scrollTop')) {
                    localStorage.removeItem('scrollTop')
                }
                console.log('info激活', this.scrollTop);
            }
            console.log('activ--',this.isCreated);
            this.isCreated = false;
            /* if(JSON.parse( localStorage.getItem('scrollTop')) > 0){
                this.$refs.scroll_item.$el.scrollTop = this.scrollTop;
                localStorage.removeItem('scrollTop')
            } */
            // }
        },
        methods: {
            scrollY(ev) {
                console.log(ev);
                // 聊天和首页应该都会有滑动需求
                if (this.selected === 'UESTC') {
                    this.scrollTop = ev.scrollTop;

                    console.log('gggoo', [ev], ev.scrollTop);
                }
            },
            async initial() {
                // 获取轮播图数据
                this.getSwipperInfo()
                // 获取置顶信息
                await this.getTopInfo()
                // 获取非置顶信息
                await this.getMainInfo()
            },
            // 获取轮播图数据
            async getSwipperInfo() {
                const {
                    data: res
                } = await this.$http.get('/info/carouselAd').catch(err => console.log(err))
                // 接收到的数据为对象数组
                // 对轮播顺序进行排序
                this.swipperInfo = res.sort((a, b) => a.levelShow - b.levelShow)
                // console.log(this.swipperInfo);
            },
            // 获取置顶信息
            async getTopInfo() {

                const res = await this.$http.get('/info/view/topInfo').catch(err => console.log(err))
                if (!res) return this.$reToast('获取失败', 'icon-close')
                const {
                    data: infos
                } = res
                if (infos.length > 0) {
                    // 这个是一次性获取了
                    this.topInfo = infos
                }
                console.log(infos);

            },
            // 获取非置顶信息 
            // 返回值为获取到的数据条目
            async getMainInfo() {

                const res = await this.$http.get('/info/view/queryall', {
                    params: this.mainForm
                }).catch(err =>
                    console.log(err))
                if (!res) return this.$reToast('获取失败', 'icon-close')
                const {
                    data: infos
                } = res
                if (infos.length > 0) {
                    this.mainInfo = this.mainInfo.concat(infos)
                    // 加载到少的数量
                    if (infos.length !== this.mainForm.pageSize) {
                        this.mainInfoEnd = true
                    } else {
                        this.mainForm.page++;
                    }
                    // console.log(this.mainInfo, this.mainInfoEnd);
                } else {
                    // 比如总共15条数据 获取三次都是满5的获取完 那么再请求 就会res.length=0
                    // 数据拉取完结束
                    console.log('END');
                    this.mainInfoEnd = true;
                }
                console.log(infos);

            },
            searchInfo() {
                if (this.searchVal === '') return this.$reToast('输入不能为空！', 'icon-cuowu')
                this.$router.push({
                    path: '/search',
                    query: {
                        key: this.searchVal
                    }
                });
            },
            // 内部已经实现了节流 loading就代表了节流标志
            // 触底节流获取信息
            async loadMore() {
                this.showSendBtn = false;
                console.log('触发了');
                this.loading = true;
                if (this.mainInfoEnd) {
                    this.showSendBtn = true;
                    return this.$reToast('无更多数据', 'icon-tixing')
                }
                await this.getMainInfo()
                this.loading = false;
                this.showSendBtn = true;
            },

            // 点击发送消息
            sendMessage() {
                if (!this.$store.state.userInfo) {
                    //  将当前路由进行保存
                    sessionStorage.setItem('route', this.$route.fullPath)
                    // 没有登录则跳转登录
                    console.log('跳转至登录');
                    return window.location.href = this.$weixin
                    // 登录界面会接收到返回的code
                }
                console.log('发消息点击了！');
                // 显示发消息对话框
                this.sendMessageVisible = true;
            },


            // 跳转对应分类的事件委托
            sortPush(ev) {
                console.log('跳转');
                const targetTag = this.$parentPush(ev, 'homepage-menuItem');
                // 拿到对应的分类
                const sort = targetTag.dataset.sort;
                console.log(sort);
                this.$router.push({
                    path: '/list',
                    query: {
                        module: sort
                    }
                });
            },


        },
        computed: {
            // 搜索框的清除按钮是否可见
            clearIconShow() {
                return this.searchVal !== ''
            }
        },
        watch: {
            // 底部选择进行切换的时候 要重新拉取数据
            selected(newTag) {
                // 保存当前位置
                this.$store.commit('changeNowSelected',newTag)
                // 强制刷新
                this.showChat = false;
                if (newTag === 'MINE') {
                    // 判断是否登录
                    if (!this.$store.state.userInfo) {
                        //  保存当前路由
                        sessionStorage.setItem('route', this.$route.fullPath);
                        sessionStorage.setItem('tag', newTag)
                        // 跳转授权登录
                        window.location.href = this.$weixin
                    } else {
                        this.showMine = true;
                        this.showChat = false;
                    }
                } else if (newTag === 'UESTC') {
                    this.showChat = false;
                    this.mainInfoEnd = false;
                    this.mainForm.page = 1;
                    this.mainInfo = [];
                    this.getTopInfo();
                    this.getMainInfo();

                } else if (newTag === 'CHAT') {
                    // 判断是否登录
                    if (!this.$store.state.userInfo) {
                        //  保存当前路由
                        sessionStorage.setItem('route', this.$route.fullPath);
                        sessionStorage.setItem('tag', newTag)
                        // 跳转授权登录
                        window.location.href = this.$weixin
                    } else {
                        // 如果是从登录回来的 则不需要刷新两次CHAT
                        if (!this.isFromLogin) {
                            this.$nextTick(() => {
                                this.showMine = true;
                                this.showChat = true;
                            })
                        } else {
                            this.isFromLogin = false;
                            this.showChat = true;
                        }

                    }
                }
            }
        },
        beforeRouteLeave(to, from, next) {
            if (to.name === 'InfoMore') {
                // console.log();
                this.scrollTop = this.$refs.scroll_item.$el.scrollTop;
                localStorage.setItem('scrollTop',JSON.stringify(this.scrollTop))
            }
            next()
        },


    }
</script>

<style lang='scss'>
    @import './info.scss';
</style>