<template >
  <div>
    <ul class="scroll-list-wrap" ref="scrollWrap0">
      <cube-scroll :data="listData0" :options="options" @pulling-up="onPullingUp0" ref="scroll0">
        <li class="tab-panel-li" v-for="(item, index) in listData0" :key="index">
          <postBox :baseData="item"></postBox>
        </li>
      </cube-scroll>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState, mapMutations } from "vuex";
import footerTabConfig from "../../common/components/footer/config.js";
import Net from "../../common/js/Net.js";
import postBox from "../../common/components/postBox/postBox";
import Config from "../../common/js/Config";
import Utils from "../../common/js/Utils.js";
export default {
  name: "rank_spec",
  components: {
    postBox
  },
  props: {
    text: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      title: "",
      clientHeight: "",
      page: 0,
      listData0: [],
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
  computed: {},
  watch: {
    // 如果 `clientHeight` 发生改变，这个函数就会运行
    clientHeight: function() {
      this.changeFixed(this.clientHeight);
    },
    $route(to, from) {
      if (to.path.indexOf("rank_spec") !== -1) {
        this.listData0 = []; //相当于新页面
        this.page = 0;
        this.setTabByUrl();
      }
    }
  },
  methods: {
    onPullingUp0() {
      console.log("监听到上拉");
      const type = Utils.getUrlQueryJson().type;
      switch (type) {
        case "singer":
          this.getData(3);
          break;
        case "broadcaster":
          this.getData(2);
          break;
        case "chickenSoup":
          this.getData(1);
          break;
        case "otherVoice":
          this.getData(4);
          break;
        default:
          this.getData(3);
      }
    },
    changeFixed(clientHeight) {
      this.$refs.scrollWrap0.style.height = clientHeight + "px";
    },
    setTabByUrl() {
      const type = Utils.getUrlQueryJson().type;
      switch (type) {
        case "singer":
          this.setTitle("唱歌专区");
          this.getData(3);
          break;
        case "broadcaster":
          this.setTitle("播音主持");
          this.getData(2);
          break;
        case "chickenSoup":
          this.setTitle("治愈系语音");
          this.getData(1);
          break;
        case "otherVoice":
          this.setTitle("其他语音");
          this.getData(4);
          break;
        default:
          this.setTitle("其他语音");
          this.getData(4);
      }
    },
    //获取唱歌数据
    getData(type) {
      this.toast = this.$createToast({
        txt: "加载中.."
      });
      this.toast.show();
      this.page++;
      Net.getSpecList(type, this.page)
        .then(res => {
          this.toast.hide();
          if (this.page <= res.body.last_page) {
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
            this.page--;
            this.$refs.scroll0.forceUpdate();
          }
        })
        .catch(res => {
          this.toast.hide();
          this.page--;
          this.$refs.scroll0.forceUpdate();
        });
    },
    setTitle(title) {
      document.title = title;
    }
  },
  created() {},
  mounted() {
    this.setTabByUrl();
    // 获取浏览器可视区域高度
    this.clientHeight = `${document.documentElement.clientHeight}`; //document.body.clientWidth;
    // 监听窗口变化
    window.onresize = function temp() {
      this.clientHeight = `${document.documentElement.clientHeight}`;
    };
  },
  destroyed() {
    this.setTitle(Config.Title);
  }
};
</script>


<style scoped lang="less">
</style>
