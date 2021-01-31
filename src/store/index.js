import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        replySheetVisible: false,
        replyToWhoInfo: null,
        // 点击帖子详情跳转带过去的信息
        infoDetail: null,
    },
    mutations: {
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
        changeReplytoWho(state, val) {
            state.replyToWhoInfo = val
        },
        changeInfoDetail(state, val) {
            state.infoDetail = val
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