<template>
	<view class="record-info">
		<view class="record-header">
			<text>ip地址：{{record.ip}}</text>
			<text>手机标识：{{record.userAgent}}</text>
		</view>
		<view class="record-content">
			<view style="margin-top:20rpx;">扫码时间：{{record.createTime}}</view>
			<view style="line-height:80rpx;">商家名称：{{record.shopName}}</view>
			<view>口令：</view>
			<view>{{record.word}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:['record'],
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.record-info{
		margin-top: 20rpx;
		box-sizing: border-box;
		padding:20rpx;
		background-color: #fff;
		border: 1px solid #ccc;
		border-radius: 8rpx;
	}
	.record-header {
		display: flex;
		justify-content: space-between;
	}
</style>
