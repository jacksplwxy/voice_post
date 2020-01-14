<template>
  <div class="person">
    <div style="width:100%">
      <div class="personInfo">
        <img :src="userInfo?userInfo['avatarUrl']:defaultImg">
        <div>{{userInfo?userInfo['nickName']:'您'}}</div>
      </div>
      <ul class="item-list" wx:if="!hideList">
        <li @click="navMyAudio">
          <div>
            <img src="./imgs/audio.png" alt>
            <span>我的语音</span>
          </div>
          <img src="./imgs/arrow.png" alt>
        </li>
        <li @click="navMyAudioCollect">
          <div>
            <img src="./imgs/favorite.png" alt>
            <div>我的收藏</div>
          </div>
          <img src="./imgs/arrow.png" alt>
        </li>
        <li @click="navMyBrowseHistory">
          <div>
            <img src="./imgs/history.png" alt>
            <div>浏览历史</div>
          </div>
          <img src="./imgs/arrow.png" alt>
        </li>
        <li @click="navYourQuestions">
          <div>
            <img src="./imgs/questions.png" alt>
            <div>常见问题</div>
          </div>
          <img src="./imgs/arrow.png" alt>
        </li>
        <li @click="navFeedback">
          <div>
            <img src="./imgs/opinion.png" alt>
            <div>意见反馈</div>
          </div>
          <img src="./imgs/arrow.png" alt>
        </li>
        <li @click="navMoreGame">
          <div>
            <img src="./imgs/moreGame.png" alt>
            <div>更多好玩</div>
          </div>
          <img src="./imgs/arrow.png" alt>
        </li>
      </ul>
      <transition name="slide">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>
<script>
import Net from "../../common/js/Net.js";
import Utils from "../../common/js/Utils.js";

import { mapState, mapActions } from "vuex";
export default {
  name: "person",
  data() {
    return {
      defaultImg: require("../../common/imgs/default.png"),
      hideList: false //hack：处理子页面input时键盘弹出上顶的问题
    };
  },
  components: {},
  provide() {
    return {
      hideListFn() {
        console.log("调用了hideList", this.hideList);
        this.hideList = !this.hideList;
      }
    };
  },
  computed: {
    ...mapState(["userInfo"])
  },
  mounted() {
    // if (!this.userInfo || this.userInfo === "undefined") {
    //   const url = unescape(Utils.getWholeUrl());
    //   const userInfoCookie = JSON.parse(Utils.getCookie("userInfo"));
    //   if (userInfoCookie) {
    //     this.set_userInfo(userInfoCookie);
    //   } else if (url.indexOf("uid") === -1) {
    //     Net.getUserInfo();
    //   } else {
    //     // const uid = Number(url.slice(url.lastIndexOf("=") + 1));
    //     const uid = Utils.getUrlQueryJson().uid;
    //     Net.getUserInfoDetail(uid).then(res => {
    //       const userInfo = res.data.data;
    //       this.set_userInfo(userInfo);
    //       Utils.setCookie("userInfo", JSON.stringify(userInfo));
    //     });
    //   }
    // }
    Utils.userAuthorization(this);
  },
  methods: {
    navMyAudio() {
      this.$router.push("/person/myAudio");
    },
    navMyAudioCollect() {
      this.$router.push("/person/myAudioCollect");
    },
    //浏览我的历史
    navMyBrowseHistory() {
      this.$router.push("/person/myBrowseHistory");
    },
    //常见问题
    navYourQuestions() {
      this.$router.push("/person/yourQuestions");
    },
    //意见反馈
    navFeedback() {
      this.$router.push("/person/yourSuggestion");
    },
    navMoreGame() {
      this.toast = this.$createToast({
        txt: "功能暂未开放",
        type: "txt",
        time: 1000
      });
      this.toast.show();
    },
    ...mapActions(["set_userInfo"])
  }
};
</script>
<style lang="less" scoped>
.person {
  background: #f2f2f2;
  // position: fixed;
  // width: 100%;
  // top: 0px;
  // bottom: 0;
  .personInfo {
    display: flex;
    align-items: center;
    flex-direction: column;
    background: #fff;
    font-size: 22px;
    padding: 20px;
    img {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      margin-bottom: 16px;
    }
  }
  .item-list {
    background: #fff;
    margin-top: 10px;
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      padding-right: 10px;
      height: 60px;
      border-bottom: 1px solid #ccc;
      font-size: 16px;
      color: #666666;
      > div {
        display: flex;
        align-items: center;
        img {
          width: 16px;
          height: 16px;
          margin-right: 10px;
        }
      }
      > img {
        width: 16px;
        height: 16px;
      }
    }
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
