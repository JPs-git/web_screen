import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
// 引入bootstrap
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)
import 'bootstrap/dist/css/bootstrap.css' 
import 'bootstrap-vue/dist/bootstrap-vue.css'
// 全局css
import '/src/assets/style/css/new_public.css'
// 引入jQuery
import jquery from 'jquery'
Vue.prototype.jquery = jquery
// 引入Echarts
import echarts from "echarts"
Vue.prototype.$echarts = echarts
// 注册echats地图
import '/src/assets/js/china'
import '/src/assets/js/world4'
// 引入Mockjs，生产环境取消引入
// import '/mock/index.js'
const { mockXHR } = require('../mock')
mockXHR()

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
