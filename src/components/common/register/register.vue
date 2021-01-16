<template>
    <div class="register">
        <form action="" class="register-form">
            <div class="register-username" style="border:1px solid red">
                <label>
                    <span>小图标</span>
                    <input type="text" ref='username' name='username' placeholder="用户名" @focus="hello"
                        v-model.trim.lazy="registerForm.username" autocomplete="off">
                    <!-- 清除按钮 -->
                </label>
                <p class="attention" v-show="usernameVerify.isShow">{{usernameVerify.showMsg}}</p>
            </div>
            <div class="register-password">
                <label>
                    <span>小图标</span>
                    <input type="password" name='password' placeholder="密码" v-model.trim.lazy="registerForm.password">
                    <!-- 清除按钮 -->

                </label>
                <p class="attention" v-show="passwordVerify.isShow">{{passwordVerify.showMsg}}</p>

            </div>
            <div class="register-passwordAgain">
                <label>
                    <span>小图标</span>
                    <input type="password" name='passwordAgain' placeholder="确认密码"
                        v-model.trim.lazy="registerForm.passwordAgain">
                    <!-- 清除按钮 -->
                </label>
                <p class="attention" v-show="passwordAgaVerify.isShow">{{passwordAgaVerify.showMsg}}</p>

            </div>
            <div class="register-email">
                <label>
                    <span>小图标</span>
                    <input type="text" name='email' placeholder="邮箱" v-model.trim.lazy="registerForm.email"
                        autocomplete="off">
                    <!-- 清除按钮 -->
                </label>
                <p class="attention" v-show="emailVerify.isShow">{{emailVerify.showMsg}}</p>
            </div>
            <div class="register-authCode">
                <label>
                    <span>验证码</span>
                    <input type="text" name='authCode' v-model.trim="registerForm.authCode" autocomplete="off"
                        maxlength='4'>
                    <mt-button class="authCode" size='small' type='primary' @click.native.prevent="countDown"
                        :disabled='authBtn' :style="authBtn ? disabledStyle : ''" :plain='authBtn'>
                        <!-- 图标 -->
                        <mt-spinner slot='icon' type="fading-circle" :size='18' v-show="authBtn" color='#03c4a1'>
                        </mt-spinner>


                        {{authContent}}
                    </mt-button>

                </label>
                <p class="attention" v-show="authVerify.isShow">{{authVerify.showMsg}}</p>

            </div>
            <mt-button plain class="register-btn" @click.native.prevent="register">注册</mt-button>
        </form>


    </div>
</template>

