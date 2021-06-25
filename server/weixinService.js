
export class WeixinService{

  
  async getSign (url) {
   let res =  await axios.get('http://xcx.ar01.cn/tx/gzh/wx3f4bf3f856017bd4/jssdkSignature?url=' +url);
      return res.data.content;
  }
  setConfig (data) {
    jssdk.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: data.appId, // 必填，公众号的唯一标识
      timestamp: data.timestamp, // 必填，生成签名的时间戳
      nonceStr: data.nonceStr, // 必填，生成签名的随机串
      signature: data.signature, // 必填，签名，见附录1
      jsApiList: ['scanQRCode'], // 必填，需要使用的JS接口列表，所有JS接口列表 例如:previewImage图片预览，openLocation 定位等
      complete: function (res) {
        console.log(res, 'res')
      },
    })
    console.log(jssdk.config)
    return jssdk;
  }
  async setWxJsdk(url){
      let data = await this.getSign(url);
      console.log(data);
     return this.setConfig(data);
  }

}

export  default  new WeixinService();