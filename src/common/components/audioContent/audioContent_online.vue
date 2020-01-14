<template >
  <div class="audioContent">
    <div class="userInfo">
      <img :src="postInfo.creater.avatarUrl" alt class="avatar">
      <div class="textContent">
        <p>{{postInfo.creater.nickName}}</p>
        <span>{{postInfo.creatTime}}</span>
      </div>
    </div>
    <div class="postInfo" @click="audioPlay">
      <img :src="isPlaying?audioBg.playing:audioBg.static" alt>
      <div class="playTimeContanier">
        {{audioDuration}}
        <img src="../../imgs/scend.png" class="second" alt>
      </div>
    </div>
    <audio
      :src="postInfo.content.audioInfo.audioUrl"
      ref="audio"
      @play="onplayCb"
      @pause="onpauseCb"
      @durationchange="ondurationchange"
      autoplay
      duration
      id="audio"
    ></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from "vuex";
import wx from "weixin-js-sdk";
import Utils from "../../js/Utils.js";
import Vue from "vue";
// import audioLoader from "audio-loader";

export default {
  components: {},
  props: {
    postInfo: {}
  },
  data() {
    return {
      isPlaying: false,
      audioDuration: 0,
      audioBg: {
        static: require("../../imgs/audioPlay.png"),
        playing: require("../../imgs/audioPlaying.gif")
      }
    };
  },
  computed: {},
  watch: {},
  methods: {
    //播放或暂停mp3
    audioPlay() {
      if (!this.isPlaying) {
        this.$refs.audio.play();
        if (
          Utils.isIosBrower() &&
          this.postInfo.content.audioInfo.timeLength === 0
        ) {
          let timer0 = setTimeout(() => {
            this.$emit("resetAudioTimeLength", this.audioDuration * 2); //ios是根据采样率计算的，大概是实际的一半长度
            window.clearTimeout(timer0);
            timer0 = null;
          }, 2000);
        }
      } else {
        this.$refs.audio.pause();
      }
    },
    //播放回调事件
    onplayCb() {
      this.isPlaying = true;
    },
    //暂停回调事件
    onpauseCb() {
      this.isPlaying = false;
    },
    ondurationchange() {
      if (!Utils.isIosBrower()) {
        this.audioDuration = Math.round(this.$refs.audio.duration);
      }
    },
    //IOS自动播放补丁
    IOSAutoPlay() {
      document.addEventListener(
        "WeixinJSBridgeReady",
        function() {
          document.getElementById("audio").play();
        },
        false
      );
    }
  },
  created() {
    if (Utils.isIosBrower()) {
      this.audioDuration = this.postInfo.content.audioInfo.timeLength
        ? this.postInfo.content.audioInfo.timeLength
        : Utils.randomNumBoth(3, 18);
    }
  },
  mounted() {
    this.$refs.audio.load();
    if (Utils.isIosBrower()) {
      this.IOSAutoPlay();
    }
  },
  destroyed() {}
};
</script>


<style scoped lang="less">
.audioContent {
  width: 100%;
  font-size: 14px;
  .userInfo {
    display: flex;
    .avatar {
      width: 51px;
      height: 51px;
      border-radius: 50%;
    }
    .textContent {
      margin-left: 10px;
      p {
        font-size: 16px;
        color: #333;
        padding: 8px 5px;
      }
      span {
        color: #ccc;
        padding: 5px;
      }
    }
  }
  .postInfo {
    margin-top: 10px;
    position: relative;
    img {
      width: 80px;
      height: 30px;
    }
    .playTimeContanier {
      position: absolute;
      top: 7px;
      left: 50px;
      color: #fff;
      font-size: 15px;
      .second {
        position: absolute;
        top: -2px;
        right: -7px;
        width: 4px;
        height: 4px;
      }
    }
  }
}
</style>
