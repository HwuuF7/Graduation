<template>
    <div class='login'>

        <!-- <h1 class="login-title">成电翻江</h1> -->
        <div class="login-logo">
            <img src="../../../assets/imgs/test.jpg" alt="">
        </div>
        <form class="login-form" action="">
            <div class="login-username">
                <label>
                    <span>小图标</span>
                    <input type="text" ref='username' name='username' placeholder="账号" @focus="hello"
                        v-model='loginForm.username'>
                    <!-- 清除按钮 -->
                </label>
            </div>
            <div class="login-password">
                <label>
                    <span>小图标</span>
                    <input type="password" name='password' placeholder="密码" v-model="loginForm.password">
                    <!-- 清除按钮 -->
                </label>
            </div>
            <div class="login-region">
                <mt-button ref='estc' type='primary' @click.prevent="getRegion('estc')">estc</mt-button>
                <mt-button ref='zs' type='primary' @click.prevent="getRegion('zs')" class="region-selected">zs
                </mt-button>
            </div>
            <mt-button plain class="login-btn" @click.native="login">登录</mt-button>
        </form>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                loginForm: {
                    username: '',
                    password: '',
                    region: 'zs'
                }
            }
        },
        methods: {
            hello() {
                console.log('hello');
            },
            login() {
                console.log('login');
                console.table(this.loginForm);
                this.$router.push('/info');
            },
            getRegion(region) {
                this.$refs['estc'].$el.classList.toggle('region-selected');
                this.$refs['zs'].$el.classList.toggle('region-selected');
                this.loginForm.region = region;
            }
        },
        //生命周期 - 创建完成（访问当前this实例）
        created() {

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