<template>
    <div class="search" ref="search" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
        infinite-scroll-distance="10" :infinite-scroll-immediate-check='true'>
        <detail-info v-for="info in infos" :key='info.infoId' :model='info'
            @click.native.stop="$router.push(`/info/${info.infoId}`)" />
        <div v-if="none" class="empty">
            <img src="@/assets/imgs/empty-image.png">
            <p>暂无相关信息</p>
        </div>
    </div>
</template>

<script>
    // import detailInfo from '@/components/common/detailInfo/detailInfo.vue';
    const detailInfo = () => import( /* webpackChunkName:"infoMore" */ '@/components/common/detailInfo/detailInfo.vue');
    export default {
        components: {
            detailInfo
        },
        data() {
            return {
                loading: false,
                // 无结果该显示一张背景图片
                none: false,
                infos: [],
                scrollTop: 0,
            }
        },
        beforeRouteEnter(to, from, next) {
            if (from.name === 'InfoMore') {
                to.meta.isBack = true;
                next()
            } else {
                to.meta.isBack = false;
                next(vm => {
                    vm.none = false;
                    vm.infos = [];
                    vm.scrollTop = 0;
                    // 如果不是从详情页返回的 重新拉取数据
                    vm.getSearchRes(vm.$route.query.key)
                })
            }
        },
        activated() {
            if (this.$route.meta.isBack) {
                this.$refs.search.scrollTop = this.scrollTop;
            }
        },
        beforeRouteLeave(to, from, next) {
            if (to.name === 'InfoMore') {
                this.scrollTop = this.$refs.search.scrollTop
            }
            next()
        },
        methods: {
            // 获取搜索结果
            async getSearchRes(key) {
                const res = await this.$http.get('/info/search', {
                    params: {
                        queryKey: key
                    }
                }).catch(err => console.warn(err))
                if (!res || res.data.length === 0) {
                    this.none = true;
                    return this.$reToast('暂无相关信息', 'icon-noresult')
                }
                this.infos = res.data;
                console.log('拉取数据');
            },
            loadMore() {
                console.log('loadMore');
            }
        }
    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    .search {
        height: 100%;
        overflow: auto;

        p.testP {
            height: 100px;
            border-bottom: 1px solid #654062;
        }

        .empty {
            display: flex;
            flex-flow: column wrap;
            height: 100%;
            width: 100%;
            justify-content: center;
            align-items: center;

            p {
                opacity: .7;
            }
        }
    }
</style>