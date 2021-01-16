<template>
    <div class='mine'>
        <p class='mine-title'>基础信息</p>
        <mt-cell title="资料修改" is-link @click.native="toMod(false)"></mt-cell>
        <p class='mine-title'>账号管理</p>
        <mt-cell title="账号修改" is-link @click.native="toMod(true)">
        </mt-cell>
        <mt-cell title="退出账号" @click.native="exit"></mt-cell>
    </div>
</template>

<script>
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
            }
        },
        //生命周期 - 创建完成（访问当前this实例）
        created() {

        },
        //生命周期 - 挂载完成（访问DOM元素）
        mounted() {

        }
    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    @import './mine.scss';
    // 这里欠背景图片
</style>