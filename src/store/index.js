import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const state = {
    //用户信息
    userInfo: (process.env.NODE_ENV !== 'development') ? null : {
        avatarUrl: "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLibZaYcXnOOlfibJDjOpXGubZ1RdnzicOqNeJkRMa1mvyv8C2MTaUe3dqyPDUFpswmJjsiaQGVeW961g/132",
        nickName: "jacksplwxy",
        uid: 2464,
    },
    //footer的内容
    footerTabs: null,
    //我的评论
    myComment: {
        text: null,
        audioId: null,
        imgId: null,
    },
    //跳转楼层详情时，一层的数据
    floorDetailMain: null,
    //帖子的评论信息
    postCommentsData: [],
    //帖子评论列表是否需要更新
    postCommentsUpdate: false

}
const mutations = {
    set_userInfo(state, userInfo) {
        state.userInfo = userInfo
    },
    set_footerTabs(state, footerTabs) {
        state.footerTabs = footerTabs
    },
    set_myComment(state, myComment) {
        state.myComment = myComment
    },
    set_floorDetailMain(state, floorDetailMain) {
        state.floorDetailMain = floorDetailMain
    },
    set_postCommentsData(state, postCommentsData) {
        state.postCommentsData = postCommentsData
    },
    set_postCommentsUpdate(state, postCommentsUpdate) {
        state.postCommentsUpdate = postCommentsUpdate
    },
}
const actions = {
    set_userInfo({ commit }, userInfo) {
        commit('set_userInfo', userInfo)
    }
}
export default new Vuex.Store({
    state,
    mutations,
    actions,
});