<template>
	<view class="login-box">
			<view > 
				<header>
					<text>
						<img :src="dataMine.head" alt=""></text>
					<text>{{dataMine.name}}</text>
					<text>{{dataMine.phone}}</text>
					<view class='nav'>
						<text>金额<br>{{dataMine.balance}}</text>
						<text>总提成<br>{{dataMine.performance}}</text>
						<text>提成金额<br>{{dataMine.pfBalance}}</text>
					</view>
				</header>
				<article>
					<view>
						会员号<text>{{dataMine.member}}</text>
					</view>
					<view>
						code<text>{{dataMine.code}}</text>
					</view>
					<view>
						到期时间<text>{{dataMine.time}}</text>
					</view>
					<view>
						剩余扫码次数<text>{{dataMine.surplus}}</text>
					</view>
				</article>
				<navigator url="/pages/login/login">
					<button  class= "button" type="default">退出登录</button>
				</navigator>
			</view>
	</view>
</template>

<script>
		import {request} from '../../server/request.js'
		export default {
			created() {
			      this.getMine()
			    },
			data() {
				return {
					dataMine: {
						head: "../../static/templateHL.png",
						name: "包子馆",
						phone: '112233',
						balance: "1.22",
						performance: '333',
						pfBalance: "3334",
						member: '24',
						code: "25",
						time: '2020-01-01',
						surplus: '88888'
					},
				}
			},
			methods:{
				onPullDownRefresh() {
					this.initialData()
					setTimeout(() => {
						uni.stopPullDownRefresh()
					}, 1000)
				},
				initialData() {
					this.getMine()
				},
				getMine() {
					request({
						url:'/auth/info',
						method: 'get',
						data: ''
					})
					.then((loadresult) => {
						let {message,code,data} = loadresult.data
						console.log(loadresult.data)
						if (code === 200) {
							let dataMines = this.dataMine
							dataMines.phone=data.account;
							dataMines.balance=data.balance
							dataMines.performance=data.commissionBalance
							dataMines.pfBalance=data.commissionBalance + data.balance
							dataMines.member=data.id
							dataMines.code=data.code
							dataMines.time=data.vipExpirationTime.substring(0,10)
							dataMines.surplus=data.scanningTimes
						}
					})
				}
			}
		}
</script>

<style scoped>
	.login-box {
		padding: 40rpx;
		font-size: 28rpx;
		padding-top: 5rpx;
	}
	.login-box .button {
		background-color: #007AFF;
		color: white;
		margin-top: 10px;
	}
	header {
		background-color: #36d48f;
		color: #fff;
		padding: 5rpx 0 5rpx 0;
	}
	header::after {
		content: "";
		clear: both;
		display: block;
	}
	header text {
		display: block;
		margin-top: 14rpx;
		text-align: center;	
	}
	.nav {
		display: flex;
		margin: 10rpx 0 10rpx 0;
	}
	.nav text {
		flex: 1;
		width: 33%;
		font-size: 20rpx;
	}
	.nav text:nth-child(2) {
		border-left: 1rpx solid #fff;
		border-right: 1rpx solid #fff;
		box-sizing: border-box;
		align-items: center;
	}
	article view {
		height: 70rpx;
		line-height: 70rpx;
		font-weight: 800;
		border-bottom: 1px solid  #ccc;
			
	}
	article text {
		float: right;
		font-weight: 500;
		color: #bbb;
	}
</style>
