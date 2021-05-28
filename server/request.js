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
            console.log(res.data);
            if(res.data.code==-1){
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