<template>
    <div class='chat'>
        <ul class="chat-item" v-infinite-scroll="loadMoreGroup" infinite-scroll-disabled="loading"
            infinite-scroll-distance="10" :infinite-scroll-immediate-check='true'>
            <li v-for="(chat,groupId) in $store.state.receiveWSMsgs" :key="groupId" @click="gotoChat(groupId)">
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
                        <div class="avatar">
                            <img v-if="!!groupSend[groupId]" :src="groupSend[groupId].userImg">
                            <!-- 当未读消息不为{} 且 未读消息对象中有该聊天组ID 且 未读消息对象中的该聊天组信息长度>0才显示 -->
                            <mt-badge size="small" type='error'
                                v-if="!!$store.state.unReadCount.groupMsg && !!$store.state.unReadCount.groupMsg[groupId] && $store.state.unReadCount.groupMsg[groupId].length > 0">
                                {{$store.state.unReadCount.groupMsg[groupId].length}}</mt-badge>
                        </div>

                        <div class="intro">
                            <span v-if="!!groupSend[groupId]">{{groupSend[groupId].userName}}</span>
                            <span>{{chat[chat.length - 1].msg | emojiDecode}}</span>
                        </div>
                    </div>
                    <!-- 右边放置时间 -->
                    <span>{{chat[chat.length - 1].createTime | timeFormat7Day}}</span>
                </mt-cell-swipe>
            </li>
        </ul>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                // 存储聊天组的发送方信息 [groupId] => sendUserInfo
                groupSend: {},
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
                if (unreadLogs.length > 0) {
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
                }
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
                    // 将发送用户的信息保存起来
                    res.data.data.forEach((item) => {
                        this.groupSend[item.groupId] = item.chatInfo;
                    })
                    console.log('groupSend===', this.groupSend);
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
            gotoChat(groupId) {
                // 构建vuex中的groupInfo
                let groupInfo = {
                    // 陪聊对象
                    toUser: this.groupSend[groupId],
                    // 聊天组ID
                    groupId,
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