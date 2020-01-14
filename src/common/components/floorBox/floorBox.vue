<template >
  <div class="floorBox">
    <img v-lazy="commentItemInfo.creater.avatarUrl" alt class="avatarUrl">
    <div class="floorBox-text">
      <div class="userInfo">
        <div>
          <p>
            <span>{{commentItemInfo.creater.nickName}}</span>
            <img :src="commentItemInfo.creater.gender===1?genderImg0:genderImg1" alt>
          </p>
          <p>{{commentItemInfo.creatTime}}</p>
        </div>
        <div @click="praise">
          <img :src="praiseImg" alt>
          <span ref="praiseNum">{{commentItemInfo.praiseNum}}</span>
        </div>
      </div>
      <div class="comment">
        <p>
          <span
            v-if="commentItemInfo.replyToId&&layerCreaterInfo[commentItemInfo.replyToId]"
          >回复 {{layerCreaterInfo[commentItemInfo.replyToId]['nickName']}} ：</span>
          {{commentItemInfo.content.text}}
        </p>
      </div>
      <div class="reply">
        <img v-if="!commentItemInfo.remarkNum" @click="reply" src="../../imgs/reply.png" alt>
        <p
          v-if="commentItemInfo.remarkNum"
          @click="navFloorDetail"
        >查看{{commentItemInfo.remarkNum}}条回复 ></p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState, mapMutations } from "vuex";
import Utils from "../../js/Utils";
import Net from "../../js/Net.js";
import LocalStorageKey from "../../js/LocalStorageKey.js";
export default {
  components: {},
  props: {
    commentItemInfo: {},
    layerCreaterInfo: {}
  },
  data() {
    return {
      genderImg0: require("../../imgs/male.png"),
      genderImg1: require("../../imgs/female.png"),
      //点赞图片
      praiseImg: require("../../imgs/praise.png")
    };
  },
  computed: {
    ...mapState(["userInfo"])
  },
  watch: {
    $route(to, from) {
      if (
        to.path === "/postDetail" &&
        from.path === "/postDetail/floorDetail"
      ) {
        this.updatePraiseImg();
      }
    }
  },
  methods: {
    //回复
    reply() {
      if (Utils.getUrlPathname() === "/dist/postDetail") {
        this.$emit("startInput_floor", this.commentItemInfo);
      } else {
        this.$emit("startInput_layer", this.commentItemInfo);
      }
    },
    //查看层评论详情
    navFloorDetail() {
      this.$emit("navFloorDetail", this.commentItemInfo);
    },
    //点赞
    praise() {
      if(!this.userInfo){
        Utils.userAuthorization(this)
        return
      }
      if (Utils.getUrlPathname() === "/dist/postDetail") {
        Net.praiseFloor(this.userInfo.uid, this.commentItemInfo.floorId);
        let origin =
          localStorage[LocalStorageKey["FloorHasPraised"]] ||
          JSON.stringify({});
        let obj = JSON.parse(origin);
        if (obj[this.commentItemInfo.floorId]) {
          delete obj[this.commentItemInfo.floorId];
          localStorage[LocalStorageKey["FloorHasPraised"]] = JSON.stringify(
            obj
          );
          this.praiseImg = require("../../imgs/praise.png");
          this.commentItemInfo.praiseNum--;
          this.$refs.praiseNum.style.color = "#8c8c8c";
        } else {
          obj[this.commentItemInfo.floorId] = true;
          localStorage[LocalStorageKey["FloorHasPraised"]] = JSON.stringify(
            obj
          );
          this.praiseImg = require("../../imgs/praised.png");
          this.commentItemInfo.praiseNum++;
          this.$refs.praiseNum.style.color = "#4B9EFC";
        }
      } else {
        Net.praiseLayer(this.userInfo.uid, this.commentItemInfo.layerId);
        let origin =
          localStorage[LocalStorageKey["LayerHasPraised"]] ||
          JSON.stringify({});
        let obj = JSON.parse(origin);
        if (obj[this.commentItemInfo.layerId]) {
          delete obj[this.commentItemInfo.layerId];
          localStorage[LocalStorageKey["LayerHasPraised"]] = JSON.stringify(
            obj
          );
          this.praiseImg = require("../../imgs/praise.png");
          this.commentItemInfo.praiseNum--;
          this.$refs.praiseNum.style.color = "#8c8c8c";
        } else {
          obj[this.commentItemInfo.layerId] = true;
          localStorage[LocalStorageKey["LayerHasPraised"]] = JSON.stringify(
            obj
          );
          this.praiseImg = require("../../imgs/praised.png");
          this.commentItemInfo.praiseNum++;
          this.$refs.praiseNum.style.color = "#4B9EFC";
        }
      }
    },
    //更新点赞图片
    updatePraiseImg() {
      if (Utils.getUrlPathname() === "/dist/postDetail") {
        if (
          localStorage[LocalStorageKey["FloorHasPraised"]] &&
          JSON.parse(localStorage[LocalStorageKey["FloorHasPraised"]])[
            this.commentItemInfo.floorId
          ]
        ) {
          this.praiseImg = require("../../imgs/praised.png");
          this.$refs.praiseNum.style.color = "#4B9EFC";
        } else {
          this.praiseImg = require("../../imgs/praise.png");
          this.$refs.praiseNum.style.color = "#8c8c8c";
        }
      } else {
        if (
          localStorage[LocalStorageKey["LayerHasPraised"]] &&
          JSON.parse(localStorage[LocalStorageKey["LayerHasPraised"]])[
            this.commentItemInfo.layerId
          ]
        ) {
          this.praiseImg = require("../../imgs/praised.png");
          this.$refs.praiseNum.style.color = "#4B9EFC";
        } else {
          this.praiseImg = require("../../imgs/praise.png");
          this.$refs.praiseNum.style.color = "#8c8c8c";
        }
      }
    }
  },
  created() {},
  mounted() {
    //设置点赞图片
    this.updatePraiseImg();
  },
  destroyed() {}
};
</script>


<style scoped lang="less">
.floorBox {
  box-sizing: border-box;
  padding: 10px 0;
  display: flex;
  width: 100%;
  .avatarUrl {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 0.2rem;
  }
  .floorBox-text {
    width: 80%;
    box-sizing: border-box;
    padding-top: 6px;
    .userInfo {
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      div:nth-child(1) {
        font-size: 16px;
        img {
          width: 26px;
          height: 15px;
          margin-left: 10px;
        }
        p:nth-child(1) {
          display: flex;
        }
        p:nth-child(2) {
          font-size: 14px;
          color: #8c8c8c;
          margin-top: 5px;
        }
      }
      div:nth-child(2) {
        font-size: 16px;
        color: #8c8c8c;
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
    .reply {
      margin-top: 15px;
      font-size: 16px;
      color: #666;
      img {
        width: 60px;
        height: 28px;
      }
    }
  }
}
</style>
