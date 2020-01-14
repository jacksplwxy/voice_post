<template >
  <div class="shareGuider">
    <img src="../../imgs/shareGuider.png" alt class="shareIcon">
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from "vuex";
export default {
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
  methods: {},
  created() {},
  mounted() {},
  destroyed() {}
};
</script>


<style scoped lang="less">
.shareGuider {
  width: 100%;
  height: 100%;
  position: absolute;
  background: #000;
  opacity: 0.5;
  z-index: 100;
  top: 0;
  left: 0;
  .shareIcon {
    position: absolute;
    top: 0.1rem;
    right: 0.3rem;
    width: 6rem;
    height: 1.6rem;
  }
}
</style>
