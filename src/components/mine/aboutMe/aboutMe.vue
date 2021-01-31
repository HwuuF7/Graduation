<template>
    <div class="aboutMe">
        <mt-header :title="activeCom.title">
            <mt-button icon="back" slot='left' @click="goBack"></mt-button>
        </mt-header>
        <component :is='activeCom.name' />
    </div>


</template>

<script>
    import issue from './issueByMe.vue';
    import reply from './replyByMe.vue';
    import favor from './favorByMe.vue'
    export default {
        components: {
            issue,
            reply,
            favor
        },
        data() {
            return {
                activeCom: null,
                options: [{
                    name: 'issue',
                    title: '我发布的'
                }, {
                    name: 'reply',
                    title: '我回复的'
                }, {
                    name: 'favor',
                    title: '我收藏的'
                }]
            }
        },
        //生命周期 - 创建完成（访问当前this实例）
        created() {
            // 非法操作
            if (!localStorage.getItem('activeCom')) {
                // 默认给activeCom=0 显示我发布的
                localStorage.setItem('activeCom', 0);
            }
            let active = localStorage.getItem('activeCom')
            this.activeCom = this.options[active]
            console.log(this.activeCom);
        },
        methods: {
            goBack() {
                console.log('gobak');
                this.$router.go(-1)
            }
        },
        //生命周期 - 挂载完成（访问DOM元素）
        mounted() {

        },
        destroyed() {
            console.log('摧毁了');
            localStorage.removeItem('activeCom')
        }
    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    .aboutMe {
        .mint-header {
            background: #fff;
            font-size: 1rem;
            color: #333;
            border-bottom: 1px solid #606266;

            ::v-deep .mint-header-title {
                font-weight: 700;
            }
        }
    }
</style>