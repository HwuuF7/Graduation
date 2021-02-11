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
        }
    },
    mutations: {
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
            this.replyLevelFlag = levelFlag;
            state.replyToWhoInfo = who;
        },
        changeInfoDetail(state, [info, isSetTop]) {
            state.infoDetail.info = info
            state.infoDetail.isSetTop = isSetTop
        }
    },
    actions: {},
    // getters: {
    //     // mutalRpySheetVisible: (state) => {
    //     //     get: function () {
    //     //         return state.replySheetVisible;
    //     //     },
    //     //     set: function (v) {
    //     //         state.commit('hideReplySheet', v);
    //     //     }
    //     // }
    // },
    modules: {}
})