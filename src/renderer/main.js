import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import bus from './bus'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.prototype.$notify = function(options) {
  bus.$emit('GlobalNotification', options)
}

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
