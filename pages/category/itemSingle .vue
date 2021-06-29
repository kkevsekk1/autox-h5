<template>
  <uni-row class="itemSingle-box">
    <uni-col :span="8"
             class="logo">
      <view @click="$emit('openLogo',item.id)">
        <img :src="item.commodityLogo"
             alt="">
      </view>
    </uni-col>
    <uni-col :span="16"
             style="padding-left:5px;"
             class="content">
      <text class="itemSurplusDays">剩{{itemSurplusDays}}天</text>
      <view class="title"
            style="padding-right:44px;">{{item.title}}</view>
      <view class="subTitle">
        <view>{{item.subTitle}}</view>
        <view>剩余：{{item.surplusStock}} {{item.unit}}</view>
      </view>
      <view class="price">
        <text class="iconfont">&#xe657;</text>
        <text>{{item.sellingPrice}}</text>
        <text class="vipPrice">
          <text class="iconfont  subTitle-icon-vip">&#xe601;</text>
          <text class="iconfont">&#xe657;</text>
          <text>{{item.vipPrice}}</text>
        </text>
        <text class="iconfont subTitle-icon-gouwuche  ">&#xe615;</text>
      </view>
    </uni-col>
  </uni-row>
</template>

<script>
export default {
  props: ['item'],
  computed: {
    itemSurplusDays () {
      return this.surplusDays(this.item.endTime);
    }
  },
  methods: {
    surplusDays (date) {
      let now = new Date()
      let until = new Date(date)
      let days = (until - now) / 1000 / 3600 / 24 + 1
      let surplusTime = Math.floor(days)
      return surplusTime
    },
  }
}
</script>

<style>
.logo img {
  width: 184rpx;
  height: 184rpx;
}
.content {
  position: relative;
}
.content .title {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-weight: 700;
}
.itemSurplusDays {
  position: absolute;
  right: 0;
  font-size: 10px;
  transform: translateY(3px);
}
.content .subTitle {
  font-size: 12px;
  color: #999;
  font-weight: 400;
}
.content .subTitle view {
  margin: 3px 0;
}
.price {
  padding-top: 10px;
  font-size: 16px;
  color: #7425db;
}
.vipPrice {
  padding-left: 5px;
  color: #fa2209;
}
.subTitle-icon-vip {
  display: inline-block;
  font-size: 26px;
  transform: translateY(3px);
}
.subTitle-icon-gouwuche {
  float: right;
  font-size: 20px;
  transform: translateY(5px);
}
</style>