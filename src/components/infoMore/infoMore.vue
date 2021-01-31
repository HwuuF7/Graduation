<template>
    <div class="infoMore">
        <detail-info :model='infoDetail' isMore />
        <div class="info-contact">
            <p>联系方式</p>
            <div>
                <p>联系人:</p>
                <p>电话:</p>
                <p class="contact-impart">联系我时，请告知是在成电翻江上看到的</p>
                <p class="icon chat " @click.stop="startChat">
                    <span class='iconfont icon-shouye fz-15'></span>
                </p>
                <p class="icon fav" @click.stop="startFav">
                    <span class='iconfont icon-tuijian fz-15'></span>
                </p>
            </div>
        </div>
        <div class="line-10"></div>
        <div class="info-qrCode">
            <div class="info-qrCode-message">
                <p>成电翻江</p>
                <p>关注尽享评论消息通知</p>
            </div>
            <div class="info-qrCode-img">
                <img src="../../assets/imgs/test.jpg" alt="">
            </div>
        </div>
        <div class="line-10"></div>
        <!-- 抽离出来 -->
        <div class="info-comments">
            <div class="comment-header">
                <span>评论留言</span>
                <!-- 可以留个图标 -->
                <span @click.stop="replyToRoot">我要评论></span>
            </div>
            <comment v-for="(comment ) in commentInfo" :key="comment.commentId" :commentInfo='comment'
                @replyToFirst='replyToFirst(comment,arguments)'></comment>

        </div>
        <!-- 点击对应评论进行回复的弹出选择框 -->
        <mt-actionsheet :actions="replySheetActions" v-model="mutualReplySheetVisible">
        </mt-actionsheet>

        <!-- 弹出回复对话框 -->
        <mt-popup v-model="popUpVisible" popup-transition="popup-fade">
            <div class="popHeader">
                <mt-button type='danger'>表情</mt-button>
            </div>
            <div class="popMid">
                <mt-field :placeholder="replyToWhoInfo ? `回复${replyToWhoInfo.userName}` : ''" type="textarea" rows="4"
                    v-model.trim="replyContent"></mt-field>
            </div>
            <div class="popFooter">
                <mt-button plain @click="cancelReply">取消</mt-button>
                <mt-button plain type='primary' @click='commitReply'>确定</mt-button>
            </div>
        </mt-popup>
    </div>
</template>

