import Vue from 'vue'
import App from './App'
import './iconfont/iconfont.css';
Vue.config.productionTip = false
let userUrl = 'http://192.168.1.101:9317'
// let userUrl = 'http://192.168.1.26:9317'

App.mpType = 'app'
 const baseUrl = process.env.NODE_ENV === 'development' ? userUrl  : 'http://112.74.161.35:9317'
 Vue.prototype.baseUrl = baseUrl
const app = new Vue({
    ...App
})
app.$mount()
