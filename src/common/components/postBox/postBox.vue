<template>
  <div class="postBox" @click="navPostDetail">
    <div class="indexNum" ref="indexNum" :data-index="baseData.index">{{baseData.index}}</div>
    <img class="avatarUrl" v-lazy="baseData.creater.avatarUrl">
    <div class="postBox-right">
      <div>{{baseData.creater.nickName?(baseData.creater.nickName+'').slice(0,12):''}}</div>
      <div class="dataDiv">
        <div>
          <img src="../../imgs/listen.png" alt>
          {{baseData.listenerNum}}人偷听
        </div>
        <div>
          <img src="../../imgs/comment.png" alt>
          {{baseData.remarkNum}}条
        </div>
        <div>
          <img src="../../imgs/praise.png" alt>
          {{baseData.praiseNum}}人
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    baseData: {
      type: Object,
      default: {}
    }
  },
  mounted() {
    this.changeIndexColor();
  },
  methods: {
    //跳转到帖子详情页
    navPostDetail() {
      this.$router.push("/postDetail?postid=" + this.baseData.postId);
    },
    changeIndexColor() {
      switch (this.$refs.indexNum.dataset["index"]) {
        case "0":
          this.$refs.indexNum.style.color = "#FD28FC";
          break;
        case "1":
          this.$refs.indexNum.style.color = "#FD972D";
          break;
        case "2":
          this.$refs.indexNum.style.color = "#FECC3B";
          break;
      }
    }
  }
};
</script>
<style lang="less">
.postBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f5f5f5;
  padding: 10px 0;
  font-size: 16px;
  .indexNum {
    text-align: center;
  }
  .avatarUrl {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .postBox-right {
    width: 75%;
    .dataDiv {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 8px;
      font-size: 14px;
      color: #8c8c8c;
      div {
        display: flex;
        align-items: center;
        img {
          width: 12px;
          height: 12px;
          margin-right: 4px;
        }
      }
    }
  }
  // div:nth-child(0) {
  //   width: 100px;
  // }
}
</style>