<script>
    import detailInfo from '@/components/common/detailInfo/detailInfo.vue';
    import comment from '@/components/common/comment/comment.vue';
    import {
        mapState,
        mapMutations
    } from 'vuex';

    /*
           // 留着过年
            // 要增加一个评论ID 和 toWhich评论ID
            commentInfo: [{
            // 评论的一个ID
            commentID: '001',
            // 评论人的ID
            commentatorID: '123',
            // 一级评论人
            commentator: '小老妹',
            // 一级评论内容
            content: '你真棒',
            rootType: true,
            // 在哪个帖子下回复的 根评论的话就是指向帖子的ID
            replyToWhich: '123',
            // 回复列表
            replyLists: [{
                    commentID: '002',
                    commentatorID: '456',
                    commentator: '清风自来',
                    replyToID: '123',
                    replyToWho: '小老妹',
                    content: '真的吗？',
                    rootType: false,
                    // 如果是二级评论的话就指向的是回复哪个评论
                    replyToWhich: '001',
                    replyLists: [{
                        commentID: '003',
                        commentatorID: '123',
                        commentator: '小老妹',
                        replyToID: '456',
                        replyToWho: '清风自来',
                        content: '真的哦',
                        rootType: false,
                        replyToWhich: '002',
                        replyLists: []
                    }, {
                        commentID: '004',
                        commentatorID: '789',
                        commentator: '其他人',
                        replyToID: '456',
                        replyToWho: '清风自来',
                        content: '其他人的回复',
                        rootType: false,
                        replyToWhich: '002',
                        replyLists: []
                    }]
                },
                {
                    commentID: '005',
                    commentatorID: '001',
                    commentator: '菜狗',
                    replyToID: '123',
                    replyToWho: '小老妹',
                    content: '红豆泥',
                    rootType: false,
                    replyToWhich: '001',
                    replyLists: [{
                        commentID: '006',
                        commentatorID: '789',
                        commentator: '其他人',
                        replyToID: '001',
                        replyToWho: '菜狗',
                        content: '你可真是只菜狗',
                        rootType: false,
                        replyToWhich: '005',
                        replyLists: [{
                            commentID: '007',
                            commentatorID: '001',
                            commentator: '菜狗',
                            replyToID: '789',
                            replyToWho: '其他人',
                            content: '你才是',
                            rootType: false,
                            replyToWhich: '006',
                            replyLists: []
                        }]
                    }]
                }
            ]
        },
        {
            commentID: '008',
            commentatorID: '456',
            commentator: '清风自来',
            content: '厉害厉害',
            rootType: true,
            // 在哪个帖子下回复的
            replyToWhich: '123',
            replyLists: [{
                commentID: '999',
                commentatorID: '111',
                commentator: 'young',
                replyToID: '456',
                replyToWho: '清风自来',
                content: '纳尼',
                rootType: false,
                replyToWhich: '008',
                replyLists: []
            }]
        }
    ], */
    export default {
        components: {
            detailInfo,
            comment
        },
        data() {
            return {
                // 通过路由获取当前的帖子ID信息
                infoId: '',
                info: {
                    // 发帖ID
                    infoId: '',
                    // 用户ID
                    userId: '',
                    // 用户头像(后端返回数据如果为空 前端给一个默认头像)
                    userAvatar: require('@/assets/imgs/test.png'),
                    // 用户名(后端返回数据如果为空 前端给一个'匿名用户')
                    userName: '芜湖',
                    // 该信息是否需要置顶
                    isSetTop: false,
                    // 分类关键词(必填项)
                    cateKeyWord: '生活用品',
                    // 用户发表的信息内容(必填项)
                    messageContent: 'hello world',
                    // 如果是交易性质的信息,则返回详细介绍,否则为空对象
                    transactionIntro: {
                        // 交易类型: 出售/求购
                        transType: '求购',
                        // 交易价格: 具体值/面议
                        transPrice: '面议'
                    },
                    // 描述标签(字符串数组- 可空)
                    descriptionTags: ['电子产品', '准新正品', '当面验货'],
                    // 展示图片(url数组- 可为空(0-6/9张))
                    showPictures: [require('@/assets/imgs/test.jpg'), require('@/assets/imgs/test.jpg'),
                        require('@/assets/imgs/test.jpg'), require('@/assets/imgs/test.jpg'), require(
                            '@/assets/imgs/test.jpg'), require('@/assets/imgs/test.jpg')
                    ],
                    // 消息是否已经结束了
                    isOver: false,
                    // 发帖时间
                    messageTime: new Date('2020/1/9 15:00').getTime(),
                    // 浏览次数
                    visitTimes: 10000,
                },
                // 获取的评论信息
                commentInfo: [],
                popUpVisible: false,
                // 输入的回复内容
                replyContent: '',
                // 判断是回复根评论 还是回复评论的回复 true为根评论 
                replyRoot: null,
            }
        },

        methods: {
            // 获取信息
            async getInfoById(infoId) {
                // 发起请求获取帖子信息


                // 获取评论信息
                const {
                    data: res
                } = await this.$http.get('/comment/loadcomments/1').catch(err =>
                    this.$toast({
                        message: '获取评论信息失败',
                        iconClass: 'iconfont icon-close',
                        className: 'toastIcon'
                    })
                )
                // 递归改造数据
                function appendReplyLists(replyArr, replyID) {
                    let lists = []
                    if (Array.isArray(replyArr) && replyArr.length > 0) {
                        replyArr.forEach(item => {
                            if (item.replyCommentId === replyID) {
                                lists.push(item)
                                item.replyLists = appendReplyLists(replyArr, item.commentId)
                            }
                        })
                    }
                    return lists
                }
                res.forEach((levelRpy) => {
                    levelRpy.reply = appendReplyLists(levelRpy.reply, 0)
                })
                this.commentInfo = res
                console.log('获取评论信息成功!', res);
                // console.table(this.commentInfo);
            },
            // 点击评论弹出的删除回复
            deleteReply() {
                console.log('删除回复');
            },
            // 点击评论弹出的回复
            replyTo() {
                console.log('进行回复');
                this.popUpVisible = true;
            },
            // 插入评论 from代表从vuex取出来的回复谁
            insertComment(from) {
                // 将查询条件解构出来
                let {
                    commentID,
                    commentatorID,
                    commentator
                } = from;
                // 构建回复体
                let comment = {
                    commentID: '009',
                    commentator: '你好',
                    commentatorID: '599',
                    content: this.replyContent,
                    replyToID: commentatorID,
                    replyToWho: commentator,
                    replyToWhich: commentID,
                    rootType: false,
                    replyLists: []
                };
                // 找到需要被添加的父评论
                // let res = this.searchInsertLocation(this.commentInfo, commentID, commentatorID)

                this.searchInsertLocation(this.commentInfo, comment, commentID, commentatorID);
                console.log(this.commentInfo)
            },
            // 查找回复位置
            searchInsertLocation(searchArr, insertComment, commentID, commentatorID) {
                // 找到需要被添加的父元素
                /* let res = null;
                tempArr.find((item) => {
                    if (item.commentID === commentID && item.commentatorID === commentatorID) {
                        return res = item;
                    } else if (item.replyLists.length > 0) {
                        return res = this.searchInsertLocation(item.replyLists, commentID, commentatorID);
                    }
                })
                return res */

                searchArr.find((commentItem) => {
                    if (commentItem.commentID === commentID && commentItem.commentatorID === commentatorID) {
                        commentItem.replyLists.push(insertComment);
                        console.log(commentItem);
                        return commentItem;
                    } else if (commentItem.replyLists.length > 0) {
                        return this.searchInsertLocation(commentItem.replyLists, insertComment, commentID,
                            commentatorID);
                    }
                })
            },
            // 取消回复
            cancelReply() {
                console.log('取消回复');
                this.closeDialog();
            },
            // 提交回复
            commitReply() {
                if (this.replyContent.length < 1) {
                    return this.$toast({
                        message: '输入不能为空',
                        className: 'infoMore-toastClass'
                    });
                }

                console.log('=====提交回复=====', this.replyContent);

                // 回复根评论
                if (this.replyRoot) {
                    // 构造一个回复者
                    let tempComment = { // 评论的一个ID
                        commentID: '111',
                        // 评论人的ID
                        commentatorID: '123',
                        // 一级评论人
                        commentator: '小老弟',
                        // 一级评论内容
                        content: this.replyContent,
                        rootType: true,
                        // 在哪个帖子下回复的 根评论的话就是指向帖子的ID
                        replyToWhich: '123',
                        replyLists: []
                    };
                    this.commentInfo.push(tempComment);
                } else {
                    this.insertComment(this.replyToWhoInfo);
                }
                console.log('----', this.commentInfo, '----')
                this.closeDialog();
            },
            // 关闭对话框的重复操作
            closeDialog() {
                this.popUpVisible = false;
                // 清空对话框
                this.replyContent = '';
            },
            // 回复根评论
            replyToRoot() {
                console.log('根ROOT');
                // 显示回复对话框
                this.popUpVisible = true;
                // 置回复根评论为true
                this.replyRoot = true;

            },
            // 回复一级评论
            replyToFirst(comment, getFromSon) {
                // console.log(comment, getFromSon);
                // 显示回复对话框
                this.popUpVisible = getFromSon[0];
                // 置回复为false 代表回复评论的评论
                this.replyRoot = false;
                this.changeReplytoWho(comment)
            },
            // 发起聊天 ==>调用俊威
            startChat() {
                console.log('开始聊天');
            },
            // 添加收藏
            startFav() {
                console.log('添加至收藏');
            },
            ...mapMutations(['changeReplytoWho']),

        },
        created() {
            this.infoId = this.$route.params.infoId
            // 发起请求获取信息
            this.getInfoById(this.infoId)
        },
        computed: {
            replySheetActions() {
                const names = ['删除回复', '回复'];
                const methods = [this.deleteReply, this.replyTo];
                return names.map((name, index) => {
                    return {
                        name,
                        method: methods[index]
                    }
                })
            },
            mutualReplySheetVisible: {
                get: function () {
                    return this.$store.state.replySheetVisible;
                },
                set: function (v) {
                    this.$store.commit('isShowReplySheet', v);
                },
            },
            // 从vuex获取确定回复哪一位
            ...mapState(['replyToWhoInfo', 'infoDetail']),
        },

    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    @import './infoMore.scss';
</style>