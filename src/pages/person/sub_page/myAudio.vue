<template >
  <div class="myAudio">
    <ul class="scroll-list-wrap" ref="scrollWrap0">
      <cube-scroll :data="listData0" :options="options" @pulling-up="onPullingUp0" ref="scroll0">
        <li class="tab-panel-li" v-for="(item, index) in listData0" :key="index">
          <postBox_person
            :baseData="item"
            ref="postBox_person"
            @deleteBox="deleteBox"
            :noClearAll="true"
          ></postBox_person>
        </li>
      </cube-scroll>
    </ul>
    <nothing v-if="showNothing"></nothing>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState, mapMutations } from "vuex";
import footerTabConfig from "../../../common/components/footer/config.js";
import Net from "../../../common/js/Net.js";
import postBox_person from "../../../common/components/postBox_person/postBox_person";
import Config from "../../../common/js/Config";
import nothing from "../../../common/components/nothing/nothing";
import Utils from '../../../common/js/Utils.js'
export default {
  name: "myAudio",
  components: {
    nothing,
    postBox_person
  },
  props: {
    text: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      clientHeight: "",
      page: 0,
      listData0: [],
      showNothing: false,
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
  computed: { ...mapState(["userInfo"]) },
  watch: {
    // 如果 `clientHeight` 发生改变，这个函数就会运行
    clientHeight: function() {
      this.changeFixed(this.clientHeight);
    }
  },
  methods: {
    onPullingUp0() {
      console.log("监听到上拉");
      this.getData0();
    },
    changeFixed(clientHeight) {
      this.$refs.scrollWrap0.style.height = clientHeight + "px";
    },
    //删除deleteBox
    deleteBox(index) {
      const postId = this.listData0[index]["postId"];
      Net.deleteMyAudio(this.userInfo.uid, postId);
      this.listData0.splice(index, 1);
      this.listData0.forEach((item, index) => {
        item.index = index;
      });
    },
    //获取我的语言数据
    getData0() {
      this.toast = this.$createToast({
        txt: "加载中.."
      });
      this.toast.show();
      this.page++;
      Net.getMyAudio(this.userInfo.uid, this.page)
        .then(res => {
          this.toast.hide();
          if (this.page <= res.body.last_page) {
            let result = res.body.data.map((item, index) => {
              return {
                index,
                postId: item.list_id, //帖子id
                praiseNum: item.like_count, //点赞数
                listenerNum: item.view_count, //点击数
                remarkNum: item.discuss_count, //回复数
                creatTime: item.create_time,
                creater: {
                  //创建者信息
                  uid: item.uid,
                  gender: item.gender, //0表示男，1表示女,2表示未知
                  nickName: item.nickName,
                  avatarUrl: item.avatarUrl
                }
              };
            });
            // 如果有新数据
            this.listData0 = this.listData0.concat(result);
            this.listData0.map((item, index) => {
              item.index = index;
            });
          } else {
            // 如果没有新数据
            this.page--;
            this.$refs.scroll0.forceUpdate();
          }
          if (this.listData0.length === 0) {
            this.showNothing = true;
          }
        })
        .catch(res => {
          this.toast.hide();
          this.page--;
          this.$refs.scroll0.forceUpdate();
        });
    },
    setTitle(title) {
      document.title = title;
    }
  },
  created() {},
  mounted() {
    Utils.userAuthorization(this);
    this.setTitle("我的语音");
    this.getData0();
    // 获取浏览器可视区域高度
    this.clientHeight = `${document.documentElement.clientHeight}`; //document.body.clientWidth;
    // 监听窗口变化
    window.onresize = function temp() {
      this.clientHeight = `${document.documentElement.clientHeight}`;
    };
  },
  destroyed() {
    this.setTitle(Config.Title);
  }
};
</script>



<style scoped lang="less" rel="stylesheet/less">
.myAudio {
  background: #fff;
  position: fixed;
  width: 100%;
  top: 0px;
  bottom: 0;

  .tab-panel-li {
    padding: 5px 12px;
  }
  .noRecord {
    width: 100%;
    height: 100%;
    text-align: center;
    .noneAudio {
      width: 110px;
      height: 110px;
      margin-top: 40%;
    }
    p {
      font-size: 16px;
      color: #e0e0e0;
      margin-top: 10%;
    }
    .sendAudio {
      width: 175px;
      height: 50;
      margin-top: 20%;
    }
  }
}
</style>