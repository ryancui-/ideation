import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import { ipcRenderer } from 'electron'

function send(event, data) {
  return new Promise(resolve => {
    ipcRenderer.once(`${event}_reply`, (e, data) => {
      resolve(data)
    })
    ipcRenderer.send(event, data)
  })
}

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.prototype.$send = send

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
