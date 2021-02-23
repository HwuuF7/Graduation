<template>
    <div class="moreHead" v-if="!!model">
        <!-- 头部 -->
        <header>
            <span class="avatar">
                <img v-if='!!model.headImg' :src="model.headImg" :alt="`${model.userName}头像`">
                <img v-else src="@/assets/imgs/xiaojiang.png" alt="默认头像">
            </span>
            <div class="user">
                <span>{{model.userName}}</span>
                <span v-if="model.isSetTop || isSetTop" class="setTop">置顶</span>
            </div>
            <span class="report">举报</span>
        </header>
        <!-- 内容 -->
        <main>
            <p>
                <span>{{model.innerTag}}</span>
                {{model.content | emojiDecode}}
            </p>
            <div v-if="isUnused">
                <p>交易类型：{{model.catogory}}</p>
                <p> 价格：{{model.price}}</p>
            </div>
        </main>
        <!-- 底部 -->
        <footer>
            <!-- 描述标签区域 -->
            <div class="bomTags" v-if="hasTags">
                <span v-for="(tag,tagIndex) in model.tags" :key='tagIndex'>{{tag}}</span>
            </div>
            <!-- 图片展示区域 -->
            <div class="bomPictures" v-if="hasPictures">
                <div v-for="(pic,picIndex) in model.pictures" :key='picIndex' @click.stop="previewPics(picIndex)">
                    <img :src="pic" alt="你看不到的秘密">
                </div>

            </div>
            <!-- 时间与浏览次数 -->
            <p class="bomVisits">
                {{model.createTime | timeFormat}}发布，{{model.views}}人浏览
            </p>
        </footer>


        <mt-popup v-model="previewVisible" popup-transition="popup-fade">

            <preview :pictures='model.pictures' @closePop='closePreview' :see='previewVisible'
                :preIndex='activePicIndex' />
        </mt-popup>
    </div>
</template>

<script>
    import preview from '@/components/common/preview/preview.vue';
    export default {
        components: {
            preview
        },
        props: {
            model: Object,
            isSetTop: Boolean,
        },
        data() {
            return {
                // 预览图片弹出框
                previewVisible: false,
                // 显示当前预览的第几张
                activePicIndex: 0,
            }
        },
        created() {
            // console.log(this.isSetTop);
        },
        methods: {
            previewPics(pIndex) {
                // console.log('预览图片---', pIndex);
                // 更改显示的图片
                this.activePicIndex = pIndex;
                this.previewVisible = true;
            },
            // 关闭预览图片
            closePreview() {
                // console.log('关闭预览~');
                this.previewVisible = false;
            },
        },
        computed: {
            isUnused() {
                return this.model.type === 'unUsed'
            },
            hasTags() {
                //  对空数组进行判断
                return this.model.tags.length > 0
            },
            hasPictures() {
                return this.model.pictures.length > 0
            },
            // 预览图片的数量
            previewLength() {
                return this.model.pictures.length
            },
        }
    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    .moreHead {
        padding: .9rem;

        header {
            padding-bottom: 1.2rem;
            display: flex;
            align-items: center;

            .avatar {
                width: 1.9rem;
                height: 1.9rem;
                margin-right: .6rem;

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;

                }
            }

            .user {
                flex: 1;

                span:first-child {
                    color: #55657d;
                    font-size: .85rem;
                }

                span.setTop {
                    color: #fff;
                    min-width: .9rem;
                    height: .9rem;
                    line-height: .9rem;
                    text-align: center;
                    font-size: .7rem;
                    padding: 0 .1rem;
                    background: #948b7d;
                    border-radius: .1rem;
                    margin-left: .3rem;
                    transform: translateY(-.08rem);
                }
            }

            .report {
                font-size: .8rem;
                color: #999;
            }

        }

        main {
            >p {
                span {
                    display: inline-block;
                    height: 1.2rem;
                    line-height: 1.2rem;
                    font-size: .8rem;
                    text-align: center;
                    padding: 0 .1rem;
                    background: #748aa0;
                    border-radius: .1rem;
                    color: #fff;
                    margin-right: .1rem;
                }
            }
        }

        footer {
            .bomTags {
                display: flex;
                flex-flow: row nowrap;
                overflow-x: scroll;
                margin-top: .6rem;

                &::-webkit-scrollbar {
                    display: none;
                }

                span {
                    flex: 0 0 auto;
                    border-top-left-radius: .7rem;
                    border-bottom-right-radius: .7rem;
                    border: 1px solid;
                    border-left-width: .3rem;
                    border-top-width: .1rem;
                    margin-right: .2rem;
                    padding: 0 .3rem;
                    background: #fafafa;
                    background-position: top right;
                    font-size: .6rem;
                    height: 1.4rem;
                    line-height: 1.4rem;
                    color: #748aa0;
                    position: relative;

                    &:last-child {
                        margin-right: 0;
                    }

                    &::before {
                        content: '';
                        position: absolute;
                        top: -1px;
                        right: -2px;
                        width: .3rem;
                        height: 100%;
                        background: cadetblue;
                        border-bottom-right-radius: .7rem;
                    }

                    &::after {
                        content: '';
                        position: absolute;
                        left: 0;
                        bottom: -1px;

                        // width: calc(.4rem + 1px);
                        // height: calc(100% + 2px);
                        // border-bottom-left-radius: .7rem;
                        // background: skyblue;
                        border: {
                            width: 0;
                            left-width: .6rem;
                            top-width: .6rem;
                            style: solid;
                            color: transparent;
                            left-color: #65d6ce;
                        }
                    }
                }


            }

            .bomPictures {
                margin-top: .4rem;
                width: calc(100vw - 5.5rem);
                display: flex;
                flex-flow: row wrap;

                div {
                    width: 5rem;
                    height: 5rem;
                    margin: .4rem .4rem 0 0;

                    >img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }

                div:nth-child(3n) {
                    margin-right: 0;
                }

            }


            .bomVisits {
                font-size: .8rem;
                margin-top: .6rem;
                color: #999;
            }
        }

        .mint-popup {
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, .95);
            color: #fff;




        }
    }
</style>