<template>
    <div>
        <mt-radio align="right" v-model="region" :options="options">
        </mt-radio>
    </div>
</template>

<script>
    export default {
        props: ['origin'],
        data() {
            return {
                region: '',
                options: [{
                    label: 'zs',
                    value: 'zs',
                }, {
                    label: 'estc',
                    value: 'estc',
                }]
            }
        },
        created() {
            this.region = this.origin
        },
        methods: {},

        mounted() {

        },
        updated() {
            this.$emit('update:origin', this.region)
        }
    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    @import './modCommon.scss';
</style>