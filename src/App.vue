<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
    export default {
        data() {
            return {

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
    // 375px => 100vw 
    // 1vw = 3.75px
    @import url('./assets/css/global.css');

    #app {
        width: 100vw;
        height: 100vh;
        overflow: auto;
        // position: relative;
    }

    /*  @media screen and (max-width: 1024px) {
        #app {
            color: green;
            // font-size: 2rem;
            font-size: 5vw;
            
    
        }
    }

    @media screen and (min-width: 1024px) {
        #app {
            color: red;
            font-size: 3rem;
        }

    } */
</style>