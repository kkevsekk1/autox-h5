<template>
	<view class="container">
		<view class="record-box">
			
			
			<view class="record-list" v-if="datas.length>0">
				<view v-for="item in datas" :key="item.id">
					<view class="record-info">
						<view class="record-header">
							<text>口令类型：{{item.type}}</text>
							<text @click="bindWord(item)" >口令内容：{{item.content}} --(绑定口令)</text>
						</view>
						<view class="record-content">
							<view style="margin-top:20rpx;">创建时间：{{item.createTime}}</view>
							<view style="line-height:80rpx;">商家名称：{{item.publisherName}}</view>
						</view>
					</view>
				</view>
			</view>
			<view v-else>暂无扫码记录</view>
		</view>
	</view>
</template>

<script>
	import {request} from '../../server/request.js'
	import {formatTime} from '../../utils/format.js'
	export default {
		created(){
			this.initialData()
		},
		data() {
			return {
				datas:[],
				pages:{index:1,size:5,count:0}
			}
		},
		onReachBottom() {
			// 当前页大于等于总页数
			if (this.pages.index >= this.pages.count) {
				uni.showToast({title: '到底啦',icon: 'none'})
			} else {
				this.pages.index++
				this.getDatas()
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
			initialData() {
				this.pages.index = 1;
				this.datas = [];
				this.getDatas();
			},
			getDatas() {
				const data = {index: this.pages.index+'',size: this.pages.size+'',orderby:'id desc'}
				uni.showLoading({title: '加载中'});
				request({
					url: '/word/pagetoshop',
					method:'post',
					data: data
					})
					.then((loadresult) => {
						uni.hideLoading()
						let {message,code,data} = loadresult.data
						if (code === 200) {
							this.pages = {count: data.count,index: data.index,size: data.size}
							data.list.forEach(record => {
								record.createTime = formatTime(record.createTime)
								this.datas.push(record)
							})
						}
						if (code === -1) {
							uni.showToast({title:message,icon:'none'})
							setTimeout(()=>{
								uni.reLaunch({url:'/pages/login/login'})
							},2000)
						}
				})
			},
			bindWord(word){
				uni.showLoading({title: '领取中'});
				request({
					url: '/word/release?id='+word.id,
					method:'get',
					})
					.then((loadresult) => {
						uni.hideLoading()
						let {message,code,data} = loadresult.data
						if (code === 200) {
							uni.showToast({title:message,icon:'none'});
							this.pages = {count: data.count,index: data.index,size: data.size}
							data.list.forEach(record => {
								record.createTime = formatTime(record.createTime)
								this.datas.push(record)
							})
						}
						if (code === -1) {
							uni.showToast({title:message,icon:'none'})
							setTimeout(()=>{
								uni.reLaunch({url:'/pages/login/login'})
							},2000)
						}
				})
				
				
			}
		}
	}
</script>

<style>
	page{background-color: #f8f8f8;}
	.container {
		position: relative;
		padding: 40rpx 20rpx;
		font-size: 14px;
	}
	.record-box {
		margin-top: 20rpx;
	}
</style>
