import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // 用户信息
        userInfo: null,
        replySheetVisible: false,
        replyToWhoInfo: null,
        /*  用于判断是回复二级评论 还是多级评论 
         true为二级评论  false为多级评论 */
        replyLevelFlag: null,
        // 点击帖子详情跳转带过去的信息
        infoDetail: {
            // 数据
            info: null,
            // 是否置顶
            isSetTop: null,
        },
        // 存放 从信息详情页跳转至聊天详情页的信息
        groupInfo: {
            // 陪聊对象
            toUser: null,
            // 聊天组ID
            groupId: null,
        },
        // 存取app实例 方便操作WebSocket
        wsInfo: null,
        // 接收通信信息
        // 对象形式 groupID(代表双方唯一通话):[]
        receiveWSMsgs: {},
        // 未读消息的标记
        unReadCount: {
            // 登录后只获取一次
            isFirst: true,
            // 总的条数
            total: 0,
            // 每个聊天组对应的未读信息ID
            groupMsg: {}
        },
    },
    mutations: {
        // 保存用户登录信息
        saveUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        },

        // 点击事件触发一次 第一次true
        // v-model的computed监听到更新值 get一开始为false 后面变为true set执行 触发第二次
        // 第三次？？？
        isShowReplySheet(state, val) {
            state.replySheetVisible = val;
            // console.log('触发了vuex', state);
        },
        // hideReplySheet(state, v) {
        //     state.replySheetVisible = v;
        //     console.log('触发了vuex2', state);
        // }
        changeReplytoWho(state, [who, levelFlag]) {
            state.replyLevelFlag = levelFlag;
            state.replyToWhoInfo = who;
        },
        changeInfoDetail(state, [info, isSetTop]) {
            state.infoDetail.info = info;
            state.infoDetail.isSetTop = isSetTop || false;
        },
        // 深入聊天时的groupInfo
        changeGroupInfo(state, [key, val]) {
            state.groupInfo[key] = val;
        },
        // 改变Websocket信息
        changeWsInfo(state, wsInfo) {
            state.wsInfo = wsInfo;
        },
        // 添加对话记录 [聊天组ID,信息,status[0=>push,1=>concat,2=>覆写]]
        addWSMsgs(state, [groupID, msgInfo, status]) {
            // 初始化时
            // 将旧对象全部深拷贝
            let pastAll = JSON.parse(JSON.stringify(state.receiveWSMsgs))
            let past;


            // 如果当前聊天组信息为undefined 表明这是初始化
            if (!pastAll[groupID]) {
                // 给一个空数组
                pastAll[groupID] = []
            }
            past = pastAll[groupID]

            // console.log('past===', past);
            // 如果是 状态[0] 则要push
            if (status === 0) {
                past.push(msgInfo)
            } else if (status === 1) {
                // 获取记录进行拼接
                pastAll[groupID] = msgInfo.concat(past)
            } else if (status === 2) {
                // console.log('覆写了===');
                // 覆写当前消息
                past.splice(0, past.length, ...msgInfo)
            }
            // console.log('ALL===', pastAll);
            state.receiveWSMsgs = pastAll;
        },
        // 改变未读信息的状态
        changeUnReadStatus(state, [key, val]) {
            state.unReadCount[key] = val;
        }

    },
    actions: {},
    getters: {
        // 获取特定聊天组的记录
        logsByGroupId(state) {
            // console.log('[]====', state.receiveWSMsgs[state.groupInfo.groupId]);
            return state.receiveWSMsgs[state.groupInfo.groupId]
        }
    },
    modules: {}
})