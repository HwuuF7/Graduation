<template>
    <div class="infoMore" :style="{'paddingBottom': isShowSpread ? '3.8rem' : '0'}">
        <moreHead :model='infoDetail' />



        <!-- 聊天与点赞区域 -->
        <div class="info-contact" v-if='!isShowSpread'>
            <!-- <p>联系方式</p> -->
            <div>
                <!-- <p>联系人:</p>
                <p>电话:</p>
                <p class="contact-impart">联系我时，请告知是在成电翻江上看到的</p> -->
                <p @click.stop="startChat">
                    <span class='iconfont icon-shouye'></span>
                </p>
                <p @click.stop="startFav($event)">
                    <span class='iconfont icon-dianzan1'></span>
                </p>
            </div>
        </div>
        <!-- 分割线 -->
        <div class="line-10"></div>
        <!-- 关注二维码区域 -->
        <div class="info-qrCode">
            <div class="info-qrCode-message">
                <p>FILI中山院</p>
                <p>关注尽享评论消息通知</p>
            </div>
            <div class="info-qrCode-img">
                <img src="@/assets/imgs/logo.jpg" alt="">
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
        <!-- 如果登陆后 发现是自己发布的信息才显示 -->
        <div class="bottom-panel" v-if="isShowSpread">
            <mt-button type='primary' @click.native="promoteMessage">扩散该消息</mt-button>
            <div class="moreAction" @click='extendAction'>
                <i class="iconfont icon-gengduocaozuo fz-2"></i>
            </div>
        </div>

        <div class="backButton" @click="backtToInfo" v-if="showBack">
            <i class="iconfont icon-zhuye"></i>
            <span>主页</span>
        </div>

        <!-- 点击对应评论进行回复的弹出选择框 -->
        <mt-actionsheet :actions="mutualReplySheetVisible ? replySheetActions : []" v-model="mutualReplySheetVisible">
        </mt-actionsheet>

        <!-- 弹出回复对话框 -->
        <mt-popup v-model="popUpVisible" popup-transition="popup-fade">
            <div class="popHeader">
                <span class="iconfont icon-xiaolianwawa fz-2" @click='showEmoji = !showEmoji'></span>
            </div>
            <div class="popMid">
                <mt-field :placeholder="replyToWhoInfo ? `回复${replyToWhoInfo.toUserName}` : ''" type="textarea" rows="4"
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

        <!-- 点击底部弹出的更多操作 -->
        <mt-actionsheet :actions="extendSheetActions" v-model="extendActionSheetVisible">
        </mt-actionsheet>
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


    export default {
        components: {
            detailInfo,
            comment,
            moreHead
        },
        data() {
            return {
                // 是否显示回【主页】按钮
                showBack: false,
                // 通过路由获取当前的帖子ID信息
                infoId: '',
                // 获取的Info数据
                infoDetail: null,
                // 获取的评论信息
                commentInfo: [],
                popUpVisible: false,
                // 输入的回复内容
                replyContent: '',
                // 判断是回复根评论 还是回复评论的回复 true为根评论 
                replyRoot: null,
                showEmoji: false,
                EMOJIS: EMOJIS.emojiArr,
                // 底部更多操作
                extendActionSheetVisible: false,
            }
        },
        beforeRouteEnter(to, from, next) {
            // console.log('INFFFFF===', from, to);
            // 如果是通过机器人进入的 则才显示返回按钮
            if (from.path === '/') {
                next(vm => {
                    // 显示[主页]按钮
                    vm.showBack = true
                })
            } else {
                next()
            }
        },
        created() {
            this.infoId = this.$route.params.infoId
            // 发起请求获取帖子信息
            this.getInfoById(this.infoId);
            this.getCommentInfo(this.infoId);

        },

        methods: {
            // 获取帖子有关信息
            async getInfoById(infoId) {
                const res = await this.$http.get(`/info/view/${infoId}`)
                if (!res) return this.$reToast('获取信息失败', ' icon-close')
                this.infoDetail = res.data;
                console.log(this.infoDetail);
            },
            // 获取评论信息
            async getCommentInfo(infoId) {
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
            async deleteReply() {
                console.log('删除回复');

                let isDelete = await this.$message.confirm('确定删除此条评论?').then((confirm) => {
                    return confirm
                }, (cancel) => {
                    return cancel;
                })
                if (isDelete === 'confirm') {
                    let formData = this.$paramsToFormData({
                        commentId: this.replyToWhoInfo.originCommentId
                    });
                    let res = await this.$http.post('/comment/dele', formData, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).catch(err => console.log(err))
                    if (res) {
                        await this.getCommentInfo(this.infoId);
                        return this.$reToast('已删除', 'icon-zhengque');
                    } else {
                        return this.$reToast('删除失败', 'icon-cuowu1');
                    }
                } else {
                    return this.$reToast('已取消', 'icon-zhengque')
                }

            },
            // 点击评论弹出的回复
            replyTo() {
                console.log('进行回复');
                this.popUpVisible = true;
            },
            // 提交回复
            async commitReply() {

                // 判断出用户已登录后,构造评论必备信息
                console.log('登录后:', this.userInfo);

                if (this.replyContent.length < 1) {
                    return this.$reToast('输入不能为空', 'icon-cuowu');
                }

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
                        // 回复一级评论时parentCommentId为空 则设置为commentId即可
                        parentCommentId: this.replyToWhoInfo.parentCommentId || this.replyToWhoInfo
                            .commentId,
                        // 回复一级评论的二级评论这一字段为0  方便判断
                        replyCommentId: 0,
                        replyCommentUserId: this.replyToWhoInfo.userId,
                        replyCommentUserName: this.replyToWhoInfo.userName
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
                // 推送信息
                this.pushMessage(this.replyContent);
                // 重新拉取数据
                await this.getCommentInfo(this.infoId);
                // 关闭对话框
                this.popUpVisible = false;
            },
            // 回复根评论
            replyToRoot() {
                console.log('根ROOT');
                // 判断是否已经登录
                if (!this.userInfo) {
                    // 保存当前路由
                    sessionStorage.setItem('route', this.$route.fullPath);
                    // 没有登录则跳转登录
                    console.log('跳转至登录');
                    return window.location.href = this.$weixin
                    // 登录界面会接收到返回的code
                }
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
                // 渲染用的 回复XX
                comment.toUserName = comment.userName;
                console.log(comment, '---');
                this.changeReplytoWho([comment, true])
            },
            // 微信推送信息
            async pushMessage(content) {
                let level = this.replyRoot ? 1 : 2;
                let toUserId = this.replyRoot ? this.infoDetail.userId : this.replyToWhoInfo.userId;
                // 如果是点击自己回复自己的二级评论 则认为是回复一级评论 
                // BUG解决：进行一级评论时 replyToWhoInfo为null
                if (this.replyToWhoInfo && this.replyToWhoInfo.originUserId && (this.userInfo.userId ===
                        this
                        .replyToWhoInfo.originUserId)) {
                    toUserId = this.replyToWhoInfo.replyCommentUserId;
                }
                let postForm = {
                    infoId: this.infoDetail.infoId,
                    userName: this.userInfo.userName,
                    level,
                    toUserId,
                    content
                }
                console.log(postForm, '282---');
                // 转换数据
                const formData = this.$paramsToFormData(postForm)
                console.log([...formData]);
                await this.$http.post('/message', formData, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).catch(err => console.log(err))
                // await this.$http.post('/message', postForm).catch(err => console.log(err))
            },
            // 发起聊天 ==>调用俊威
            async startChat() {
                console.log('开始聊天');
                // 判断是否已经登录
                if (!this.userInfo) {
                    // 保存当前路由
                    sessionStorage.setItem('route', this.$route.fullPath);
                    // 没有登录则跳转登录
                    console.log('跳转至登录');
                    return window.location.href = this.$weixin
                    // 登录界面会接收到返回的code
                }

                // 判断是否聊过天
                let isChatQuery = {
                    myId: this.userInfo.userId,
                    chatId: this.infoDetail.userId,
                }
                // 判断之前是否建立过聊天组
                const {
                    data: res
                } = await this.$ws.get('/check/chat', {
                    params: isChatQuery
                })

                // 成功与否都要将groupId及toUser进行同步vuex
                let toUser = {
                    userId: this.infoDetail.userId,
                    userImg: this.infoDetail.headImg,
                    userName: this.infoDetail.userName,
                }
                let {
                    groupId = null
                } = res

                this.changeGroupInfo(['toUser', toUser]);
                this.changeGroupInfo(['groupId', groupId]);
                console.log('同步vuex', this.$store.state.groupInfo);

                // 跳转至具体聊天页
                this.$router.push('/chat')
            },
            // 添加收藏
            startFav(ev) {
                console.log('添加至收藏');
                let {
                    classList
                } = ev.currentTarget;
                // ev.currentTarget.classList.toggle('highLight');
                classList.toggle('highLight')
                let prom, isLike;
                if (classList.contains('highLight')) {
                    isLike = 1;
                    prom = this.$message({
                        title: '',
                        message: '已收藏',
                        closeOnClickModal: false
                    })
                } else {
                    isLike = 0;
                    prom = this.$message({
                        title: '',
                        message: '已取消收藏',
                        closeOnClickModal: false
                    })
                }
                // 接收确定框的回调 发起请求修改数据
                prom.then(async (res) => {
                    console.log(res, this.userInfo);
                    let likeObj = {
                        infoId: this.infoId,
                        openId: this.userInfo.openId,
                        likeLevel: 1,
                        likeStatus: isLike,
                    }
                    let result = await this.$http.post('/info/like', likeObj).catch(err =>
                        console.log(err))
                    console.log(result)
                })
            },
            // 选择表情
            chooseEmoji(ev) {
                this.replyContent += ev.target.innerText;
            },
            // 扩散信息
            promoteMessage() {
                console.log('扩散信息');
            },
            // 删除/刷新/已解决操作
            extendAction() {
                console.log('more');
                this.extendActionSheetVisible = true;
            },
            // 删除该发布帖子
            async deleteInfoById() {
                console.log('删除帖子');
            },
            // 刷新该帖子（每天每个帖子三次机会 将该帖子重回至顶）
            async freshInfoById() {
                console.log('刷新帖子');
            },
            // 将当前帖子置为已解决状态
            async doneInfoById() {
                console.log('已解决');
            },
            // 返回首页
            backtToInfo() {
                // 强制刷新Info
                this.$route.meta.useAlive = false;
                console.log('=====返回=====');
                this.$router.push('/');
            },
            ...mapMutations(['changeReplytoWho', 'changeGroupInfo']),

        },
        filters: {
            // 对表情(0x16进制)进行转码
            decodeByHex(hex) {
                return String.fromCodePoint(hex)
            }
        },
        computed: {
            replySheetActions() {
                let names, methods;
                // 如果登录身份的用户ID跟评论的用户ID相等 才会出现删除自己回复
                if (this.userInfo.userId === this.replyToWhoInfo.originUserId) {
                    names = ['删除回复', '回复'];
                    methods = [this.deleteReply, this.replyTo];
                } else {
                    names = ['回复'];
                    methods = [this.replyTo];
                }
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
            // 是否显示扩散 或者显示点赞和聊天
            isShowSpread() {
                return this.userInfo && this.infoDetail && this.userInfo.userId === this.infoDetail.userId
            },
            // 可选的更多操作
            extendSheetActions() {
                const names = ['删除', '刷新', '已解决'];
                const methods = [this.deleteInfoById, this.freshInfoById, this.doneInfoById];
                return names.map((name, index) => {
                    return {
                        name,
                        method: methods[index]
                    }
                })
            },
            // 从vuex获取确定回复哪一位
            ...mapState(['replyToWhoInfo', 'replyLevelFlag', 'userInfo']),
        },
        watch: {
            // 监听回复对话框popup的关闭事件
            popUpVisible(bool) {
                if (!bool) {
                    // 将回复内容置空
                    this.replyContent = '';
                    // 将replyToWhoInfo置为null
                    this.changeReplytoWho([null, null])
                }
            }
        }

    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    @import './infoMore.scss';
</style>