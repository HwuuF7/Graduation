<template>
    <div class="detailInfo" v-if="model">
        <!-- 头像区域 -->
        <div class="infoAvatar">
            <img v-if="!!!model.userAvatar" src="@/assets/imgs/xiaojiang.png" alt="默认头像">
            <img v-else :src="model.userAvatar" :alt="`${model.userName}头像`">
        </div>
        <!-- 内容主体 -->
        <div class="infoMain">
            <!-- 头部用户名 -->
            <p class="mainTop">
                <span>{{model.userName}}</span>
                <span class="setTop" v-if="isSetTop">置顶</span>
                <span class="report" v-if="isInfoMore">举报</span>
            </p>
            <!-- 中部详细信息 -->
            <div class="mainMid">
                <!-- 分类关键词和内容主体 -->
                <p class="mainMidP">
                    <span>{{model.cateKeyWord}}</span>
                    {{model.messageContent}}
                </p>
                <!-- 明码标价区域 -->
                <div v-if="isTransact">
                    <p class='mainMidP'>交易类型：{{model.transactionIntro.transType}}</p>
                    <p class="mainMidP"> 价格：{{model.transactionIntro.transPrice}}</p>
                </div>

            </div>
            <!-- 底部图片 -->
            <div class="mainBom">
                <!-- 描述标签区域 -->
                <div class="bomTags" v-if="hasTags">
                    <span v-for="(tag,tagIndex) in model.descriptionTags" :key='tagIndex'>{{tag}}</span>
                </div>
                <!-- 图片展示区域 -->
                <div class="bomPictures" v-if="hasPictures">
                    <img v-for="(pic,picIndex) in model.showPictures" :key='picIndex' :src="pic" alt="你看不到的秘密">

                </div>
                <!-- 时间与浏览次数 -->
                <p class="timeVisits">{{model.messageTime | timeFormat}}，{{model.visitTimes ? model.visitTimes : 0}}人浏览
                </p>
                <!-- 电话图标 -->
                <span class="bomTel" v-if="!model.isOver">小</span>
            </div>


        </div>
        <!-- 已结束的章 -->
        <div class="expired" v-if="model.isOver"></div>
        <div class="redPack" v-if="isShowRedPack"></div>
    </div>
</template>

<script>
    export default {
        props: ['model', 'isOther', 'isMore'],
        data() {
            return {}
        },
        methods: {},
        computed: {
            isTransact() {
                return JSON.stringify(this.model.transactionIntro) !== '{}'
            },
            isSetTop() {
                return !!this.model.isSetTop === true
            },
            hasTags() {
                return this.model.descriptionTags.length > 0
            },
            hasPictures() {
                return this.model.showPictures.length > 0
            },
            isShowRedPack() {
                return typeof this.isOther === 'boolean' && this.isOther
            },
            isInfoMore() {
                return typeof this.isMore === 'boolean' && this.isMore
            }
        },
        created() {
            console.log(this.isMore);
        }
    }
</script>

<style lang='scss'>
    /* @import url(); 引入css类 */
    @import './detailInfo.scss';
</style>