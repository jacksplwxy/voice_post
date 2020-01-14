<template>
  <div>
    <cube-tab-bar v-model="selectedLabel" show-slider @click="clickHandler" class="tab-bar">
      <cube-tab v-for="(item, index) in tabs" :label="item.label" :key="index" class="tab"></cube-tab>
    </cube-tab-bar>
    <cube-tab-panels v-model="selectedLabel">
      <cube-tab-panel :label="tabs[0].label">
        <ul class="scroll-list-wrap" ref="scrollWrap0">
          <cube-scroll
            :data="listData0"
            :options="options"
            @pulling-up="onPullingUp0"
            ref="scroll0"
          >
            <li class="tab-panel-li" v-for="(item, index) in listData0" :key="index">
              <postBox :baseData="item"></postBox>
            </li>
          </cube-scroll>
        </ul>
      </cube-tab-panel>
      <cube-tab-panel :label="tabs[1].label">
        <ul class="scroll-list-wrap" ref="scrollWrap1">
          <cube-scroll
            :data="listData1"
            :options="options"
            @pulling-up="onPullingUp1"
            ref="scroll1"
          >
            <li class="tab-panel-li" v-for="(item, index) in listData1" :key="index">
              <postBox :baseData="item"></postBox>
            </li>
          </cube-scroll>
        </ul>
      </cube-tab-panel>
      <cube-tab-panel :label="tabs[2].label">
        <ul class="scroll-list-wrap" ref="scrollWrap2">
          <cube-scroll
            :data="listData2"
            :options="options"
            @pulling-up="onPullingUp2"
            ref="scroll2"
          >
            <li class="tab-panel-li" v-for="(item, index) in listData2" :key="index">
              <postBox :baseData="item"></postBox>
            </li>
          </cube-scroll>
        </ul>
      </cube-tab-panel>
      <cube-tab-panel :label="tabs[3].label">
        <ul class="scroll-list-wrap" ref="scrollWrap3">
          <cube-scroll
            :data="listData3"
            :options="options"
            @pulling-up="onPullingUp3"
            ref="scroll3"
          >
            <li class="tab-panel-li" v-for="(item, index) in listData3" :key="index">
              <postBox :baseData="item"></postBox>
            </li>
          </cube-scroll>
        </ul>
      </cube-tab-panel>
    </cube-tab-panels>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import footerTabConfig from "../../common/components/footer/config.js";
import Net from "../../common/js/Net.js";
import postBox from "../../common/components/postBox/postBox";
import Utils from "../../common/js/Utils.js";

