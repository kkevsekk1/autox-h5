<template>
	<view class="code-info">
		<text style="font-size: 26rpx;font-weight: bold;text-align: left;">{{code.shopName}}</text>
		<view class="code-content">
			<view class="code-id">
				<text style="flex:1" @click="downImg">二维码code:{{code.id}}</text>
				<view>
					<button @click="$emit('previewImg',code.id)" type="primary" class="preview-button" size="mini">预览</button>
					<button @click="bindCode" type="primary" class="bind-code-button" size="mini" plain>绑定新码</button>
				</view>
			</view>
			<view class="code-url">
				<text style="flex:1">{{code.imgURL}}</text>
				<button @click="identifyCode" class="identify-code-button" size="mini">识别商家二维码</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {request} from '../../server/request.js'
	export default {
	  props:['code'],
	  methods:{
		  downImg() {
			  uni.downloadFile({
			        url: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2151136234,3513236673&fm=26&gp=0.jpg', //仅为示例，并非真实的资源
				    success: (res) =>{
			          	if (res.statusCode === 200){
			          		this.saveImg(res.tempFilePath)
			          	}
			      },
				  fail:(error) => {
					  console.log(error,'error')
				  }
			  });
		  },
		  saveImg(url) {
			  var oA = document.createElement("a");
			  	oA.download = '';// 设置下载的文件名，默认是'下载'
			  	oA.href = url;
			  	document.body.appendChild(oA);
			  	oA.click();
			  	oA.remove(); // 下载之后把创建的元素删除
				uni.showToast({title:'下载成功',icon:'none'})
		  },
		  bindCode() {
			  
		  },
		  identifyCode() {
			  jssdk.scanQRCode({
			    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
			    scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
			    success: function (res) {
			      var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
				  uni.showToast({
				  	title:res
				  })
			    }
			  });
		  }
	    }
	}
</script>

<style>
	.code-info{
		margin-top: 20rpx;
		box-sizing: border-box;
		padding:20rpx;
		background-color: #fff;
		border: 1px solid #ccc;
		border-radius: 8rpx;
	}
	.code-id,.code-url{display: flex;justify-content: space-between;}
	.code-id {padding: 20rpx 0;}
	.preview-button {width: 140rpx;}
	.bind-code-button{width: 180rpx;margin-left:10rpx;}
	.identify-code-button {width: 260rpx;}
</style>
