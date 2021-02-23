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
                // 判断是否已经登录
                if (!this.$store.state.userInfo) {
                    //  保存当前路由
                    sessionStorage.setItem('route', this.$route.fullPath);
                    // 没有登录则跳转登录
                    console.log('跳转至登录');
                    return window.location.href = this.$weixin
                    // 登录界面会接收到返回的code
                }
                this.isShowReplySheet(true)
                // console.log(comment, index);

                // 原始的评论用户ID  删除评论时用
                comment.originUserId = comment.userId;
                comment.originUserName = comment.userName;
                // 评论ID 删除用
                comment.originCommentId = comment.commentId;
                // 如果多级评论里 自己回复自己 就认为是回复一级评论
                if (this.$store.state.userInfo.userId === comment.userId) {
                    if (comment.replyCommentId === 0) {
                        console.log('进来了~1');
                        // 相当于直接回复一级评论
                        //  覆写渲染的userName为一级评论的评论人
                        comment.toUserName = comment.replyCommentUserName;
                        this.changeReplytoWho([comment, true])
                    } else {
                        console.log('进来了~2');
                        // 对多级评论的同一个人进行补充回复
                        // 解构 被回复的人 
                        let {
                            replyCommentUserName,
                            parentCommentId,
                            replyCommentId,
                            replyCommentUserId,
                            originUserId,
                            originUserName,
                            originCommentId,
                        } = comment;
                        // 改造被回复者的信息
                        let replaceComment = {
                            // 推送用
                            replyCommentUserId,
                            originUserId,
                            // 提交用
                            parentCommentId,
                            commentId: replyCommentId,
                            userId: replyCommentUserId,
                            userName: replyCommentUserName,
                            // 渲染用
                            toUserName: replyCommentUserName,
                            originUserName,
                            // 删除用
                            originCommentId
                        }
                        this.changeReplytoWho([replaceComment, false])
                    }

                } else {
                    // 正常的评论别人
                    comment.toUserName = comment.userName;
                    this.changeReplytoWho([comment, false])
                }
                // this.changeReplytoWho([comment, false])
                console.log("comment===", this.$store.state.replyToWhoInfo);
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