<template >
  <div class="floorDetail-container">
    <div class="floorDetail scroll-list-wrap" ref="scrollWrap" v-if="floorDetailMain">
      <cube-scroll
        ref="scroll"
        :data="commentFloorInfo"
        :options="options"
        @pulling-up="onPullingUp"
      >
        <div class="head">
          {{floorDetailMain.remarkNum}}条回复
          <div class="close">
            <img src="../imgs/close.png" @click="close">
          </div>
        </div>
        <div class="mainComment">
          <div class="floorBox">
            <img :src="floorDetailMain.creater.avatarUrl" alt class="avatarUrl">
            <div class="floorBox-text">
              <div class="userInfo">
                <div>
                  <p>
                    <span>{{floorDetailMain.creater.nickName}}</span>
                    <img :src="floorDetailMain.creater.gender===0?genderImg0:genderImg1" alt>
                  </p>
                  <p>{{floorDetailMain.creatTime}}</p>
                </div>
                <div @click="praise_floor">
                  <img :src="praiseImg" alt>
                  <span>{{floorDetailMain.praiseNum}}</span>
                </div>
              </div>
              <div class="comment">{{floorDetailMain.content.text}}</div>
            </div>
          </div>
          <div style="margin-top:8px;">精彩评论</div>
        </div>

        <ul class="commentList" v-if="commentFloorInfo.length">
          <li v-for="(item, index)  in commentFloorInfo" :key="index">
            <floorBox
              :commentItemInfo="item"
              :layerCreaterInfo="layerCreaterInfo"
              @startInput_layer="startInput_layer"
            ></floorBox>
          </li>
        </ul>
      </cube-scroll>

      <div class="inputMessage" @click="startInput_floor">
        <input type="text" placeholder="给你一个神评机会" disabled>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from "vuex";
