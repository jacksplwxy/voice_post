<template >
  <div class="floorInput">
    <div class="head">
      <div @click.stop="closeComment" class="close">
        <img src="../imgs/close.png" alt>
      </div>
      <p>回复</p>
    </div>
    <div class="content">
      <div v-if="myComment.audioId">
        <img src alt>
      </div>
      <div v-if="myComment.imgId">放置图片</div>
      <textarea
        v-model.trim="content_text"
        placeholder="给你一个神评机会"
        @focus="getFocus"
        @blur="loseFocus"
        @input="inputing"
        v-focus
      ></textarea>
    </div>
    <div class="toolbar">
      <div>
        <!-- <img src="../imgs/starAudio_disable.png" alt @click="starAudio" class="starAudio">
        <img src="../imgs/defaultImg.png" alt @click="uploadImg" class="uploadImg">-->
      </div>
      <img src="../imgs/publish.png" alt @click="pulishContent" class="pulishContent">
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState, mapMutations } from "vuex";
import Net from "../../../common/js/Net";
import Utils from "../../../common/js/Utils";
export default {
  components: {},
  props: {
    text: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      allowPublish: true, //是否允许发表，防止多次发表
      content_text: "",
      replyType: 0 //回复的类型，0表示回复帖子，1表示回复楼，2表示回复层
    };
  },
  directives: {
    focus: {
      // 指令的定义
      inserted: function(el) {
        el.focus();
      }
    }
  },
  computed: {
    ...mapState(["myComment", "userInfo", "postCommentsUpdate"])
  },
  watch: {
    content_text: function() {
      console.log(11111111, this.content_text);
    }
  },
  methods: {
    //回退
    closeComment() {
      this.$router.go(-1);
    },
    //获得焦点事件
    getFocus() {
      let timer = setTimeout(() => {
        document.body.scrollTop = document.documentElement.scrollTop = 150;
        window.clearTimeout(timer);
        timer = null;
      }, 500);
    },
    //失去焦点事件
    loseFocus() {},
    //textarea自动撑开
    inputing() {},
    //开始录音
    starAudio() {},
    //开始上传图片
    uploadImg() {},
    //发表
    pulishContent() {
      if (!this.allowPublish) {
        return;
      }
      if (this.content_text.length === 0) {
        this.toast = this.$createToast({
          txt: "内容不能为空",
          type: "txt",
          time: 500
        });
        this.toast.show();
        return;
      }
      switch (this.replyType) {
        case "0":
          this.reply_post();
          break;
        case "1":
          this.reply_floor();
          break;
        case "2":
          this.reply_layer();
          break;
      }
      //防止重复发表
      this.allowPublish = false;
    },
    //回复帖子
    reply_post() {
      if (!this.userInfo) {
        Utils.userAuthorization(this);
        return;
      }
      const postId = Utils.getUrlQueryJson().postid;
      Net.storeComment_Post(postId, this.userInfo.uid, this.content_text)
        .then(res => {
          this.toast = this.$createToast({
            txt: "回复成功",
            type: "txt",
            time: 800
          });
          this.toast.show();
          //设置为允许更新的状态
          this.set_postCommentsUpdate(true);
          let timer = setTimeout(() => {
            if (Utils.getUrlPathname() === "/dist/postDetail/floorInput")
              this.$router.go(-1);
          }, 800);
        })
        .catch(res => {
          this.toast = this.$createToast({
            txt: "网络错误",
            type: "txt",
            time: 1000
          });
          this.toast.show();
          let timer = setTimeout(() => {
            if (Utils.getUrlPathname() === "/dist/postDetail/floorInput")
              this.$router.go(-1);
          }, 1000);
        });
    },
    //回复楼
    reply_floor() {
      if (!this.userInfo) {
        Utils.userAuthorization(this);
        return;
      }
      const postId = Utils.getUrlQueryJson().postid;
      const floorId = Utils.getUrlQueryJson().floorid;
      Net.storeComment_Floor(
        postId,
        floorId,
        this.userInfo.uid,
        this.content_text
      )
        .then(res => {
          this.toast = this.$createToast({
            txt: "回复成功",
            type: "txt",
            time: 800
          });
          this.toast.show();
          //设置为允许更新的状态
          this.set_postCommentsUpdate(true);
          let timer = setTimeout(() => {
            if (Utils.getUrlPathname() === "/dist/postDetail/floorInput")
              this.$router.go(-1);
          }, 800);
        })
        .catch(res => {
          this.toast = this.$createToast({
            txt: "网络错误",
            type: "txt",
            time: 1000
          });
          this.toast.show();
          let timer = setTimeout(() => {
            if (Utils.getUrlPathname() === "/dist/postDetail/floorInput")
              this.$router.go(-1);
          }, 1000);
        });
    },
    //回复层
    reply_layer() {
      if (!this.userInfo) {
        Utils.userAuthorization(this);
        return;
      }
      const postId = Utils.getUrlQueryJson().postid;
      const floorId = Utils.getUrlQueryJson().floorid;
      const layerId = Utils.getUrlQueryJson().layerid;
      Net.storeComment_Layer(
        postId,
        floorId,
        layerId,
        this.userInfo.uid,
        this.content_text
      )
        .then(res => {
          this.toast = this.$createToast({
            txt: "回复成功",
            type: "txt",
            time: 800
          });
          this.toast.show();
          //设置为允许更新的状态
          this.set_postCommentsUpdate(true);
          let timer = setTimeout(() => {
            if (Utils.getUrlPathname() === "/dist/postDetail/floorInput")
              this.$router.go(-1);
          }, 800);
        })
        .catch(res => {
          this.toast = this.$createToast({
            txt: "网络错误",
            type: "txt",
            time: 1000
          });
          this.toast.show();
          let timer = setTimeout(() => {
            if (Utils.getUrlPathname() === "/dist/postDetail/floorInput")
              this.$router.go(-1);
          }, 1000);
        });
    },

    ...mapMutations(["set_myComment", "set_postCommentsUpdate"])
  },
  created() {
    this.replyType = Utils.getUrlQueryJson().replytype;
  },
  mounted() {},
  destroyed() {}
};
</script>


<style scoped lang="less">
.floorInput {
  box-shadow: 0px -4px 10px #ddd;
  box-sizing: border-box;
  width: 100%;
  background: #fff;
  position: absolute;
  left: 0;
  top: 250px;
  bottom: 0;
  z-index: 6;
  .head {
    background: #fff;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: left;
    border-bottom: 1px solid #ccc;
    position: relative;
    .close {
      position: absolute;
      top: 3px;
      left: -5px;
      padding: 15px 25px;
      img {
        width: 16px;
        height: 16px;
      }
    }
    p {
      width: 100px;
      text-align: center;
      font-size: 20px;
      margin: 0 auto;
    }
  }
  .content {
    background: #fff;
    box-sizing: border-box;
    padding: 20px 10px;
    textarea {
      border: 0;
      resize: none;
      outline: none;
      width: 100%;
      font-size: 16px;
      box-sizing: border-box;
      word-break: break-all;
      overflow: hidden;
      height: 2rem;
    }
  }
  .toolbar {
    background: #fff;
    box-sizing: border-box;
    width: 100%;
    height: 50px;
    position: absolute;
    left: 0;
    bottom: 0;
    border-top: 1px solid #ccc;
    box-shadow: 0px -4px 10px #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 40px;
    .starAudio {
      width: 16px;
      height: 25px;
      margin-right: 40px;
    }
    .uploadImg {
      width: 28px;
      height: 25px;
    }
    .pulishContent {
      width: 50px;
      height: 30px;
    }
  }
}
</style>
