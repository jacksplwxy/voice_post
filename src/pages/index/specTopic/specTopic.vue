<template>
  <div>
    <topicTitle>
      <div slot="topic">精选专题</div>
      <div slot="nav" @click="navSpecAll">查看全部</div>
      <div slot="topicDetail">编辑吐血推荐，优秀专题集合</div>
    </topicTitle>
    <horizontal></horizontal>
  </div>
</template>
    
<script>
import topicTitle from "../../../common/components/topicTitle/topicTitle";
import horizontal from "./horizontal";
export default {
  components: {
    topicTitle,
    horizontal
  },
  methods: {
    navSpecAll() {
      this.$router.push("rank_allSpec");
    }
  }
};
</script>

<style scoped lang="less">
</style>
