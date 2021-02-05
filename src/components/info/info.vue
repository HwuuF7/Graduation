<template>
    <div class="page-all">


        <div class="page-scroll">
            <!-- 内容主体区域 -->
            <mt-tab-container v-model="selected">

                <!-- 信息页 -->
                <mt-tab-container-item id="UESTC" class="uestc-info">

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
                    <div class="homepage-moreinfo" v-infinite-scroll="loadTest" infinite-scroll-disabled="loading"
                        infinite-scroll-distance="10">

                        <detail-info v-for="info in topInfo" :key="info.infoId" isSetTop :model='info'
                            @click.native.stop="linkToMore(info,true)"></detail-info>
                        <detail-info v-for="info in mainInfo" :key='info.infoId' :model='info'
                            @click.native.stop="linkToMore(info,false)"></detail-info>

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
                <span slot="icon" class="iconfont icon-zhuye fz-12"></span>
                <span>成电</span>
            </mt-tab-item>
            <mt-tab-item id="CHAT">
                <span slot="icon" class="iconfont icon-drxx59 fz-12"></span>
                <span>CHAT</span>
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
                    pageSize: 30,
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
                // this.$reToast('无更多数据', 'icon-tixing')
                const res = await this.$http.get('/info/view/queryall', {
                    params: this.mainForm
                }).catch(err => console.log(err))
                if (!res) return this.$reToast('获取失败', 'icon-close')
                const {
                    data: infos
                } = res
                if (infos.length > 0) {
                    this.mainInfo = this.mainInfo.concat(infos)
                    // 加载到少的数量
                    if (infos.length !== this.mainForm.pageSize) {
                        this.mainInfoEnd = true
                    }
                    // console.log(this.mainInfo, this.mainInfoEnd);
                    this.mainForm.pageBegin += infos.length
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
                console.log('search', this.searchVal);
            },
            // 内部已经实现了节流 loading就代表了节流标志
            // 触底节流获取信息
            async loadTest() {
                this.showSendBtn = false;
                // console.log('触发了');
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

            // 帖子跳转至详情信息
            linkToMore(info, isSetTop) {
                const {
                    infoId
                } = info
                // 将当前点击跳转的信息复制一份存入vuex
                this.changeInfoDetail([info, isSetTop])
                this.$router.push(`/info/${infoId}`)
            },
            ...mapMutations(['changeInfoDetail'])
        },
        computed: {
            // 搜索框的清除按钮是否可见
            clearIconShow() {
                return this.searchVal !== ''
            }
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