<template>
    <div class="comment-item" v-if="replyInfo.length">
        <ul>
            <li class="reply-item" v-for='(comment,index) in replyInfo' :key='comment.commentId'>
                <p @click.stop.capture="catchReplyEvent(comment,index)">
                    <span class="commentator">{{comment.userName}}</span>
                    <template v-if="!secondary">
                        <span>:</span>
                    </template>
                    <template v-else>
                        <span class="isReply">回复</span>
                        <span class="commentator">{{comment.replyCommentUserName}}</span>
                        <span>:</span>
                    </template>
                    <span class="content">{{comment.content | emojiDecode}}</span>
                </p>

                <comment-item :replyInfo='comment.replyLists' :secondary='true'></comment-item>
            </li>
        </ul>
    </div>

</template>

<script>
    import {
        mapMutations
    } from 'vuex';
    export default {
        name: 'commentItem',
        // secondary代表二级评论的嵌套评论
        props: ['replyInfo', 'secondary'],
        methods: {
            // 监听回复谁
            catchReplyEvent(comment, index) {
                // this.replySheetVisible = true
                this.isShowReplySheet(true)
                // console.log(comment, index);
                this.changeReplytoWho([comment, false])
                console.log(this.$store.state.replyToWhoInfo);
            },
            ...mapMutations(['isShowReplySheet', 'changeReplytoWho']),
        },

    }
</script>

<style scoped lang='scss'>
    .comment-item {
        >ul {
            li.reply-item {

                span {
                    color: #55657d;
                    font-size: .8rem;
                    line-height: 1rem;

                    &.content,
                    &.isReply {
                        color: #333;
                    }

                    &:nth-child(even) {
                        margin: 0 .3rem;
                    }

                    &.content {
                        display: inline-block;
                        padding-bottom: .18rem;
                    }

                    &.commentator:first-child {
                        display: inline-block;
                        padding-top: .18rem;
                    }
                }

            }
        }

    }
</style>