import Utils from "../../../common/js/Utils.js";
import Net from "../../../common/js/Net.js";
import floorBox from "../../../common/components/floorBox/floorBox";
import LocalStorageKey from "../../../common/js/LocalStorageKey.js";
export default {
  components: { floorBox },
  props: {},
  data() {
    return {
      floorId: null,
      page: 0,
      commentFloorInfo: [],
      layerCreaterInfo: {}, //每层创建者的基本信息
      genderImg0: require("../../../common/imgs/male.png"),
      genderImg1: require("../../../common/imgs/female.png"),
      //点赞图片
      praiseImg: require("../../../common/imgs/praised.png"),
      //屏幕高度
      clientHeight: "",
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
    ...mapState(["floorDetailMain", "userInfo"])
  },
  watch: {
    // 如果 `clientHeight` 发生改变，这个函数就会运行
    clientHeight: function() {
      this.changeFixed(this.clientHeight);
    }
  },
  methods: {
    //开始输入
    startInput_floor(commentItemInfo) {
      const queryJson = Utils.getUrlQueryJson();
      this.$router.push(
        "/postDetail/floorInput?postid=" +
          queryJson.postid +
          "&replytype=1&floorid=" +
          queryJson.floorid
      );
    },
    //开始输入
    startInput_layer(commentItemInfo) {
      const queryJson = Utils.getUrlQueryJson();
      this.$router.push(
        "/postDetail/floorInput?postid=" +
          queryJson.postid +
          "&replytype=2&floorid=" +
          queryJson.floorid +
          "&layerid=" +
          commentItemInfo.layerId
      );
    },
    //点赞
    praise_floor() {
      if(!this.userInfo){
        Utils.userAuthorization(this)
        return
      }
      Net.praisePost(this.userInfo.uid, this.floorId);
      let origin =
        localStorage[LocalStorageKey["FloorHasPraised"]] || JSON.stringify({});
      let obj = JSON.parse(origin);
      if (obj[this.floorId]) {
        delete obj[this.floorId];
        localStorage[LocalStorageKey["FloorHasPraised"]] = JSON.stringify(obj);
        this.praiseImg = require("../../../common/imgs/praise.png");
        this.floorDetailMain.praiseNum--;
      } else {
        obj[this.floorId] = true;
        localStorage[LocalStorageKey["FloorHasPraised"]] = JSON.stringify(obj);
        this.praiseImg = require("../../../common/imgs/praised.png");
        this.floorDetailMain.praiseNum++;
      }
    },
    //根据floorId获取层评论信息列表
    getFloorCommentList() {
      this.toast = this.$createToast({
        txt: "加载中.."
      });
      this.toast.show();
      this.floorId = Utils.getUrlQueryJson().floorid;
      this.page++;
      Net.getAudioComment_layer(this.floorId, this.page)
        .then(res => {
          this.toast.hide();
          if (this.page <= res.body.data.last_page) {
            let result = res.body.data.data.map((item, index) => {
              return {
                praiseNum: item.favours, //点赞数
                remarkNum: item.reply_count, //回复数
                creatTime: item.create_time, //创建时间
                floorId: item.comment_id,
                layerId: item.id,
                replyToId: item.reply_id,
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
            this.commentFloorInfo = this.commentFloorInfo.concat(result);
            //获取每层创建者的基本信息
            this.commentFloorInfo.forEach((item, index) => {
              if (!this.layerCreaterInfo[item.layerId]) {
                this.layerCreaterInfo[item.layerId] = item.creater;
              }
            });
          } else {
            // 如果没有新数据
            this.page--;
            this.$refs.scroll.forceUpdate();
          }
        })
        .catch(res => {
          this.toast.hide();
          this.page--;
          this.$refs.scroll.forceUpdate();
        });
    },
    //关闭
    close() {
      this.$router.go(-1);
    },
    //动态修改样式
    changeFixed(clientHeight) {
      this.$refs.scrollWrap.style.height = clientHeight - 100 + "px";
    },
    // 触发上拉加载
    onPullingUp() {
      console.log("监听到上拉加载");
      this.getFloorCommentList();
    }
  },
  created() {},
  mounted() {
    if (!this.floorDetailMain) this.close();
    this.floorId = Utils.getUrlQueryJson().floorid;
    //设置点赞图片
    this.praiseImg =
      localStorage[LocalStorageKey["FloorHasPraised"]] &&
      JSON.parse(localStorage[LocalStorageKey["FloorHasPraised"]])[this.floorId]
        ? require("../../../common/imgs/praised.png")
        : require("../../../common/imgs/praise.png");
    this.getFloorCommentList();
    // 获取浏览器可视区域高度
    this.clientHeight = `${document.documentElement.clientHeight}`;
    // 监听窗口变化
    window.onresize = function temp() {
      this.clientHeight = `${document.documentElement.clientHeight}`;
    };
  },
  destroyed() {}
};
</script>

<style scoped lang="less">
.floorDetail-container {
  box-shadow: 0px -4px 10px #ddd;
  box-sizing: border-box;
  width: 100%;
  background: #f4f4f4;
  position: fixed;
  left: 0;
  top: 100px;
  bottom: 30px;
  z-index: 3;
  .floorDetail {
    .head {
      background: #fff;
      height: 40px;
      line-height: 40px;
      position: relative;
      text-align: center;
      border-bottom: 1px solid #ccc;
      .close {
        position: absolute;
        top: 0px;
        right: 10px;
        padding: 5px 10px;
        img {
          width: 15px;
          height: 15px;
        }
      }
    }
    .mainComment {
      background: #fff;
      padding: 10px;
      .floorBox {
        padding: 10px 0;
        display: flex;
        .avatarUrl {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 0.2rem;
        }
        .floorBox-text {
          padding-top: 6px;
          width: 80%;
          .userInfo {
            display: flex;
            justify-content: space-between;
            align-items: center;
            div:nth-child(1) {
              font-size: 16px;
              img {
                width: 26px;
                height: 15px;
                margin-left: 10px;
              }
              p:nth-child(2) {
                font-size: 14px;
                color: #999;
                margin-top: 5px;
              }
            }
            div:nth-child(2) {
              font-size: 16px;
              color: #999;
              display: flex;
              align-items: center;
              img {
                width: 16px;
                height: 16px;
                margin-right: 5px;
              }
            }
          }
          .comment {
            margin-top: 15px;
            font-size: 18px;
          }
        }
      }
    }
    .commentList {
      margin-top: 1px;
      background: #fff;
      padding: 0 10px;
      li {
        border-top: 1px solid #ccc;
      }
      li:nth-child(1) {
        border: none;
      }
    }
    .inputMessage {
      box-sizing: border-box;
      width: 100%;
      height: 1rem;
      position: fixed;
      left: 0;
      bottom: 0;
      border-top: 1px solid #ccc;
      box-shadow: 0px -4px 10px #ddd;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 10px;
      z-index: 5;
      background: #f2f2f2;
      input {
        width: 6rem;
        height: 0.6rem;
        border-radius: 5px;
        font-size: 15px;
        padding: 0 15px;
        background: #fff;
      }
    }
  }
}
</style>
