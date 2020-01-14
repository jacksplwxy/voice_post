
<template>
  <div>
    <div class="scroll-list-wrap" ref="scrollWrap">
      <cube-scroll
        ref="scroll"
        :data="latestVoiceData"
        :options="options"
        @pulling-up="onPullingUp"
      >
        <rankNav></rankNav>
        <specTopic class="componet"></specTopic>
        <goodVoice class="componet"></goodVoice>
        <div class="componet" ref="latestVoice">
          <topicTitle>
            <div slot="topic">最新朋友圈语音</div>
            <div slot="nav" @click="navRank_good_latestVoice">查看全部</div>
            <div slot="topicDetail">最新朋友圈语音，有你喜欢的吗</div>
          </topicTitle>
          <ul class="latestVoiceContainer">
            <li v-for="(item, index)  in latestVoiceData" :key="index">
              <postBox :baseData="item"></postBox>
            </li>
          </ul>
        </div>
      </cube-scroll>
    </div>
  </div>
</template> 
<script>
import wx from "weixin-js-sdk";
import rankNav from "./rankNav/rankNav";
import specTopic from "./specTopic/specTopic";
import goodVoice from "./goodVoice/goodVoice";

import topicTitle from "../../common/components/topicTitle/topicTitle";
import postBox from "../../common/components/postBox/postBox";
import Net from "../../common/js/Net.js";
import Utils from "../../common/js/Utils";

export default {
  name: "index",
  components: {
    rankNav,
    specTopic,
    goodVoice,
    topicTitle,
    postBox
  },
  data() {
    return {
      clientHeight: "", //屏幕高度
      page: 0,
      latestVoiceData: [], // 用来渲染最新朋友圈语音列表的数组
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
  mounted() {
    // 获取浏览器可视区域高度
    this.clientHeight = `${document.documentElement.clientHeight}`; //document.body.clientWidth;
    // 监听窗口变化
    window.onresize = function temp() {
      this.clientHeight = `${document.documentElement.clientHeight}`;
    };
    //加载列表数据
    this.getLatestDataList();
  },
  created() {},
  watch: {
    // 如果 `clientHeight` 发生改变，这个函数就会运行
    clientHeight: function() {
      this.changeFixed(this.clientHeight);
    },
    $route(to, from) {
      if (to.path.indexOf("index") !== -1) {
        this.$refs.scroll && this.$refs.scroll.refresh();
      }
    }
  },
  methods: {
    //动态修改样式
    changeFixed(clientHeight) {
      this.$refs.scrollWrap.style.height = clientHeight + "px";
    },
    // 触发上拉加载
    onPullingUp() {
      console.log("监听到上拉加载");
      this.getLatestDataList();
    },
    getLatestDataList() {
      this.page++;
      Net.getLatestVoice(this.page)
        .then(res => {
          if (this.page <= res.body.data.last_page) {
            let result = res.body.data.data.map((item, index) => {
              return {
                index: "",
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
            this.latestVoiceData = this.latestVoiceData.concat(result);
            // this.latestVoiceData.map((item, index) => {
            //   item.index = index;
            // });
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
    navRank_good_latestVoice() {
      this.$router.push({ path: "rank_good_latestVoice", query: { type: 1 } });
    }
  }
};
</script>


<style lang="less">
.scroll-list-wrap {
  background: #efefef;
}

.componet {
  background: #fff;
  margin-top: 10px;
}

.latestVoiceContainer li {
  padding: 0 10px;
}
</style>
