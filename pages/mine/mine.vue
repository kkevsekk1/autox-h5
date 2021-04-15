<template>
  <view class="login-box">
    <view>
      <header>
        <view class="bead">
          <text class="head-portrait">
            <img :src="dataMine.head" alt="" />
          </text>
          <text> ID: {{ dataMine.phone }}</text>
        </view>
        <view class="nav">
          <text>
            <p>{{ dataMine.balance }}</p>
            金额
          </text>
          <text>
            <p>{{ dataMine.performance }}</p>
            总提成
          </text>
          <text>
            <p>{{ dataMine.pfBalance }}</p>
            提成金额
          </text>
        </view>
      </header>
      <article>
        <view>
          会员号<text>{{ dataMine.member }}</text>
        </view>
        <view>
          code<text>{{ dataMine.code }}</text>
        </view>
        <view>
          到期时间<text>{{ dataMine.time }}</text>
        </view>
        <navigator url="/pages/login/login">
          <button class="button" type="default">退出登录</button>
        </navigator>
      </article>
    </view>
  </view>
</template>

<script>
import { request } from '../../server/request.js'
export default {
  created() {
    this.getMine()
  },
  data() {
    return {
      dataMine: {
        head: '../../static/uni.png',
        // name: '金运1122',
        phone: '112233',
        balance: '1.22',
        performance: '333',
        pfBalance: '3334',
        member: '24',
        code: '25',
        time: '2020-01-01',
        surplus: '88888',
      },
    }
  },
  methods: {
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
        url: '/auth/info',
        method: 'get',
        data: '',
      }).then((loadresult) => {
        let { message, code, data } = loadresult.data
        console.log(loadresult.data)
        if (code === 200) {
          let dataMines = this.dataMine
          // dataMines.phone = data.account
          // dataMines.balance = data.balance
          // dataMines.performance = data.commissionBalance
          // dataMines.pfBalance = data.commissionBalance + data.balance
          // dataMines.member = data.id
          // dataMines.code = data.code
          // dataMines.time = data.vipExpirationTime.substring(0, 10)
          // dataMines.surplus = data.scanningTimes
        }
      })
    },
  },
}
</script>

<style scoped>
.login-box {
  background-color: #f5f5f5;
  padding: 0 !important;
}
header {
  height: 430rpx;
  background-color: #007aff;
  color: #fff;
  padding: 20rpx;
}
.bead {
  margin: 20rpx 0;
}
.head-portrait {
  margin: 0 auto;
  width: 147rpx;
  height: 147rpx;
}
.head-portrait img {
  width: 100%;
}
header::after {
  content: '';
  clear: both;
  display: block;
}
header text {
  display: block;
  margin-top: 26rpx;
  text-align: center;
}
.nav {
  display: flex;
  height: 160rpx;
  margin: 56rpx 0 10rpx 0;
}
.nav text {
  flex: 1;
  width: 33%;
  font-size: 26rpx;
  box-sizing: border-box;
  font-weight: 200;
}
.nav text p {
  height: 50rpx;
  margin-bottom: 10rpx;
  font-size: 36rpx;
  font-weight: 900;
}
.nav text:nth-child(2) {
  position: relative;
}
.nav text:nth-child(2)::before,
.nav text:nth-child(2)::after {
  content: '';
  width: 1px;
  height: 40rpx;
  position: absolute;
  top: 32rpx;
  background-color: #6ab1ff;
}
.nav text:nth-child(2)::before {
  left: 0;
}
.nav text:nth-child(2)::after {
  right: 0;
}
article {
  margin: 22rpx;
}
article view {
  height: 100rpx;
  line-height: 100rpx;
  margin: 10rpx 0;
  padding: 0 30rpx;
  background-color: #fff;
  font-size: 30rpx;
  color: #333333;
}
article text {
  float: right;
  color: #bbb;
}
.login-box {
  padding: 40rpx;
  font-size: 28rpx;
  padding-top: 5rpx;
}
.login-box .button {
  background-color: #007aff;
  color: white;
  margin-top: 44rpx;
  font-size: 32rpx;
  height: 100rpx;
  line-height: 100rpx;
}
</style>
