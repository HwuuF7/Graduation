<template>
    <div class="page-all">


        <div class="page-scroll">
            <!-- 内容主体区域 -->
            <mt-tab-container v-model="selected">


                <mt-tab-container-item id="UESTC" class="uestc-info">

                    <!-- 导航栏区域 -->
                    <mt-navbar v-model="infoActive" class="info-navbar" fixed>
                        <mt-tab-item id="homepage">首页</mt-tab-item>
                        <mt-tab-item id="search">搜索</mt-tab-item>
                        <mt-tab-item id="other">红包</mt-tab-item>
                    </mt-navbar>

                    <!-- 中间区域 -->
                    <div class="info-main">
                        <!-- 成电INFO页的另外tab跳转页 -->
                        <mt-tab-container v-model="infoActive">

                            <!-- 成电INFO页 -->
                            <mt-tab-container-item id="homepage">
                                <!-- 轮播图 -->
                                <div class='homepage-swipper'>
                                    <mt-swipe :auto="4000">
                                        <mt-swipe-item>
                                            <a href="javascript:;">
                                                <img src="../../assets/imgs/tuodan.png" alt="你一定会脱单的">
                                            </a>
                                        </mt-swipe-item>
                                        <mt-swipe-item>
                                            <a href="javascript:;">
                                                <img src="../../assets/imgs/tuodan.png" alt="你一定会脱单的">
                                            </a>
                                        </mt-swipe-item>
                                    </mt-swipe>
                                </div>


                                <!-- 小菜单区域 -->
                                <div class="homepage-menu" @click.stop.capture="sortPush">
                                    <div class="homepage-menuItem" v-for="(menu,menuIndex) in homepageMenu"
                                        :key='menuIndex' :data-sort='menu.icon'>
                                        <a href="javascript:;">图标</a>
                                        <p>{{menu.content}}</p>
                                    </div>
                                </div>

                                <!-- 间隔线 -->
                                <div class="line-10"></div>

                                <!-- 详情信息 -->
                                <div class="homepage-moreinfo" v-infinite-scroll="loadTest"
                                    infinite-scroll-disabled="loading" infinite-scroll-distance="10"
                                    @click.stop.capture="parentPush">
                                    <!-- <detail-info :model='infoDetail[0]'>
                                    </detail-info>
                                    <detail-info :model='testModel' />
                                    <detail-info :model='testModel' />

                                    <detail-info :model='testModel' />
                                    <detail-info :model='testModel' />
                                    <detail-info :model='testModel' />
                                    <detail-info :model='testModel' /> -->
                                    <detail-info :model='testModel' :data-info_id='testModel.infoId' />
                                    <detail-info :model='testModel2' :data-info_id='testModel2.infoId' />
                                    <p class="testP" v-for="i in testP" :key="i">{{i}}*i</p>


                                </div>
                                <!-- 加载动画 -->
                                <div class="loadingMore">
                                    <mt-spinner v-show="!loading" type="snake" color='#ffabe1' :size='32'>
                                    </mt-spinner>
                                    <p v-show="loading">- 没有更多了 -</p>
                                </div>
                            </mt-tab-container-item>

                            <!-- 成电Search页 -->
                            <mt-tab-container-item id="search">
                                搜索
                            </mt-tab-container-item>

                            <!-- 成电other页 -->
                            <mt-tab-container-item id="other">
                                <other />
                            </mt-tab-container-item>
                        </mt-tab-container>

                        <!-- 无处不在的底部发送消息按钮 -->
                        <div class="sendMessageBtn" v-show="showSendBtn">
                            <mt-button plain type='primary' size='small' @click.native="sendMessage">发消息</mt-button>
                        </div>
                    </div>
                </mt-tab-container-item>


                <mt-tab-container-item id="WALL">
                    <div>表白墙</div>
                </mt-tab-container-item>



                <mt-tab-container-item id="FORUM">
                    <div>论坛</div>
                </mt-tab-container-item>



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
            <mt-tab-item id="WALL">
                <img slot="icon" src="@/assets/imgs/test.png">
                表白墙
            </mt-tab-item>
            <mt-tab-item id="FORUM">
                <img slot="icon" src="@/assets/imgs/test.png">
                论坛
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
    import detailInfo from '@/components/common/detailInfo/detailInfo.vue';
    import other from '@/components/other/other.vue';
    import mine from '@/components/mine/mine.vue';
    export default {
        components: {
            detailInfo,
            other,
            mine
        },
        data() {
            return {
                testP: 5,
                loading: false,
                showSendBtn: true,
                infoActive: 'homepage',
                selected: 'UESTC',
                homepageMenu: [{
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
                    userAvatar: require('@/assets/imgs/test.png'),
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
                    'cars': '校内拼车',
                    'houses': '校园租房',
                    'unused': '闲置二手',
                    'counts': '优惠信息',
                    'finds': '寻人找物',
                    'helps': '打听求助',
                    'chats': '闲来有聊',
                    'dinners': '约饭走起'
                }
            }
        },
        created() {

        },
        methods: {
            // 这里留着实现节流！！！
            loadTest() {
                this.showSendBtn = false;
                setTimeout(() => {
                    if (this.testP > 15) {
                        console.log('1');
                        this.loading = true
                    } else {
                        console.log('22');
                        this.testP += 5;
                    }
                    this.showSendBtn = true;

                }, 2500);
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
                // 跳转
                this.$router.push(`/info/${infoID}`);
            },
        },
        watch: {
            selected(newVal) {
                console.log(newVal);
            },
            infoActive(newVal) {
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