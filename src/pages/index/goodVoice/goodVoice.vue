<template>
  <div>
    <topicTitle>
      <div slot="topic">好声音推荐</div>
      <div slot="nav" @click="navRank_good_latestVoice">查看全部</div>
      <div slot="topicDetail">寻找朋友圈里的，优质好声音</div>
    </topicTitle>
    <ul class="listContainer">
      <li v-for="(item, index)  in listData" :key="index">
        <postBox :baseData="item"></postBox>
      </li>
    </ul>
  </div>
</template>
    
<script>
import topicTitle from "../../../common/components/topicTitle/topicTitle";
import postBox from "../../../common/components/postBox/postBox";
import Net from "../../../common/js/Net.js";

export default {
  components: {
    topicTitle,
    postBox
  },
  data() {
    return {
      listData: [],
      page: 0
    };
  },
  computed: {},
  watch: {},
  methods: {
    getDataList() {
      this.page++;
      Net.getIndexRecommendVoice()
        .then(res => {
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
          this.listData = this.listData.concat(result.slice(0, 5));
        })
        .catch(res => {});
    },
    navRank_good_latestVoice() {
      this.$router.push({ path: "rank_good_latestVoice", query: { type: 0 } });
    }
  },
  created() {},
  mounted() {
    this.getDataList();
  }
};
</script>

<style scoped lang="less">
.listContainer li {
  padding: 0 10px;
}
</style>
