<template>
    <div class='chat'>
        <ul class="chat-item" v-infinite-scroll="loadMoreGroup" infinite-scroll-disabled="loading"
            infinite-scroll-distance="10" :infinite-scroll-immediate-check='true'>
            <li v-for="chat in chatGroups" :key="chat.groupId" @click="gotoChat(chat)">
                <mt-cell-swipe :right="[
                {
                content: '删除',
                style: {
                    background: 'red',
                    color: '#fff'
                },
                handler: () => deleteMessageById(ic)
                }
            ]">
                    <!-- 左边盒子放置头像、名字、信息 -->
                    <div>
                        <img :src="chat['chatInfo'].userImg">
                        <div class="intro">
                            <span>{{chat['chatInfo'].userName}}</span>
                            <span>{{chat['msgList'].msg | emojiDecode}}</span>
                        </div>
                    </div>
                    <!-- 右边放置时间 -->
                    <span>{{chat['msgList'].createTime | timeFormat7Day}}</span>
                </mt-cell-swipe>
            </li>
            <li>
                <p class="testP" v-for="i in 10" :key='i'>{{i}}</p>
            </li>
        </ul>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                // 聊天组
                chatGroups: [],
                // 获取聊天组的查询参数
                queryGroup: {
                    userId: null,
                    pageNum: 1,
                    // 获取聊天组的最大数
                    pageSize: 10,
                },
                // 加载更多标志
                loading: false,
                loadEnd: false,
            }
        },
        created() {
            console.log('chat==');
            // 登录之后才会显示这一组件 因此能确保拿到userId
            this.queryGroup.userId = this.$store.state.userInfo.userId;
            // console.log('重置pagenum', this.chatGroups, this.queryGroup.pageNum);
            this.getChatGroups()
            // 获取未读消息
            if (this.$store.state.unReadCount.isFirst) {
                this.getUnread()
            }
        },
        methods: {
            // 获取未读信息
            async getUnread() {
                const res = await this.$ws.get('/msg/unread', {
                    params: {
                        receiveId: this.$store.state.userInfo.userId
                    }
                })
                let unreadLogs = res.data.data
                console.log('未读信息===', unreadLogs);
                // 存放组ID对应的消息
                let groupMsg = {};
                unreadLogs.forEach((log) => {
                    // 如果不存在
                    if (!groupMsg[log.groupId]) {
                        groupMsg[log.groupId] = [log.msgId];
                    } else {
                        groupMsg[log.groupId].push(log.msgId)
                    }
                })
                this.$store.commit('changeUnReadStatus', ['total', unreadLogs.length])
                this.$store.commit('changeUnReadStatus', ['groupMsg', groupMsg])
                this.$store.commit('changeUnReadStatus', ['isFirst', false])
                console.log('=====', this.$store.state.unReadCount);
            },
            // 获取当前用户的聊天组
            async getChatGroups() {
                const res = await this.$ws.get('/msg/load_record', {
                    params: this.queryGroup
                })
                let resLen = res.data.data.length;
                if (resLen > 0) {
                    this.chatGroups = this.chatGroups.concat(res.data.data)
                    if (resLen !== this.queryGroup.pageSize) {
                        this.loadEnd = true;
                    } else {
                        this.queryGroup.pageNum++;
                    }
                } else {
                    // 一个聊天组都没有
                    // console.log('无聊天组');
                    this.loadEnd = true;
                }
                console.log(this.chatGroups);
                // 同步至vuex中 groupId-> []
                res.data.data.forEach(chat => {
                    this.$store.commit('addWSMsgs', [chat.groupId, [chat.msgList], 2])
                });
                console.log(this.$store.state.receiveWSMsgs);
            },
            // 删除此会话
            deleteMessageById(id) {
                console.log('delete===', id);
            },
            // 深入聊天
            gotoChat(chat) {

                // 构建vuex中的groupInfo
                let groupInfo = {
                    // 陪聊对象
                    toUser: chat.chatInfo,
                    // 聊天组ID
                    groupId: chat.groupId
                }
                // console.log('gotoChat===', groupInfo);

                // 同步至vuex中
                this.$store.commit('changeGroupInfo', ['toUser', groupInfo.toUser]);
                this.$store.commit('changeGroupInfo', ['groupId', groupInfo.groupId]);
                this.$router.push('/chat')
            },
            // 加载更多聊天组
            async loadMoreGroup() {
                this.loading = true;
                if (this.loadEnd) return console.log('加载截止');
                console.log('加载更多聊天组....');
                await this.getChatGroups();
                this.loading = false;
            },
        },
    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    @import './chat.scss';
</style>