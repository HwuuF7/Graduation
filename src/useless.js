/*
           // 留着过年
            // 要增加一个评论ID 和 toWhich评论ID
            commentInfo: [{
            // 评论的一个ID
            commentID: '001',
            // 评论人的ID
            commentatorID: '123',
            // 一级评论人
            commentator: '小老妹',
            // 一级评论内容
            content: '你真棒',
            rootType: true,
            // 在哪个帖子下回复的 根评论的话就是指向帖子的ID
            replyToWhich: '123',
            // 回复列表
            replyLists: [{
                    commentID: '002',
                    commentatorID: '456',
                    commentator: '清风自来',
                    replyToID: '123',
                    replyToWho: '小老妹',
                    content: '真的吗？',
                    rootType: false,
                    // 如果是二级评论的话就指向的是回复哪个评论
                    replyToWhich: '001',
                    replyLists: [{
                        commentID: '003',
                        commentatorID: '123',
                        commentator: '小老妹',
                        replyToID: '456',
                        replyToWho: '清风自来',
                        content: '真的哦',
                        rootType: false,
                        replyToWhich: '002',
                        replyLists: []
                    }, {
                        commentID: '004',
                        commentatorID: '789',
                        commentator: '其他人',
                        replyToID: '456',
                        replyToWho: '清风自来',
                        content: '其他人的回复',
                        rootType: false,
                        replyToWhich: '002',
                        replyLists: []
                    }]
                },
                {
                    commentID: '005',
                    commentatorID: '001',
                    commentator: '菜狗',
                    replyToID: '123',
                    replyToWho: '小老妹',
                    content: '红豆泥',
                    rootType: false,
                    replyToWhich: '001',
                    replyLists: [{
                        commentID: '006',
                        commentatorID: '789',
                        commentator: '其他人',
                        replyToID: '001',
                        replyToWho: '菜狗',
                        content: '你可真是只菜狗',
                        rootType: false,
                        replyToWhich: '005',
                        replyLists: [{
                            commentID: '007',
                            commentatorID: '001',
                            commentator: '菜狗',
                            replyToID: '789',
                            replyToWho: '其他人',
                            content: '你才是',
                            rootType: false,
                            replyToWhich: '006',
                            replyLists: []
                        }]
                    }]
                }
            ]
        },
        {
            commentID: '008',
            commentatorID: '456',
            commentator: '清风自来',
            content: '厉害厉害',
            rootType: true,
            // 在哪个帖子下回复的
            replyToWhich: '123',
            replyLists: [{
                commentID: '999',
                commentatorID: '111',
                commentator: 'young',
                replyToID: '456',
                replyToWho: '清风自来',
                content: '纳尼',
                rootType: false,
                replyToWhich: '008',
                replyLists: []
            }]
        }
    ], */


// 构造一个回复者
/*  let tempComment = { // 评论的一个ID
     commentID: '111',
     // 评论人的ID
     commentatorID: '123',
     // 一级评论人
     commentator: '小老弟',
     // 一级评论内容
     content: this.replyContent,
     rootType: true,
     // 在哪个帖子下回复的 根评论的话就是指向帖子的ID
     replyToWhich: '123',
     replyLists: []
 };
 this.commentInfo.push(tempComment); */


