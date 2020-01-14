import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const index = () => import(/* webpackChunkName: "index" */'../pages/index/index.vue')
const rank = () => import(/* webpackChunkName: "rank" */'../pages/rank/rank.vue')
const rank_spec = () => import(/* webpackChunkName: "rank_spec" */'../pages/rank_spec/rank_spec.vue')
const rank_allSpec = () => import(/* webpackChunkName: "rank_allSpec" */'../pages/rank_allSpec/rank_allSpec.vue')
const rank_good_latestVoice = () => import(/* webpackChunkName: "rank_good_latestVoice" */'../pages/rank_good_latestVoice/rank_good_latestVoice.vue')
const message = () => import(/* webpackChunkName: "message" */'../pages/message/message.vue')
const person = () => import(/* webpackChunkName: "person" */'../pages/person/person.vue')
const myAudio = () => import(/* webpackChunkName: "myAudio" */'../pages/person/sub_page/myAudio.vue')
const myAudioCollect = () => import(/* webpackChunkName: "myAudioCollect" */'../pages/person/sub_page/myAudioCollect.vue')
const myBrowseHistory = () => import(/* webpackChunkName: "myBrowseHistory" */'../pages/person/sub_page/myBrowseHistory.vue')
const yourQuestions = () => import(/* webpackChunkName: "yourQuestions" */'../pages/person/sub_page/yourQuestions.vue')
const yourSuggestion = () => import(/* webpackChunkName: "yourSuggestion" */'../pages/person/sub_page/yourSuggestion.vue')
const sendVoice = () => import(/* webpackChunkName: "sendVoice" */'../pages/sendVoice/sendVoice.vue')
const postDetail = () => import(/* webpackChunkName: "postDetail" */'../pages/postDetail/postDetail.vue')
const floorInput = () => import(/* webpackChunkName: "floorInput" */'../pages/postDetail/sub_page/floorInput.vue')
const floorDetail = () => import(/* webpackChunkName: "floorDetail" */'../pages/postDetail/sub_page/floorDetail.vue')
const reportPolice = () => import(/* webpackChunkName: "reportPolice" */'../pages/postDetail/sub_page/reportPolice.vue')



export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      component: index,
      name: 'index',
    },
    {
      path: '/rank',
      component: rank,
      name: 'rank',
    }, {
      path: '/rank_spec',
      component: rank_spec,
      name: 'rank_spec',
    }, {
      path: '/rank_allSpec',
      component: rank_allSpec,
      name: 'rank_allSpec',
    }, {
      path: '/rank_good_latestVoice',
      component: rank_good_latestVoice,
      name: 'rank_good_latestVoice',
    }, {
      path: '/message',
      component: message,
      name: 'message',
    },
    {
      path: '/person',
      component: person,
      name: 'person',
      children: [
        {
          path: 'myAudio',
          component: myAudio
        },
        {
          path: 'myAudioCollect',
          component: myAudioCollect
        }, {
          path: 'myBrowseHistory',
          component: myBrowseHistory
        },
        {
          path: 'yourQuestions',
          component: yourQuestions
        },
        {
          path: 'yourSuggestion',
          component: yourSuggestion
        },
      ]
    },
    {
      path: '/sendVoice',
      component: sendVoice,
      name: 'sendVoice'
    },
    {
      path: '/postDetail',
      component: postDetail,
      name: 'postDetail',
      meta: {
        hideFooter: true,
      },
      children: [
        {
          path: 'floorInput',
          component: floorInput,
          meta: {
            hideFooter: true,
          },
        }, {
          path: 'floorDetail',
          component: floorDetail,
          meta: {
            hideFooter: true,
          },
        }, {
          path: 'reportPolice',
          component: reportPolice,
          meta: {
            hideFooter: true,
          },
        }
      ]
    },
    //重定向，必须放最后
    {
      path: "*",
      redirect: "/"
    }
  ]
})

