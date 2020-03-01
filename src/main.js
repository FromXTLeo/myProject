import Vue from 'vue'
import App from './App.vue'
import router from './router'
/* elment-UI引入 */
import './plugins/element.js'
/* 全局样式引入 */
import './assets/css/global.css'
/* axios引入 */
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
