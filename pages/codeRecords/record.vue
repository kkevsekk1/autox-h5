<template>
  <view class="record-info">
    <view class="record-header">
      <text>ip地址：{{record.ip}}</text>
      <view><img src="../../static/phone.png">
        <view class="record-ua">{{record.userAgent}}</view>
      </view>
    </view>
    <view class="record-content">
      <view style="margin-top:20rpx;">扫码时间：{{record.createTime}}</view>
      <view style="line-height:80rpx;">商家名称：<text class="record-shopname">{{record.shopName}}</text></view>
      <view style="margin-bottom: 20rpx">口令 </view>
      <view>{{record.word}}</view>
    </view>
  </view>
</template>

<script>
export default {
  props: ['record'],
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>

<style>
page {
  background-color: #f4f4f5;
}
.record-info {
  margin-top: 20rpx;
  box-sizing: border-box;
  padding: 20rpx;
  background-color: #fff;
  border: 1rpx solid white;
  border-radius: 10rpx;
  font-size: 24rpx;
}
.record-header {
  display: flex;
  height: 60rpx;
  width: 100%;
  justify-content: space-between;
  line-height: 60rpx;
  align-items: center;
}
.record-header text {
  color: #007aff;
  font-size: 26rpx;
}
.record-header view {
  height: 60rpx;
}
.record-header .record-ua {
  float: right;
  color: #999999;
  font-size: 24rpx;
}
.record-header view img {
  display: inline-block;
  width: 15rpx;
  height: 24rpx;
  margin-top: 20rpx;
}
.record-content .record-shopname {
  color: #007aff;
}
</style>
