<template >
  <div class="footer">
    <ul class="tabs">
      <li
        v-for="(item,index) in footerTabs"
        :key="index"
        ref="tab"
        :data-index="index"
        @click="navPage"
      >
        <img :src="item.img" alt>
        <p>{{item.label}}</p>
      </li>
    </ul>
    <img src="./imgs/sendPost.png" class="chooseVoiceBtn" @click="showAudioType">
    <cube-button class="cube-button"></cube-button>
  </div>
</template>

<script type="text/ecmascript-6">
import tabConfig from "./config.js";
import { types } from "util";
import { mapState, mapMutations } from "vuex";
import Utils from "../../js/Utils.js";
export default {
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapState(["footerTabs"])
  },
  watch: {
    $route(to, from) {
      //根据url设置tab颜色
      const path = to.path;
      if (path.indexOf("index") !== -1) {
        this.set_footerTabs(tabConfig.tab0);
      } else if (path.indexOf("rank") !== -1) {
        this.set_footerTabs(tabConfig.tab1);
      } else if (path.indexOf("message") !== -1) {
        this.set_footerTabs(tabConfig.tab2);
      } else if (path.indexOf("person") !== -1) {
        this.set_footerTabs(tabConfig.tab3);
      } else {
        this.set_footerTabs(tabConfig.tab0);
      }
    }
  },
  methods: {
    //点击tap导航
    navPage(e) {
      switch (e.currentTarget.dataset["index"]) {
        case "0":
          this.set_footerTabs(tabConfig.tab0);
          this.$router.push("/index");
          break;
        case "1":
          this.set_footerTabs(tabConfig.tab1);
          this.$router.push("/rank");
          break;
        case "2":
          this.set_footerTabs(tabConfig.tab2);
          // this.$router.push("/message");
          this.toast = this.$createToast({
            txt: "功能暂未开放",
            type: "txt",
            time: 1000
          });
          this.toast.show();
          break;
        case "3":
          this.set_footerTabs(tabConfig.tab3);
          this.$router.push("/person");
          break;
      }
    },
    //显示音频类型选择
    showAudioType() {
      this.$createActionSheet({
        title: "选择录制的语音类型",
        data: [
          {
            content: "其他",
            align: "center"
          },
          {
            content: "治愈系",
            align: "center"
          },
          {
            content: "播音主持",
            align: "center"
          },
          {
            content: "唱歌",
            align: "center",
            class: ""
          }
        ],
        onSelect: item => {
          let type = 0;
          switch (item.content) {
            case "其他":
              type = 0;
              break;
            case "治愈系":
              type = 1;
              break;
            case "播音主持":
              type = 2;
              break;
            case "唱歌":
              type = 3;
              break;
            default:
              type = 0;
              break;
          }
          this.$router.push({ path: "/sendVoice", query: { type } });
        }
      }).show();
    },
    ...mapMutations({ set_footerTabs: "set_footerTabs" })
  },
  created() {},
  mounted() {}
};
</script>


<style scoped lang="less">
.footer {
  box-shadow: 0px -4px 10px #ddd;
  display: flex;
  align-items: center;
  font-size: 16px;
  img {
    width: 22px;
    height: 22px;
  }
  .tabs {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 20px;
    li {
      text-align: center;
      font-size: 14px;
    }
    li:nth-child(2) {
      margin-right: 60px;
    }
  }
  .chooseVoiceBtn {
    width: 60px;
    height: 60px;
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
  }
  .chooseVoiceWindow {
    width: 100%;
    height: 80px;
    position: absolute;
    top: 10px;
  }
  .cube-button {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
  }
}
</style>
