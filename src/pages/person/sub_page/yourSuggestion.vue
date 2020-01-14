<template >
  <div class="yourSuggestion">
    <cube-scroll class="scroll">
      <p class="tips">感谢使用语言朋友圈，我们欢迎任何反馈和建议。</p>
      <textarea autofocus placeholder="您的建议.." v-model.trim="messageTxt"></textarea>
      <p class="personInfoTitle">个人微信</p>
      <input type="text" v-model.trim="personTxt">
      <div class="commit" @click="submit" @blur="hideListFn" @focus="hideListFn">提交</div>
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
      messageTxt: "",
      personTxt: ""
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
    },
    personTxt: function(value) {
      const MaxTextLength = 100;
      if (value.length > MaxTextLength) {
        this.personTxt = this.personTxt.slice(0, MaxTextLength);
      }
    }
  },
  inject: ["hideListFn"],
  methods: {
    //提交
    submit() {
      if (this.messageTxt.length > 9) {
        Net.setSuggestion(
          this.userInfo.uid,
          this.messageTxt,
          this.personTxt
        ).then(res => {
          this.toast = this.$createToast({
            txt: "提交成功",
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
          }, 2000);
        });
      } else {
        this.toast = this.$createToast({
          txt: "内容不能少于10个字",
          type: "txt",
          time: 1500
        });
        this.toast.show();
      }
    }
  },
  created() {
    this.hideListFn();
  },
  mounted() {
    Utils.userAuthorization(this);
  },
  destroyed() {}
};
</script>


<style scoped lang="less">
.yourSuggestion {
  position: absolute;
  width: 100%;
  top: 0px;
  bottom: 0;
  background: #ebebeb;
  padding: 20px 10px;
  box-sizing: border-box;
  font-size: 18px;
  .tips {
    font-size: 15px;
    color: #333;
    line-height: 50px;
  }
  textarea {
    border-radius: 5px;
    background: #fff;
    width: 100%;
    height: 200px;
    border: none;
    outline: none;
    box-sizing: border-box;
    font-size: 16px;
    padding: 10px;
  }
  .personInfoTitle {
    font-size: 16px;
    color: #333;
    line-height: 50px;
    margin-top: 10px;
  }
  input {
    box-sizing: border-box;
    border-radius: 5px;
    background: #fff;
    width: 100%;
    height: 50px;
    line-height: 50px;
    padding: 0 10px;
    outline: none;
    border: none;
    font-size: 16px;
  }
  .commit {
    width: 100%;
    height: 60px;
    line-height: 60px;
    text-align: center;
    background: #4d9efc;
    color: #fff;
    border-radius: 10px;
    font-size: 20px;
    margin-top: 50px;
    margin-bottom: 200px;
  }
}
</style>


