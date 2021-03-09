<template>
    <div id="app">
        <keep-alive>
            <router-view v-if="$route.meta.keepalive" />
        </keep-alive>

        <router-view v-if="!$route.meta.keepalive" />
    </div>
</template>

<script>
    export default {
        data() {
            return {
                ws: null,
                heartID: null,
                isDisconnect: true,
                // ws出错时 会相继触发ERROR和CLOSE事件 因此要区分
                isError: false,
                // 是否客户端主动挂断
                isPos: false,
            }
        },
        created() {
            console.log('created');
            //    有无登录都要将该[this]存储至store中 发信息/接收信息时使用
            this.$store.commit('changeWsInfo', this)
            // console.log(this.$store.state.wsInfo);
            // 如果用户3天内授权过则无需再跳转登录
            // console.log(this.$getLocalStorage('userInfo'), '===APP');
            if (this.$getLocalStorage('userInfo')) {
                // 在vuex中保存
                this.$store.commit('saveUserInfo', this.$getLocalStorage('userInfo'))
                // console.log(this.$store.state.userInfo)
                // 创建WS
                this.init()
            }

        },
        methods: {
            // 登陆后的初始化
            init() {
                // 创建一个ws(一直保持在整个页面中)
                this.ws = this.createWs()
            },
            createWs() {
                const ws = new WebSocket('ws://kingwait.com:9999/uestc')
                ws.onopen = this.wsOpen;
                ws.onerror = this.wsError;
                ws.onclose = this.wsClose;
                ws.onmessage = this.wsMessage;
                return ws;
            },
            // 心跳 15s
            heartJump() {
                let obj = {
                    msgType: 4
                }
                this.hearID = setInterval(() => {
                    this.ws.send(JSON.stringify(obj))
                }, 1.5e4)
            },
            wsOpen() {
                console.log("APPopen====", this.$store.state.userInfo.userId);
                this.isDisconnect = false;
                this.isError = false;
                let obj = {
                    msgType: 1,
                    content: {
                        sendUserId: this.$store.state.userInfo.userId,
                    }
                }
                // 发起链接
                this.ws.send(JSON.stringify(obj));
                // 定时发送心跳
                this.heartJump()
            },
            wsMessage(e) {
                console.log('服务器返回===', e.data);
                let storeObj = JSON.parse(e.data).content
                // 如果vuex不存在该聊天组的信息
                if (!this.$store.state.receiveWSMsgs[storeObj.groupId]) {
                    // 向store中开创该聊天组信息
                    this.$store.commit('addWSMsgs', [storeObj.groupId, [storeObj], 2])
                } else {
                    // 否则向store中添加该记录
                    this.$store.commit('addWSMsgs', [storeObj.groupId, storeObj, 0])

                }
                // 同样地 将未读消息也进行同步
                if (!this.$store.state.unReadCount.groupMsg[storeObj.groupId]) {
                    // 向store中开创该聊天组信息
                    this.$store.state.unReadCount.groupMsg[storeObj.groupId] = [storeObj.msgId];
                } else {
                    // 否则向store中添加该记录
                    this.$store.state.unReadCount.groupMsg[storeObj.groupId].push(storeObj.msgId);
                }
                // 将消息数+1  
                this.$store.state.unReadCount.total += 1;
            },
            wsError(e) {
                console.log('APP=WebSocket失败===', e);
                this.isDisconnect = true;
                this.isError = true;
                if (this.hearID) clearInterval(this.hearID)
                this.init()
                // 更新store中的值
                this.$store.commit('changeWsInfo', this)
            },
            wsClose(e) {
                console.log('APP=关闭连接===', e);
                // 如果是出错 则交由[出错ERROR]来进行重连 或者是客户端主动挂断
                if (this.isError || this.isPos) return;
                // 否则的话 由[CLOSE]进行重连
                if (this.hearID) clearInterval(this.hearID)
                this.init()
                // 更新store中的值
                this.$store.commit('changeWsInfo', this)
            },

        },
        beforeDestroy() {
            if (this.ws) {
                this.isPos = true;
                clearInterval(this.hearID);
                this.ws.close()
                this.hearID = null;
            }
        },
    }
</script>