<template>
  <cube-scroll ref="scroll" direction="horizontal" class="horizontal-scroll-list-wrap">
    <ul class="list-wrapper">
      <li
        v-for="(item,index) in items"
        class="list-item"
        :key="index"
        :data-spec="item.spec"
        @click="navRankSpec"
      >
        <img :src="item.img" alt>
      </li>
    </ul>
  </cube-scroll>
</template>

<script type="text/ecmascript-6">
const _data = [
  {
    img: require("../imgs/singer.jpg"),
    spec: "singer"
  },
  {
    img: require("../imgs/broadcaster.jpg"),
    spec: "broadcaster"
  },
  {
    img: require("../imgs/chickenSoup.jpg"),
    spec: "chickenSoup"
  },
  {
    img: require("../imgs/otherVoice.jpg"),
    spec: "otherVoice"
  }
];
export default {
  data() {
    return {
      items: _data
    };
  },
  methods: {
    navRankSpec(e) {
      const type = e.currentTarget.dataset["spec"];
      this.$router.push({ path: "rank_spec", query: { type } });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.horizontal-scroll-list-wrap {
  .cube-scroll-content {
    display: inline-block;
  }

  .list-wrapper {
    padding: 10px;
    white-space: nowrap;
  }

  .list-item {
    display: inline-block;

    img {
      width: 210px;
      height: 125px;
      border-radius: 5px;
      margin: 5px;
    }
  }
}
</style>