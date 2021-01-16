<template>
    <div class="index">
        <h1 class="index-title">成电翻江</h1>
        <component :is='nowComponent' />
        <mt-button type='primary' @click.native="toggleComponent" class="toggle">
            <!-- 向左向右的图标 -->
            切换
        </mt-button>
    </div>
</template>

<script>
    import Login from '../common/login/login';
    import Register from '../common/register/register';

    export default {
        components: {
            Login,
            Register
        },
        data() {
            return {
                nowComponent: 'Login',
            }
        },
        methods: {
            toggleComponent() {
                if (this.nowComponent === 'Login') {
                    this.nowComponent = 'Register'
                } else {
                    this.nowComponent = 'Login'
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

    .index {
        width: 100%;
        height: 100%;
        position: relative;

        >h1 {
            position: fixed;
            top: 12vh;
            left: 50vw;
            transform: translateX(-50%);
        }

        .toggle {
            position: fixed;
            left: 50%;
            bottom: 8vh;
            transform: translateX(-50%);
        }

    }
</style>