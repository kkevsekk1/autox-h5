import Vue from 'vue'
import App from './App'
// import wx from "jwexin-modules";
Vue.config.productionTip = false
// Vue.prototype.$wx = wx;
App.mpType = 'app'
 const baseUrl = process.env.NODE_ENV === 'development' ? 'http://192.168.1.242:9317' : 'http://112.74.161.35:9317'
 Vue.prototype.baseUrl = baseUrl
const app = new Vue({
    ...App
})
app.$mount()
