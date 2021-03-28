<template>
    <div class="aboutMe" ref="aboutMe">
        <mt-header :title="options[activeNum]" fixed>
            <mt-button icon="back" slot='left' @click="$router.go(-1)"></mt-button>
        </mt-header>
        <div class="about-outer">
            <div v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10"
                :infinite-scroll-immediate-check='true' class='scroll-info' v-if="activeNum === '0'">
                <template v-if="activeInfo.length > 0">
                    <detail-info v-for="info in activeInfo" :key='info.infoId' :model='info'
                        @click.native.stop="$router.push(`/info/${info.infoId}`)" />
                </template>
            </div>
            <!-- <div v-if="activeNum === '1'" class="scroll-info my-dynamic"> -->
                <!-- <mt-cell-swipe :right=" [{
                    content: '删除',
                    style: {
                        background: 'red',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                    },
                    handler: () =>  this.deleteFromMyDynamic(123)
                }]">
                    <div>
                        <img src="@/assets/imgs/7f.png">
                        <div class="intro">
                            <span>name</span>
                            <span>哈哈哈contentcontentcontentcontentcontentcontent</span>
                            <span>{{date |timeFormatAmPm}}</span>
                        </div>
                    </div>
                    <div>
                        <img src="@/assets/imgs/7f.png">
                    </div>
                </mt-cell-swipe> -->
                <ul v-else-if="activeNum === '1'" class="scroll-info my-dynamic" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
            infinite-scroll-distance="10" :infinite-scroll-immediate-check='true'>
                    <template v-if="activeInfo.length > 0">
                        <li v-for="(info,index) in activeInfo" :key="index"  @click.stop="$router.push(`/info/${info.infoId}`)">
                            <mt-cell-swipe>
                                <!-- 左边盒子放置头像、名字、信息 -->
                                <div class="dy-left">
                                    <div class="avatar">
                                        <img :src="info.headImg" alt="用户头像">
                                    </div>

                                    <div class="intro">
                                        <span class="hello">{{info.userName}}</span>
                                        <span>{{info.content | emojiDecode}}</span>
                                        <span>{{info.createTime | timeFormat7Day}}</span>
                                    </div>
                                </div>
                                <!-- 右边放置相关内容图片 -->
                                <div  class="dy-right" v-if="!!info.pictures || info.pictures.length <1">
                                    <img :src="info.pictures" alt="相关图片">
                                </div>
                            </mt-cell-swipe>
                        </li>
                    </template>

                </ul>
            <!-- </div> -->
        </div>
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
                // 记录当前活跃的显示
                activeNum: '0',
                options: ['我的发布', '我的动态'],
                // 所激活对应的数据
                activeInfo: [],
                // 记录离开前的滚动高度
                scrollTop: 0,
                // 无限滚动
                loading: false,
            }
        },
        beforeRouteEnter(to, from, next) {
            if (from.name === 'InfoMore' && !!from.meta.useAlive) {
                to.meta.isBack = true;
                console.log('fromInfoMore', to.meta,from.meta);
                next()
            } else {
                to.meta.isBack = false;
                next(vm => {
                    // 非法操作
                    if (!sessionStorage.getItem('activeCom')) {
                        // 默认给activeCom=0 显示我发布的
                        sessionStorage.setItem('activeCom', 0);
                    }
                    vm.activeNum = sessionStorage.getItem('activeCom')
                    console.log('before======',typeof vm.activeNum);
                    vm.scrollTop = 0;
                    vm.loading = false;
                })
            }

        },
        //生命周期 - 创建完成（访问当前this实例）
        created() {
            console.log('created');
        },
        mounted() {
            console.log('mounted');
        },
        activated() {
            console.log('issue激活');
            // 如果不是从详情页进入的 则刷新数据
            if (!this.$route.meta.isBack) {
                console.log('ISSUE刷新');
                // 获取"我的发布"信息
               /*  if (this.activeNum === '0') {
                    this.getReleaseByMe()
                } else if (this.activeNum === '1') {
                    // 获取"我的动态"信息
                    this.getActiveInfo()
                } */
                this.$nextTick(()=> {
                    console.warn('调用GETMINE--');
                    this.getMineInfo()
                })
            } else {
                console.log('ISSUE不刷新');
                // 恢复浏览高度
                this.$refs.aboutMe.scrollTop = this.scrollTop
            }
        },
        beforeRouteLeave(to, from, next) {
            this.scrollTop = this.$refs.aboutMe.scrollTop;
            if(to.path === '/info') {
                // 所激活对应的数据
                this.activeInfo =  [];
                this.loading  = false;
            }
            next()
        },
        methods: {
            async getMineInfo() {
                console.log('getMine--');
                const URIopt = ['myRelease','mytrends'];
                let uri = this.activeNum === '0' ? URIopt[0] : URIopt[1];
                const res = await this.$http.get(`/user/${uri}/${this.$store.state.userInfo.userId}`).catch(
                    err => console.warn(err))
                if (!res) return this.$reToast('获取信息失败！', 'icon-close')
                this.activeInfo = res.data;
                console.log(this.activeInfo);
            },
            async getActiveInfo() {
                const {
                    data: res
                } = await this.$http.get(`/user/mytrends/${this.$store.state.userInfo.userId}`).catch(err => console.log(err))
                console.log('动态---',res);
                this.activeInfo = res
            },
            async getReleaseByMe() {
                // console.log(this.$store.state.userInfo);
                const res = await this.$http.get(`/user/myRelease/${this.$store.state.userInfo.userId}`).catch(
                    err => console.warn(err))
                if (!res) return this.$reToast('获取信息失败！', 'icon-close')
                this.activeInfo = res.data;
                console.log(this.activeInfo);
            },
            async loadMore() {
                console.log('触发更多');
            },
            // 向左滑动的交互  从"我的动态"中进行删除
            deleteFromMyDynamic(id) {
                console.log('Delete===', id);
            },
        },
        destroyed() {
            // console.log('摧毁了');
            // localStorage.removeItem('activeCom')
        },

        watch: {}
    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    .aboutMe {
        overflow: auto;
        height: 100%;

        .mint-header {
            background: #fff;
            font-size: 1rem;
            color: #333;
            border-bottom: 1px solid #606266;

            ::v-deep .mint-header-title {
                font-weight: 700;
            }
        }

        .about-outer {
            margin-top: 2.5rem;

            .scroll-info {
                height: auto;
            }

            .my-dynamic {
                .mint-cell-swipe {
                    background: #f6f6f6;
                    border-bottom: 1px solid #777;

                    ::v-deep .mint-cell-wrapper {
                        padding: .3rem .6rem;

                        .mint-cell-title {
                            flex: 0;
                        }

                        .mint-cell-value {
                            flex: 1;
                            overflow: hidden;

                            >div.dy-left {
                                display: flex;
                                overflow: hidden;
                                flex:1;
                                .avatar {
                                    position: relative;
                                    width: 3rem;
                                    height: 3.2rem;
                                    border-radius: .2rem;
                                    align-self: center;

                                    img {
                                        width: 100%;
                                        height: 100%;
                                    }
                                }
                                
                                .intro {
                                    min-height: 4rem;
                                    margin-left: .4rem;
                                    flex: 1;
                                    display: flex;
                                    flex-flow: column wrap;
                                    overflow: hidden;
                                    justify-content: space-around;
                                    font-family: Tahoma, Helvetica, Arial, '宋体', "Times New Roman", Georgia, sans-serif;


                                    >span {
                                        font-weight: 400;
                                        line-height: 1.1rem;
                                        overflow: hidden;
                                        vertical-align: middle;
                                        text-overflow: ellipsis;
                                        display: -webkit-box;
                                        -webkit-line-clamp: 2;
                                        -webkit-box-orient: vertical;
                                        word-break: break-all;
                                        letter-spacing: .05rem;

                                        &:first-child {
                                            color: #371cd5;
                                            font-size: .9rem;
                                        }

                                        &:nth-child(2) {
                                            font-size: .8rem;
                                            color: #674d85;
                                        }
                                        &:last-child {
                                            font-size: .7rem;
                                            color: #ccc;
                                        }
                                    }
                                }

                                
                            }

                            >div.dy-right {
                                width: 3rem;
                                height: 3.2rem;
                                border-radius: .2rem;
                                align-self: center;

                                img {
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>