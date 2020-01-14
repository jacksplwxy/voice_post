<template>
  <cube-tab-bar
    :showSlider="false"
    :useTransition="false"
    :inline="false"
    v-model="selectedLabelSlots"
    @click="clickHandler"
    class="navRank"
  >
    <cube-tab v-for="(item,index) in tabs" :label="item.label" :key="index">
      <img :src="item.img">
      <div>{{item.label}}</div>
    </cube-tab>
  </cube-tab-bar>
</template>

<script>
export default {
  data() {
    return {
      selectedLabelSlots: "新锐榜",
      tabs: [
        {
          label: "新锐榜",
          img: require("../imgs/newerRank.png")
        },
        {
          label: "人气榜",
          img: require("../imgs/hotRank.png")
        },
        {
          label: "女神榜",
          img: require("../imgs/femaleRank.png")
        },
        {
          label: "男神榜",
          img: require("../imgs/maleRank.png")
        }
      ]
    };
  },
  mounted() {},
  methods: {
    clickHandler(label) {
      let type = 0;
      switch (label) {
        case "新锐榜":
          type = 0;
          break;
        case "人气榜":
          type = 1;
          break;
        case "女神榜":
          type = 2;
          break;
        case "男神榜":
          type = 3;
          break;
      }
      this.$router.push({ path: "rank", query: { type } });
    }
  }
};
</script>


<style scoped lang="less">
.navRank {
  background: #fff;
  padding: 6px 0;
  font-size: 16px;
}
img {
  width: 72px;
  height: 72px;
}
.cube-tab_active {
  color: #333;
}
</style>
