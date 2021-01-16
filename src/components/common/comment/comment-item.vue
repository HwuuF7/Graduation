<template>
    <div class="comment-item" v-if="replyInfo.length">
        <ul>
            <li class="reply-item" v-for='(comment,index) in replyInfo' :key='comment.commentID'>
                <p @click.stop.capture="catchReplyEvent(comment,index)">
                    <span class="commentator">{{comment.commentator}}</span>
                    <template v-if="!secondary">
                        <span>:</span>
                    </template>
                    <template v-else>
                        <span class="isReply">回复</span>
                        <span class="commentator">{{comment.replyToWho}}</span>
                        <span>:</span>
                    </template>
                    <span class="content">{{comment.content}}</span>
                </p>

                <comment-item :replyInfo='comment.replyLists' :secondary='true'></comment-item>
            </li>
        </ul>
        <!-- 点击对应评论进行回复的弹出选择框 -->
        <!-- <mt-actionsheet :actions="replySheetActions" v-model="replySheetVisible">
        </mt-actionsheet> -->
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
        data() {
            return {
                // replySheetVisible: false,
            }
        },
        created() {},
        mounted() {

        },
        methods: {
            // 监听回复谁
            catchReplyEvent(comment, index) {
                // this.replySheetVisible = true
                this.isShowReplySheet(true)
                // console.log(comment, index);
                this.changeReplytoWho(comment)
                console.log(this.$store.state.replyToWhoInfo);
            },
            // // 删除回复
            // deleteReply() {
            //     console.log('删除回复');
            // },
            // // 点击回复
            // replyTo() {
            //     console.log('进行回复');
            // },
            ...mapMutations(['isShowReplySheet', 'changeReplytoWho']),
        },
        computed: {
            // replySheetActions() {
            //     const names = ['删除回复', '回复'];
            //     const methods = [this.deleteReply, this.replyTo];
            //     return names.map((name, index) => {
            //         return {
            //             name,
            //             method: methods[index]
            //         }
            //     })
            // },

        }

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