<script>
    export default {
        data() {
            return {
                registerForm: {
                    // 用户名
                    username: '',
                    // 密码
                    password: '',
                    // 再次确认密码
                    passwordAgain: '',
                    // 邮箱注册（支持163，qq）
                    email: '',
                    // 验证码
                    authCode: ''
                },
                usernameVerify: {
                    isPass: false,
                    isShow: false,
                    showMsg: ''
                },
                passwordVerify: {
                    isPass: false,
                    isShow: false,
                    showMsg: ''
                },
                passwordAgaVerify: {
                    isPass: false,
                    isShow: false,
                    showMsg: ''
                },
                emailVerify: {
                    isPass: false,
                    isShow: false,
                    showMsg: ''
                },
                authVerify: {
                    isPass: false,
                    isShow: false,
                    showMsg: ''
                },
                totalTime: 10,
                authBtn: false,
                authContent: '获取验证码',
                disabledStyle: {
                    // backgroundColor: '#ccc',
                    // border: 'none',
                    borderColor: '#61b15a',
                    fontSize: '1.3rem',
                    color: '#03c4a1'
                }
            }
        },
        methods: {
            hello() {
                // console.log('hello');
            },
            register(el) {
                // MintUI的加载动画
                this.$indicator.open({
                    text: '注册中...',
                    spinnerType: 'fading-circle'
                });

                // 发起注册
                /*  if (!this.isValid) {
                     console.log('验证失败！');
                     setTimeout(() => {
                         this.$indicator.close();
                     }, 1000);
                     return;
                 } */
                console.log(this.registerForm);
                console.log('验证通过 发起请求');
                setTimeout(() => {
                    this.$indicator.close();
                }, 0)
                let toast = this.$toast({
                    message: '注册成功',
                    position: 'middle',
                    duration: 1000
                });
                setTimeout(() => {
                    toast.close();

                }, 3000);


            },
            test() {
                console.log('1111---');
            },
            // 抽离验证代码
            verify(val, whichVerify, condition, ...showMsg) {
                // 不能为空
                if (val.length < 1) {
                    this[whichVerify].isShow = true;
                    this[whichVerify].showMsg = showMsg[0];
                } else {
                    // 判断条件
                    if (!condition) {
                        // 不通过
                        this[whichVerify].isPass = false;
                        this[whichVerify].isShow = true;
                        this[whichVerify].showMsg = showMsg[1];
                    } else {
                        // 通过
                        this[whichVerify].isShow = false;
                        this[whichVerify].isPass = true;

                        // 先输入'确认密码'  后输入'密码'
                        if (whichVerify === 'passwordVerify' && this.registerForm.passwordAgain) {
                            if (this.registerForm.password === this.registerForm.passwordAgain) {
                                this.passwordAgaVerify.isShow = false;
                                this.passwordAgaVerify.isPass = true;
                            } else {
                                this.passwordAgaVerify.isShow = true;
                                this.passwordAgaVerify.isPass = false;
                                this.passwordAgaVerify.showMsg = '请再次核对密码';
                            }
                            console.log(this.passwordAgaVerify);

                        }

                    }
                }
            },
            countDown() {
                if (this.authBtn) return;
                this.authBtn = true;
                this.authContent = this.totalTime + 's'
                let clock = setInterval(() => {
                    this.totalTime--;
                    this.authContent = this.totalTime + 's';
                    if (this.totalTime <= 0) {
                        clearInterval(clock)
                        this.authContent = '重新发送';
                        this.totalTime = 10;
                        this.authBtn = false;
                    }
                }, 1000)
            }
        },
        //生命周期 - 创建完成（访问当前this实例）
        created() {},
        //生命周期 - 挂载完成（访问DOM元素）
        mounted() {
            this.$refs.username.focus();
        },
        computed: {
            isValid() {
                const verifyArr = ['usernameVerify', 'passwordVerify', 'passwordAgaVerify', 'emailVerify',
                    'authVerify'
                ];

                return verifyArr.every((eachVerify) => {
                    return this[eachVerify].isPass
                })
            }
        },
        watch: {
            // 校验规则
            "registerForm.username"(val) {

                let reg = /^[\s\S]{2,4}$/;
                this.verify(val, 'usernameVerify', reg.test(val), '用户名不能为空', '请输入2~4位的用户名');
                console.log(this['usernameVerify']);

                // console.log('username---', val);
                // console.log(val.match(reg));
                // console.log(this.usernamePass);
            },
            "registerForm.password"(val) {
                console.log('password');
                let reg = /^\w{6,15}$/;
                this.verify(val, 'passwordVerify', reg.test(val), '密码不能为空', '请输入6~15位的密码');
            },
            "registerForm.passwordAgain"(val) {
                console.log('passAgain');
                // 密码有值的同时 再去判断是否相等
                let isChecked = this.registerForm.password && this.registerForm.password === this.registerForm
                    .passwordAgain;
                this.verify(val, 'passwordAgaVerify', isChecked, '密码不能为空', '请再次核对密码');
            },
            "registerForm.email"(val) {
                console.log('email', val);
                // let reg2 = /^([a-zA-Z\d_-.])+\@(163.com|qq.com)$/;
                let reg = /^([\w-.])+@(163.com|qq.com)$/;
                this.verify(val, 'emailVerify', reg.test(val), '邮箱不能为空', '请输入正确的邮箱')
            },
            "registerForm.authCode"(val) {
                console.log('authCode', val);
                let reg = /(abc7)/i;
                this.verify(val, 'authVerify', reg.test(val), '验证码不能为空', '验证码不正确')
            },
        }
    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    // @import './register.scss';
    @import '../log-reg.scss';
</style>