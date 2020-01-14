const Config = {
    AppId: 'wxaf314524def1e59e',
    Title: '朋友圈语音',
    HOST: process.env.NODE_ENV === "production" ? 'http://h.76069.cn/voice2/api_index/' : 'http://api.aifkj.top/voice2/api_index/',
}


export default Config