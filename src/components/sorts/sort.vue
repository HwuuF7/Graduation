<template>
    <div class="sort">
        <mt-navbar v-model="activeName">
            <mt-tab-item v-for='eachName in differSub' :key='eachName' :id="eachName">{{eachName}}</mt-tab-item>
        </mt-navbar>

        <mt-tab-container v-model="activeName">
            <mt-tab-container-item v-for='eachName in differSub' :key='eachName' :id="eachName">
                <div @click.stop.capture="jumpDetail">
                    <detail-info :model='testModel' :data-info_id='testModel.infoId' />
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
                    'news': ['校内', '省内', '国内'],
                    'jobs': ['家教', '兼职', '实习', '其他'],
                    'cars': ['缺人', '缺车'],
                    'houses': ['出租', '求租', '合租'],
                    'unused': ['课本书籍', '手机数码', '文体户外', '生活用品', '服装配饰', '美容保健', '出行工具', '其他'],
                    'counts': ['酒店客栈', '休闲娱乐', '生活服务', '购物', '旅游', '其他'],
                    'finds': ['寻人', '找物', '宠物', '失物招领'],
                    'helps': ['打听', '求助'],
                    'chats': ['吐槽', '讨论', '聊天'],
                    'dinners': ['约饭', '约玩'],
                },
                // 子页面对应子分类导航栏[数组]
                differSub: null,
                // 对应数据获取
                modelInfo: [],
                testModel: {
                    // 发帖ID
                    infoId: '123',
                    // 用户头像(后端返回数据如果为空 前端给一个默认头像)
                    userAvatar: require('@/assets/imgs/test.png'),
                    // 用户名(后端返回数据如果为空 前端给一个'匿名用户')
                    userName: '芜湖22',
                    // 该信息是否需要置顶
                    isSetTop: true,
                    // 分类关键词(必填项)
                    cateKeyWord: '生活用品22',
                    // 用户发表的信息内容(必填项)
                    messageContent: 'hello world22',
                    // 如果是交易性质,则返回详细介绍
                    // transactionIntro: {
                    //     // 交易类型: 出售/求购
                    //     transType: '出售',
                    //     // 交易价格: 具体值/面议
                    //     transPrice: '40'
                    // },
                    transactionIntro: {},
                    // 描述标签(字符串数组- 可空)
                    // descriptionTags: ['电子产品', '准新正品', '当面验货'],
                    descriptionTags: [],
                    // 展示图片(url数组- 可为空)
                    // showPictures: [require('@/assets/imgs/test.png'), require('@/assets/imgs/test.png')],
                    showPictures: [],
                    // 消息是否已经结束了
                    isOver: true,
                    // 发帖时间
                    messageTime: new Date('2020/12/15 15:00').getTime(),
                    // 浏览次数
                    visitTimes: 120,
                },
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
                // 对应导航栏
                vm.differSub = vm.constModule[toModule];
                // 默认为第一项
                // 为activeName设置了watch属性 
                // 只要切换了子分类 就会自动获取对应数据
                vm.activeName = vm.differSub[0];
            })
        },
        methods: {
            // 获取对应数据
            getInfo(activeName) {
                console.log(activeName);
                // 找到子分类对应的索引
                const subIndex = this.differSub.findIndex(subName => subName === activeName);
                // 发送ModuleName和索引去获取数据
                // 比如/news/0 =>校内新闻 /1 => 省内新闻
                // 格式和之前首页展示的一样
                // this.modelInfo=xx

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