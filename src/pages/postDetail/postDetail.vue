<template >
  <div class="postDetail scroll-list-wrap" ref="scrollWrap">
    <div v-if="shareGuideShow" @click="showShareGuide">
      <shareGuide></shareGuide>
    </div>
    <nothing v-if="postHasBeDeleted">帖子已被作者删除啦~</nothing>
    <cube-scroll
      ref="scroll"
      :data="postCommentsData"
      :options="options"
      @pulling-up="onPullingUp"
      v-if="!postHasBeDeleted"
    >
      <div class="postInfo" v-if="postInfo.creatTime">
        <audioContent_online
          :postInfo="postInfo"
          ref="audioContent"
          @resetAudioTimeLength="resetAudioTimeLength"
        ></audioContent_online>
        <ul class="shareInfo">
          <li>
            <img src="../../common/imgs/listen.png" alt>
            <span>{{postInfo.listenerNum}}人偷听</span>
          </li>
          <li @click="showShareGuide">
            <img src="../../common/imgs/share.png" alt>
            <span>{{postInfo.shareNum}}次</span>
          </li>
          <li>
            <img src="../../common/imgs/comment.png" alt>
            <span>{{postInfo.remarkNum}}条</span>
          </li>
          <li @click="praise_post">
            <img :src="praiseImg" alt>
            <span>{{postInfo.praiseNum}}人</span>
          </li>
        </ul>
        <div class="listenDetail" v-if="listenersList.length>0">
          <img src="./imgs/listenArrow.png" alt>
          <ul>
            <li v-for="(item, index)  in listenersList.slice(0,10)" :key="index">
              {{item.nickName}}
              <span v-if="index!==listenersList.length-1">、</span>
            </li>
          </ul>
        </div>
        <img src="./imgs/meTo.png" alt class="meTo" @click="navSendVoice">
      </div>
      <div class="commentList">
        <div class="head">
          <span>全部评论</span>
          <p @click="changeOrder">
            {{commentOrder.message}}
            <img :src="commentOrder.img">
          </p>
        </div>
        <ul class="floorBoxContainer" v-if="postCommentsData.length">
          <li v-for="(item, index)  in postCommentsData" :key="index">
            <floorBox
              :commentItemInfo="item"
              @startInput_floor="startInput_floor"
              @navFloorDetail="navFloorDetail"
            ></floorBox>
          </li>
        </ul>
        <div class="noneComments" v-if="postCommentsData.length===0">
          <img src="./imgs/noneComments.png" alt>
        </div>
      </div>
    </cube-scroll>
    <div class="replyBox_static" v-if="!postHasBeDeleted">
      <!-- <img src="./imgs/inputImg.png" alt @click="startInput"> -->
      <div class="inputMessage" @click="startInput_post">
        <input type="text" placeholder="给你一个神评机会" disabled>
      </div>
      <img src="./imgs/reportPolice.png" alt @click="showReportPolice">
      <img :src="collectImg" alt @click="record">
      <img src="./imgs/share1.png" alt @click="showShareGuide">
      <img src="./imgs/index.png" alt @click="navIndexPage">
    </div>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState, mapMutations, mapActions } from "vuex";
import audioContent_online from "../../common/components/audioContent/audioContent_online";
import Utils from "../../common/js/Utils.js";
import Net from "../../common/js/Net.js";
import floorBox from "../../common/components/floorBox/floorBox";
import LocalStorageKey from "../../common/js/LocalStorageKey.js";
import shareGuide from "../../common/components/shareGuide/shareGuide";
import wx from "weixin-js-sdk";
import { clearTimeout } from "timers";
import nothing from "../../common/components/nothing/nothing";

