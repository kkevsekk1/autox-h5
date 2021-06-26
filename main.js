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
Vue.filter("formatDate",(data)=>{
	const nDate=new Date(data);
	const year = nDate.getFullYear();
	const month = nDate.getMonth()+1;
	const day = nDate.getDay();
	return year +'-'+ month +'-'+ day
})
Vue.filter("formatTotal",(data)=>{
  if(Number(data)>1000000){
    return  (data/1000000.0).toFixed(2)+'m'
  }
	if(Number(data)>10000){
    return  (data/1000.0).toFixed(2)+'w'
  }
  if(Number(data)>1000){
    return  (data/100.0).toFixed(2)+'k'
  }
  return data;
})
app.$mount()
