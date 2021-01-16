<template>
    <div>
        <mt-radio align="right" v-model="sex" :options="options">
        </mt-radio>
    </div>
</template>

<script>
    export default {
        props: ['origin'],
        data() {
            return {
                sex: '1',
                options: [{
                    label: '男',
                    value: '1',
                }, {
                    label: '女',
                    value: '0',
                }]
            }
        },
        created() {
            this.sex = this.origin
        },
        methods: {},

        mounted() {

        },
        updated() {
            this.$emit('update:origin', this.sex)
        }
    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    @import './modCommon.scss';
</style>