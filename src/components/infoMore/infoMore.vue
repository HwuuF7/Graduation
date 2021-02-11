<template>
    <div class="infoMore">
        <!-- <detail-info :model='infoDetail' isMore /> -->

        <moreHead :model='infoDetail.info' :isSetTop="infoDetail.isSetTop" />



        <!-- 聊天与收藏区域 -->
        <div class="info-contact">
            <p>联系方式</p>
            <div>
                <!-- <p>联系人:</p>
                <p>电话:</p>
                <p class="contact-impart">联系我时，请告知是在成电翻江上看到的</p> -->
                <p @click.stop="startChat">
                    <span class='iconfont icon-shouye'></span>
                </p>
                <p @click.stop="startFav($event)">
                    <span class='iconfont icon-shoucang'></span>
                </p>
            </div>
        </div>
        <!-- 分割线 -->
        <div class="line-10"></div>
        <!-- 关注二维码区域 -->
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
        <!-- 评论区域抽离出来 -->
        <div class="info-comments">
            <div class="comment-header">
                <span>评论留言</span>
                <!-- 可以留个图标 -->
                <span @click.stop="replyToRoot">我要评论></span>
            </div>
            <comment v-for="(comment ) in commentInfo" :key="comment.commentId" :commentInfo='comment'
                @replyToFirst='replyToFirst(comment,arguments)'></comment>
            <!-- 没有评论数据的时候 -->
            <div class="emptyComments" v-if="commentInfo.length<1"></div>
        </div>
        <!-- 点击对应评论进行回复的弹出选择框 -->
        <mt-actionsheet :actions="replySheetActions" v-model="mutualReplySheetVisible">
        </mt-actionsheet>

        <!-- 弹出回复对话框 -->
        <mt-popup v-model="popUpVisible" popup-transition="popup-fade">
            <div class="popHeader">
                <span class="iconfont icon-xiaolianwawa fz-2" @click='showEmoji = !showEmoji'></span>
            </div>
            <div class="popMid">
                <mt-field :placeholder="replyToWhoInfo ? `回复${replyToWhoInfo.userName}` : ''" type="textarea" rows="4"
                    v-model.trim="replyContent"></mt-field>
            </div>
            <div class="addEmoji" v-show='showEmoji'>
                <mt-swipe :auto="0">
                    <mt-swipe-item v-for="(loop,index) in emojiSwipeLength" :key='loop'>
                        <div @click.capture.stop="chooseEmoji">
                            <span v-for="emoji in emojiPerPage(index)" :key="emoji">
                                {{emoji |decodeByHex}}
                            </span>
                        </div>
                    </mt-swipe-item>
                </mt-swipe>
            </div>
            <div class="popFooter">
                <mt-button plain @click="popUpVisible = false">取消</mt-button>
                <mt-button plain type='primary' @click='commitReply'>确定</mt-button>
            </div>
        </mt-popup>
    </div>
</template>

