import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from '@/store'
// import '@mdi/font/css/materialdesignicons.css'

const log = require('electron-log')

Vue.config.productionTip = false

// log.transports.file.level = false
log.transports.console.level = false

Vue.config.errorHandler = err => {
  log.error('Vue Exception: ', err)
}

window.onerror = (message, source, lineno, colno, error) => {
  log.error('window Exception: ', error)
}

log.info('starting the app')

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate () {
    log.info('dispatching newProject')
    this.$store.dispatch('newProject')
  }
}).$mount('#app')
