<template>
  <view class="sellAbi-box">
    <view @click="$refs.popupAccountList.open()">
      <view>提现到</view>
      <view v-show="account"
            style="padding:10px 0 10px 10px">
        <view class="account-content-col">
          <text> {{account.withdrawName}}（ {{account.withdrawAccount}} ）</text>
          <text class="iconfont account-content-right">&#xe603;</text>
        </view>
        <view class="account-content-bottom">
          <text>预计24小时内到账</text>
        </view>
      </view>
      <view v-show="!account"
            style="padding:10px 0 10px 10px">
        <view class="account-content-col">
          <text> 添加账户</text>
          <text class="iconfont account-content-right">&#xe603;</text>
        </view>
      </view>
    </view>
    <sum @inputNumber="sumSellNumber"
         :balance="balance"
         :title="'退款金额'"></sum>
    <view class="btn-pay">
      <button :class="sellNumber && !isExceed?'btn-pay-opacity':''"
              @click="sell">提交订单</button>
    </view>
    <view class="payDetailed">
      <view class="payDetailed-title">退货退款说明：</view>
      <view class="payDetailed-list">
        <view>1.充值未使用过的A可以申请退货</view>
        <view>2.退货退款服务费，由系统自动扣除（10-20%）</view>
        <view>3.退货退款暂时只支持支付宝</view>
        <view>4.退货退款账号姓名要使用实名，否则会失败</view>
        <view>5.申请后货款会在24小时内到账，未到账及时联系客户</view>
      </view>
    </view>
    <!-- 账户列表弹窗 -->
    <uni-popup ref="popupAccountList"
               type="bottom">
      <view class="popup-account">
        <view class="popup-account-title">选择退款账户</view>
        <view class="popup-account-content">
          <view v-for="(account,index) in accountList"
                :key="index"
                class="account-content-row"
                @click="closeAccountPopup(account,index)">
            <view class="account-content-col">
              <text> {{account.withdrawName}}（ {{account.withdrawAccount}} ）</text>
              <view class="account-content-right">
                <text class="iconfont "
                      :class="index == popupIndex?'account-content-color':''">&#xe64b;</text>
                <text @click.stop="deleteAccount(index)"
                      class="iconfont account-content-delete ">&#xe60b;</text>
              </view>
            </view>
            <view class="account-content-bottom">
              <text>预计24小时内到账</text>
              <text style="float:right;margin-right:10px;"> {{account.withdrawType}} </text>
            </view>
          </view>
          <view style="padding-top:10px"
                @click="popupAddAccount">
            <view class="account-content-col">
              <text> 添加账号</text>
              <text class="iconfont account-content-right">&#xe603;</text>
            </view>
          </view>
        </view>
      </view>
    </uni-popup>
    <!-- 添加账号弹出 -->
    <uni-popup ref="popupAddAccount"
               type="center">
      <view class="addAccount">
        <view class="addAccount-row">
          <text class="addAccount-text-name">名字：</text>
          <input type="text"
                 v-model="addAccount.withdrawName">
        </view>
        <view class="addAccount-row">
          <text class="addAccount-text-name">账号：</text>
          <input type="text"
                 v-model="addAccount.withdrawAccount">
        </view>
        <view class="addAccount-row">
          <text>类型：</text>
          <picker @change="bindPickerChange"
                  :value="addAccountIndex"
                  :range="userType"
                  class="addAccount-picker">
            <view>{{userType[addAccountIndex]}}</view>
          </picker>
        </view>
        <button @click="addAccountClick"
                size="mini"
                class="btn-addAccount">保存</button>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import sum from "./sum.vue"
