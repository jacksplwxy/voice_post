import Net from './Net'
import wx from 'weixin-js-sdk'  //注意：该sdk版本是1.2.0版本，不要使用最新版，否则无法设置分享
import Config from './Config'



//获取当前页面完整url
function getWholeUrl() {
    return window.location.href
}

//获取页面url主机
function getUrlProtocol() {
    return window.location.protocol + "//" //"http:" 或 “https:”
}


//获取页面url主机
function getUrlHost() {
    return window.location.host //"www.code.net.cn"
}

//获取页面url路径
function getUrlPathname() {
    return window.location.pathname //"/detail" 或 /article/index.html"
}

//获取页面url查询（参数）部分
function getUrlQuery() {
    return window.location.search //"?majorId=17&articleId=53"
}

//获取页面url，并将参数转换为json
function getUrlQueryJson() {
    let url = unescape(location.search.replace(/%20/ig, '')); //获取url中"?"符后的字串
    let theRequest = null
    if (url.indexOf("?") !== -1) {
        theRequest = new Object();
        let str = url.substr(1);
        let strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

//用户授权
function userAuthorization(vue) {
    console.log("vue.userInfo", vue.userInfo);
    return new Promise((resolve, reject) => {
        if (!vue.userInfo || vue.userInfo === "undefined") {
            const url = unescape(getWholeUrl().replace(/%20/ig, ''));
            const userInfoCookie = JSON.parse(getCookie("userInfo"));
            if (userInfoCookie) {
                vue.set_userInfo(userInfoCookie);
                resolve(userInfoCookie)
            } else if (url.indexOf("uid") === -1) {
                Net.getUserInfo();
            } else {
                const uid = getUrlQueryJson().uid;
                vue.set_userInfo({ uid });
                Net.getUserInfoDetail(uid).then(res => {
                    const userInfo = Object.assign({ uid }, res.data.data);
                    vue.set_userInfo(userInfo);
                    setCookie("userInfo", JSON.stringify(userInfo));
                    resolve(userInfo)
                }).catch(res => {
                    reject(res)
                });
            }
        }
    })

}

//配置验证微信sdk签名
function verifyWxSdkSignature() {
    const nonceStr = ''// getRandomString(16);
    const timestamp = ''// new Date().getTime();
    let url = getWholeUrl()//.split('?')[0];   
    return new Promise((resolve, reject) => {
        console.log('当前校验签名的url为', url)
        Net.getJSSDKAuth(nonceStr, timestamp, url).then(res => {
            console.log('获取签名接口成功', res)
            wx.config({
                debug: false,
                appId: Config.AppId, // 和获取Ticke的必须一样------必填，公众号的唯一标识
                timestamp: res.body.data.timestamp, // 必填，生成签名的时间戳
                nonceStr: res.body.data.noncestr, // 必填，生成签名的随机串
                signature: res.body.data.signature, // 必填，签名，见附录1
                jsApiList: [                //需要分享的列表项:发送给朋友，分享到朋友圈，分享到QQ，分享到QQ空间
                    'checkJsApi',
                    "updateAppMessageShareData",
                    "updateTimelineShareData",
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    "onMenuShareWeibo",
                    "chooseImage",
                    "previewImage",
                    "uploadImage",
                    "downloadImage",
                    "getLocalImgData",
                    "startRecord",
                    "stopRecord",
                    "onVoiceRecordEnd",
                    "playVoice",
                    "stopVoice",
                    "onVoicePlayEnd",
                    "uploadVoice",
                    "downloadVoice",
                ]
            });
            /**
             * 只有执行了wx.config, wx.ready和wx.error才能执行
             */
            wx.ready(function () {
                console.log('开始执行wx.ready')
                //分享给微信
                wx.onMenuShareAppMessage({
                    title: "朋友圈语音", // 分享标题
                    desc: "这是我发的一条朋友圈语音，来听听嘛", // 分享描述
                    link: url, // 分享链接
                    imgUrl: "http://img.eryieryi.top/uploads/voice/images/share0.png", // 分享图标
                    type: "", // 分享类型,music、video或link，不填默认为link
                    dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        console.log('分享成功')
                    },
                    cancel: function () {
                        console.log('分享取消')
                    }
                });
                //分享到朋友圈
                wx.onMenuShareTimeline({
                    title: "15秒", // 分享标题
                    link: getWholeUrl(), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: "http://img.eryieryi.top/uploads/voice/images/share1.jpg", // 分享图标
                    success: function (res) {
                        console.log('分享成功')
                    },
                    cancel: function (res) {
                        console.log('分享取消')
                    }
                });
                resolve(res)
            });
            wx.error(function (res) {
                console.log('开始执行wx.error', res)
            });
        }).catch(res => {
            console.log('获取签名接口报错或者then中的回调出错', res)
            reject(res)
        });
    })
}

//范围内随机整数
function randomNumBoth(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range); //四舍五入
    return num;
}

