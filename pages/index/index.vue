<template>
	<view class="container">
		<view class="add-code">
			<button @click="getSign" type="primary" size="mini" style="width:100px;">签名</button>
			<button @click="addCode" type="primary" size="mini" class="add-code-button">添加新码</button></view>
		<view class="code-box">
			<view class="code-list" v-if="codeList.length>0">
				<view v-for="item in codeList" :key="item.id">
					<code-item
					:code="item"
					@previewImg="previewImg"
					@showList="showList"
					@identifyCode="identifyCode"></code-item>
				</view>
			</view>
			<view v-else>暂无二维码记录</view>
		</view>
		<view class="img-box" v-if="src">
			<img :src="src" alt="">
		</view>
		<uni-popup ref="popup" type="center">
			<view class="shop-list">
				<uni-indexed-list :options="shopList" :showSelect="false" @click="selectShop"></uni-indexed-list>
			</view>
		</uni-popup>
		
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
			this.getShopList()
		},
		mounted() {
			console.log(window,jssdk,'ssdk11122')
		},
		data() {
			return {
				src:'',
				currentCodeId:undefined,
				shopData:[],
				codeList:[],
				shopList:[],
				bindInfo:{url:'',id:'',type:''},
				codeUrl:'',
				pages:{index:1,size:5,count:0}
			}
		},
		watch:{
			bindInfo: {
				handler(newInfo,old) {
					if (newInfo.type === 1) {
						this.addshopqrcode(newInfo.url,newInfo.id)
					} else if (newInfo.type === 2) {
						this.updateshopqrcode(newInfo.url,newInfo.id)
					}
				},
				deep: true
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
			showList(id) {
				this.$refs.popup.open()
				this.currentCodeId = id
			},
			getShopList() {
				this.shopList = []
				this.shopData = []
				request({
					url: '/auth/getShopPage',
					method:'post',
					data: {index:'1',size:'1000',search:'',orderby:'id desc'}
				})
				.then((loadresult) => {
					let {code,message,data} = loadresult.data
					if (code === 200) {
						let tmplist = []
						data.list.forEach(shop => {
							tmplist.push(shop.name)
							this.shopData.push({shopName:shop.name,shopId:shop.id})
						})
						this.shopList.push({letter:'商家',data:tmplist})
					} else {
						uni.showToast({title:message,icon:'none'})
					}
				})
			},
			selectShop(data) {
				let index = data.item.itemIndex
				let shopInfo = this.shopData[index]
				request({
					url: '/qrcode/bindingshop',
					method:'get',
					data: {shopId:shopInfo.shopId,qrcodeId:this.currentCodeId}
				}).then(result => {
					let {code,message} = result.data
					uni.showToast({title:message,icon:'none'})
					if (code === 200) {
						this.$refs.popup.close()
						this.initialData()
					}
				})
			},
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
				urls.push(this.baseUrl+'/qrcode/geturlqrcode?id=' +id+'.png')
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
								code.url = code.url?code.url:'暂未绑定商家二维码'
								code.shopName = code.shopName?code.shopName:'点击绑定商户'
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
			},
			identifyCode(data) {
				let _this = this
				jssdk.scanQRCode({
					needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
					scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
					success: function (res) {
						var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
						_this.bindInfo = {url:result,type:data.type,id:data.id}
					},
					fail:function(error) {
						uni.showToast({title:error,icon:'none'})
					}
				})
			},
			addshopqrcode(result,id) {
				request({
					url: '/qrcode/addshopqrcode',
					method:'post',
					data: {id:id,url:result}
				})
				.then((loadresult) => {
					uni.showToast({title:loadresult.data.message,icon:'none'})
					if (loadresult.data.code === 200) {
						this.initialData()
					}
				})
			},
			updateshopqrcode(result,id) {
				result = result.split('?code=')[1]
				alert(result,'rsult')
				request({
					url: '/qrcode/update',
					method:'post',
					data: {id:id,newqrCode:result}
				})
				.then((loadresult) => {
					uni.showToast({title:loadresult.data.message,icon:'none'})
					if (loadresult.data.code === 200) {
						this.initialData()
					}
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
	.shop-list {
		box-sizing: border-box;
		font-size: 24rpx;
		padding: 30rpx 25rpx;
		width: 750rpx;
		height: 450rpx;
		background-color: #fff;
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
