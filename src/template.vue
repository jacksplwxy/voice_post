<template >
  <div></div>
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
      data: {
        index: 0,
        postId: item.list_id, //帖子id
        floorId: item.comment_id, //楼id
        layerId: item.id, //层id
        replyToId: item.reply_id, //回复给的id
        praiseNum: item.like_count, //点赞数
        listenerNum: item.view_count, //点击数
        remarkNum: item.discuss_count, //回复数
        shareNum: 0, //分享数
        creatTime: "", //创建时间
        replyTime: "", //最后回复时间
        creater: {
          //创建者信息
          uid: item.uid,
          gender: item.gender, //0表示男，1表示女,2表示未知
          nickName: item.nickName,
          avatarUrl: item.avatarUrl
        },
        listenerArr: [
          //收听者详情列表
          {
            uid: 0,
            gender: 0,
            nickName: "",
            avatarUrl: ""
          }
        ],
        content: {
          //帖子包含的内容
          text: "",
          audioInfo: {
            timeLength: 0,
            audioUrl: ""
          },
          imgUrl: ""
        }
      }
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
</style>


