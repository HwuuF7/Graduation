<template>
    <div>
    </div>
</template>

<script>
    import {
        mapMutations
    } from 'vuex';
    export default {
        data() {
            return {

            }
        },
        //生命周期 - 创建完成（访问当前this实例）
        created() {
            this.$indicator.open({
                text: '加载中...',
                spinnerType: 'fading-circle'
            });
            let code = this.$route.query.code || ''
            this.getUserInfo(code)
        },
        //生命周期 - 挂载完成（访问DOM元素）
        mounted() {

        },
        methods: {
            async getUserInfo(code) {
                if (!code) return console.log('没有code');
                const res = await this.$http.get(`/getInfo?code=${code}`)
                // vuex存一份
                this.saveUserInfo(res.data.result)
                console.log('Vuex存储成功===', this.$store.state.userInfo);

                // 用Localstorage保存一份
                this.$setLocalStorage('userInfo', res.data.result)
                console.log('本地存储===', this.$getLocalStorage('userInfo'))
                // 跳转回登录前的页面
                this.$router.replace(sessionStorage.getItem('route'))
            },
            ...mapMutations(['saveUserInfo']),
        },
        destroyed() {
            this.$indicator.close();
        }
    }
</script>

<style scoped>
    /* @import url(); 引入css类 */
</style>