<script>
    import detailInfo from '@/components/common/detailInfo/detailInfo.vue';
    import moreHead from './moreHead.vue';
    import comment from '@/components/common/comment/comment.vue';
    import EMOJIS from './emoji.js';
    import {
        mapState,
        mapMutations
    } from 'vuex';
    import emoji from './emoji.js';


    export default {
        components: {
            detailInfo,
            comment,
            moreHead
        },
        data() {
            return {
                // 通过路由获取当前的帖子ID信息
                infoId: '',
                // 获取的评论信息
                commentInfo: [],
                popUpVisible: false,
                // 输入的回复内容
                replyContent: '',
                // 判断是回复根评论 还是回复评论的回复 true为根评论 
                replyRoot: null,
                showEmoji: false,
                EMOJIS: EMOJIS.emojiArr
            }
        },

        methods: {
            // 获取信息
            async getInfoById(infoId) {
                // 发起请求获取帖子信息


                // 获取评论信息
                const res = await this.$http.get(`/comment/loadcomments/${infoId}`).catch(err =>
                    console.log(err)
                )
                if (!res) return this.$reToast('获取评论信息失败', ' icon-close')

                // 解构出评论数据
                const {
                    data: comments
                } = res;
                // 将根评论找出并递归
                comments.forEach((levelRpy) => {
                    levelRpy.reply = this.appendReplyLists(levelRpy.reply, 0)
                })
                this.commentInfo = comments
                console.log('获取评论信息成功!', comments);
            },
            // 递归改造数据
            appendReplyLists(replyArr, replyID) {
                let lists = []
                if (Array.isArray(replyArr) && replyArr.length > 0) {
                    replyArr.forEach(item => {
                        if (item.replyCommentId === replyID) {
                            lists.push(item)
                            item.replyLists = this.appendReplyLists(replyArr, item.commentId)
                        }
                    })
                }
                return lists
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
            // 提交回复
            async commitReply() {
                if (this.replyContent.length < 1) {
                    return this.$reToast('输入不能为空', 'icon-cuowu');
                }


                // 判断是否已经登录
                if (!this.userInfo) {
                    // 没有登录则跳转登录
                    console.log('跳转至登录');
                    return window.location.href = this.$weixin
                    // 登录界面会接收到返回的code
                }
                // 判断出用户已登录后,构造评论必备信息
                console.log('登录后:', this.userInfo);
                let replyComment;
                console.log('=====提交回复=====', this.replyContent);


                // 回复根评论
                if (this.replyRoot) {


                    replyComment = {
                        // 从Vuex中取出openId
                        openId: this.userInfo.openId,
                        infoId: this.infoId,
                        commentLevel: 1,
                        // 对评论内容进行表情编码
                        content: this.$emojiEncode(this.replyContent),
                    }

                } else {

                    replyComment = {
                        // 从Vuex中取出openId
                        openId: this.userInfo.openId,
                        infoId: this.infoId,
                        commentLevel: 2,
                        content: this.$emojiEncode(this.replyContent),
                        parentCommentId: this.replyToWhoInfo.parentCommentId,
                    }
                    // 回复的是多级评论 则填充完整信息
                    if (!this.replyLevelFlag) {
                        replyComment = Object.assign(replyComment, {
                            replyCommentId: this.replyToWhoInfo.commentId,
                            replyCommentUserId: this.replyToWhoInfo.userId,
                            replyCommentUserName: this.replyToWhoInfo.userName
                        })
                    }
                }
                console.log(replyComment, '--263');
                // 转换提交数据格式
                const postMsg = new URLSearchParams(replyComment).toString()
                const res = await this.$http.post('/comment/addComment', postMsg, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).catch(err => console.log(err))
                if (!res || res.data.status !== 200) {
                    return this.$reToast('评论失败!', 'icon-close')
                }
                this.$reToast('评论成功!', 'icon-queren')
                // 重新拉取数据
                this.getInfoById(this.infoId)
                // 关闭对话框
                this.popUpVisible = false;
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
                // console.log(comment, '---');
                this.changeReplytoWho([comment, true])
            },
            // 发起聊天 ==>调用俊威
            startChat() {
                console.log('开始聊天');
            },
            // 添加收藏
            startFav(ev) {
                console.log('添加至收藏');
                let {
                    classList
                } = ev.currentTarget;
                // ev.currentTarget.classList.toggle('highLight');
                classList.toggle('highLight')
                let prom;
                if (classList.contains('highLight')) {
                    prom = this.$message({
                        title: '',
                        message: '已收藏',
                        closeOnClickModal: false
                    })
                } else {
                    tes = this.$message({
                        title: '',
                        message: '已取消收藏',
                        closeOnClickModal: false
                    })
                }
                // 接收确定框的回调 发起请求修改数据
                prom.then(res => {
                    console.log(res);
                })
            },
            // 选择表情
            chooseEmoji(ev) {
                this.replyContent += ev.target.innerText;
            },
            ...mapMutations(['changeReplytoWho']),

        },
        created() {
            this.infoId = this.$route.params.infoId
            // 发起请求获取信息
            this.getInfoById(this.infoId)
        },
        filters: {
            // 对表情(0x16进制)进行转码
            decodeByHex(hex) {
                return String.fromCodePoint(hex)
            }
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
            // 表情轮播的循环长度
            emojiSwipeLength() {
                return Math.ceil((this.EMOJIS.length / 24))
            },
            // 每页表情轮播展示的表情
            emojiPerPage() {
                // const emojisNum = this.EMOJIS.length;
                // 接收页码 每页24个
                return (pageIndex) => {
                    return this.EMOJIS.slice(pageIndex * 24, (pageIndex + 1) * 24)
                }
            },
            // 从vuex获取确定回复哪一位
            ...mapState(['replyToWhoInfo', 'replyLevelFlag', 'infoDetail', 'userInfo']),
        },
        watch: {
            // 监听回复对话框popup的关闭事件
            popUpVisible(bool) {
                if (!bool) {
                    // 将回复内容置空
                    this.replyContent = ''
                }
            }
        }

    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    @import './infoMore.scss';
</style>