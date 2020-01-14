
<template>
  <div>
    <div v-if="shareGuideShow" @click="showShareGuide">
      <shareGuide></shareGuide>
    </div>

    <p class="tips">发送至微信朋友圈，查看访客记录</p>
    <img
      v-if="recordStatus===0||recordStatus===4?false:true"
      :src="recordStatusImg[recordStatus]"
      class="recordTips"
    >
    <div v-if="recordStatus!==4" class="recordBtn" id="recordBtn">{{recordBtnInfo.text}}</div>
    <div v-else class="recordContent">
      <audioContent_local :audioInfo="audioInfo"></audioContent_local>
      <div class="recordReset" @click="recordReset">重 新 录 制</div>
      <div class="shareBtn" @click="showShareGuide">已保存，查看访客记录</div>
    </div>
  </div>
</template> 
<script>
import { mapState, mapActions } from "vuex";
import Utils from "../../common/js/Utils.js";
import { clearTimeout, setInterval, clearInterval, setTimeout } from "timers";
import Net from "../../common/js/Net.js";
import audioContent_local from "../../common/components/audioContent/audioContent_local";
import shareGuide from "../../common/components/shareGuide/shareGuide";
import wx from "weixin-js-sdk";

export default {
  name: "sendVoice",
  components: {
    audioContent_local,
    shareGuide
  },
  props: {
    text: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      recordStatus: 0, //0表示未录音状态；1表示正在录音状态；2表示取消状态；3表示录音太短状态；4表示已经完成录音状态，不允许再录音了
      recordStatusImg: {
        0: "",
        1: require("./imgs/recording.gif"),
        2: require("./imgs/recordCancel.png"),
        3: require("./imgs/recordShort.png")
      },
      audioInfo: {
        creater: null,
        creatTime: "00-00 00:00",
        timeLength: 0,
        audioLocalId: null
      },
      shareGuideShow: false,
      recordBtnInfo: {
        text: "加载中..", //按住 录制
        canRecord: false
      }
    };
  },
  computed: {
    ...mapState(["userInfo"])
  },
  watch: {
    $route(to, from) {
      if (to.path.indexOf("sendVoice") !== -1) {
        //安卓：页面跳转重新授权
        if (Utils.isIosBrower() !== true) {
          console.log(
            `安卓浏览器,${Utils.getWholeUrl()}页面，JSSDK开始校验...`
          );
          Utils.verifyWxSdkSignature().then(res => {});
        }
        //设置标题
        this.setTitle();
        //数据初始化
        this.recordStatus = 0;
        this.shareGuideShow = false;
      }
    }
  },
  methods: {
    //设置标题
    setTitle() {
      const type = Utils.getUrlQueryJson().type;
      switch (type) {
        case "0":
          document.title = "其他类型";
          break;
        case "1":
          document.title = "治愈系";
          break;
        case "2":
          document.title = "播音主持";
          break;
        case "3":
          document.title = "唱歌";
          break;
        default:
          document.title = "其他类型";
          break;
      }
    },
    //开始录音
    startRecord() {
      return new Promise((resolve, reject) => {
        wx.startRecord({
          success: function() {
            resolve();
          },
          cancel: function() {
            reject();
          }
        });
      });
    },
    //取消录音
    stopRecord() {
      return new Promise((resolve, reject) => {
        wx.stopRecord({
          success: res => {
            console.log("成功获取到localId", res.localId);
            resolve(res.localId);
          }
        });
      });
    },
    // 上传语音接口
    uploadVoice(localId) {
      const that = this;
      wx.uploadVoice({
        localId, // 需要上传的音频的本地ID，由stopRecord接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function(res) {
          let serverId = res.serverId; // 返回音频的服务器端ID
          console.log("上传的音频成功，获取音频的服务器端ID", serverId);
          console.log(
            "正在将音频的服务器端ID发送到业务服务器,参数：",
            serverId,
            that.userInfo.uid,
            Utils.getUrlQueryJson().type,
            that.audioInfo.timeLength
          );
          Net.uploadAudioId(
            serverId,
            that.userInfo.uid,
            Utils.getUrlQueryJson().type,
            that.audioInfo.timeLength
          )
            .then(res => {
              console.log("音频id上传业务服务器成功", res);
              if (res.body.status === 0) {
                console.log("获取到的postId为：", Number(res.body.list_id));
                that.setShareInfo(
                  that.audioInfo.timeLength,
                  Number(res.body.list_id)
                );
                that.shareGuideShow = true;
              } else {
                console.log("业务服务器生成postId失败");
              }
            })
            .catch(res => {
              console.log("音频id上传业务服务器失败", res);
              that.toast = that.$createToast({
                txt: "语音上传失败",
                type: "txt",
                time: 2500
              });
              that.toast.show();
            });
        }
      });
    },
    //设置分享朋友圈
    setShareInfo(audioTimeLength, postId) {
      const that = this;
      const link =
        Utils.getUrlProtocol() +
        Utils.getUrlHost() +
        "/dist/postDetail?postid=" +
        postId;
      console.log("分享的link", link);
      wx.onMenuShareAppMessage({
        title: "朋友圈语音", // 分享标题
        desc: "这是我发的一条朋友圈语音，来听听嘛", // 分享描述
        link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: "http://img.eryieryi.top/uploads/voice/images/share0.png", // 分享图标
        success: function(res) {
          console.log("分享成功");
          navMyAudio();
          Net.addShareNumber(postId)
            .then(res => {})
            .catch(res => {});
        },
        cancel: function(res) {
          console.log("分享取消");
        }
      });
      wx.onMenuShareTimeline({
        title: `${audioTimeLength}秒`, // 分享标题
        link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: "http://img.eryieryi.top/uploads/voice/images/share1.jpg", // 分享图标
        success: function(res) {
          console.log("分享成功:" + `${audioTimeLength}秒`);
          navMyAudio();
          Net.addShareNumber(postId)
            .then(res => {})
            .catch(res => {});
        },
        cancel: function(res) {
          console.log("分享取消");
        }
      });
      function navMyAudio() {
        let timer = setTimeout(function() {
          that.$router.push("/person/myAudio");
          window.clearTimeout(timer);
          timer = null;
        }, 1000);
      }
    },
    //录音初始化
    recordInt() {
      const CancelThreshold = 50; //取消发送的上移阈值
      const that = this;
      const RecordTimeMin = 1; //录音的最小时长
      const RecordTimeMax = 55; //录音的最大时长
      let posStart = 0; //初始化起点坐标
      let posEnd = 0; //初始化终点坐标
      let posMove = 0; //初始化滑动坐标
      let btnElem = document.getElementById("recordBtn");
      let startRecordTimer = null; //开始录音定时器
      let recordtime = 0; //录音时长
      return function() {
        btnElem.addEventListener("touchstart", event => {
          if (that.recordStatus === 4) {
            return;
          }
          if (that.recordBtnInfo.canRecord === false) {
            that.sdkVerify();
            return;
          }
          if (!that.userInfo) {
            Utils.userAuthorization(that)
              .then(res => {
                that.audioInfo.creater = that.userInfo;
                console.log("that.audioInfo.creater", that.audioInfo.creater);
              })
              .catch(res => {});
            return;
          }

          event.preventDefault(); //阻止浏览器默认行为
          //初始化
          posStart = 0;
          posEnd = 0;
          posMove = 0;
          clearInterval(startRecordTimer);
          startRecordTimer = null;
          recordtime = 0;
          //获取起点坐标
          posStart = event.touches[0].pageY;
          // console.log("开始录音");
          that.recordStatus = 1;
          that
            .startRecord()
            .then(res => {
              //判断用户是否有授权过录音
              if (
                !localStorage.rainAllowRecord ||
                localStorage.rainAllowRecord !== "true"
              ) {
                console.log("用户已授权录音");
                localStorage.rainAllowRecord = "true";
              }
            })
            .catch(res => {
              console.log("用户拒绝授权录音");
              let timer = setTimeout(function() {
                clearInterval(startRecordTimer);
                startRecordTimer = null;
                wx.stopRecord();
                that.recordStatus = 0;
                window.clearTimeout(timer);
                timer = null;
              }, 800);
            });
          if (
            !localStorage.rainAllowRecord ||
            localStorage.rainAllowRecord !== "true"
          ) {
            wx.stopRecord();
            let timer = setTimeout(function() {
              that.recordStatus = 0;
              window.clearTimeout(timer);
              timer = null;
            }, 800);
            console.log("用户未授权，停止录音");
            return;
          }
          startRecordTimer = setInterval(() => {
            recordtime++;
            console.log("recordtime", recordtime);
            if (recordtime >= RecordTimeMax) {
              // console.log("超过时间自动停止录音并发送");
              //停止定时器
              clearInterval(startRecordTimer);
              startRecordTimer = null;
              console.log("超时完成录音，等候获取到localId");
              that.audioInfo.creatTime = Utils.getCurrentTime();
              that.audioInfo.timeLength = recordtime + 1;
              //停止录音并发送
              that.stopRecord().then(localId => {
                that.recordStatus = 4;
                that.uploadVoice(localId);
              });
            }
          }, 1000);
        });
        btnElem.addEventListener("touchmove", event => {
          if (
            that.recordBtnInfo.canRecord === false ||
            that.recordStatus === 4
          ) {
            return;
          }
          event.preventDefault(); //阻止浏览器默认行为
          posMove = event.targetTouches[0].pageY; //获取滑动实时坐标
          if (posStart - posMove < CancelThreshold) {
            console.log("录音中,松开手机完成录音");
            that.recordStatus = 1;
          } else {
            console.log("录音中,超出按键范围，松开手指取消发送");
            that.recordStatus = 2;
          }
        });
        btnElem.addEventListener("touchend", event => {
          if (
            that.recordBtnInfo.canRecord === false ||
            that.recordStatus === 4
          ) {
            return;
          }
          event.preventDefault();
          posEnd = event.changedTouches[0].pageY; //获取终点坐标
          if (recordtime <= RecordTimeMin) {
            that.stopRecord();
            clearInterval(startRecordTimer);
            startRecordTimer = null;
            console.log("录音时间过短，取消发送");
            if (that.recordStatus === 1) {
              that.recordStatus = 3;
            }
            let timer = setTimeout(function() {
              that.recordStatus = 0;
              window.clearTimeout(timer);
              timer = null;
            }, 1000);
            return;
          }
          if (recordtime >= RecordTimeMax) {
            return;
          }
          //清空定时器
          clearInterval(startRecordTimer);
          startRecordTimer = null;
          if (posStart - posEnd < CancelThreshold) {
            console.log("完成录音，等候获取到localId");
            that.audioInfo.creatTime = Utils.getCurrentTime();
            that.audioInfo.timeLength = recordtime + 1;
            that.stopRecord().then(localId => {
              that.recordStatus = 4;
              that.audioInfo.audioLocalId = localId;
              that.uploadVoice(localId);
            });
          } else {
            that.recordStatus = 0;
            that.stopRecord();
            console.log("停止录音，已取消发送");
          }
        });
      };
    },
    //分享指引
    showShareGuide() {
      this.shareGuideShow = !this.shareGuideShow;
    },
    //重新录制
    recordReset() {
      this.recordStatus = 0;
    },
    //sdk授权
    sdkVerify() {
      if (Utils.isIosBrower() !== true) {
        console.log(`安卓浏览器,${Utils.getWholeUrl()}页面，JSSDK开始校验...`);
        Utils.verifyWxSdkSignature().then(res => {
          this.recordBtnInfo = {
            text: "按住 录制",
            canRecord: true
          };
        });
      } else {
        this.recordBtnInfo = {
          text: "按住 录制",
          canRecord: true
        };
      }
    },
    ...mapActions(["set_userInfo"])
  },
  created() {
    if (!this.userInfo) {
      Utils.userAuthorization(this).then(res => {
        this.audioInfo.creater = this.userInfo;
        console.log("this.audioInfo.creater", this.audioInfo.creater);
      });
    }
  },
  mounted() {
    this.audioInfo.creater = this.userInfo;
    this.setTitle();
    this.recordInt()();
    this.sdkVerify();
  },
  destroyed() {}
};
</script>


<style lang="less">
.tips {
  color: #9d9d9d;
  font-size: 16px;
  text-align: center;
  margin-top: 20px;
}
.recordBtn {
  width: 250px;
  height: 50px;
  border-radius: 5px;
  border: 2px solid #4d9efc;
  text-align: center;
  line-height: 50px;
  font-size: 20px;
  color: #4d9efc;
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
}
.recordContent {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 2rem;
  left: 0;
  .recordReset {
    position: absolute;
    bottom: 5.5rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.3rem;
    color: #999;
  }
  .shareBtn {
    width: 4.6rem;
    height: 1rem;
    border-radius: 5px;
    border: 2px solid #4d9efc;
    text-align: center;
    line-height: 1rem;
    font-size: 0.35rem;
    color: #4d9efc;
    position: absolute;
    bottom: 4rem;
    left: 50%;
    transform: translateX(-50%);
  }
}
.recordTips {
  width: 3.2rem;
  height: 3.2rem;
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
}
</style>
