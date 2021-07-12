<template>
  <view class="buyAbi-box">
    <sum @inputNumber="sumBuyNumber"
         :title="'购买A币'"></sum>
    <view class="payWay">

      <view class="payWay-zfb"
            @click="payWayTypeZFB">
        <text class="iconfont  payWay-iconfont-left"
              style="color:rgb(6, 180, 253);">&#xe65f;</text>
        <text>支付宝</text>
        <text class="iconfont payWay-iconfont-right"
              :class="payWayType === 'zfb'?'payWay-iconfont-color':''">&#xe64b;</text>
      </view>
      <view class="payWay-wx"
            @click="payWayTypeWX ">
        <text class="iconfont payWay-iconfont-left"
              style="color:rgb(9, 187, 7)">&#xe7e5;</text>
        <text>微信</text>
        <text class="iconfont payWay-iconfont-right"
              :class="payWayType === 'wx'?'payWay-iconfont-color':''">&#xe64b;</text>
      </view>
    </view>
    <view class="btn-pay">
      <button :class="buyNumber && payWayType ?'btn-pay-opacity':''"
              @click="buy">立即支付</button>
    </view>
    <view class="payDetailed">
      <view class="payDetailed-title">购买说明：</view>
      <view class="payDetailed-list">
        <view>1.平台支持使用支付宝，微信支付费用，用于购买A币</view>
        <view>2.A 币可用来兑换功能的使用权。</view>
        <view>3.购买的A币 在未使用的情况下可以退货，但平台会扣出部分，（10-20%不等），用于抵扣服务费。</view>
      </view>
    </view>
  </view>
</template>

<script>
import { request } from '../../server/request.js';
import sum from "./sum.vue"
export default {
  components: {
    sum
  },
  data () {
    return {
      buyNumber: "",
      payWayType: "",
    }
  },

  methods: {
    sumBuyNumber (data) {
      this.buyNumber = data.index
    },
    payWayTypeZFB () {
      this.payWayType = 'zfb'
    },
    payWayTypeWX () {
      uni.showToast({
        title: "目前暂不支持微信支付",
        icon: "none"
      })
      return
      this.payWayType = 'wx'
    },
    buy () {
      if (this.buyNumber && this.payWayType) {
        let type = this.payWayType == "zfb" ? '1' : '0'
        request({
          url: "/bill/recharge?amount=" + this.buyNumber + "&type=" + type,
          method: "get"
        })
          .then(res => {
            let { code, message, data } = res.data
            if (code == 200) {
              window.location.href = data.url
            }
            uni.showToast({
              title: message,
              icon: "none"
            })
          })
      }
    }
  }
}
</script>

<style>
page {
  background-color: #f5f5f5;
}
.buyAbi-box {
  padding: 10px;
}

.payWay {
  padding: 0 10px;
  margin: 15px 0;
  border-radius: 10px;
  background-color: #fff;
}
.payWay-zfb {
  border-bottom: 1px solid #f5f5f5;
}
.payWay-zfb text,
.payWay-wx text {
  display: inline-block;
  height: 40px;
  line-height: 40px;
}
.payWay-iconfont-left {
  margin-right: 10px;
  font-size: 25px;
}
.payWay-iconfont-right {
  float: right;
  color: #dbdbdb;
  margin-right: 10px;
}
.payWay-iconfont-color {
  color: #409efe;
}
.btn-pay button {
  color: #fff;
  background-color: #409efe;
  opacity: 0.5;
}
.btn-pay .btn-pay-opacity {
  opacity: 1;
}
.payDetailed {
  margin: 20px 0;
  padding: 20px 10px;
  padding-bottom: 50px;
  background-color: #fff;
  border-radius: 10px;
}
.payDetailed-title {
  font-size: 16px;
}
.payDetailed-list {
  margin-top: 5px;
  margin-left: 5px;
  font-size: 12px;
}
.payDetailed-list view {
  line-height: 20px;
}
</style>