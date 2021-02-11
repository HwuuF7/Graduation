<template>
    <div class="sort">
        <mt-navbar v-model="activeName">
            <mt-tab-item v-for='eachName in differSub' :key='eachName' :id="eachName">{{eachName}}</mt-tab-item>
        </mt-navbar>

        <mt-tab-container v-model="activeName">
            <mt-tab-container-item v-for='eachName in differSub' :key='eachName' :id="eachName">
                <div @click.stop.capture="jumpDetail">
                    <detail-info v-for="info in modelInfo" :key="info.infoId" :model='info'
                        :data-info_id='info.infoId' />
                </div>
            </mt-tab-container-item>
        </mt-tab-container>
    </div>
</template>

<script>
    import detailInfo from '@/components/common/detailInfo/detailInfo.vue';
    export default {
        components: {
            detailInfo
        },
        data() {
            return {
                // 当前激活的某一项导航
                activeName: null,
                constModule: {
                    'news': {
                        type: 'news',
                        sortArr: ['校内', '省内', '国内']
                    },
                    'jobs': {
                        type: 'job',
                        sortArr: ['家教', '兼职', '实习', '其他'],
                    },
                    'cars': {
                        type: 'cars',
                        sortArr: ['缺人', '缺车'],
                    },
                    'houses': {
                        type: 'houses',
                        sortArr: ['出租', '求租', '合租'],
                    },
                    'unused': {
                        type: 'unUsed',
                        sortArr: ['课本书籍', '手机数码', '文体户外', '生活用品', '服装配饰', '美容保健', '出行工具', '其他']
                    },
                    'counts': {
                        type: 'preferential',
                        sortArr: ['酒店客栈', '休闲娱乐', '生活服务', '购物', '旅游', '其他'],
                    },
                    'finds': {
                        type: 'lostingFind',
                        sortArr: ['寻人', '找物', '宠物', '失物招领'],
                    },
                    'helps': {
                        type: 'help',
                        sortArr: ['打听', '求助'],
                    },
                    'chats': {
                        type: 'chats',
                        sortArr: ['吐槽', '讨论', '聊天'],
                    },
                    'dinners': {
                        type: 'dinners',
                        sortArr: ['约饭', '约玩'],
                    },
                },
                // 对应的模块大分类
                type: null,
                // 子页面对应子分类导航栏[数组]
                differSub: null,
                // 对应数据获取
                modelInfo: [],
            }
        },
        created() {},
        mounted() {},
        // 获取跳转参数
        beforeRouteEnter(to, from, next) {
            next(vm => {
                // 获取跳转的模块
                let {
                    module: toModule
                } = to.query;
                vm.type = vm.constModule[toModule].type;
                // 对应导航栏
                vm.differSub = vm.constModule[toModule].sortArr;
                // 默认为第一项
                // 为activeName设置了watch属性 
                // 只要切换了子分类 就会自动获取对应数据
                vm.activeName = vm.differSub[0];
            })
        },
        methods: {
            // 获取对应数据
            async getInfo(activeName) {
                // console.log(this.type, activeName);
                // 找到子分类对应的索引
                // const subIndex = this.differSub.findIndex(subName => subName === activeName);
                // 发送ModuleName和索引去获取数据
                // 比如/news/0 =>校内新闻 /1 => 省内新闻
                // 格式和之前首页展示的一样
                // this.modelInfo=xx
                const res = await this.$http.get('/catogory/catogoryPage', {
                    params: {
                        type: this.type,
                        pageBegin: 0,
                        pageSize: 20,
                        catogory: activeName
                    }
                }).catch(err => console.log(err))
                if (!res) return this.$reToast('获取信息失败！', 'icon-close')
                // 获取成功后进行赋值
                this.modelInfo = res.data
            },
            // 事件捕获跳转到详情页
            jumpDetail(ev) {
                console.log('跳转到详情页');
                const targetTag = this.$parentPush(ev, 'detailInfo')
                // 拿到帖子ID data-xx 只能小写
                const infoID = targetTag.dataset.info_id;
                // 跳转
                this.$router.push(`/info/${infoID}`);
            }
        },
        computed: {

        },
        watch: {
            activeName(newActive) {
                this.getInfo(newActive)
            }
        }

    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    @import './sort.scss';
</style>