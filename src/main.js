// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'es6-promise/auto'
import App from './App'
import VueMqtt from 'vue-mqtt'
import router from './router'
import vuetify from './plugins/vuetify';
import store from './store'

let options = {clientId: 'WebClient-' + parseInt(Math.random() * 100000),
  username: 'joneill',
  password: '123456'}

/* Vue.use(VueMqtt, 'ws://lxmqtt.aug.ipp.mpg.de:1884', options) */
Vue.use(VueMqtt, 'ws://lxrem.aug.ipp.mpg.de:1884', options)
Vue.use(vuetify)
Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  router,
  vuetify,
  store,
  components: { App }
})
