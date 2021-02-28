<template>
    <div class='chat'>
        <ul class="chat-item" v-if="refresh">
            <li v-for="ic in 2" :key="ic +'?'" @click="gotoChat(ic)">
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
                        <img src="@/assets/imgs/7f.png">
                        <div class="intro">
                            <span>name</span>
                            <span>哈哈哈contentcontentcontentcontentcontentcontent</span>
                        </div>
                    </div>
                    <!-- 右边放置时间 -->
                    <span>{{date | timeFormat7Day}}</span>
                </mt-cell-swipe>
            </li>
        </ul>

        <p class="testP" v-for="i in 10" :key='i'>{{i}}</p>
    </div>
</template>

<script>
    export default {
        props: ['refresh'],
        data() {
            return {
                rightButton: [],
                date: "2021-02-26T13:34:39.000+00:00"
            }
        },
        methods: {
            // 删除此会话
            deleteMessageById(id) {
                console.log('delete===', id);
            },
            // 深入聊天
            gotoChat(chatId) {
                console.log('gotoChat===', chatId);
                this.$router.push('/chat')
            }
        }
    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    @import './chat.scss';
</style>