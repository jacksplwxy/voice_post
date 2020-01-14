<template>
  <div class="topicTitle">
    <div class="title">
      <div class="topic">
        <slot name="topic">精选专题</slot>
      </div>
      <div class="nav">
        <slot name="nav">查看全部</slot>
        <img src="../../imgs/arrow.png" alt>
      </div>
    </div>
    <div class="topicDetail">
      <slot name="topicDetail">吐血推荐</slot>
    </div>
  </div>
</template>
    
<style scoped lang="less">
.topicTitle {
  padding: 10px;
  font-size: 13px;
  color: #999;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    .topic {
      font-size: 18px;
      color: #333;
    }
    .nav {
      display: flex;
      align-items: center;
      img {
        width: 14px;
        height: 14px;
        margin-left: 5px;
      }
    }
  }
  .topicDetail {
    border-bottom: 1px solid #ccc;
    padding: 2px 0 15px 0;
  }
}
</style>