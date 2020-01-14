<template >
  <div class="nothing">
    <img src="../../../common/imgs/defaultAudio.png" alt>
    <p>
      <slot>暂时没有记录哦~</slot>
    </p>
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
    return {
      data: {}
    };
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
.nothing {
  position: absolute;
  text-align: center;
  width: 100%;
  font-size: 16px;
  color: #999;
  top: 3rem;
  img {
    width: 2.5rem;
    height: 2.5rem;
    margin-bottom: 0.3rem;
  }
}
</style>


