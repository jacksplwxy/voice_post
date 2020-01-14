<template >
  <div class="rank_allSpec">
    <img src="./imgs/singer.png" alt data-spec="singer" @click="navRankSpec">
    <img src="./imgs/broadcaster.png" data-spec="broadcaster" @click="navRankSpec">
    <img src="./imgs/chickenSoup.png" data-spec="chickenSoup" @click="navRankSpec">
    <img src="./imgs/otherVoice.png" data-spec="otherVoice" @click="navRankSpec">
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name:'rank_allSpec',
  components: {},
  props: {
    text: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {
    navRankSpec(e) {
      const type = e.currentTarget.dataset["spec"];
      this.$router.push({ path: "rank_spec", query: { type } });
    }
  },
  created() {},
  mounted() {}
};
</script>


<style scoped lang="less">
.rank_allSpec {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  img {
    width: 180px;
    height: 160px;
  }
}
</style>
