<template>
    <div class="detailInfo" v-if="model">
        <!-- 头像区域 -->
        <div class="infoAvatar">
            <img v-if='!!model.headImg' :src="model.headImg" :alt="`${model.userName}头像`">
            <img v-else src="@/assets/imgs/xiaojiang.png" alt="默认头像">
        </div>
        <!-- 内容主体 -->
        <div class="infoMain">
            <!-- 头部用户名 -->
            <p class="mainTop">
                <span>{{model.userName}}</span>
                <span class="setTop" v-if="isSetTop">置顶</span>
            </p>
            <!-- 中部详细信息 -->
            <div class="mainMid">
                <!-- 分类关键词和内容主体 -->
                <p class="mainMidP">
                    <span>{{model.innerTag}}</span>
                    {{model.content | emojiDecode}}
                </p>
                <!-- 明码标价区域 -->
                <div v-if="isUnused">
                    <p class='mainMidP'>交易类型：{{model.catogory}}</p>
                    <p class="mainMidP"> 价格：{{model.price}}</p>
                </div>

            </div>
            <!-- 底部图片 -->
            <div class="mainBom">
                <!-- 描述标签区域 -->
                <div class="bomTags" v-if="hasTags">
                    <span v-for="(tag,tagIndex) in model.tags" :key='tagIndex'>{{tag}}</span>
                </div>
                <!-- 图片展示区域 -->
                <div class="bomPictures" v-if="hasPictures">
                    <img v-for="(pic,picIndex) in model.pictures" :key='picIndex' :src="pic" alt="你看不到的秘密">
                </div>
                <!-- 时间与浏览次数 -->
                <p class="timeVisits">{{model.createTime | timeFormat}}，{{model.viewNum ? model.viewNum : 0}}人浏览
                </p>
                <!-- 电话图标 -->
                <!-- <span class="bomTel" v-if="!!!model.isOver">小</span> -->
            </div>


        </div>
        <!-- 已结束的章 -->
        <div class="expired" v-if="!!model.isOver"></div>
    </div>
</template>

<script>
    export default {
        props: {
            model: Object,
            isSetTop: Boolean,
        },
        created() {},
        data() {
            return {

            }
        },
        methods: {},
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
        },
    }
</script>

<style lang='scss'>
    /* @import url(); 引入css类 */
    @import './detailInfo.scss';
</style>