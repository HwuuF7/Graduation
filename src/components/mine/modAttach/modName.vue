<template>
    <div>
        <mt-field ref="focus" v-model="name"></mt-field>
    </div>
</template>

<script>
    export default {
        props: ['origin'],
        data() {
            return {
                name: '',
            }
        },
        created() {
            console.log('加载2');
            this.name = this.origin
        },
        mounted() {
            this.$refs.focus.$refs.input.focus()
        },
        updated() {
            this.$emit('update:origin', this.name)
        }
    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    @import './modCommon.scss'
</style>