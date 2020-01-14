<template >
  <div class="yourQuestions">
    <div>
      <div class="head">朋友圈语音访客记录常见问题：</div>
      <ul class="content">
        <li v-for="(item, index) in baseData" :key="index">
          <p class="title">{{index+1}}、{{item.title}}</p>
          <p>{{item.content}}</p>
        </li>
      </ul>
      <div class="foot">你还想知道什么？可以留言板反馈给我哦！</div>
    </div>
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
      baseData: [
        {
          title: "怎么查看朋友圈访客记录?",
          content:
            "答:在该小程序录语音分享到朋友圈,下次再点进这条语音就可以看到访客记录了。"
        },
        {
          title: "只能发语音才能看到访客记录吗?",
          content: "答:是的,该功能目前仅限朋友圈语音,文字、图片暂不支持。"
        },
        {
          title: "分享后以前的记录能看到吗?",
          content: "答:记录从分享后开始生效。"
        },
        {
          title: "为什么看不到访客记录?",
          content: "答:这是一个悲伤的故事,暂时还无人访问你。"
        },
        {
          title: "只能看到这条语音的访问记录吗?",
          content:
            "还是只要来过我的朋友圈都有记录?答:只能看到这条语音的记录,不过连语音都要点进来看的人会不看其他动态?确认过眼神,绝对是暗恋你的人。"
        },
        {
          title: "我有朋友看了,还显示无人访问?",
          content: "答:可能对方拒绝了登录授权,获取不到信息,所以无法显示。"
        },
        {
          title: "我的语音,不是好友也能看到吗?",
          content:
            "答:朋友圈的好友都能看,如果访问人数多被推荐到热门,那别人也可以欣赏到你美妙的声音啦!(坐等小哥哥/小姐姐勾搭)"
        },
        {
          title: "别人能看到我的访客记录吗?",
          content: "答:可以的哦，还可以在你的语音下面留言哦。"
        },
        {
          title: "我发过的语音如何删除?",
          content:
            "答:点底部「我的」进入“我的语音”，找到需要删除的语音,点击该条语音右上角的三个圆点进行删除。"
        },
        {
          title: "为什么我录了语音分享到朋友圈,点进来还是录制的页面?",
          content: "答:录制完语音以后,请等几秒再分享就可以了。"
        },
        {
          title: "录制的语音保存多久?",
          content: "答:原则上是永久保存，除非你删除了哦！"
        }
      ]
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
.yourQuestions {
  position: absolute;
  width: 100%;
  top: 0px;
  bottom: 0;
  background: #fff;
  > div {
    box-sizing: border-box;
    background: #fff;
    padding: 10px 20px;
    .head {
      font-size: 18px;
      font-weight: bold;
      height: 60px;
      line-height: 60px;
    }
    .content {
      font-size: 15px;
      color: #666;
      li {
        margin-top: 15px;
        .title {
          font-size: 16px;
          color: #000;
        }
        p:nth-child(2) {
          margin: 5px 0 10px 0;
          line-height: 26px;
        }
      }
    }
    .foot {
      font-size: 16px;
      font-weight: bold;
      height: 60px;
      line-height: 60px;
      padding-bottom: 100px;
    }
  }
}
</style>
