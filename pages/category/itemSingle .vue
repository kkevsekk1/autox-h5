<template>
  <uni-row class="itemSingle-box">
    <uni-col :xs="8"
             :sm="4"
             :lg="2"
             :xl="1"
             class="logo">
      <view @click="$emit('imgClick',item.id)">
        <img :src="itemFirstImage"
             alt="">
      </view>
    </uni-col>
    <uni-col :xs="16"
             :sm="20"
             :lg="22"
             :xl="23"
             style="padding-left:5px;"
             class="content">
      <text class="itemSurplusDays">剩{{itemSurplusDays}}天</text>
      <view class="title"
            style="padding-right:44px;">{{item.title}}</view>
      <view class="subTitle">
        <view>{{item.subTitle}}</view>
        <view>剩余：{{item.surplusStock | formatTotal }} {{item.unit}}</view>
      </view>
      <view class="price">
        <text class="iconfont priceText-icon">&#xe657;</text>
        <text class="priceText">{{item.sellingPrice}}</text>
        <text class="vipPrice">
          <text class="iconfont  subTitle-icon-vip">&#xe601;</text>
          <text class="iconfont priceText-icon">&#xe657;</text>
          <text class="priceText">{{item.vipPrice}}</text>
        </text>
        <input-number class="subTitle-icon-gouwuche"
                      :num="item.buyNunber"
                      :min="0"
                      :max="item.surplusStock"
                      @maximum='maximum(item.surplusStock)'
                      @handleCount="handleCount" />
      </view>
    </uni-col>
  </uni-row>
</template>

<script>
import inputNumber from './inputNumber'
export default {
  components: { inputNumber },
  props: ['item'],
  computed: {
    itemFirstImage () {
      try {
        // console.log(this.item.picture)
        let pictures = JSON.parse(this.item.picture)
        if (pictures && pictures.length > 0) {
          return pictures[0] + '_x.jpg';
        }
      } catch (error) {
      }
      return ''
    },
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
    handleCount (num) {
      let data = {
        num: num,
        itemId: this.item.id
      }
      this.$emit('handleCount', data)
    },
    maximum (surplusStock) {
      uni.showToast({
        title: "已达到库存" + surplusStock + "最大值",
        icon: "none"
      })
    }
  }
}
</script>

<style>
.logo img {
  width: 100%;
  height: 92px;
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
.subTitle-icon-gouwuche {
  float: right;
  transform: translateY(5px);
}
</style>