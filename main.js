import Vue from 'vue'
import App from './App'
import './iconfont/iconfont.css';
// import wx from "jwexin-modules";
Vue.config.productionTip = false
// Vue.prototype.$wx = wx;
let userUrl = 'http://192.168.1.101:9317'
let fastmock = 'https://www.fastmock.site/mock/36798d2da4981040dc88982f7acbc4b7/ListOfGoods' 

App.mpType = 'app'
 const baseUrl = process.env.NODE_ENV === 'development' ? fastmock  : 'http://112.74.161.35:9317'
 Vue.prototype.baseUrl = baseUrl
const app = new Vue({
    ...App
})
app.$mount()