import { request } from '../../server/request.js';
export default {
  components: {
    sum,
  },
  data () {
    return {
      balance: "",
      popupIndex: "",
      sellNumber: "",
      isExceed: "",
      account: "",
      accountList: [],
      userType: ['微信', '支付宝'],
      addAccountIndex: '0',
      addAccount: {
        withdrawAccount: '',
        withdrawName: '',
        withdrawType: '',
      }
    }
  },
  created () {
    this.userInfoApp()
  },
  methods: {
    bindPickerChange (e) {
      this.addAccountIndex = e.target.value
      this.addAccount.withdrawType = this.userType[e.target.value]
    },
    sumSellNumber (data) {
      this.sellNumber = data.index
      this.isExceed = data.isExceed
    },
    closeAccountPopup (account, popupIndex) {
      this.$refs.popupAccountList.close()
      this.account = account
      this.popupIndex = popupIndex
    },
    userInfoApp () {
      request({
        url: "/auth/userInfoApp",
        method: "get"
      })
        .then(res => {
          let { code, data } = res.data
          if (code == 200) {
            let { withdraws, balance } = data
            this.balance = balance
            this.accountList = withdraws || []
            this.account = this.account || this.accountList[0] || ''
          }
        })
    },
    deleteAccount (index) {
      this.accountList.splice(index, 1)
      this.setAccount(this.accountList, "删除成功")
    },
    popupAddAccount () {
      this.$refs.popupAddAccount.open()
      this.addAccount = []
    },
    addAccountClick () {
      let { withdrawAccount, withdrawName, withdrawType, } = this.addAccount
      if (!withdrawAccount || withdrawAccount == " ") {
        uni.showToast({
          title: "请填写姓名",
          icon: "none"
        })
        return
      }
      if (!withdrawName || withdrawName == " ") {
        uni.showToast({
          title: "请填写账户",
          icon: "none"
        })
        return
      }
      withdrawType = withdrawType || this.userType[0]
      let addAccountData = {
        withdrawAccount: withdrawAccount,
        withdrawName: withdrawName,
        withdrawType: withdrawType
      }
      this.accountList.push(addAccountData)
      this.setAccount(this.accountList, "添加成功")
      this.$refs.popupAddAccount.close()
    },
    setAccount (data, title) {
      request({
        url: "/auth/updateWithdraws",
        method: "post",
        data: data
      })
        .then(res => {
          let { message, code } = res.data
          if (code == 200) {
            uni.showToast({
              title: title,
              icon: "none"
            })
          }
        })
    },
    sell () {
      if (this.sellNumber && !this.isExceed) {
        let data = {
          amount: this.sellNumber,
          withdrawAccount: this.account.withdrawAccount,
          withdrawName: this.account.withdrawName,
          withdrawType: this.account.withdrawType,
        }
        request({
          url: "/bill/withdraw",
          method: "post",
          data: data
        })
          .then(res => {
            let { code, message } = res.data
            if (code == 200) {
              uni.showToast({
                title: "订单提交成功"
              })
              setTimeout(() => {
                location.reload()
              }, 500)
            }
            uni.showToast({
              title: message,
              icon: "none"
            })
          })
      }
    },
  }
}
</script>

<style>
page {
  background-color: #f5f5f5;
}
.sellAbi-box {
  position: relative;
  padding: 10px;
}

.account-content-right {
  position: relative;
  float: right;
  color: #dbdbdb;
  padding-right: 35px;
}
.account-content-color {
  color: #409efe;
}
.account-content-delete {
  position: absolute;
  top: -2px;
  left: 25px;
  font-size: 20px;
  color: red;
}
.btn-pay button {
  margin-top: 20px;
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
.tradeAccount {
  position: absolute;
}
.popup-account {
  background-color: #f5f5f5;
  padding: 10px;
}
.popup-account-title {
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #e3e3e3;
}
.popup-account-content {
  padding: 10px;
  margin: 10px 0;
  border-radius: 10px;
  background-color: #fff;
}
.account-content-row {
  padding: 10px 0;
  border-bottom: 1px solid #e3e3e3;
}
.account-content-col {
  overflow: hidden;
  font-size: 14px;
}
.account-content-bottom {
  overflow: hidden;
  margin-top: 3px;
  font-size: 12px;
  color: #999;
}
.addAccount {
  padding: 30px;
  padding-bottom: 80px;
  font-size: 14px;
  border-radius: 10px;
  background-color: #fff;
}
.addAccount-row input,
.addAccount-picker {
  display: inline-block;
  height: 100%;
  width: 200px;
  font-size: 14px;
  padding-left: 5px;
  border: 1px solid #999;
  border-radius: 10px;
}
.addAccount-row {
  margin-bottom: 10px;
  height: 30px;
  line-height: 30px;
}
.addAccount-text-name {
  position: relative;
  top: -10px;
}
.btn-addAccount {
  position: absolute;
  bottom: 20px;
  right: 30px;
  background-color: #409efe;
  color: #fff;
}
</style>