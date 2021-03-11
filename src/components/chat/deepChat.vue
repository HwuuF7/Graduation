<template>
    <!-- 缓存页面 -->
    <div class="deepChat">
        <!-- 深入聊天 -->
        <mt-header :title="$store.state['groupInfo'].toUser.userName" fixed>
            <mt-button slot="left" icon="back" @click.native="$router.go(-1)"></mt-button>
        </mt-header>
        <mt-loadmore class="message" :top-method="loadTop" ref="loadmoreTop" topLoadingText=''
            @top-status-change="handleTopChange">
            <ul ref="msg-ul" v-if="canShow">
                <li v-for="log in loggings" :key='log.msgId'>
                    <!-- 左边显示对方 -->
                    <div v-if="log.sendUserId !== $store.state['userInfo'].userId" class="message-item">
                        <span>
                            <img :src="$store.state['groupInfo'].toUser.userImg">
                        </span>
                        <span>{{log.msg | emojiDecode}}</span>
                    </div>
                    <!-- 右边显示自己 -->
                    <div v-else class="message-item message-reverse">
                        <span>
                            <img :src="$store.state['userInfo'].headImg">
                        </span>
                        <span>{{log.msg | emojiDecode}}</span>
                    </div>
                </li>
                <!-- <li>
                    <p class='testP' v-for="i in 7" :key='i'>{{unReadLoggings}}</p>
                </li> -->
            </ul>
            <div slot="top" class="mint-loadmore-top">
                <mt-spinner v-show="topStatus === 'loading'" :type="0" color='rgba(100, 100, 100,.4)' :size='18'>
                </mt-spinner>
            </div>
        </mt-loadmore>

        <footer v-if="canShow">
            <div class="sendMsg" contenteditable ref="msg" @keydown.enter.prevent="sendMsg" @focus="scrollToBottom">
            </div>
            <mt-button type='primary' @click="sendMsg">send</mt-button>
        </footer>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                // groupInfo查询参数
                groupQuery: {
                    groupId: null,
                    pageNum: 1,
                },
                // 加载条目
                pageSize: 20,
                // 等聊天记录同步至vuex中后 才进行渲染
                // 解决前loggings存有的数据显示BUG
                canShow: false,
                topStatus: '',
                topLoadEnd: false,
                // 区分接收消息和上拉加载的滑底标志 如果为true 则不应该置底
                isLoadTop: false,
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {})
        },
        async created() {
            console.log('deep-create===', this.$store.state.groupInfo.groupId);
            // 从vuex中获取聊天组ID
            this.groupQuery.groupId = this.$store.state.groupInfo.groupId;
            // 如果聊天组ID不为null 查询聊天记录
            if (!!this.groupQuery.groupId) {
                console.log('查询===');
                // 查询当前聊天组的记录 [覆写Vuex中的数据]
                this.getGroupInfo(this.groupQuery.groupId, 2);
            } else {
                this.canShow = true;
            }

        },
        methods: {
            // 控制信息滑至底部
            scrollToBottom() {
                if (!!this.$refs['msg-ul'].lastChild) {
                    this.$refs['msg-ul'].lastChild.scrollIntoView(false)
                }
            },
            // 创建聊天组
            async createChatGroup() {
                let {
                    userInfo,
                    groupInfo
                } = this.$store.state
                // console.log(userInfo, groupInfo);
                let chatBody = {
                    masterUserId: userInfo.userId,
                    masterUserImg: userInfo.headImg,
                    masterUserName: userInfo.userName,
                    slaveUserId: groupInfo.toUser.userId,
                    slaveUserImg: groupInfo.toUser.userImg,
                    slaveUserName: groupInfo.toUser.userName,
                }
                // console.log('创建聊天组==', chatBody)
                const res = await this.$ws.post('/build/group', chatBody)
                this.$store.commit('changeGroupInfo', ['groupId', res.data.groupId]);
                // console.log('创建--', groupInfo)
            },
            // 获取当前聊天组的记录 第二个参数关系到vuex中的数据保存
            async getGroupInfo(groupId, vuexStatus) {
                const res = await this.$ws.get('/msg/group', {
                    params: this.groupQuery
                })
                let logs = res.data.data.list;
                console.log(res.data.data.list);
                if (logs.length > 0) {
                    if (logs.length !== this.pageSize) {
                        console.log('加载完了!');
                        this.topLoadEnd = true;
                    } else {
                        this.groupQuery.pageNum++;
                    }
                } else {
                    console.log('加载完了!');
                    this.topLoadEnd = true;
                }
                // 将记录保存至Vuex中
                this.$store.commit('addWSMsgs', [groupId, logs.reverse(), vuexStatus])
                console.log(this.$store.state.receiveWSMsgs)
                // 显示页面布局
                this.canShow = true;
            },
            // 发送消息
            async sendMsg() {
                // 如果断开了链接 要重新链接
                if (this.$store.state.wsInfo.isDisconnect) {
                    this.$reToast(`发送失败!正在重连...`, 'icon-cuowu')
                    return this.$store.state.wsInfo.ws = this.$store.state.wsInfo.wsCreate();
                }
                let msg = this.$emojiEncode(this.$refs.msg.innerText.trim());
                if (msg.length < 1) return this.$reToast('输入不能为空', 'icon-cuowu');

                // 如果聊天组ID为空
                if (!this.$store.state.groupInfo.groupId) {
                    // 创建聊天组
                    await this.createChatGroup()
                }

                // 生成15位随机ID
                let msgId = this.$getRanID(15);
                // ws请求体
                let obj = {
                    msgType: 2,
                    content: {
                        // 最终用
                        sendUserId: this.$store.state.userInfo.userId,
                        receiveUserId: this.$store.state.groupInfo.toUser.userId,
                        msg,
                        msgId,
                        groupId: this.$store.state.groupInfo.groupId,
                    }
                }
                console.log('发送消息==', obj);
                // 调用vuex发送消息
                this.$store.state.wsInfo.ws.send(JSON.stringify(obj))
                // 向vuex中同步通信记录
                this.$store.commit('addWSMsgs', [this.$store.state.groupInfo.groupId, obj.content, 0])

                // 清空输入
                this.$refs.msg.innerText = '';
                // 滑至底部
                this.$nextTick(() => {
                    // console.log('添加信息');
                    this.scrollToBottom()
                })
            },
            // 上拉加载记录
            async loadTop() {
                this.isLoadTop = true;
                if (this.topLoadEnd) {
                    console.log('加载完了!!!');
                    this.isLoadTop = false;
                    return this.$refs.loadmoreTop.onTopLoaded();
                }
                // 加载记录进行拼接
                console.log('加载更多----');
                await this.getGroupInfo(this.groupQuery.groupId, 1)
                this.$refs.loadmoreTop.onTopLoaded();
                this.isLoadTop = false;
            },
            handleTopChange(status) {
                this.topStatus = status;
            },
            // 将未读消息转已读消息
            convertRead(groupId) {

                let group = this.$store.state.unReadCount.groupMsg[groupId]
                // 如果为空
                if (!group) return;
                // 否则调用vuex发送已读包
                this.$store.state.wsInfo.ws.send(JSON.stringify({
                    msgType: 3,
                    extand: group.join()
                }))
                this.$store.commit('changeUnReadStatus', ['total', this.$store.state.unReadCount.total - group.length]);
                this.$store.state.unReadCount.groupMsg[groupId] = [];
                console.log('转已读!!=', this.$store.state.unReadCount);

            },
        },
        computed: {
            //  从vuex中获取对应聊天组用于渲染的消息记录
            loggings() {
                // console.log('11111', this.$store.getters.logsByGroupId);
                return this.$store.getters.logsByGroupId;
            },
            // 从vuex中获取对应聊天组的[未读消息]
            unReadLoggings() {
                if (!!this.$store.state.unReadCount.groupMsg[this.groupQuery.groupId]) {
                    return this.$store.state.unReadCount.groupMsg[this.groupQuery.groupId]
                } else {
                    return []
                }

            },
        },
        watch: {
            // 最新消息要滑动窗口至底部
            'loggings.length'(newLength) {
                if (newLength > 0 && !this.isLoadTop) {
                    // console.log('hhhh?');
                    this.$nextTick(() => {
                        this.$refs['msg-ul'].lastChild.scrollIntoView(false)
                    })
                }
            },
            'unReadLoggings.length'(newLength) {
                if (newLength > 0) {
                    console.log('会变化====');
                    this.convertRead(this.groupQuery.groupId)
                }
            },
            /*  // 最新消息要滑动窗口至底部
             canShow() {
                 // 首次进入时所滑动至底
                 this.$nextTick(() => {
                     if (!!this.$refs['msg-ul'].lastChild) {
                         console.log('进入');
                         this.$refs['msg-ul'].lastChild.scrollIntoView(false)
                     }
                 })
             } */
        }
    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */

    @import './deepChat.scss';
</style>