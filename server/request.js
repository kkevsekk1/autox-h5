const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:9317' : 'http://112.74.161.35:9317';

function request(options){
	let cookie = uni.getStorageSync('token')
	let { url,data,method } = options;
	data = data || {}
	return new Promise((resolve)=>{
		uni.request({
		    url:  baseUrl+url, 
		    data,
			method:method||"GET",
			header:{authorization:cookie || '',cookie:''},
		    success: (res) => {
				resolve(res)
		    }
		});
	})
}

module.exports = {request: request}