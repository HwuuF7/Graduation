<template>
    <div>
        <img :src="avatar" alt="">
    </div>
</template>

<script>
    export default {
        props: ['origin'],
        data() {
            return {
                avatar: ''
            }
        },
        //生命周期 - 创建完成（访问当前this实例）
        created() {
            this.avatar = this.origin
            console.log(this.origin);
        },
        //生命周期 - 挂载完成（访问DOM元素）
        mounted() {

        },
        updated() {
            this.$emit('update:origin', this.avatar)
        }
    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    div {
        height: calc(100vh - 3.125rem);
        width: 100%;
        display: flex;
        justify-content: center;
        overflow: hidden;

        >img {
            width: 100%;
            height: 65%;
            margin-top: 10%;
        }
    }
</style>