//判断是否为微信IOS浏览器
function isIosBrower() {
    return window.__wxjs_is_wkwebview
}

//获取后端返回cookie
function getEndCookie(name) {
    var strcookie = document.cookie;//获取cookie字符串
    var arrcookie = strcookie.split("; ");//分割
    //遍历匹配
    for (var i = 0; i < arrcookie.length; i++) {
        var arr = arrcookie[i].split("=");
        if (arr[0] == name) {
            return JSON.parse(decodeURIComponent(arr[1]));
        }
    }
    return null;
}

//生成随机字符串
function getRandomString(L) {
    var s = '';
    var randomchar = function () {
        var n = Math.floor(Math.random() * 62);
        if (n < 10) return n; //1-10
        if (n < 36) return String.fromCharCode(n + 55); //A-Z
        return String.fromCharCode(n + 61); //a-z
    }
    while (s.length < L) s += randomchar();
    return s;
}

//google浏览器禁用了本地网页的cookie操作，只能通过在线方式操作本地的cookie
//添加cookie:
// expiresSecond表示cookie有效时间，单位是秒
//cookorDir:表示指定可访问cookie的路径。默认情况下，创建cookie的页面及其子目录中的其他页面也可以访问该cookie。'/'表示整个网站
function setCookie(name, value, expiressSecond = 604800, cookieDir = '/') {
    //在cookie的名或值中不能使用分号、逗号、等号以及空格,如何来存储这些值呢？方法是用escape()函数进行编码，它能将一些特殊符号使用十六进制表示
    var cookieString = name + "=" + escape(value);
    //判断是否设置过期时间
    if (expiressSecond > 0) {
        var date = new Date();
        date.setTime(date.getTime() + expiressSecond * 1000);
        cookieString = cookieString + "; expires=" + date.toGMTString();
    }
    if (cookieDir) {
        cookieString = cookieString + ";path=" + cookieDir
    }
    document.cookie = cookieString;
}
//获取cookie:
function getCookie(name) {
    var strCookie = document.cookie;
    var arrCookie = strCookie.split("; ");
    for (var i = 0; i < arrCookie.length; i++) {
        var arr = arrCookie[i].split("=");
        if (arr[0] == name) {
            return unescape(arr[1]);
        }
    }
    return null;
}
//删除cookie:
function deleteCookie(name) {
    var date = new Date();
    date.setTime(date.getTime() - 10000); //将时间设置为过去时
    document.cookie = name + "=v; expires=" + date.toGMTString();
}

//获取当前时间，格式为'04-18  14:22'
function getCurrentTime() {
    var date = new Date();//当前时间
    var month = zeroFill(date.getMonth() + 1);//月
    var day = zeroFill(date.getDate());//日
    var hour = zeroFill(date.getHours());//时
    var minute = zeroFill(date.getMinutes());//分
    var second = zeroFill(date.getSeconds());//秒
    //当前时间
    var curTime = month + "-" + day + " " + hour + ":" + minute;
    return curTime;
    //补零
    function zeroFill(i) {
        if (i >= 0 && i <= 9) {
            return "0" + i;
        } else {
            return i;
        }
    }
}



export default {
    verifyWxSdkSignature,
    isIosBrower,
    getWholeUrl,
    getUrlProtocol,
    getUrlHost,
    getUrlPathname,
    getUrlQuery,
    getUrlQueryJson,
    getEndCookie,
    getRandomString,
    setCookie,
    getCookie,
    deleteCookie,
    getCurrentTime,
    userAuthorization,
    randomNumBoth,
}

