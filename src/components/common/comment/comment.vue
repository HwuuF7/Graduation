<template>
    <div class='comment'>
        <div class="comment-user">
            <span class="userAvatar">
                <img src="../../../assets/imgs/test.jpg" alt="">
            </span>
            <span class="userName">{{commentInfo.commentator}}</span>
        </div>
        <div class="comment-content" @click.stop.capture="replyToFirst">
            {{commentInfo.content}}
        </div>
        <div class="comment-time">
            2020-12-14 18:11
        </div>
        <!-- 这里是要进行判断是否有评论 同样要控制懒加载 -->
        <div class="comment-reply" v-if="commentInfo.replyLists.length">
            <!-- <p class="reply-item">
                <span class="commentator">小老妹</span>
                <span>回复</span>
                <span>:</span>
                <span class="content">嘻嘻</span>
            </p>
            <p class="reply-item">
                <span class="commentator">小老妹</span>
                <span>回复</span>
                <span>:</span>
                <span class="content">嘻嘻</span>
            </p> -->
            <!-- <ul>
                <li class="reply-item" v-for='(comment) in commentInfo' :key='comment.commentatorID'>
                    <span class="commentator">{{comment.commentator}}</span>
                    <template v-if="comment.replyLists.length > 0">
                        <span class="isReply">回复</span>
                        <span class="commentator">xxxx</span>
                    </template>
                    <span>:</span>
                    <span class="content">{{comment.content}}</span>
                </li>
            </ul> -->


            <!-- <commentItem /> -->
            <commentItem :replyInfo="commentInfo.replyLists" />


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
        data() {
            return {

                // 评论的数据格式
                /*  commentInfo: [{
                        // 评论人的ID
                        commentatorID: '123',
                        // 一级评论人
                        commentator: '小老妹',
                        // 一级评论内容
                        content: '你真棒',
                        // 回复列表
                        replyLists: [{
                                commentatorID: '456',
                                commentator: '清风自来',
                                replyToID: '123',
                                replyToWho: '小老妹',
                                content: '真的吗？',
                                replyLists: [{
                                    commentatorID: '123',
                                    commentator: '小老妹',
                                    replyToID: '456',
                                    replyToWho: '清风自来',
                                    content: '真的哦',
                                    replyLists: []
                                }, {
                                    commentatorID: '789',
                                    commentator: '其他人',
                                    replyToID: '456',
                                    replyToWho: '清风自来',
                                    content: '其他人的回复',
                                    replyLists: []
                                }]
                            },
                            {
                                commentatorID: '001',
                                commentator: '菜狗',
                                replyToID: '123',
                                replyToWho: '小老妹',
                                content: '红豆泥',
                                replyLists: [{
                                    commentatorID: '789',
                                    commentator: '其他人',
                                    replyToID: '001',
                                    replyToWho: '菜狗',
                                    content: '你可真是只菜狗',
                                    replyLists: [{
                                        commentatorID: '001',
                                        commentator: '菜狗',
                                        replyToID: '789',
                                        replyToWho: '其他人',
                                        content: '你才是',
                                        replyLists: []
                                    }]
                                }]
                            }
                        ]
                    },
                    {
                        commentatorID: '456',
                        commentator: '清风自来',
                        replyToID: '123',
                        replyToWho: '小老妹',
                        content: '厉害厉害',
                        replyLists: []
                    }
                ]*/
            }
        },
        //生命周期 - 创建完成（访问当前this实例）
        created() {
            console.log(this.commentInfo);
        },
        //生命周期 - 挂载完成（访问DOM元素）
        mounted() {

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