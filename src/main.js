import Vue from 'vue'
import App from './App.vue'
import router from './router'
/* elment-UI引入 */
import './plugins/element.js'
/* 全局样式引入 */
import './assets/css/global.css'
/* 引入iconfont */
import './assets/fonts/iconfont.css'

/* axios引入 */
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
