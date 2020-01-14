<template>
  <div class="postBox_person">
    <img class="avatarUrl" v-lazy="baseData.creater.avatarUrl">
    <div class="postBox_person-right" @click="navPostDetail">
      <div class="topDiv">
        <div>{{baseData.creater.nickName?(baseData.creater.nickName+'').slice(0,7):''}}</div>
        <div class="time">{{baseData.creatTime.slice(5,16)}}</div>
      </div>
      <div class="btmDiv">
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
    <div @click="showDelete" class="itemMenu">
      <img src="../../imgs/itemMenu.png" alt>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    baseData: {
      type: Object,
      default: {}
    },
    noClearAll: false //没有清除所有的选项
  },
  mounted() {},
  methods: {
    //跳转到帖子详情页
    navPostDetail() {
      this.$router.push("/postDetail?postid=" + this.baseData.postId);
    },
    showDelete() {
      const that = this;
      this.$createActionSheet({
        title: "确认删除吗？",
        active: 0,
        data: this.noClearAll
          ? [{ content: "删除该条" }]
          : [{ content: "删除该条" }, { content: "清空全部" }],
        onSelect: e => {
          if (e.content === "删除该条") {
            that.$emit("deleteBox", this.baseData.index);
          } else {
            that.$emit("clearAll");
          }
        }
      }).show();
    }
  }
};
</script>
<style lang="less">
.postBox_person {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f5f5f5;
  padding: 10px 0;
  position: relative;

  .avatarUrl {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .postBox_person-right {
    width: 80%;
    .btmDiv {
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
    .topDiv {
      display: flex;
      align-items: center;
      .time {
        background: #cecece;
        color: #fff;
        font-size: 12px;
        padding: 4px 6px;
        border-radius: 3px;
        margin-left: 10px;
      }
    }
  }
  .itemMenu {
    position: absolute;
    right: -10px;
    top: -5px;
    padding: 10px 20px;
    img {
      width: 18px;
      height: 4px;
    }
  }
  // div:nth-child(0) {
  //   width: 100px;
  // }
}
</style>
