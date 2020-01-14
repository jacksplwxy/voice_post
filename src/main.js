
import Vue from 'vue'
import './cube-ui'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import './common/less/init.less'
import VueResource from 'vue-resource'
import Utils from './common/js/Utils'
import Utils_bus from './common/js/Utils_bus'



//显示代码环境
console.log('当前代码环境为：', process.env.NODE_ENV)
//阻止 vue 在启动时生成生产提示
Vue.config.productionTip = false
//设置首页浏览历史
Utils_bus.setReturnHistory()
//第三方http库
Vue.use(VueResource);
//在引入fastclick之后，ios会有一个副作用：input输入框需要连续点击两次或者长按才能获取焦点，此为补丁方案
fastclick.prototype.focus = function (targetElement) {
  var length;
  // Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
  if (Utils.isIosBrower === true && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
    length = targetElement.value.length;
    targetElement.focus();
    targetElement.setSelectionRange(length, length);
  } else {
    targetElement.focus();
  }
};
//添加fastclick
fastclick.attach(document.body)
//设置默认图片
Vue.use(VueLazyload, {
  loading: require('./common/imgs/default.png'),
  error: require('./common/imgs/default.png'),
})
//IOS浏览器，只需要在app入口进行一次校验，其他页面也都能使用jssdk授权
if (Utils.isIosBrower() === true) {
  console.log("IOS浏览器JSSDK开始校验...");
  Utils.verifyWxSdkSignature()
}
//自动获取焦点
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})


const vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export default vue

