<template>
    <div class='mine'>
        <!--  <p class='mine-title'>基础信息</p>
        <mt-cell title="资料修改" is-link @click.native="toMod(false)"></mt-cell>
        <p class='mine-title'>账号管理</p>
        <mt-cell title="账号修改" is-link @click.native="toMod(true)"></mt-cell>
        <p class='mine-title'>与我有关</p> -->
        <!-- 顶部个人头像 -->
        <div class="self-info">
            <img :src='userInfo.headImg'>
            <h4>{{userInfo.userName}}</h4>
        </div>
        <div class="wave"></div>
        <mt-cell title="我的发布" @click.native="toAboutMe(0)">
            <span slot="icon" class='iconfont icon-zuopin'></span>
        </mt-cell>
        <mt-cell title="我的动态" @click.native="toAboutMe(1)">
            <span slot="icon" class='iconfont icon-pinglun'></span>
        </mt-cell>
    </div>
</template>

<script>
    import {
        mapState
    } from 'vuex';
    export default {
        data() {
            return {}
        },
        methods: {
            toMod(bool) {
                this.$route.meta.isSecret = bool
                this.$router.push('/mine/modinfo')
            },
            async exit() {
                console.log('退出登录');
                let res = await this.$message({
                    title: '提示',
                    message: '确定退出当前账号?',
                    showCancelButton: true,
                    confirmButtonHighlight: true,
                    cancelButtonHighlight: true,
                })

                if (res === 'confirm') {
                    // 1、清除session里的数据
                    sessionStorage.clear();
                    // 2、跳转登录界面
                    this.$router.push('/')
                    console.log('跳转登录');
                }
            },
            // 跳转关于我的集成组件
            toAboutMe(activeCom) {
                console.log('goAboutMe');
                // 刷新操作时保存当前的激活组件
                sessionStorage.setItem('activeCom', activeCom)
                this.$nextTick(()=> {
                    console.warn('goAboutMe2--');
                    this.$router.push('/mine/aboutMe')
                })
            },

        },
        computed: {
            ...mapState(['userInfo']),
        }
    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    @import './mine.scss';
    // 这里欠背景图片
</style>