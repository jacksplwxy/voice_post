<template>
  <div id="app">
    <keep-alive :exclude="['postDetail','sendVoice','myAudio','myAudioCollect']">
      <router-view/>
    </keep-alive>
    <keep-alive>
      <mFooter class="componet" v-show="!$route.meta.hideFooter"></mFooter>
    </keep-alive>
  </div>
</template>
<script>
import mFooter from "./common/components/footer/footer";
export default {
  components: {
    mFooter
  },
  computed: {},
  mounted() {},
  methods: {}
};
</script>
<style lang="less">
.footer {
  position: fixed;
  left: 0px;
  bottom: 0px;
  width: 100%;
  height: 50px;
  background-color: #fff;
  z-index: 9999;
  border-top: 1px solid #ccc;
}
</style>
