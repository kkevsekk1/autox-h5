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
        <view>
          <navigator url="/pages/codeRecords/codeRecords">
            扫码记录
          </navigator>
        </view>
        <view @click="openPopup">
          下载码包
        </view>
        <view>
          <navigator url="/pages/addShop/addShop">
            管理商家
          </navigator>
        </view>
        <view>
          <navigator url="/pages/modifyPassword/modifyPassword">
            修改密码
          </navigator>
        </view>
        <navigator :url="'/pages/login/login?path='+this.$route.path">
          <button class="btn-logout"
                  type="default">退出登录</button>
        </navigator>
      </article>
    </view>

    <!-- 下载代码包弹窗 -->
    <uni-popup ref="popup"
               type='center'>
      <uni-forms :valve="dataMine"
                 ref="form"
                 class="mine-popup">
        <text>确定下载码包</text>
        <uni-forms-item label="下载个数"
                        name="download"
                        required>
          <uni-easyinput type="number"
                         v-model="dataMine.downloadTotal"
                         placeholder="请输入个数" />
        </uni-forms-item>
        <view class="popup-btn">
          <button type="button"
                  @click="closePopup">取消</button>
          <button tyoe="submit"
                  @click="submitForm">下载</button>
        </view>
      </uni-forms>
    </uni-popup>
  </view>
</template>
<script>
import Vue from 'vue'
import { request } from '../../server/request.js';
export default {
  data () {
    return {
      dataMine: {
        head: '../../static/portrait.png',
        name: "粉红色的吹风机",
        phone: '',
        balance: '0',
        performance: '0',
        pfBalance: '0',
        member: '24',
        code: '25',
        time: '2020-01-01',
        downloadTotal: '',
      },
    };
  },
  created () {
    this.getMine();
  },
  methods: {
    openPopup () {
      this.$refs.popup.open();
    },
    closePopup () {
      this.$refs.popup.close()
    },
    getMine () {
      request({
        url: '/auth/info',
        method: 'get',
        data: '',
      }).then((loadresult) => {
        let { message, code, data } = loadresult.data
        // console.log(loadresult.data)
        if (code === 200) {
          let dataMines = this.dataMine
          dataMines.phone = data.account
          dataMines.balance = data.balance === null ? 0 : data.balance;
          dataMines.performance = data.commissionBalance === null ? 0 : data.commissionBalance;
          dataMines.pfBalance = data.commissionBalance + data.balance
          dataMines.member = data.id
          dataMines.code = data.code
          dataMines.time = data.vipExpirationTime.substring(0, 10)
          dataMines.surplus = data.scanningTimes
        }
      })
    },
    submitForm () {
      if (this.dataMine.downloadTotal > 99) {
        uni.showToast({
          title: '图片超出最大范围值',
          icon: 'none',
        });
        this.dataMine.downloadTotal = "";
      } else {
        let token = uni.getStorageSync("token");
        let host = Vue.prototype.baseUrl;
        let url = host + '/qrcode/download?number=' + this.dataMine.downloadTotal + "&token=" + token;
        document.cookie = `authorization=${token}; path=/; domain=${host}; expires=${new Date().getTime() + (1000 * 60)};`;
        window.location.href = url;
        this.dataMine.downloadTotal = 0;
        this.$refs.popup.close();
      }
    }
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
  padding: 10px;
}

.bead {
  margin: 10px 0;
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
  margin-top: 13px;
  text-align: center;
}

.nav {
  display: flex;
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
  margin: 11px;
}

article view {
  position: relative;
  height: 100rpx;
  line-height: 100rpx;
  margin: 5px 0;
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

.mine-box .btn-logout {
  background-color: #007aff;
  color: white;
  margin-top: 44rpx;
  font-size: 32rpx;
  height: 100rpx;
  line-height: 100rpx;
}

/* 弹窗 */
.mine-box .mine-popup {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 50rpx 70rpx;
  text-align: center;
}
.mine-popup text {
  font-size: 34rpx;
  color: #1183ff;
  font-weight: 600;
  margin-bottom: 50rpx;
  display: block;
}
.mine-popup .popup-btn {
  display: flex;
}
.mine-popup button {
  flex: 1;
  width: 240rpx;
  font-weight: 530;
}
.mine-popup button:nth-child(1) {
  margin-right: 30rpx;
  border: 1px solid #ddd;
  color: #999;
}
.mine-popup button:nth-child(2) {
  background-color: #007aff;
  color: #fff;
}
</style>
