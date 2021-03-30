<template>
	<view class="container">
		<view class="add-code">
			<button @click="getSign" type="primary" size="mini" style="width:100px;">签名</button>
			<button @click="addCode" type="primary" size="mini" class="add-code-button">添加新码</button></view>
		<view class="code-box">
			<view class="code-list" v-if="codeList.length>0">
				<view v-for="item in codeList" :key="item.id">
					<code-item :code="item" @previewImg="previewImg"></code-item>
				</view>
			</view>
			<view v-else>暂无二维码记录</view>
		</view>
		<view class="img-box" v-if="src">
			<img :src="src" alt="">
		</view>
	</view>
</template>

<script>
	import {request} from '../../server/request.js'
	import codeItem from './code.vue'
	export default {
		components:{codeItem},
		created(){
			// this.getSign()
			this.initialData()
		},
		mounted() {
			console.log(window,jssdk,'ssdk11122')
		},
		data() {
			return {
				src:'',
				codeList:[],
				pages:{index:1,size:5,count:0}
			}
		},
		onReachBottom() {
			// 当前页大于等于总页数
			if (this.pages.index >= this.pages.count) {
				uni.showToast({title: '到底啦',icon: 'none'})
			} else {
				this.pages.index++
				this.getCode()
			}
					// 进入下一页
		},
		onPullDownRefresh() {
			this.initialData()
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1000)
		},
		methods: {
			getSign() {
				axios.get('http://xcx.ar01.cn/tx/gzh/wx3f4bf3f856017bd4/jssdkSignature?url=' + encodeURIComponent(location.href.split('#')[0]))
				  .then(res => {
					  if (res.data.code === '0') {
						  this.setConfig(res.data.content)
						}
					  })
			},
			setConfig(data) {
				jssdk.config({
				    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				    appId: data.appId, // 必填，公众号的唯一标识
				    timestamp: data.timestamp, // 必填，生成签名的时间戳
				    nonceStr: data.nonceStr, // 必填，生成签名的随机串
				    signature: data.signature,// 必填，签名，见附录1
				    jsApiList: ['scanQRCode','previewImage'] ,// 必填，需要使用的JS接口列表，所有JS接口列表 例如:previewImage图片预览，openLocation 定位等
					complete:function(res) {
						console.log(res,'res')
					}
				})
				console.log(jssdk.config)
			},
			previewImg(id) {
				let urls = []
				urls.push(this.baseUrl+'/qrcode/geturlqrcode?id=' +id)
				jssdk.previewImage({
				  current: 0, // 当前显示图片的http链接
				  urls: urls // 需要预览的图片http链接列表
				});
			},
			showImg(shopId) {
				this.src = this.baseUrl+'/qrcode/geturlqrcode?id=' +shopId
				// this.src  = img
			},
			initialData() {
				this.pages.index = 1
				this.codeList = []
				this.getCode()
			},
			getCode() {
				const data = {index: this.pages.index,size: this.pages.size,orderby:'id desc'}
				uni.showLoading({title: '加载中'});
				request({
					url: '/qrcode/page',
					method:'post',
					data: data
					})
					.then((loadresult) => {
						uni.hideLoading()
						let {message,code,data} = loadresult.data
						if (code === 200) {
							this.pages = {count: data.count,index: data.index,size: data.size}
							data.list.forEach(code => {
								code.imgURL = code.imgURL?code.imgURL:'暂未绑定商家二维码'
								this.codeList.push(code)
							})
						}
						if (code === -1) {
							console.log(message,'message')
							uni.showToast({title:message,icon:'none'})
							setTimeout(()=>{
								uni.reLaunch({url:'/pages/login/login'})
							},2000)
						}
				})
			},
			addCode() {
				request({
						url: '/qrcode/precreate',
						method:'post',
						data: {number:1,status:0}
					})
					.then((loadresult) => {
						console.log(loadresult)
					})
			}
		}
	}
</script>

<style>
	.container {
		position: relative;
		padding: 40rpx 20rpx;
		font-size: 14px;
	}
	.img-box {
		position: absolute;
		width: 200px;
		height: 200px;
		top: 50%;
		left: 50%;
	}
	.img-box{width: 100px;height: 100px;}
	.code-box {
		margin-top: 20rpx;
	}
	.add-code {height: 60rpx;}
	.add-code-button {
		width: 200rpx;
		float: right;
	}
</style>
