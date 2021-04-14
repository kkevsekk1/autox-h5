import Vue from 'vue'

function request(options){
	let cookie = uni.getStorageSync('token')
	let { url,data,method } = options;
	data = data || {}
	return new Promise((resolve)=>{
		uni.request({
		    url:  Vue.prototype.baseUrl+url, 
		    data,
			method:method||"GET",
			header:{authorization:cookie || '',cookie:''},
		    success: (res) => {
          if(res.data.code === -1){
            console.log(res.data.message, 'message')
            uni.showToast({ title: res.data.message, icon: 'none' })
            setTimeout(() => {
              uni.reLaunch({ url: '/pages/login/login' })
            }, 2000)
          }else if(res.data.code != 200){
            console.log(res.data.message, 'message')
            uni.showToast({ title:res.data.message, icon: 'none' })
          }else{
            resolve(res)
          }
		    }
		});
	})
}

module.exports = {request: request}