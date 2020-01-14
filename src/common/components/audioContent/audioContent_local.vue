<template >
  <div class="audioContent">
    <div class="userInfo">
      <img :src="audioInfo.creater&&audioInfo.creater.avatarUrl" alt class="avatar">
      <div class="textContent">
        <p>{{audioInfo.creater&&audioInfo.creater.nickName}}</p>
        <span>{{audioInfo.creatTime}}</span>
      </div>
    </div>
    <div class="audioInfo" @click="audioPlay">
      <img :src="isPlaying?audioBg.playing:audioBg.static" alt>
      <div class="playTimeContanier">
        {{audioInfo.timeLength}}
        <img src="../../imgs/scend.png" class="second" alt>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from "vuex";
import wx from "weixin-js-sdk";
export default {
  components: {},
  props: {
    audioInfo: {
      type: Object,
      default: {
        creater: {
          avatarUrl: "",
          nickName: "",
          uid: null
        },
        creatTime: "",
        timeLength: 0,
        audioLocalId: null
      }
    }
  },
  data() {
    return {
      isPlaying: false,
      audioBg: {
        static: require("../../imgs/audioPlay.png"),
        playing: require("../../imgs/audioPlaying.gif")
      }
    };
  },
  computed: {},
  watch: {},
  methods: {
    audioPlay() {
      if (!this.isPlaying) {
        wx.playVoice({
          localId: this.audioInfo.audioLocalId
        });
        this.isPlaying = true;
      } else {
        wx.pauseVoice({
          localId: this.audioInfo.audioLocalId
        });
        this.isPlaying = false;
      }
    }
  },
  created() {
    
  },
  mounted() {
    const that = this;
    //监听音频播放完毕
    wx.onVoicePlayEnd({
      success: function(res) {
        console.log(`监听到 ${res.localId}播放完毕`);
        that.isPlaying = false;
      }
    });
  },
  destroyed() {}
};
</script>


<style scoped lang="less">
.audioContent {
  width: 100%;
  font-size: 14px;
  padding-left: 20px;
  box-sizing: border-box;
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
  .audioInfo {
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
