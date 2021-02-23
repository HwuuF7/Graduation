<template>
    <div class='login'>

        <!-- <h1 class="login-title">成电翻江</h1> -->
        <div class="login-logo">
            <img src="../../../assets/imgs/test.jpg" alt="">
        </div>
        <form class="login-form" action="">
            <div class="login-username">
                <label>
                    <span class="iconfont icon-icon- fz-15"></span>
                    <input type="text" ref='username' name='username' placeholder="账号" v-model='loginForm.username'>
                    <span class="iconfont icon-qingchu fz-12"></span>
                </label>
            </div>
            <div class="login-password">
                <label>
                    <span class='iconfont icon-mimayincang fz-15'></span>
                    <input type="password" name='password' placeholder="密码" v-model="loginForm.password">
                    <span class="iconfont icon-qingchu fz-12"></span>
                </label>
            </div>
            <div class="login-region">
                <mt-button ref='estc' plain type='primary' @click.prevent="getRegion('estc')">estc</mt-button>
                <mt-button ref='zs' plain type='primary' @click.prevent="getRegion('zs')" class="region-selected">zs
                </mt-button>
            </div>
        </form>
        <mt-button plain class="login-btn" @click.native="login">登录</mt-button>

    </div>
</template>

<script>
    import {
        mapMutations
    } from 'vuex';
    export default {
        data() {
            return {
                loginForm: {
                    username: '',
                    password: '',
                    region: 'zs',
                }
            }
        },
        methods: {
            login() {
                console.log('login');
                console.table(this.loginForm);
                // this.$http.get('/wxLogin').then(res => {
                //     console.log(res, '--');
                // })
                this.$router.push('/info');
            },
            getRegion(region) {
                this.$refs['estc'].$el.classList.toggle('region-selected');
                this.$refs['zs'].$el.classList.toggle('region-selected');
                this.loginForm.region = region;
            },
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
        //生命周期 - 创建完成（访问当前this实例）
        created() {
            let code = this.$route.query.code || ''
            this.getUserInfo(code)
        },
        //生命周期 - 挂载完成（访问DOM元素）
        mounted() {
            this.$refs.username.focus()
        }
    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    // @import './login.scss';
    @import '../log-reg.scss';
</style>