<template>
    <div class='comment'>
        <div class="comment-user">
            <span class="userAvatar">
                <!-- 默认头像 -->
                <!-- <img src="../../../assets/imgs/test.jpg" alt=""> -->
                <img :src="commentInfo.headImg" alt="">
            </span>
            <span class="userName">{{commentInfo.userName}}</span>
        </div>
        <div class="comment-content" @click.stop.capture="replyToFirst">
            {{commentInfo.content}}
        </div>
        <div class="comment-time">
            {{commentInfo.createTime | getFormatTime}}
        </div>
        <!-- 这里是要进行判断是否有评论 同样要控制懒加载 -->
        <div class="comment-reply" v-if="commentInfo.reply.length">
            <commentItem :replyInfo="commentInfo.reply" />
        </div>
    </div>
</template>

<script>
    import commentItem from './comment-item.vue';
    export default {
        props: ['commentInfo'],
        components: {
            commentItem
        },
        filters: {
            // 格式化时间
            getFormatTime(originalVal) {
                // 变时间戳
                let time = +new Date(originalVal)
                let date = new Date(+time + 8 * 3600 * 1000); // 增加8小时
                return date.toJSON().substr(0, 16).replace('T', ' ');
            }
        },
        data() {
            return {

            }
        },
        //生命周期 - 创建完成（访问当前this实例）
        created() {
            // console.log(this.commentInfo);
        },
        methods: {
            // 回复一级评论
            replyToFirst() {
                console.log('回复一级评论');
                // 将回复对话框显示出来
                this.$emit('replyToFirst', true)
            }
        },

    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    @import './comment.scss';
</style>