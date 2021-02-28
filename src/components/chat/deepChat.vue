<template>
    <div class="deepChat">
        <!-- 深入聊天 -->
        <mt-header title="用户名" fixed>
            <mt-button slot="left" icon="back" @click.native="$router.go(-1)"></mt-button>
        </mt-header>
        <ul class="message">
            <li v-for="msg in msgs" :key='msg.mId'>
                <!-- 左边 -->
                <div v-if="msg.uName === userName" class="message-item">
                    <span>
                        <img src="@/assets/imgs/xiaojiang.png">
                    </span>
                    <span>{{msg.content | emojiDecode}}</span>
                </div>
                <!-- 右边 -->
                <div v-else class="message-item message-reverse">
                    <span>
                        <img src="@/assets/imgs/7f.png">
                    </span>
                    <span>{{msg.content}}</span>
                </div>
            </li>
            <li>
                <p class='testP' v-for="i in 7" :key='i'>{{i}}</p>
            </li>
        </ul>
        <footer>
            <div class="sendMsg" contenteditable ref="msg" @keydown.enter.prevent="sendMsg"></div>
            <mt-button type='primary' @click="sendMsg">send</mt-button>
        </footer>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                ws: null,
                content: '',
                userName: '菜单',
                msgs: [{
                        mId: 0,
                        uName: '菜单',
                        content: '你好'
                    },
                    {
                        mId: 1,
                        uName: 'wxx',
                        content: 'good😆😆😆'
                    },
                    {
                        mId: 2,
                        uName: '菜单',
                        content: '你好2'
                    },
                    {
                        mId: 3,
                        uName: '菜单',
                        content: '你好3'
                    },
                    {
                        mId: 4,
                        uName: 'wxx',
                        content: 'better'
                    },
                ]
            }
        },
        //生命周期 - 创建完成（访问当前this实例）
        created() {
            // 建立链接
            /*   this.ws = new WebSocket('ws://kingwait.com:9999/uestc');
              this.ws.onopen = this.wsOpen;
              this.ws.onmessage = this.wsMessage;
              this.ws.onerror = this.wsError; */
        },
        //生命周期 - 挂载完成（访问DOM元素）
        mounted() {

        },
        methods: {
            // 发送消息
            sendMsg() {
                let msg = this.$emojiEncode(this.$refs.msg.innerText.trim());
                let obj = {
                    msgType: 2,
                    content: {
                        sendUserId: 3,
                        receiveUserId: 12,
                        msg: 'hhhhhhhhhhh222'
                    }
                }
                this.ws.send(JSON.stringify(obj))

            },
            wsOpen() {
                console.log("open");
                let obj = {
                    msgType: 1,
                    content: {
                        sendUserId: 3,
                    }
                }
                this.ws.send(JSON.stringify(obj));
            },
            wsMessage(e) {
                console.log('服务器返回===', e.data);
            },
            wsError(e) {
                console.log(e);
            },
            heartJump() {
                this.ws.send()
            }
        },
    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */

    @import './deepChat.scss';
</style>