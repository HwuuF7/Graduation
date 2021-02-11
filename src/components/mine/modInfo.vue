<template>
    <div class="modinfo">
        <mt-header :title="title">
            <mt-button icon="back" slot='left' @click="goBack"></mt-button>
        </mt-header>
        <!-- 个人基础信息修改选择跳转 -->
        <div v-if="!isSecret" class="baseInfo">
            <mt-cell title="头像" is-link class="userAvatar" :to='`${baseUrl}modAvatar`'>
                <img :src="userInfo.headImg" alt="">
            </mt-cell>
            <mt-cell title="名字" is-link :value='userInfo.userName' :to='`${baseUrl}modName`'></mt-cell>
            <mt-cell title="性别" is-link :value='userInfo.gender ===1 ? " 男" : "女" ' :to=' `${baseUrl}modSex`'>
            </mt-cell>
            <mt-cell title="地区" is-link :value='userInfo.region' :to='`${baseUrl}modRegion`'></mt-cell>
            <mt-cell title="个性签名" is-link :value='userInfo.signature' :to='`${baseUrl}modSignature`'></mt-cell>
        </div>
        <!-- 个人账号信息修改跳转 -->
        <div v-else class="secretInfo">
            <mt-field label="UID" placeholder="请输入用户名" v-model="userInfo.userID" disabled></mt-field>
            <!-- 这里还要判断是否为空 如果为空 说明可以进行设置 否则代表着修改过-->
            <mt-field label="登录名" placeholder="一旦修改则再也无法变更" v-model="userInfo.userName" disableClear
                @focus.native.capture="getFocusEle('userName',2)"></mt-field>
            <mt-field label="绑定邮箱" type="email" v-model="userInfo.email" disabled></mt-field>
            <mt-field label="原密码" placeholder="请输入原密码" v-model="userInfo.oldPassword" disableClear
                @focus.native.capture="getFocusEle('oldPassword',4)"></mt-field>
            <mt-field label="新密码" placeholder="请输入新密码" v-model="userInfo.newPassword" disableClear
                @focus.native.capture="getFocusEle('newPassword',5)"></mt-field>
            <mt-field label="确认新密码" placeholder="请再次输入新密码" v-model="userInfo.newAgain" disableClear
                @focus.native.capture="getFocusEle('newAgain', 6)"></mt-field>
            <p class="clearIcon" :style="{'--selfP': pIndex }" v-show="showClearIcon" @click="clearInput"></p>
            <mt-button type='primary' @click.self="finishMod">确认修改</mt-button>
        </div>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                baseUrl: '/mine/modinfo/',
                userInfo: {},
                isSecret: null,
                title: '',
                focusEle: '',
                pIndex: null
            }
        },
        beforeRouteEnter(to, from, next) {
            if (from.meta.isSecret) {
                next(vm => {
                    vm.isSecret = true;
                    vm.title = '账户与安全';
                    console.log(vm._data);
                })
            } else {
                next(vm => {
                    vm.isSecret = false;
                    vm.title = '个人资讯';
                    console.log(vm._data);
                })
            }

        },
        methods: {
            goBack() {
                this.$router.go(-1)
            },
            getUserInfo() {
                /* if (!sessionStorage.getItem('userInfo')) {
                    // 1、判断sessionStorage里有没有数据，没有就发起请求获取用户信息
                    this.userInfo = {
                        avatar: require('@/assets/imgs/test.jpg'),
                        name: 'goodBetterBest',
                        sex: '1',
                        region: 'uesc',
                        signature: '一句话介绍自己',
                        userID: '111',
                        userName: '',
                        email: 'huwu@163.com',
                        oldPassword: '',
                        newPassword: '',
                        newAgain: ''
                    }
                    this.userInfo['code'] = 'xxx'
                    console.log(this.userInfo);
                    // 2、在sessionStorage存一份 后续就不用再发请求了 直接从sessionStorage里拿
                    sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo))
                } else {
                    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
                } */
                // 解构出必要信息
                let {
                    headImg,
                    gender,
                    userId,
                    userName
                } = this.$store.state.userInfo;
                let usedInfo = {
                    headImg,
                    gender,
                    userId,
                    userName
                }
                this.userInfo = Object.assign({}, usedInfo, {
                    region: 'uesc',
                    signature: '一句话介绍自己',
                    email: 'huwu@163.com',
                    oldPassword: '',
                    newPassword: '',
                    newAgain: ''
                })
                console.log(this.userInfo);
            },
            // 获取得到焦点的元素 控制清除按钮的出现位置
            getFocusEle(el, cssIndex) {
                this.focusEle = el;
                this.pIndex = cssIndex
            },
            // 清除输入
            clearInput() {
                this.userInfo[this.focusEle] = ''
            },
            finishMod() {
                console.log('发起请求验证是否成功');
            },


        },
        created() {
            if (window.name === '') {
                console.log('首次加载');
                window.name = 'isRefresh'
                this.getUserInfo()
                console.log(this.userInfo);
            } else {
                console.log('页面刷新');
                this.$router.push('/info')
            }


            // console.log(this.$route);
        },
        mounted() {

        },
        computed: {
            showClearIcon() {
                if (this.focusEle && this.pIndex) {
                    return this.userInfo[this.focusEle].length > 0
                }
                return false
            }
        },
        destroyed() {
            window.name = '';
        }
    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    $textColor: #707070;
    $constMtField: 16.66%;

    .modinfo {
        width: 100%;
        height: 100%;
        background-color: #606266;

        .mint-header {
            background-color: #606266;
        }

        .mint-cell {
            background-color: $textColor;
            color: #fff;
            border-bottom: 1px solid;
            padding: .4rem 0;
        }

        .baseInfo {
            .userAvatar {

                img {
                    width: 2.5rem;
                    height: 2.5rem;
                    border-radius: .3rem;
                }
            }

            .mint-cell {

                ::v-deep .mint-cell-value {
                    color: #bbb;
                    max-width: 40%;
                    flex: .5;
                    justify-content: flex-end;
                }

                &:last-child {}
            }
        }

        .secretInfo {
            position: relative;

            .mint-field {
                ::v-deep input {
                    background-color: $textColor;
                    color: #fff;
                    margin-right: 1.2rem;

                    &::-webkit-input-placeholder {
                        color: #ddd;
                    }

                    &:disabled {
                        color: #a6a6a4;
                    }
                }


            }

            p.clearIcon {
                position: absolute;
                right: .6rem;
                // color: #fff;
                width: 1rem;
                height: 1rem;
                background-color: gold;
                border: 1px solid #fff;
                text-align: center;
                line-height: 1rem;
                top: calc((#{$constMtField} *var(--selfP)) - (#{$constMtField}/2));
                transform: translateY(-50%);
            }

            .mint-button {
                position: fixed;
                // margin: 0 .5rem;
                width: 85%;
                left: 50%;
                bottom: .5rem;
                border-radius: 1.7rem;
                transform: translateX(-50%);
                box-shadow: 0 0 1rem 0 rgba(33, 150, 243, .5);
            }
        }

    }
</style>