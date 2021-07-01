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
  if(!data){
    return '';
  }
	const nDate=new Date(data);
	const year = nDate.getFullYear();
	const month = nDate.getMonth()+1;
	const day = nDate.getDay();
	return year +'-'+ month +'-'+ day
})
Vue.filter("formatTime",(time)=>{
  if(!time){
    return '';
  }
  const date = new Date(time);
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  
  const t1 = [year, month, day].map(formatNumber).join('-')
  const t2 = [hour, minute, second].map(formatNumber).join(':')
  
  return `${t1} ${t2}`
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
function formatNumber (n) {
  const str = n.toString()
  return str[1] ? n : `0${n}`
}
app.$mount()
