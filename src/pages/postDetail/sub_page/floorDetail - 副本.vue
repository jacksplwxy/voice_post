<template >
  <div class="floorDetail scroll-list-wrap" ref="scrollWrap" v-if="floorDetailMain">
    <cube-scroll ref="scroll" :data="commentFloorInfo" :options="options" @pulling-up="onPullingUp">
      <div class="head">
        {{floorDetailMain.remarkNum}}条回复
        <img src="../imgs/close.png" class="close" @click="close">
      </div>
      <div class="mainComment">
        <div class="floorBox">
          <img :src="floorDetailMain.creater.avatarUrl" alt class="avatarUrl">
          <div class="floorBox-text">
            <div class="userInfo">
              <div>
                <p>
                  <span>{{floorDetailMain.creater.nickName}}</span>
                  <img :src="floorDetailMain.creater.gender===0?genderImg0:genderImg1" alt>
                </p>
                <p>{{floorDetailMain.creatTime}}</p>
              </div>
              <div>
                <img src="../../../common/imgs/praise.png" alt>
                <span>{{floorDetailMain.praiseNum}}</span>
              </div>
            </div>
            <div class="comment">{{floorDetailMain.content.text}}</div>
          </div>
        </div>
        <div>精彩评论</div>
      </div>

      <ul class="commentList" v-if="commentFloorInfo.length">
        <li v-for="(item, index)  in commentFloorInfo" :key="index">
          <floorBox :commentItemInfo="item" @click="startInput"></floorBox>
        </li>
      </ul>
    </cube-scroll>

    <div class="inputMessage"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from "vuex";
import Utils from "../../../common/js/Utils.js";
import Net from "../../../common/js/Net.js";
import floorBox from "../../../common/components/floorBox/floorBox";
export default {
  components: { floorBox },
  props: {},
  data() {
    return {
      page: 0,
      commentFloorInfo: [],
      genderImg0: require("../../../common/imgs/male.png"),
      genderImg1: require("../../../common/imgs/female.png"),
      //屏幕高度
      clientHeight: "",
      options: {
        pullUpLoad: {
          threshold: 10,
          txt: {
            more: "上拉加载更多",
            noMore: "没有更多数据"
          }
        }
      }
    };
  },
  computed: {
    ...mapState(["floorDetailMain"])
  },
  watch: {
    // 如果 `clientHeight` 发生改变，这个函数就会运行
    clientHeight: function() {
      this.changeFixed(this.clientHeight);
    }
  },
  methods: {
    //根据floorId获取层评论信息列表
    getFloorCommentList() {
      const floorId = Utils.getUrlQueryJson().floorid;
      this.page++;
      Net.getAudioComment_layer(floorId, this.page).then(res => {
        if (Math.random() > 0.001) {
          // 如果有新数据
          this.commentFloorInfo = this.commentFloorInfo.concat(res.data);
        } else {
          // 如果没有新数据
          this.page--;
          this.$refs.scroll.forceUpdate();
        }
      });
    },
    //回复
    startInput() {},
    //关闭
    close() {
      this.$router.go(-1);
    },
    //动态修改样式
    changeFixed(clientHeight) {
      console.log("this.$refs.scrollWrap", this.$refs.scrollWrap);
      this.$refs.scrollWrap.style.height = clientHeight + "px";
    },
    // 触发上拉加载
    onPullingUp() {
      console.log("监听到上拉加载");
      this.getFloorCommentList();
    }
  },
  created() {},
  mounted() {
    this.getFloorCommentList();
    // 获取浏览器可视区域高度
    this.clientHeight = `${document.documentElement.clientHeight}`;
    // 监听窗口变化
    window.onresize = function temp() {
      this.clientHeight = `${document.documentElement.clientHeight}`;
    };
  },
  destroyed() {}
};
</script>


<style scoped lang="less">
.floorDetail {
  box-sizing: border-box;
  width: 100%;
  background: #f4f4f4;
  position: fixed;
  left: 0;
  top: 2rem;
  bottom: 0;
  z-index: 3;
  .head {
    background: #fff;
    height: 40px;
    line-height: 40px;
    position: relative;
    text-align: center;
    border-bottom: 1px solid #ccc;
    .close {
      position: absolute;
      width: 15px;
      height: 15px;
      top: 12px;
      right: 20px;
    }
  }
  .mainComment {
    background: #fff;
    padding: 10px;
    .floorBox {
      padding: 10px 0;
      display: flex;
      .avatarUrl {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 0.2rem;
      }
      .floorBox-text {
        padding-top: 6px;
        .userInfo {
          display: flex;
          justify-content: space-between;
          align-items: center;
          div:nth-child(1) {
            font-size: 16px;
            img {
              width: 26px;
              height: 15px;
              margin-left: 10px;
            }
            p:nth-child(2) {
              font-size: 14px;
              color: #999;
              margin-top: 5px;
            }
          }
          div:nth-child(2) {
            font-size: 16px;
            color: #999;
            display: flex;
            align-items: center;
            img {
              width: 16px;
              height: 16px;
              margin-right: 5px;
            }
          }
        }
        .comment {
          margin-top: 15px;
          font-size: 18px;
        }
      }
    }
  }
  .commentList {
    margin-top: 10px;
    background: #fff;
    padding: 0 10px;
    li {
      border-top: 1px solid #ccc;
    }
    li:nth-child(1) {
      border: none;
    }
  }
}
</style>
