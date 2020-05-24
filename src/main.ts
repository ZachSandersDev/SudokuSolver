import Vue from 'vue'
import App from './App.vue'
import router from '@/@modules/VuePlugins/router'
import store from '@/@modules/VuePlugins/store'

import '@/@modules/registerServiceWorker'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

import InformedSolver from './@modules/Sudoku/InformedSolver'
new InformedSolver()