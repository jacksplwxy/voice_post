import Utils from './Utils'
import Config from './Config'

//在浏览历史中压入首页记录，操作返回按钮时可以返回到首页
function setReturnHistory() {
    const currentUrl = Utils.getWholeUrl()
    let timer = setTimeout(() => {
        window.history.pushState(null, Config.Title, Utils.getUrlProtocol() +
            Utils.getUrlHost() +
            "/dist/index");
        window.history.pushState(null, Config.Title, currentUrl);
        window.clearTimeout(timer)
        timer = null
    }, 100);
}



export default {
    setReturnHistory
}