export default {
  name: "postDetail",
  components: {
    audioContent_online,
    shareGuide,
    nothing,
    floorBox
  },
  props: {},
  data() {
    return {
      postId: null,
      //帖子是否被删除
      postHasBeDeleted: false,
      //屏幕高度
      clientHeight: "",
      //帖子基本信息
      postInfo: {},
      //偷听者名字数据
      listenersList: [],
      //评论的顺序:1为正序，2为倒序
      commentOrder: {
        order: 1,
        message: "正序", //倒序 <
        img: require("../../common/imgs/arrow.png")
      },
      page: 0,
      //点赞图片
      praiseImg: require("../../common/imgs/praised.png"),
      //收藏图片
      collectImg: require("./imgs/record0.png"),
      //显示指引
      shareGuideShow: false,
      options: {
        pullUpLoad: {
          threshold: 10,
          txt: {
            more: "上拉加载更多",
            noMore: "没有更多数据"
          }
        }
      }
    };
  },
  computed: {
    ...mapState(["userInfo", "postCommentsData", "postCommentsUpdate"])
  },
  watch: {
    // 如果 `clientHeight` 发生改变，这个函数就会运行
    clientHeight: function() {
      this.changeFixed(this.clientHeight);
    },
    //更新数据，此方法是退而求其次的办法，完美方法应该是直接操作set_postCommentsData更新数据，这样可以防止评论数据全变
    $route(to, from) {
      if (
        to.path === "/postDetail" &&
        (from.path === "/postDetail/floorInput" ||
          from.path === "/postDetail/floorDetail")
      ) {
        if (this.postCommentsUpdate) {
          //更新评论数
          this.getAudioDetail();
          //帖子评论数据更新
          this.set_postCommentsData([]);
          this.page = 0;
          this.getAudioComment_floor();
          this.set_postCommentsUpdate(false);
        }
      }
    }
  },
  methods: {
    //获取当前页面的postId
    getUrlPostId() {
      return Utils.getUrlQueryJson().postid;
    },
    //改变帖子评论顺序
    changeOrder() {
      if (this.commentOrder.order === 1) {
        this.commentOrder = {
          order: 2,
          message: "倒序",
          img: require("../../common/imgs/arrow1.png")
        };
      } else {
        this.commentOrder = {
          order: 1,
          message: "正序",
          img: require("../../common/imgs/arrow.png")
        };
      }
      this.set_postCommentsData([]);
      this.page = 0;
      this.getAudioComment_floor();
    },
    //点赞
    praise_post() {
      if (!this.userInfo) {
        Utils.userAuthorization(this);
        return;
      }
      Net.praisePost(this.userInfo.uid, this.postId);
      let origin =
        localStorage[LocalStorageKey["PostHasPraised"]] || JSON.stringify({});
      let obj = JSON.parse(origin);
      if (obj[this.postId]) {
        delete obj[this.postId];
        localStorage[LocalStorageKey["PostHasPraised"]] = JSON.stringify(obj);
        this.praiseImg = require("../../common/imgs/praise.png");
        this.postInfo.praiseNum--;
      } else {
        obj[this.postId] = true;
        localStorage[LocalStorageKey["PostHasPraised"]] = JSON.stringify(obj);
        this.praiseImg = require("../../common/imgs/praised.png");
        this.postInfo.praiseNum++;
      }
    },
    //收藏
    record() {
      if (!this.userInfo) {
        Utils.userAuthorization(this);
        return;
      }
      let origin =
        localStorage[LocalStorageKey["PostHasCollected"]] || JSON.stringify({});
      let obj = JSON.parse(origin);
      if (obj[this.postId]) {
        Net.collectPost_Cancel(this.userInfo.uid, this.postId);
        delete obj[this.postId];
        localStorage[LocalStorageKey["PostHasCollected"]] = JSON.stringify(obj);
        this.collectImg = require("./imgs/record0.png");
      } else {
        Net.collectPost(this.userInfo.uid, this.postId);
        obj[this.postId] = true;
        localStorage[LocalStorageKey["PostHasCollected"]] = JSON.stringify(obj);
        this.collectImg = require("./imgs/record1.png");
      }
    },
    //添加一条浏览记录
    addBrowseHistory() {
      let origin =
        localStorage[LocalStorageKey["BrowseAudioHistory"]] ||
        JSON.stringify([]);
      let arr = JSON.parse(origin);
      const index = arr.indexOf(this.postId);
      if (index !== -1) {
        arr.splice(index, 1);
      }
      arr.unshift(this.postId);
      const MaxHistoryNumber = 30;
      arr.slice(0, MaxHistoryNumber);
      localStorage[LocalStorageKey["BrowseAudioHistory"]] = JSON.stringify(arr);
    },
    //获取语音详情数据
    getAudioDetail() {
      this.toast = this.$createToast({
        txt: "加载中.."
      });
      this.toast.show();
      Net.getAudioDetail(this.postId, this.userInfo ? this.userInfo.uid : null)
        .then(res => {
          this.toast.hide();
          if (res.body.status === 1) {
            let item = res.body.data;
            let result = {
              shareNum: item.share_count,
              remarkNum: item.discuss_count,
              creatTime: item.create_time,
              praiseNum: item.like_count,
              listenerNum: item.view_count,
              remarkNum: item.discuss_count,
              creater: {
                //创建者信息
                uid: item.uid,
                gender: item.gender, //0表示男，1表示女,2表示未知
                nickName: item.nickName,
                avatarUrl: item.avatarUrl
              },
              content: {
                //帖子包含的内容
                text: "",
                audioInfo: {
                  timeLength: item.audio_time,
                  audioUrl: item.voice_url
                },
                imgUrl: ""
              }
            };
            this.postInfo = result;
            this.getListenersList();
          } else {
            if (this.userInfo) {
              this.postHasBeDeleted = true;
            }
            const url = Utils.getWholeUrl();
            let timer = setTimeout(() => {
              if (Utils.getWholeUrl() === url) {
                this.$router.push("/");
              }
              window.clearTimeout(timer);
              timer = null;
            }, 2500);
          }
        })
        .catch(res => {
          this.toast.hide();
          if (this.userInfo) {
            this.postHasBeDeleted = true;
          }
          const url = Utils.getWholeUrl();
          let timer = setTimeout(() => {
            if (Utils.getWholeUrl() === url) {
              this.$router.push("/");
            }
            window.clearTimeout(timer);
            timer = null;
          }, 8000);
        });
    },
    //获取偷听人的列表数据
    getListenersList() {
      Net.getListenersList(this.postId).then(res => {
        this.listenersList = res.body.data;
      });
    },
    //获取语音评论（楼）数据列表
    getAudioComment_floor() {
      this.page++;
      Net.getAudioComment_floor(this.postId, this.page, this.commentOrder.order)
        .then(res => {
          if (this.page <= res.body.data.last_page) {
            let result = res.body.data.data.map((item, index) => {
              return {
                praiseNum: item.favours, //点赞数
                remarkNum: item.reply_count, //回复数
                creatTime: item.create_time, //创建时间
                floorId: item.comment_id,
                creater: {
                  //创建者信息
                  uid: item.uid,
                  gender: item.gender, //0表示男，1表示女,2表示未知
                  nickName: item.nickName,
                  avatarUrl: item.avatarUrl
                },
                content: {
                  //帖子包含的内容
                  text: item.content,
                  audioInfo: {
                    timeLength: 0,
                    audioUrl: ""
                  },
                  imgUrl: ""
                }
              };
            });
            // 如果有新数据
            this.set_postCommentsData(this.postCommentsData.concat(result));
          } else {
            // 如果没有新数据
            this.page--;
            this.$refs.scroll.forceUpdate();
          }
        })
        .catch(res => {
          this.page--;
          this.$refs.scroll.forceUpdate();
        });
    },
    //回复帖子
    startInput_post() {
      this.$router.push(
        "/postDetail/floorInput?postid=" + this.postId + "&replytype=0"
      );
    },
    //回复楼
    startInput_floor(e) {
      this.$router.push(
        "/postDetail/floorInput?postid=" +
          this.postId +
          "&replytype=1&floorid=" +
          e.floorId
      );
    },
    //查看层评论详情
    navFloorDetail(commentItemInfo) {
      this.set_floorDetailMain(commentItemInfo);
      this.$router.push(
        `/postDetail/floorDetail?postid=${this.postId}&&floorid=${
          commentItemInfo.floorId
        }`
      );
    },
    //显示举报
    showReportPolice() {
      this.$router.push("/postDetail/reportPolice?postid=" + this.postId);
    },
    //分享
    showShareGuide() {
      this.shareGuideShow = !this.shareGuideShow;
    },
    //ios bug:设置分享时的时间
    resetAudioTimeLength(audioDuration) {
      this.setShare(audioDuration);
    },
    //设置分享：ios路径和秒数
    setShare(audioDuration) {
      const that = this;
      const link =
        Utils.getUrlProtocol() +
        Utils.getUrlHost() +
        "/dist/postDetail?postid=" +
        that.postId;
      //分享给微信
      wx.onMenuShareAppMessage({
        title: "朋友圈语音", // 分享标题
        desc: `这是${
          that.postInfo.creater.nickName === that.userInfo.nickName
            ? "我"
            : that.postInfo.creater.nickName
        }发的一条朋友圈语音，来听听嘛`, // 分享描述
        link, // 分享链接
        imgUrl: "http://img.eryieryi.top/uploads/voice/images/share0.png", // 分享图标
        type: "", // 分享类型,music、video或link，不填默认为link
        dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
        success: function() {
          console.log("分享成功");
          Net.addShareNumber(that.postId)
            .then(res => {
              that.postInfo.shareNum++;
            })
            .catch(res => {
              console.log("分享数据上传服务器错误", res);
            });
        },
        cancel: function() {
          console.log("分享取消");
        }
      });
      wx.onMenuShareTimeline({
        title: audioDuration
          ? `${audioDuration}秒`
          : `${this.$refs.audioContent.audioDuration}秒`, // 分享标题
        link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: "http://img.eryieryi.top/uploads/voice/images/share1.jpg", // 分享图标
        success: function(res) {
          console.log("分享成功");
          Net.addShareNumber(that.postId)
            .then(res => {
              that.postInfo.shareNum++;
            })
            .catch(res => {});
        },
        cancel: function(res) {
          console.log("分享取消");
        }
      });
    },
    //动态修改样式
    changeFixed(clientHeight) {
      this.$refs.scrollWrap.style.height = clientHeight + "px";
    },
    //返回首页
    navIndexPage() {
      this.$router.push("/index");
    },
    //跳转录制语音页面
    navSendVoice() {
      this.$router.push({ path: "/sendVoice", query: { type: 0 } });
    },
    // 触发上拉加载
    onPullingUp() {
      console.log("监听到上拉加载");
      this.getAudioComment_floor();
    },
    //设置点赞图片
    setPraiseImg() {
      this.praiseImg =
        localStorage[LocalStorageKey["PostHasPraised"]] &&
        JSON.parse(localStorage[LocalStorageKey["PostHasPraised"]])[this.postId]
          ? require("../../common/imgs/praised.png")
          : require("../../common/imgs/praise.png");
    },
    ...mapMutations([
      "set_floorDetailMain",
      "set_postCommentsData",
      "set_postCommentsUpdate"
    ]),
    ...mapActions(["set_userInfo"])
  },
  created() {
    console.log("进入语音详情时的url", Utils.getWholeUrl());
    this.postId = this.getUrlPostId();
    if (Utils.isIosBrower() !== true) {
      console.log(`安卓浏览器,${Utils.getWholeUrl()}页面，JSSDK开始校验...`);
      Utils.verifyWxSdkSignature();
    }
  },
  mounted() {
    Utils.userAuthorization(this);

    //初始化数据
    this.page = 0;
    this.set_postCommentsData([]);
    this.set_postCommentsUpdate(false);

    // 获取浏览器可视区域高度
    this.clientHeight = `${document.documentElement.clientHeight}`;
    // 监听窗口变化
    window.onresize = function temp() {
      this.clientHeight = `${document.documentElement.clientHeight}`;
    };

    //获取数据
    this.getAudioDetail();
    this.getAudioComment_floor();

    //设置点赞图片
    this.setPraiseImg();

    //设置收藏图片
    this.collectImg =
      localStorage[LocalStorageKey["PostHasCollected"]] &&
      JSON.parse(localStorage[LocalStorageKey["PostHasCollected"]])[this.postId]
        ? require("./imgs/record1.png")
        : require("./imgs/record0.png");
    //设置分享
    let timer0 = setTimeout(() => {
      try {
        this.setShare();
      } catch (res) {
        console.log("网速慢，还未获取到分享时长");
      }
      window.clearTimeout(timer0);
      timer0 = null;
    }, 500);
    //防止网速慢获取不到audio的时长
    let timer1 = setTimeout(() => {
      try {
        this.setShare();
      } catch (res) {
        console.log("网速慢，还未获取到分享时长");
      }
      window.clearTimeout(timer1);
      timer1 = null;
    }, 3000);
    //添加一条浏览记录
    this.addBrowseHistory();
  },
  destroyed() {
    this.set_postCommentsUpdate(false);
  }
};
</script>


