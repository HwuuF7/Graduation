<template>
    <div>
        <a onclick="window.location.href='www.cnblogs.com'" href="javascript:void(0);">博客园</a>
        <mt-button type='primary' @click="back">回去</mt-button>
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
            console.log('tets===', this.$store.state.referInfo);
        },
        methods: {
            back() {
                this.$router.push(this.$store.state.referInfo)
            }
        },
        //生命周期 - 挂载完成（访问DOM元素）
        mounted() {

        }
    }
</script>

<style scoped>
    /* @import url(); 引入css类 */
</style>