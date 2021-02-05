/* 抽离初始化的静态数据 */


// 1、根据不同的模块(type='二手闲置') 改变对应的表单字段 
// 二维数组用于转换Map类型
const attachForm = [
    ['jobs', {
        type: '招聘求职',
        innerTag: ''
    }],
    ['unused', {
        type: '二手闲置',
        innerTag: '',
        price: null,
    }],
    ['finds', {
        type: '寻人寻物',
    }],
    ['counts', {
        type: '优惠信息',
    }],
    ['helps', {
        type: '打听求助'
    }]
]

// 2、根据不同的模块(type='二手闲置') 对应不同的子分类 
const categorys = {
    "jobs": ['招聘', '求职'],
    "unused": ['出售', '求购'],
    "finds": ['寻人', '寻物', '失物招领'],
    "counts": ['优惠分享', '砍几刀'],
    "helps": ['打听', '求助']
}

// 3、根据不同的子分类(catogory = '招聘') 
// 有不同的标志提示(innerTag)、tags、defaultDesc 
const uniqueInfo = [
    ['招聘', {
        innerTags: ['家教', '实习', '兼职'],
        tags: ['五险一金', '包吃', '包住', '双休', '年底双薪', '住房补助', '话费补助', '交通补助'],
        defaultDesc: '请说明招聘岗位、任职要求、公司介绍等'
    }],
    ['求职', {
        innerTags: ['找家教', '找实习', '找兼职', '其他'],
        tags: ['沟通力强', '学习力强', '执行力强'],
        defaultDesc: '个人介绍、工作经历、职位等信息'
    }],
    ['出售', {
        innerTags: ['课本书籍', '手机数码', '文体户外', '生活用品', '服装配饰', '美容保健', '交通工具', '其他'],
        tags: ['二手书籍', '电子产品', '生活用品', '准新正品', '当面验货'],
        defaultDesc: '请简要说明您的物品名称、参数、价格等信息'
    }],
    ['求购', {
        innerTags: ['课本书籍', '手机数码', '文体户外', '生活用品', '服装配饰', '美容保健', '交通工具', '其他'],
        tags: ['二手书籍', '电子产品', '生活用品', '准新正品', '当面验货'],
        defaultDesc: '请简要说明您的物品名称、参数、价格等信息'
    }],
    ['寻人', {
        innerTags: [],
        tags: [],
        defaultDesc: '人物的特征信息..'
    }],
    ['寻物', {
        innerTags: [],
        tags: [],
        defaultDesc: '物品信息描述..'
    }],
    ['失物招领', {
        innerTags: [],
        tags: [],
        defaultDesc: '物品的特征信息及领取地点信息..'
    }],
    ['优惠分享', {
        innerTags: [],
        tags: [],
        defaultDesc: '请务必说明优惠内容、时间及地点'
    }],
    ['砍几刀', {
        innerTags: [],
        tags: [],
        defaultDesc: '活动描述'
    }],
    ['打听', {
        innerTags: [],
        tags: [],
        defaultDesc: '打听的人或事'
    }],
    ['求助', {
        innerTags: [],
        tags: [],
        defaultDesc: '求助描述'
    }],
]



export default {
    attachForm,
    categorys,
    uniqueInfo,
}