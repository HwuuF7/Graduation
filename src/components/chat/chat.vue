<template>
    <div class='chat'>
        <ul class="chat-item">
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
        </ul>

        <p class="testP" v-for="i in 10" :key='i'>{{i}}</p>
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
                }
            }
        },
        created() {
            console.log('chat==');
            // 登录之后才会显示这一组件 因此能确保拿到userId
            this.queryGroup.userId = this.$store.state.userInfo.userId;
            this.getChatGroups()
        },
        methods: {
            // 获取当前用户的聊天组
            async getChatGroups() {
                const res = await this.$ws.get('/msg/load_record', {
                    params: this.queryGroup
                })
                this.chatGroups = res.data.data;
                console.log(this.chatGroups);
                // 同步至vuex中 groupId-> []
                this.chatGroups.forEach(chat => {
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
                this.$store.commit('changeGroupInfo', groupInfo);
                this.$router.push('/chat')
            }
        },
    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    @import './chat.scss';
</style>