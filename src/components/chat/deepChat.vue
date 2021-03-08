<template>
    <!-- 缓存页面 -->
    <div class="deepChat">
        <!-- 深入聊天 -->
        <mt-header :title="$store.state['groupInfo'].toUser.userName" fixed>
            <mt-button slot="left" icon="back" @click.native="$router.go(-1)"></mt-button>
        </mt-header>
        <ul class="message" ref="msg-ul" v-if="canShow">
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
                <p class='testP' v-for="i in 7" :key='i'></p>
            </li> -->
        </ul>
        <footer v-if="canShow">
            <div class="sendMsg" contenteditable ref="msg" @keydown.enter.prevent="sendMsg"></div>
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
                // 等聊天记录同步至vuex中后 才进行渲染
                // 解决前loggings存有的数据显示BUG
                canShow: false,
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {})
        },
        //生命周期 - 创建完成（访问当前this实例）
        async created() {
            console.log('deep-create===', this.$store.state.groupInfo.groupId);
            // 从vuex中获取聊天组ID
            this.groupQuery.groupId = this.$store.state.groupInfo.groupId;
            // 如果聊天组ID不为null 查询聊天记录
            if (!!this.groupQuery.groupId) {
                console.log('查询===');
                // 查询当前聊天组的记录 [覆写Vuex中的数据]
                this.getGroupInfo(this.groupQuery.groupId, 2);
                // 调用vuex发送消息 [确认将未读消息转为已读]
                this.$store.state.wsInfo.ws.send(JSON.stringify({
                    msgType: 3
                }))
            } else {
                this.canShow = true;
            }

        },
        methods: {
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
                console.log(res.data.data.list);
                // 将记录保存至Vuex中
                this.$store.commit('addWSMsgs', [groupId, res.data.data.list.reverse(), vuexStatus])
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
            },

        },
        computed: {
            //  从vuex中获取对应聊天组用于渲染的消息记录
            loggings() {
                // console.log('11111', this.$store.getters.logsByGroupId);
                return this.$store.getters.logsByGroupId;
            },
        },
        watch: {
            // 最新消息要滑动窗口至底部
            /* 'loggings.length'(newLength) {
                if (newLength > 0) {
                    console.log('hhhh?');
                    this.$nextTick(() => {
                        this.$refs['msg-ul'].lastChild.scrollIntoView(false)
                    })
                }
            }, */
            // 最新消息要滑动窗口至底部
            canShow() {
                this.$nextTick(() => {
                    if (!!this.$refs['msg-ul'].lastChild) {
                        this.$refs['msg-ul'].lastChild.scrollIntoView(false)
                    }
                })
            }
        }
    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */

    @import './deepChat.scss';
</style>