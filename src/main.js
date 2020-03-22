import Vue from 'vue'
import Moment from 'moment'
import App from './App.vue'
import i18n from './i18n'
import router from './router'

Vue.config.productionTip = false

Vue.filter('date', value => {
  if (value) {
    return Moment(String(value)).format('DD MMM YYYY, hh:mm')
  }
  return Moment(new Date()).format('DD MMM YYYY, hh:mm')
})

new Vue({
  i18n,
  router,
  render: h => h(App)
}).$mount('#app')
