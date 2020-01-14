import Config from './Config'
import Utils from "./Utils.js";
import Vue from 'vue'

//获取jssdk授权
function getJSSDKAuth(noncestr, timestamp, url) {
    return Vue.http.post(Config.HOST + 'getSignature', {
        noncestr,
        timestamp,
        url,
    });
}

//调取用户授权接口：
function getUserInfo() {
    // const wholeUrl = Utils.getWholeUrl();
    // //php无法获取到url中的#
    // const host = wholeUrl.slice(0, wholeUrl.indexOf('#'))
    // const route = wholeUrl.slice(wholeUrl.indexOf('#') + 2)
    // console.log('wholeUrl', wholeUrl)
    // //?后面是页面跳转后需要跳回来的地址，由后台控制
    // location.href = Config.HOST + '/voice/api_index/getCode?url=' + host + '&route=' + route;
    location.href = Config.HOST + 'getCode?url=' + Utils.getWholeUrl();
}

//获取用户信息
function getUserInfoDetail(uid) {
    return Vue.http.post(Config.HOST + 'returnUserInfo', { uid });
}

//上传音频id到业务服务器
function uploadAudioId(audioId, uid, type, audioTimeLength) {
    return Vue.http.post(Config.HOST + 'saveListData', {
        media_id: audioId,
        uid,
        type,
        audio_time: audioTimeLength
    });
}

//获取首页的好声音推荐
function getIndexRecommendVoice() {
    return Vue.http.post(Config.HOST + 'getGoodVoice', {});
}

//获取全部好声音推荐
function getRecommendVoice(page) {
    return Vue.http.post(Config.HOST + 'getGoodVoiceList', {
        page
    });
}

//获取最新朋友圈语音
function getLatestVoice(page = 1) {
    return Vue.http.post(Config.HOST + 'getNewVoiceList', {
        page
    });
}

//获取新锐、人气、女神、男神热门的数据
function getRankAudioList(type, page) {
    return Vue.http.post(Config.HOST + 'getGoddessRank', {
        type: type + 1,
        page,
    });
}

//获取专题列表： 4：其他类型、1：治愈系类型、2：播音主持类型、3：唱歌类型
function getSpecList(type, page) {
    return Vue.http.post(Config.HOST + 'getSubjectList', {
        type: type + '',
        page
    });
}


//获取语音详情数据
function getAudioDetail(postId, uid) {
    return Vue.http.post(Config.HOST + 'getOneListData', {
        list_id: postId,
        uid,
    });
}

//获取偷听人的姓名列表
function getListenersList(postId) {
    return Vue.http.post(Config.HOST + 'getLookName', {
        list_id: postId,
    });
}

//获取语音评论（楼）数据
//order:顺序，1为正序，2为倒序
function getAudioComment_floor(postId, page = 1, order = 1) {
    return Vue.http.post(Config.HOST + 'getVoiceComment', {
        list_id: postId,
        page,
        order_type: order
    });
}


//获取层评论列表
function getAudioComment_layer(floorId, page = 1) {
    return Vue.http.post(Config.HOST + 'returnReplyData', {
        comment_id: floorId,
        page,
    });
}


/**
 * 存储帖子的评论数据到数据库
 * @param {string} postId:帖子id
 * @param {string} uid :用户id
 * @param {string} text: 文本内容
 */
function storeComment_Post(postId, uid, text) {
    return Vue.http.post(Config.HOST + 'saveUserComment', {
        uid,
        list_id: postId,
        content: text,
    });
}

/**
 * 存储楼的评论数据到数据库
 * @param {string} postId:帖子id
 * @param {string} floorId:帖子的回复的id
 * @param {string} uid :用户id
 * @param {string} text: 文本内容
 */
function storeComment_Floor(postId, floorId, uid, text) {
    return Vue.http.post(Config.HOST + 'saveUserReply', {
        uid,
        list_id: postId,
        comment_id: floorId,
        content: text,
    });
}

/**
 * 存储楼的评论数据到数据库
 * @param {string} postId:帖子的id
 * @param {string} floorId:帖子的回复的id
 * @param {string} layerId:帖子的回复的回复的id
 * @param {string} uid :用户id
 * @param {string} text: 文本内容
 */
function storeComment_Layer(postId, floorId, layerId, uid, text) {
    return Vue.http.post(Config.HOST + 'saveUserReply', {
        uid,
        list_id: postId,
        reply_id: layerId,
        comment_id: floorId,
        content: text,
    });
}

//帖子：点赞或者删除点赞
function praisePost(uid, postId) {
    return Vue.http.post(Config.HOST + 'changeLike', {
        uid,
        list_id: postId,
    });
}
//楼：点赞或者删除点赞
function praiseFloor(uid, floorId) {
    return Vue.http.post(Config.HOST + 'changeLike', {
        uid,
        comment_id: floorId,
    });
}
//层：点赞或者删除点赞
function praiseLayer(uid, layerId) {
    return Vue.http.post(Config.HOST + 'changeLike', {
        uid,
        reply_id: layerId,
    });
}



//获取我的语音数据
function getMyAudio(uid, page = 1) {
    return Vue.http.post(Config.HOST + 'returnMyAllList', {
        uid,
        page
    });
}
//删除一条我的语音数据
function deleteMyAudio(uid, postId) {
    return Vue.http.post(Config.HOST + 'delMyList', {
        uid,
        list_id: postId
    });
}

//获取我的语音收藏数据
function getMyAudioCollect(uid, page) {
    return Vue.http.post(Config.HOST + 'myCollect', {
        uid,
        page
    });
}
//收藏帖子
function collectPost(uid, postId) {
    return Vue.http.post(Config.HOST + 'addCollect', {
        uid,
        list_id: postId,
    });
}

//取消帖子收藏
function collectPost_Cancel(uid, postId) {
    return Vue.http.post(Config.HOST + 'delMyCollect', {
        uid,
        list_id: postId,
    });
}

//清空所有帖子收藏
function collectPost_ClearAll(uid) {
    return Vue.http.post(Config.HOST + 'deleteMyCollectList', {
        uid,
    });
}

//获取我的语音浏览历史记录数据
function getBrowseHistory(historyList) {
    return Vue.http.post(Config.HOST + 'returnHistory', {
        list: JSON.stringify(historyList)
    });
}

//举报
function reportPolice(uid, postId, type, content) {
    return Vue.http.post(Config.HOST + 'userInform', {
        uid,
        list_id: postId,
        type,
        content
    });
}


//提交建议
function setSuggestion(uid, content, personInfo) {
    return Vue.http.post(Config.HOST + 'saveSuggest', {
        uid,
        content,
        contact: personInfo
    });
}

//增加分享次数
function addShareNumber(postId) {
    return Vue.http.post(Config.HOST + 'addShareNum', {
        list_id: postId
    });
}

export default {
    getJSSDKAuth,
    getUserInfo,
    getUserInfoDetail,
    uploadAudioId,
    getIndexRecommendVoice,
    getRecommendVoice,
    getLatestVoice,
    getRankAudioList,
    getSpecList,
    getMyAudio,
    getMyAudioCollect,
    getBrowseHistory,
    getAudioDetail,
    getListenersList,
    getAudioComment_floor,
    getAudioComment_layer,
    storeComment_Post,
    storeComment_Floor,
    storeComment_Layer,
    praisePost,
    praiseFloor,
    praiseLayer,
    collectPost,
    collectPost_Cancel,
    collectPost_ClearAll,
    deleteMyAudio,
    reportPolice,
    setSuggestion,
    addShareNumber,
}