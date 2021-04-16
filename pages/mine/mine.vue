<template>
  <view class="mine-box">
    <view>
      <header>
        <view class="bead">
          <text class="head-portrait">
            <img :src="dataMine.head"
                 alt="" />
          </text>
          <text> {{ dataMine.name }} </text>
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
        <navigator url="/pages/codeRecords/codeRecords">
          <view>
            扫码记录
          </view>
        </navigator>
        <view @click="download">
          下载码包
        </view>
        <navigator url="/pages/addShop/addShop">
          <view>
            管理商家
          </view>
        </navigator>
        <navigator url="/pages/alterPassword/alterPassword">
          <view>
            修改密码
          </view>
        </navigator>
        <navigator url="/pages/login/login">
          <button class="button"
                  type="default">退出登录</button>
        </navigator>
      </article>
    </view>

    <!-- 下载代码包弹窗 -->
    <uni-popup ref="popup"
               type='center'
               class="mine_popup">
      <text class="text">确定下载码包</text>
      <uni-forms :valve="dataMine"
                 ref="form">
        <uni-forms-item label="下载个数"
                        required>
          <uni-easyinput type="text"
                         v-model="dataMine.download"
                         placeholder="请输入个数" />
        </uni-forms-item>
      </uni-forms>
      <view class="btn">
        <button>取消</button>
        <button>下载</button>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import {
  request
} from '../../server/request.js'
export default {
  created () {
    this.getMine()
  },
  data () {
    return {
      dataMine: {
        head: '../../static/portrait.png',
        name: "粉红色的大吹风机",
        phone: '112233',
        balance: '1.22',
        performance: '333',
        pfBalance: '3334',
        member: '24',
        code: '25',
        time: '2020-01-01',
        surplus: '88888',
        download: '',
      },
    }
  },
  methods: {
    download () {
      this.$refs.popup.open()
    },
    getMine () {
      request({
        url: '/auth/info',
        method: 'get',
        data: '',
      }).then((loadresult) => {
        let {
          message,
          code,
          data
        } = loadresult.data
        console.log(loadresult.data)
        if (code === 200) {
          let dataMines = this.dataMine
          dataMines.phone = data.account
          dataMines.balance = data.balance
          dataMines.performance = data.commissionBalance
          dataMines.pfBalance = data.commissionBalance + data.balance
          dataMines.member = data.id
          dataMines.code = data.code
          dataMines.time = data.vipExpirationTime.substring(0, 10)
          dataMines.surplus = data.scanningTimes
        }
      })
    },
  },
}
</script>

<style scoped>
.mine-box {
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
  width: 124rpx;
  height: 124rpx;
  border-radius: 50%;
  overflow: hidden;
}

.head-portrait img {
  width: 100%;
}

header text {
  display: block;
  margin-top: 26rpx;
  text-align: center;
}

.nav {
  display: flex;
  height: 160rpx;
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
  content: "";
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
  position: relative;
  height: 100rpx;
  line-height: 100rpx;
  margin: 10rpx 0;
  padding-left: 100rpx;
  background-color: #fff;
  font-size: 30rpx;
  color: #333333;
  background: no-repeat;
  background-position: 20rpx 24rpx;
  background-size: 50rpx;
}
article view::after {
  content: "";
  background: url(../../static/arrows.png) no-repeat;
  background-size: 16rpx 27rpx;
  position: absolute;
  top: 40rpx;
  right: 30rpx;
  width: 16rpx;
  height: 27rpx;
  z-index: 1;
}
article view:nth-child(1) {
  background-image: url(../../static/scan.png);
}
article view:nth-child(2) {
  background-image: url(../../static/download.png);
}
article view:nth-child(3) {
  background-image: url(../../static/management.png);
}
article view:nth-child(4) {
  background-image: url(../../static/password.png);
}

.mine-box {
  padding: 40rpx;
  font-size: 28rpx;
  padding-top: 5rpx;
}

.mine-box .button {
  background-color: #007aff;
  color: white;
  margin-top: 44rpx;
  font-size: 32rpx;
  height: 100rpx;
  line-height: 100rpx;
}

/* 弹窗 */
::v-deep .uni-popup__wrapper-box {
  background: aliceblue;
  border-radius: 10rpx;
  width: 650rpx;
  height: 410rpx;
  text-align: center;
}
.mine_popup .text {
  font-size: 34rpx;
  color: #1183ff;
  font-weight: 600;
  margin: 50rpx 0;
  display: block;
}
::v-deep .is-direction-left {
  padding-left: 80rpx;
}
::v-deep .is-input-border {
  width: 350rpx;
}
.mine_popup .btn {
  display: flex;
  justify-content: space-around;
}
::v-deep .uni-popup__wrapper-box uni-button {
  width: 120px;
  height: 40px;
  line-height: 40px;
  font-weight: 530;
}
::v-deep .uni-popup__wrapper-box uni-button:nth-child(1) {
  background-color: #ffffff;
  border: 1px solid #999999;
  color: #999999;
}
::v-deep .uni-popup__wrapper-box uni-button:nth-child(2) {
  background-color: #007aff;
  color: #fff;
}
</style>
