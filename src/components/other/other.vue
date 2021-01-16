<template>
    <div class="other">
        <detail-info :model="testModel" :isOther='true' />
        <detail-info :model="testModel" :isOther='true' />
        <detail-info :model="testModel" :isOther='true' />
        <detail-info :model="testModel" :isOther='true' />
        <detail-info :model="testModel" :isOther='true' />

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
                testModel: {
                    // 用户头像(后端返回数据如果为空 前端给一个默认头像)
                    userAvatar: require('@/assets/imgs/test.png'),
                    // 用户名(后端返回数据如果为空 前端给一个'匿名用户')
                    userName: '芜湖22',
                    // 该信息是否需要置顶
                    isSetTop: true,
                    // 分类关键词(必填项)
                    cateKeyWord: '生活用品22',
                    // 用户发表的信息内容(必填项)
                    messageContent: 'hello world22hello然后一然后一月初我得交论文提纲然后一月初我得交论文提纲月初我得交论文提纲然后一月初我得交论文提纲然后一月初我得交论文提纲然后一月初我得交论文提纲',
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
                }
            }
        },
        //生命周期 - 创建完成（访问当前this实例）
        created() {

        },
        //生命周期 - 挂载完成（访问DOM元素）
        mounted() {

        }
    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    @import './other.scss';
</style>