export default {
  name: "rank",
  components: {
    postBox
  },
  data() {
    return {
      clientHeight: "",
      page0: 0,
      page1: 0,
      page2: 0,
      page3: 0,
      listData0: [],
      listData1: [],
      listData2: [],
      listData3: [],
      options: {
        pullUpLoad: {
          threshold: 10,
          txt: {
            more: "上拉加载更多",
            noMore: "没有更多数据"
          }
        }
      },
      selectedLabel: "新锐榜",
      tabs: [
        {
          label: "新锐榜",
          content: []
        },
        {
          label: "人气榜",
          content: []
        },
        {
          label: "女神榜",
          content: []
        },
        {
          label: "男神榜",
          content: []
        }
      ]
    };
  },
  mounted() {
    // 获取浏览器可视区域高度
    this.clientHeight = `${document.documentElement.clientHeight}`; //document.body.clientWidth;
    // 监听窗口变化
    window.onresize = function temp() {
      this.clientHeight = `${document.documentElement.clientHeight}`;
    };
    this.setTabByUrl();
  },
  watch: {
    // 如果 `clientHeight` 发生改变，这个函数就会运行
    clientHeight: function() {
      this.changeFixed(this.clientHeight);
    },
    $route(to, from) {
      if (to.path.indexOf("rank") !== -1) {
        this.setTabByUrl();
      }
    }
  },
  methods: {
    clickHandler(label) {
      switch (label) {
        case "新锐榜":
          if (this.listData0.length === 0) {
            this.getData0();
          }
          break;
        case "人气榜":
          if (this.listData1.length === 0) {
            this.getData1();
          }
          break;
        case "女神榜":
          if (this.listData2.length === 0) {
            this.getData2();
          }
          break;
        case "男神榜":
          if (this.listData3.length === 0) {
            this.getData3();
          }
          break;
      }
    },
    onPullingUp0() {
      console.log("监听到上拉");
      this.getData0();
    },
    onPullingUp1() {
      this.getData1();
    },
    onPullingUp2() {
      this.getData2();
    },
    onPullingUp3() {
      this.getData3();
    },
    changeFixed(clientHeight) {
      this.$refs.scrollWrap0.style.height = clientHeight + "px";
      this.$refs.scrollWrap1.style.height = clientHeight + "px";
      this.$refs.scrollWrap2.style.height = clientHeight + "px";
      this.$refs.scrollWrap3.style.height = clientHeight + "px";
    },
    setTabByUrl() {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      const type = Utils.getUrlQueryJson()
        ? Utils.getUrlQueryJson().type + ""
        : "0";
      switch (type) {
        case "0":
          this.selectedLabel = "新锐榜";
          this.getData0();
          break;
        case "1":
          this.selectedLabel = "人气榜";
          this.getData1();
          break;
        case "2":
          this.selectedLabel = "女神榜";
          this.getData2();
          break;
        case "3":
          this.selectedLabel = "男神榜";
          this.getData3();
          break;
        default:
          this.selectedLabel = "新锐榜";
          this.getData0();
      }
    },
    //获取数据
    getData0() {
      this.toast = this.$createToast({
        txt: "加载中.."
      });
      this.toast.show();
      this.page0++;
      Net.getRankAudioList(0, this.page0)
        .then(res => {
          this.toast.hide();
          if (this.page0 <= res.body.last_page) {
            let result = res.body.data.map((item, index) => {
              return {
                index: index + 1,
                postId: item.list_id, //帖子id
                praiseNum: item.like_count, //点赞数
                listenerNum: item.view_count, //点击数
                remarkNum: item.discuss_count, //回复数
                creater: {
                  //创建者信息
                  uid: item.uid,
                  gender: item.gender, //0表示男，1表示女,2表示未知
                  nickName: item.nickName,
                  avatarUrl: item.avatarUrl
                }
              };
            });
            // 如果有新数据
            this.listData0 = this.listData0.concat(result);
            this.listData0.map((item, index) => {
              item.index = index + 1;
            });
          } else {
            // 如果没有新数据
            this.page0--;
            this.$refs.scroll0.forceUpdate();
          }
        })
        .catch(res => {
          this.toast.hide();
          this.page0--;
          this.$refs.scroll0.forceUpdate();
        });
    },
    //获取数据
    getData1() {
      this.toast = this.$createToast({
        txt: "加载中.."
      });
      this.toast.show();
      this.page1++;
      Net.getRankAudioList(1, this.page1)
        .then(res => {
          this.toast.hide();
          if (this.page1 <= res.body.last_page) {
            let result = res.body.data.map((item, index) => {
              return {
                index: index + 1,
                postId: item.list_id, //帖子id
                praiseNum: item.like_count, //点赞数
                listenerNum: item.view_count, //点击数
                remarkNum: item.discuss_count, //回复数
                creater: {
                  //创建者信息
                  uid: item.uid,
                  gender: item.gender, //0表示男，1表示女,2表示未知
                  nickName: item.nickName,
                  avatarUrl: item.avatarUrl
                }
              };
            });

            // 如果有新数据
            this.listData1 = this.listData1.concat(result);
            this.listData1.map((item, index) => {
              item.index = index + 1;
            });
          } else {
            // 如果没有新数据
            this.page1--;
            this.$refs.scroll1.forceUpdate();
          }
        })
        .catch(res => {
          this.toast.hide();
          this.page1--;
          this.$refs.scroll1.forceUpdate();
        });
    },
    //获取数据
    getData2() {
      this.toast = this.$createToast({
        txt: "加载中.."
      });
      this.toast.show();
      this.page2++;
      Net.getRankAudioList(2, this.page2)
        .then(res => {
          this.toast.hide();
          if (this.page2 <= res.body.last_page) {
            let result = res.body.data.map((item, index) => {
              return {
                index: index + 1,
                postId: item.list_id, //帖子id
                praiseNum: item.like_count, //点赞数
                listenerNum: item.view_count, //点击数
                remarkNum: item.discuss_count, //回复数
                creater: {
                  //创建者信息
                  uid: item.uid,
                  gender: item.gender, //0表示男，1表示女,2表示未知
                  nickName: item.nickName,
                  avatarUrl: item.avatarUrl
                }
              };
            });

            // 如果有新数据
            this.listData2 = this.listData2.concat(result);
            this.listData2.map((item, index) => {
              item.index = index + 1;
            });
          } else {
            // 如果没有新数据
            this.page2--;
            this.$refs.scroll2.forceUpdate();
          }
        })
        .catch(res => {
          this.toast.hide();
          this.page2--;
          this.$refs.scroll2.forceUpdate();
        });
    },
    //获取数据
    getData3() {
      this.toast = this.$createToast({
        txt: "加载中.."
      });
      this.toast.show();
      this.page3++;
      Net.getRankAudioList(3, this.page3)
        .then(res => {
          this.toast.hide();
          if (this.page3 <= res.body.last_page) {
            let result = res.body.data.map((item, index) => {
              return {
                index: index + 1,
                postId: item.list_id, //帖子id
                praiseNum: item.like_count, //点赞数
                listenerNum: item.view_count, //点击数
                remarkNum: item.discuss_count, //回复数
                creater: {
                  //创建者信息
                  uid: item.uid,
                  gender: item.gender, //0表示男，1表示女,2表示未知
                  nickName: item.nickName,
                  avatarUrl: item.avatarUrl
                }
              };
            });

            // 如果有新数据
            this.listData3 = this.listData3.concat(result);
            this.listData3.map((item, index) => {
              item.index = index + 1;
            });
          } else {
            // 如果没有新数据
            this.page3--;
            this.$refs.scroll3.forceUpdate();
          }
        })
        .catch(res => {
          this.toast.hide();
          this.page3--;
          this.$refs.scroll3.forceUpdate();
        });
    }
  }
};
</script>
<style lang="less">
.tab-bar {
  font-size: 16px;
  height: 50px;
}
.tab-panel-li {
  height: 72px;
  background: #fff;
  padding: 0 10px;
}
</style>