<style scoped lang="less">
.postDetail {
  box-sizing: border-box;
  background: #f2f2f2;
  position: relative;
  .postInfo {
    padding: 20px 10px;
    background: #fff;
    .shareInfo {
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 15px;
      margin-top: 16px;
      color: #8c8c8c;
      li {
        display: flex;
        align-items: center;
        img {
          width: 16px;
          height: 14px;
          margin-right: 4px;
        }
      }
      li:nth-child(2) {
        margin-right: 0.5rem;
      }
    }
    .listenDetail {
      font-size: 14px;
      color: #68abfa;
      line-height: 20px;
      img {
        width: 20px;
        height: 12px;
        position: relative;
        left: 18px;
        top: 6px;
      }
      ul {
        background: #f2f2f2;
        border-radius: 5px;
        padding: 10px;
        display: flex;
        flex-wrap: wrap;
      }
    }
    .meTo {
      width: 1.5rem;
      height: 0.6rem;
      position: absolute;
      top: 0.3rem;
      right: 0.2rem;
    }
  }

  .commentList {
    padding: 10px;
    background: #fff;
    margin-top: 10px;
    position: relative;
    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      color: #333;
      span {
        font-size: 18px;
      }
      p {
        display: flex;
        align-items: center;
        img {
          width: 12px;
          height: 12px;
          margin-left: 5px;
        }
      }
    }
    .floorBoxContainer {
      padding: 10px 10px;
      li {
        border-bottom: 1px solid #ccc;
      }
    }
    .noneComments {
      text-align: center;
      position: absolute;
      width: 100%;
      color: #999;
      left: 0;
      top: 38px;
      background: #fff;
      height: 12rem;
      img {
        width: 140px;
        height: 120px;
        margin-top: 2rem;
      }
    }
  }
  .replyBox_static {
    position: fixed;
    left: 0px;
    bottom: 0px;
    width: 100%;
    height: 50px;
    background-color: #f2f2f2;
    z-index: 1;
    border-top: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: space-around;
    img {
      width: 22px;
      height: 20px;
      margin-right: 10px;
    }
    input {
      width: 3.5rem;
      height: 0.6rem;
      border-radius: 5px;
      font-size: 15px;
      padding: 0 15px;
      background: #fff;
    }
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(0, 100%, 0);
}
</style>
