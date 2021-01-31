<template>
    <div class="page-all">


        <div class="page-scroll">
            <!-- 内容主体区域 -->
            <mt-tab-container v-model="selected">

                <!-- 信息页 -->
                <mt-tab-container-item id="UESTC" class="uestc-info">

                    <!-- 搜索框 -->
                    <mt-search v-model="searchVal" cancel-text="取消" placeholder="请输入搜索关键字"
                        @keyup.enter.native="searchInfo">
                    </mt-search>


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
                    <div class="homepage-moreinfo" v-infinite-scroll="loadTest" infinite-scroll-disabled="loading"
                        infinite-scroll-distance="10">


                        <!--  @click.stop.capture="parentPush"
                        <detail-info v-for="info in topInfo" :key="info.infoId" isSetTop :model='info'
                            :data-info_id='info.infoId'></detail-info>
                        <detail-info v-for="info in mainInfo" :key='info.infoId' :model='info'
                            :data-info_id='info.infoId'></detail-info> -->

                        <detail-info v-for="info in topInfo" :key="info.infoId" isSetTop :model='info'
                            :data-info_id='info.infoId' @click.native.stop="linkToMore(info)"></detail-info>
                        <detail-info v-for="info in mainInfo" :key='info.infoId' :model='info'
                            :data-info_id='info.infoId' @click.native.stop="linkToMore(info)"></detail-info>

                        <!-- <detail-info :model='testModel' :data-info_id='testModel.infoId' />
                        <detail-info :model='testModel2' :data-info_id='testModel2.infoId' /> -->


                        <p class="testP" v-for="i in testP" :key="i+'c'">{{i}}*i</p>


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
                    <div>聊天</div>
                </mt-tab-container-item>


                <!-- 我的 -->
                <mt-tab-container-item id="MINE">
                    <mine />
                </mt-tab-container-item>
            </mt-tab-container>
        </div>


        <!-- 底部跳转栏区域 -->
        <mt-tabbar v-model="selected" fixed>
            <mt-tab-item id="UESTC">
                <img slot="icon" src="@/assets/imgs/test.png">
                成电
            </mt-tab-item>
            <mt-tab-item id="CHAT">
                <img slot="icon" src="@/assets/imgs/test.png">
                CHAT
            </mt-tab-item>
            <mt-tab-item id="MINE">
                <img slot="icon" src="@/assets/imgs/test.png">
                我的
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
    // 以后会用到？
    /*  homepageMenu: [{
                    icon: 'news',
                    content: '新闻时事'
                }, {
                    icon: 'jobs',
                    content: '招聘求职'
                }, {
                    icon: 'cars',
                    content: '校内拼车'
                }, {
                    icon: 'houses',
                    content: '校园租房'
                }, {
                    icon: 'unused',
                    content: '闲置二手'
                }, {
                    icon: 'counts',
                    content: '优惠信息'
                }, {
                    icon: 'finds',
                    content: '寻人寻物'
                }, {
                    icon: 'helps',
                    content: '打听求助'
                }, {
                    icon: 'chats',
                    content: '闲来无聊'
                }, {
                    icon: 'dinners',
                    content: '约饭走起'
                }],

 */



    import detailInfo from '@/components/common/detailInfo/detailInfo.vue';
    import other from '@/components/other/other.vue';
    import mine from '@/components/mine/mine.vue';
    import {
        mapMutations
    } from 'vuex';
    export default {
        components: {
            detailInfo,
            other,
            mine
        },
        data() {
            return {
                // 每次加载的条目
                testP: 5,
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
                    pageBegin: 0,
                    pageSize: 4,
                },
                // 非置顶数据拉取完毕的标志
                mainInfoEnd: false,
                // 非置顶信息
                mainInfo: [],

                infoDetail: [{
                    // 发帖ID
                    infoId: '',
                    // 用户ID
                    userId: '',
                    // 用户头像(后端返回数据如果为空 前端给一个默认头像)
                    userAvatar: require('@/assets/imgs/test.png'),
                    // 用户名(后端返回数据如果为空 前端给一个'匿名用户')
                    userName: '芜湖',
                    // 该信息是否需要置顶
                    isSetTop: false,
                    // 分类关键词(必填项)
                    cateKeyWord: '生活用品',
                    // 用户发表的信息内容(必填项)
                    messageContent: 'hello world',
                    // 如果是交易性质的信息,则返回详细介绍,否则为空对象
                    transactionIntro: {
                        // 交易类型: 出售/求购
                        transType: '求购',
                        // 交易价格: 具体值/面议
                        transPrice: '面议'
                    },
                    // 描述标签(字符串数组- 可空)
                    descriptionTags: ['电子产品', '准新正品', '当面验货'],
                    // 展示图片(url数组- 可为空(0-6/9张))
                    showPictures: [require('@/assets/imgs/test.jpg'), require('@/assets/imgs/test.jpg'),
                        require('@/assets/imgs/test.jpg'), require('@/assets/imgs/test.jpg'), require(
                            '@/assets/imgs/test.jpg'), require('@/assets/imgs/test.jpg')
                    ],
                    // 消息是否已经结束了
                    isOver: false,
                    // 发帖时间
                    messageTime: new Date('2020/1/9 15:00').getTime(),
                    // 浏览次数
                    visitTimes: 10000,
                }],
                testModel: {
                    // 发帖ID
                    infoId: '123',
                    // 用户头像(后端返回数据如果为空 前端给一个默认头像)
                    userAvatar: require('@/assets/imgs/test.png'),
                    // 用户名(后端返回数据如果为空 前端给一个'匿名用户')
                    userName: '芜湖22',
                    // 该信息是否需要置顶
                    isSetTop: true,
                    // 分类关键词(必填项)
                    cateKeyWord: '生活用品22',
                    // 用户发表的信息内容(必填项)
                    messageContent: 'hello world22',
                    // 如果是交易性质,则返回详细介绍
                    // transactionIntro: {
                    //     // 交易类型: 出售/求购
                    //     transType: '出售',
                    //     // 交易价格: 具体值/面议
                    //     transPrice: '40'
                    // },
                    transactionIntro: {},
                    // 描述标签(字符串数组- 可空)
                    // descriptionTags: ['电子产品', '准新正品', '当面验货'],
                    descriptionTags: [],
                    // 展示图片(url数组- 可为空)
                    // showPictures: [require('@/assets/imgs/test.png'), require('@/assets/imgs/test.png')],
                    showPictures: [],
                    // 消息是否已经结束了
                    isOver: true,
                    // 发帖时间
                    messageTime: new Date('2020/12/15 15:00').getTime(),
                    // 浏览次数
                    visitTimes: 120,
                },
                testModel2: {
                    // 发帖ID
                    infoId: '123456',
                    // 用户头像(后端返回数据如果为空 前端给一个默认头像)
                    userAvatar: null,
                    // 用户名(后端返回数据如果为空 前端给一个'匿名用户')
                    userName: '芜湖223333',
                    // 该信息是否需要置顶
                    isSetTop: true,
                    // 分类关键词(必填项)
                    cateKeyWord: '生活用品223',
                    // 用户发表的信息内容(必填项)
                    messageContent: 'hello world223',
                    // 如果是交易性质,则返回详细介绍
                    // transactionIntro: {
                    //     // 交易类型: 出售/求购
                    //     transType: '出售',
                    //     // 交易价格: 具体值/面议
                    //     transPrice: '40'
                    // },
                    transactionIntro: {},
                    // 描述标签(字符串数组- 可空)
                    // descriptionTags: ['电子产品', '准新正品', '当面验货'],
                    descriptionTags: [],
                    // 展示图片(url数组- 可为空)
                    // showPictures: [require('@/assets/imgs/test.png'), require('@/assets/imgs/test.png')],
                    showPictures: [],
                    // 消息是否已经结束了
                    isOver: true,
                    // 发帖时间
                    messageTime: new Date('2020/12/15 15:00').getTime(),
                    // 浏览次数
                    visitTimes: 120,
                },
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
                }
            }
        },
        created() {
            this.initial()
        },
        methods: {
            async initial() {
                // 获取轮播图数据
                await this.getSwipperInfo()
                // 获取置顶信息
                await this.getTopInfo()
                // 获取非置顶信息
                await this.getMainInfo()
            },
            // 获取轮播图数据
            async getSwipperInfo() {
                const {
                    data: res
                } = await this.$http.get('/homepage/carouselAd').catch(err => console.log(err))
                // 接收到的数据为对象数组
                // 对轮播顺序进行排序
                this.swipperInfo = res.sort((a, b) => a.levelShow - b.levelShow)
                // console.log(this.swipperInfo);
            },
            // 获取置顶信息
            async getTopInfo() {
                const {
                    data: res
                } = await this.$http.get('homepage/view/topInfo').catch(err => this.$toast({
                    message: '获取失败',
                    iconClass: 'iconfont icon-close',
                    className: 'toastIcon'
                }))
                if (res && res.length > 0) {
                    // 这个是一次性获取了
                    this.topInfo = res
                }
                console.log(res);
            },
            // 获取非置顶信息 
            // 返回值为获取到的数据条目
            async getMainInfo() {
                const {
                    data: res
                } = await this.$http.get('/homepage/view/queryall', {
                    params: this.mainForm
                }).catch(err => this.$toast({
                    message: '获取失败',
                    iconClass: 'iconfont icon-close',
                    className: 'toastIcon'
                }))
                if (res && res.length > 0) {
                    this.mainInfo = this.mainInfo.concat(res)
                    // 加载到如期的数据数量
                    if (res.length === this.mainForm.pageSize) {}
                    // 加载到少的数量
                    else {
                        this.mainInfoEnd = true;
                    }
                    console.log(this.mainInfo, this.mainInfoEnd);
                    this.mainForm.pageBegin += res.length
                } else {
                    // 比如总共15条数据 获取三次都是满5的获取完 那么再请求 就会res.length=0
                    // 数据拉取完结束
                    console.log('END');
                    this.mainInfoEnd = true;
                }
            },
            searchInfo() {
                console.log('search', this.searchVal);
            },
            // 内部已经实现了节流 loading就代表了节流标志
            // 节流获取信息
            async loadTest() {
                this.showSendBtn = false;
                console.log('触发了');
                this.loading = true;
                if (this.mainInfoEnd) {
                    this.showSendBtn = true;
                    return this.$toast({
                        message: '无更多数据',
                        iconClass: 'iconfont icon-tixing',
                        className: 'toastIcon'
                    })
                }
                await this.getMainInfo()
                this.loading = false;
                this.showSendBtn = true;
            },

            // 点击发送消息
            sendMessage() {
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
            // 跳转帖子详情的事件委托
            parentPush(ev) {
                console.log('事件委托');
                const targetTag = this.$parentPush(ev, 'detailInfo')
                // 拿到帖子ID data-xx 只能小写
                const infoID = targetTag.dataset.info_id;
                // 将当前点击跳转的信息复制一份存入vuex
                // this.changeInfoDetail()
                // 跳转
                this.$router.push(`/info/${infoID}`);
            },
            // 帖子跳转至详情信息
            linkToMore(info) {
                const {
                    infoId
                } = info
                // 将当前点击跳转的信息复制一份存入vuex
                this.changeInfoDetail(info)
                this.$router.push(`/info/${infoId}`)
            },
            ...mapMutations(['changeInfoDetail'])
        },
        watch: {
            selected(newVal) {
                console.log(newVal);
            }
        }

    }
</script>

<style lang='scss'>
    /* @import url(); 引入css类 */
    @import './info.scss';

    .homepage-moreinfo {
        p.testP {
            height: 100px;
            border-bottom: 1px solid #654062;
        }
    }
</style>