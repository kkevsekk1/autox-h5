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
        <text class="iconfont priceText-icon">&#xe657;</text>
        <text class="priceText">{{item.sellingPrice}}</text>
        <text class="vipPrice">
          <text class="iconfont  subTitle-icon-vip">&#xe601;</text>
          <text class="iconfont priceText-icon">&#xe657;</text>
          <text class="priceText">{{item.vipPrice}}</text>
        </text>
        <view class="subTitle-icon-gouwuche">
          <text class="iconfont  "
                v-show="clickbBuy=='1'"
                @click="item.buyNunber--">&#xeb41;</text>
          <input type="number"
                 v-show="clickbBuy=='1'"
                 v-model="item.buyNunber"
                 maxlength="3">
          <text class="iconfont "
                :class="{subTitleTranslateY:clickbBuy=='1'}"
                @click="item.buyNunber++">&#xe615;</text>
        </view>
      </view>
    </uni-col>
  </uni-row>
</template>

<script>
export default {
  props: ['item'],
  data () {
    return {
      clickbBuy: "0"
    }
  },
  watch: {
    'item.buyNunber' () {
      this.shopBuy()
    }
  },
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
    shopBuy () {
      this.clickbBuy = '1'
      if (this.item.buyNunber < 0) {
        this.item.buyNunber = 0
        return
      }
      if (this.item.buyNunber == 1000) {
        this.item.buyNunber = 999
      }
    }
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
  color: #9266f9;
}
.vipPrice {
  padding-left: 5px;
  color: #ff4b36;
}
.subTitle-icon-vip {
  display: inline-block;
  font-size: 22px;
  transform: translateY(3px);
}
.subTitle-icon-gouwuche {
  float: right;
  transform: translateY(5px);
}
.subTitle-icon-gouwuche text:nth-child(1) {
  display: inline-block;
  font-size: 20px;
  transform: translateY(-2px);
}
.subTitle-icon-gouwuche input:nth-child(2) {
  display: inline-block;
  width: 25px;
  text-align: center;
  font-size: 14px;
  padding: 0 5px;
  color: #000;
}
.subTitle-icon-gouwuche text:nth-child(3) {
  display: inline-block;
  font-size: 18px;
}
.subTitleTranslateY {
  transform: translateY(-3px);
}
.priceText {
  font-size: 16px;
  font-weight: 700;
}
.priceText-icon {
  font-size: 12px;
  font-weight: 700;
}
</style>