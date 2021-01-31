<template>
    <div>
        <detail-info :model='test' />
    </div>
</template>

<script>
    import detailInfo from '@/components/common/detailInfo/detailInfo.vue'
    export default {
        components: {
            detailInfo
        },
        data() {
            return {
                test: null
            }
        },
        //生命周期 - 创建完成（访问当前this实例）
        created() {
            this.getTest()
        },
        //生命周期 - 挂载完成（访问DOM元素）
        mounted() {

        },
        methods: {
            async getTest() {
                const {
                    data: res
                } = await this.$http.get('/homepage/view/queryall?pageBegin=0&pageSize=1')
                console.log(res);
                this.test = res[0]
            }
        }
    }
</script>

<style scoped>
    /* @import url(); 引入css类 */
</style>