// 插入评论 from代表从vuex取出来的回复谁
insertComment(from) {
        // 将查询条件解构出来
        let {
            commentID,
            commentatorID,
            commentator
        } = from;
        // 构建回复体
        let comment = {
            commentID: '009',
            commentator: '你好',
            commentatorID: '599',
            content: this.replyContent,
            replyToID: commentatorID,
            replyToWho: commentator,
            replyToWhich: commentID,
            rootType: false,
            replyLists: []
        };
        // 找到需要被添加的父评论
        // let res = this.searchInsertLocation(this.commentInfo, commentID, commentatorID)

        this.searchInsertLocation(this.commentInfo, comment, commentID, commentatorID);
        console.log(this.commentInfo)
    },
    // 查找回复位置
    searchInsertLocation(searchArr, insertComment, commentID, commentatorID) {
        // 找到需要被添加的父元素
        /* let res = null;
        tempArr.find((item) => {
            if (item.commentID === commentID && item.commentatorID === commentatorID) {
                return res = item;
            } else if (item.replyLists.length > 0) {
                return res = this.searchInsertLocation(item.replyLists, commentID, commentatorID);
            }
        })
        return res */

        searchArr.find((commentItem) => {
            if (commentItem.commentID === commentID && commentItem.commentatorID === commentatorID) {
                commentItem.replyLists.push(insertComment);
                console.log(commentItem);
                return commentItem;
            } else if (commentItem.replyLists.length > 0) {
                return this.searchInsertLocation(commentItem.replyLists, insertComment, commentID,
                    commentatorID);
            }
        })
    },

    // 以后会用到？
    /*  homepageMenu: [{
                    icon: 'news',
                    content: '新闻时事'
                }, {
                    icon: 'jobs',
                    content: '招聘求职'
                }, {
                    icon: 'cars',
                    content: '校内拼车'
                }, {
                    icon: 'houses',
                    content: '校园租房'
                }, {
                    icon: 'unused',
                    content: '闲置二手'
                }, {
                    icon: 'counts',
                    content: '优惠信息'
                }, {
                    icon: 'finds',
                    content: '寻人寻物'
                }, {
                    icon: 'helps',
                    content: '打听求助'
                }, {
                    icon: 'chats',
                    content: '闲来无聊'
                }, {
                    icon: 'dinners',
                    content: '约饭走起'
                }],

 */

    // 跳转帖子详情的事件委托
    parentPush(ev) {
        console.log('事件委托');
        const targetTag = this.$parentPush(ev, 'detailInfo')
        // 拿到帖子ID data-xx 只能小写
        const infoID = targetTag.dataset.info_id;
        // 将当前点击跳转的信息复制一份存入vuex
        // this.changeInfoDetail()
        // 跳转
        this.$router.push(`/info/${infoID}`);
    },

    /* <
        !--@click.stop.capture = "parentPush" <
        detail - info v -
        for = "info in topInfo": key = "info.infoId"
    isSetTop: model = 'info': data - info_id = 'info.infoId' > < /detail-info> <
        detail - info v -
        for = "info in mainInfo": key = 'info.infoId': model = 'info': data - info_id = 'info.infoId' > < /detail-info> -->

        <
        !--@click.stop.capture = "parentPush" <
        detail - info v -
        for = "info in topInfo": key = "info.infoId"
    isSetTop: model = 'info': data - info_id = 'info.infoId' > < /detail-info> <
        detail - info v -
        for = "info in mainInfo": key = 'info.infoId': model = 'info': data - info_id = 'info.infoId' > < /detail-info> --> */


    infoDetail: [{
        // 发帖ID
        infoId: '',
        // 用户ID
        userId: '',
        // 用户头像(后端返回数据如果为空 前端给一个默认头像)
        userAvatar: require('@/assets/imgs/test.png'),
        // 用户名(后端返回数据如果为空 前端给一个'匿名用户')
        userName: '芜湖',
        // 该信息是否需要置顶
        isSetTop: false,
        // 分类关键词(必填项)
        cateKeyWord: '生活用品',
        // 用户发表的信息内容(必填项)
        messageContent: 'hello world',
        // 如果是交易性质的信息,则返回详细介绍,否则为空对象
        transactionIntro: {
            // 交易类型: 出售/求购
            transType: '求购',
            // 交易价格: 具体值/面议
            transPrice: '面议'
        },
        // 描述标签(字符串数组- 可空)
        descriptionTags: ['电子产品', '准新正品', '当面验货'],
        // 展示图片(url数组- 可为空(0-6/9张))
        showPictures: [require('@/assets/imgs/test.jpg'), require('@/assets/imgs/test.jpg'),
            require('@/assets/imgs/test.jpg'), require('@/assets/imgs/test.jpg'), require(
                '@/assets/imgs/test.jpg'), require('@/assets/imgs/test.jpg')
        ],
        // 消息是否已经结束了
        isOver: false,
        // 发帖时间
        messageTime: new Date('2020/1/9 15:00').getTime(),
        // 浏览次数
        visitTimes: 10000,
    }],
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
    testModel2: {
        // 发帖ID
        infoId: '123456',
        // 用户头像(后端返回数据如果为空 前端给一个默认头像)
        userAvatar: null,
        // 用户名(后端返回数据如果为空 前端给一个'匿名用户')
        userName: '芜湖223333',
        // 该信息是否需要置顶
        isSetTop: true,
        // 分类关键词(必填项)
        cateKeyWord: '生活用品223',
        // 用户发表的信息内容(必填项)
        messageContent: 'hello world223',
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


    info: {
        // 发帖ID
        infoId: '',
        // 用户ID
        userId: '',
        // 用户头像(后端返回数据如果为空 前端给一个默认头像)
        userAvatar: require('@/assets/imgs/test.png'),
        // 用户名(后端返回数据如果为空 前端给一个'匿名用户')
        userName: '芜湖',
        // 该信息是否需要置顶
        isSetTop: false,
        // 分类关键词(必填项)
        cateKeyWord: '生活用品',
        // 用户发表的信息内容(必填项)
        messageContent: 'hello world',
        // 如果是交易性质的信息,则返回详细介绍,否则为空对象
        transactionIntro: {
            // 交易类型: 出售/求购
            transType: '求购',
            // 交易价格: 具体值/面议
            transPrice: '面议'
        },
        // 描述标签(字符串数组- 可空)
        descriptionTags: ['电子产品', '准新正品', '当面验货'],
        // 展示图片(url数组- 可为空(0-6/9张))
        showPictures: [require('@/assets/imgs/test.jpg'), require('@/assets/imgs/test.jpg'),
            require('@/assets/imgs/test.jpg'), require('@/assets/imgs/test.jpg'), require(
                '@/assets/imgs/test.jpg'), require('@/assets/imgs/test.jpg')
        ],
        // 消息是否已经结束了
        isOver: false,
        // 发帖时间
        messageTime: new Date('2020/1/9 15:00').getTime(),
        // 浏览次数
        visitTimes: 10000,
    },