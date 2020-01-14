<template >
  <div class="reportPolice">
    <cube-scroll class="scroll">
      <div class="head">
        <p>举报类型（必选）</p>
        <img src="../imgs/close.png" alt @click="close">
      </div>
      <ul class="tyepChoose">
        <li @click="choose(0)" :class="this.reportType===0?'active':''">垃圾广告</li>
        <li @click="choose(1)" :class="this.reportType===1?'active':''">色情</li>
        <li @click="choose(2)" :class="this.reportType===2?'active':''">内容低俗无意义</li>
        <li @click="choose(3)" :class="this.reportType===3?'active':''">辱骂攻击</li>
        <li @click="choose(4)" :class="this.reportType===4?'active':''">暴露我的隐私</li>
        <li @click="choose(5)" :class="this.reportType===5?'active':''">内容描述不实</li>
        <li @click="choose(6)" :class="this.reportType===6?'active':''">违法国家法律法规</li>
        <li @click="choose(7)" :class="this.reportType===7?'active':''">其他违规</li>
      </ul>
      <div class="write">
        <div>请填写举报内容（选填）</div>
        <div style="position:relative;">
          <textarea name id v-model.trim="messageTxt"></textarea>
          <div class="textLengthTips">{{this.messageTxt.length}}/200</div>
        </div>
        <img :src="canCommit?commitBtn1:commitBtn0" alt @click="submit">
      </div>
    </cube-scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from "vuex";
import Net from "../../../common/js/Net.js";
import Utils from "../../../common/js/Utils.js";
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
      reportType: null, //0:垃圾广告,1:色情,2:内容低俗无意义,3:辱骂攻击,4:暴露我的隐私,5:内容描述不实,6:违法国家法律法规,7:其他违规
      canCommit: false,
      messageTxt: "",
      commitBtn0: require("../../../common/imgs/commitOpinion_disable.png"),
      commitBtn1: require("../../../common/imgs/commitOpinon.png")
    };
  },
  computed: {
    ...mapState(["userInfo"])
  },
  watch: {
    messageTxt: function(value) {
      const MaxTextLength = 200;
      if (value.length > MaxTextLength) {
        this.messageTxt = this.messageTxt.slice(0, MaxTextLength);
      }
    }
  },
  methods: {
    //选择投诉的类型
    choose(type) {
      this.reportType = type;
      this.canCommit = true;
    },
    //提交
    submit() {
      if(!this.userInfo){
        Utils.userAuthorization(this)
        return
      }
      if (this.canCommit) {
        Net.reportPolice(
          this.userInfo.uid,
          Utils.getUrlQueryJson().postid,
          this.reportType,
          this.messageTxt
        ).then(res => {
          this.toast = this.$createToast({
            txt: "举报成功",
            type: "txt",
            time: 800
          });
          this.toast.show();
          const url = Utils.getWholeUrl();
          let timer = setTimeout(() => {
            if (url === Utils.getWholeUrl()) {
              this.$router.go(-1);
            }
            window.clearTimeout(timer);
            timer = null;
          }, 1000);
        });
      } else {
        this.toast = this.$createToast({
          txt: "请选择举报类型",
          type: "txt",
          time: 1500
        });
        this.toast.show();
      }
    },
    //关闭页面
    close() {
      this.$router.go(-1);
    }
  },
  created() {},
  mounted() {},
  destroyed() {}
};
</script>


<style scoped lang="less">
.reportPolice {
  box-shadow: 0px -4px 10px #ddd;
  box-sizing: border-box;
  width: 100%;
  background: #f2f2f2;
  position: fixed;
  left: 0;
  top: 2rem;
  bottom: 0;
  z-index: 3;
  .scroll {
    .head {
      background: #fff;
      color: #666;
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      img {
        width: 16px;
        height: 16px;
      }
    }
    .tyepChoose {
      display: flex;
      flex-wrap: wrap;
      padding: 10px 0 0 10px;
      background: #fff;
      li {
        padding: 10px 20px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 2px;
        margin: 0 10px 10px 0;
      }
    }
    .write {
      background: #fff;
      margin-top: 10px;
      padding: 12px;
      text-align: center;
      padding-bottom: 3rem;
      textarea {
        width: 100%;
        height: 150px;
        font-size: 16px;
      }
      .textLengthTips {
        position: absolute;
        bottom: 10px;
        right: 4px;
        font-size: 15px;
      }
      div:nth-child(1) {
        text-align: left;
        height: 50px;
        line-height: 50px;
        color: #666;
      }
      img {
        width: 100%;
        height: 1rem;
        margin-top: 30px;
      }
    }
  }
  .active {
    color: #3f9bfc;
    border: 1px solid #3f9bfc !important;
  }
}
</style>
