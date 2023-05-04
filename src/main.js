import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueParticles from 'vue-particles'
import store from './store'
import axios from "axios"
import vuetify from './plugins/vuetify'
import dataV from '@jiaminghi/data-view'
Vue.use(dataV)
var dayjs = require('dayjs');
Vue.prototype.dayjs = dayjs
Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(VueParticles)
Vue.prototype.$axios = axios;
Vue.use(ElementUI,{size:'small'});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  beforeCreate(){
      Vue.prototype.$bus=this //安装全局事件总线，$bus就是当前应用的vm
  },
}).$mount('#app')
