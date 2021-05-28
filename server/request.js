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
          try {
            if(res.data.code==-1){
              let pathParameter =  { 
                options:getCurrentPages()[0].options,
                route:getCurrentPages()[0].route}
              uni.setStorageSync("pathParameter",pathParameter)
              setTimeout(() => {
                uni.reLaunch({ url: '/pages/login/login' })
              }, 2000);
              return null;
            }
          } catch (error) {
          }
				resolve(res)
		    }
		});
	})
}

module.exports = {request: request}