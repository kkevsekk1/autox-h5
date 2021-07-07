<template>
  <view class="login-box">
    <view class="login-logo">
      登录界面
    </view>
    <view class="input-list">
      <view :class="error['phone']?'error-phone':''">
        <input placeholder-style="color:#b1acac"
               type="text"
               class="input-class"
               v-model="user.phone"
               placeholder="请输入手机号"
               :class="error['phone']?'border-red':''" />
      </view>
      <uni-row>
        <uni-col :span="16">
          <view :class="error['verifyCode']?'error-verifyCode':''">
            <input placeholder-style="color:#b1acac"
                   type="text"
                   class="input-class"
                   v-model="user.verifyCode"
                   placeholder="请输入密码/验证码"
                   :class="error['verifyCode']?'border-red':''" />
          </view>
        </uni-col>
        <uni-col :span="8">
          <button class="btn-verification"
                  size="mini"
                  v-show="user.getVerification=='getVerify'"
                  @click="getAuth">获取验证码</button>
          <button v-show="user.getVerification=='clickBanned'"
                  size="mini"
                  class="update-verification"
                  style="padding:0">
            重新获取({{user.timeSeconds}}S)
          </button>
        </uni-col>
      </uni-row>
      <view :class="error['inviteCode']?'error-inviteCode':''">
        <input placeholder-style="color:#b1acac"
               type="text"
               class="input-class"
               v-model="user.inviteCode"
               placeholder="首次登录请输入邀请码"
               :class="error['inviteCode']?'border-red':''" />
      </view>
    </view>
    <button @click="loginCheck"
            type="primary"
            class="register">登录</button>
    <view class="detail">
      <view class="detail-title">登录方法</view>
      <view class="detail-nav">
        <view>1.输入您的手机号</view>
        <view>2.第一次登录点击获取【验证码】</view>
        <view>3.收到系统的【短信验证码】即可首次登录</view>
        <view>4.进入系统后可以修改密码，下次可输入密码登录</view>
        <view>5.推荐用户可以永久获得佣金</view>
      </view>
    </view>
  </view>
</template>

<script>
import { request } from '../../server/request.js'
export default {
  data () {
    return {
      error: { phone: "", verifyCode: "", inviteCode: "" },
      path: "",
      pathMin: "",
      user: {
        phone: "",
        verifyCode: "",
        inviteCode: "",
        timeSeconds: "60",
        getVerification: 'getVerify',
      },
    }
  },
  created () {
    uni.removeStorageSync('token')

    this.getStorageSyncData()
  },
  onLoad (option) {
    this.pathMin = option.path
  },
  methods: {
    // 短信验证
    getAuth () {
      if ((/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.user.phone))) {
        this.user.getVerification = 'clickBanned'
        let item = setInterval(() => {
          if (this.user.timeSeconds > 1) {
            this.user.timeSeconds--
          } else {
            this.user.getVerification = 'getVerify'
            this.user.timeSeconds = 60
            clearInterval(item)
          }
        }, 1000);
        request({
          url: '/sms/sendVerifyCode',
          method: "post",
          data: {
            phone: this.user.phone
          }
        })
          .then((loadresult) => {
            if (loadresult.data.code) {
              uni.showToast({
                title: "验证码发送成功",
                icon: "none"
              })
            }
          })
      } else {
        uni.showToast({
          title: "手机号码输入错误",
          icon: "none"
        })
      }
    },
    getStorageSyncData () {
      if (uni.getStorageSync("inviteCode")) {
        console.log(uni.getStorageSync("inviteCode"));
        this.user.inviteCode = uni.getStorageSync("inviteCode");
      }
      if (uni.getStorageSync("userData")) {
        let userList = JSON.parse(uni.getStorageSync("userData"))
        let { phone, verifyCode } = userList
        this.user.phone = phone
        this.user.verifyCode = verifyCode
      }
      if (uni.getStorageSync("pathParameter")) {
        let pathParameter = uni.getStorageSync('pathParameter')
        let path = "/" + pathParameter.route + "?"
        for (const key in pathParameter.options) {
          path += key + '=' + pathParameter.options[key] + "&"
        }
        this.path = path.substring(0, path.length - 1)
      }
    },
    loginCheck () {
      let { phone, verifyCode } = this.user
      if (!phone || !verifyCode) {
        if (!phone) {
          this.error.phone = "true"
        }
        if (!verifyCode) {
          this.error.verifyCode = "true"
        }
      } else {
        this.submitForm()
      }
    },
    submitForm () {
      let { phone, verifyCode, inviteCode } = this.user
      let res = { phone: phone, verifyCode: verifyCode, proxyCode: inviteCode, verifyType: '1' }
      console.log(res)
      request({
        url: '/sms/verification',
        method: 'post',
        data: res
      })
        .then((loadresult) => {
          let { code, message, data } = loadresult.data
          console.log(message)
          if (message == "邀请码错误") {
            this.error.inviteCode = "true"
          }
          uni.showToast({ title: message, icon: 'none' })
          if (code === 200) {
            let user = JSON.stringify(res)
            uni.setStorageSync("userData", user)
            uni.setStorageSync('token', data.token)
            setTimeout(() => {
              if (this.pathMin) {
                uni.reLaunch({ url: this.pathMin })
                return null
              }
              if (this.path && this.path != "pages/login/login") {
                uni.reLaunch({ url: this.path })
              } else {
                uni.reLaunch({ url: "/pages/index/index" })
              }
            }, 2000)
          }
        })
    }
  }
}
</script>

<style>
page {
  background-color: #f5f5f5;
}
.login-box {
  padding: 20px;
  font-size: 28rpx;
}
.login-logo {
  margin-top: 50px;
  font-size: 60rpx;
  font-weight: 700;
  text-align: center;
}
.input-list {
  margin: 50px 0;
}
.input-class {
  margin-bottom: 30px;
  padding-left: 10px;
  height: 40px;
  background-color: #fff;
  border-radius: 5px;
}
.update-verification,
.btn-verification {
  height: 40px;
  line-height: 40px;
  width: 100%;
}
.btn-verification {
  background-color: #409eff;
  color: #fff;
}
.update-verification {
  background-color: #bbbbbb;
  color: #fff;
}
.register {
  background-color: #409eff;
}
.error-phone,
.error-verifyCode,
.error-inviteCode {
  position: relative;
}
.error-phone::after,
.error-verifyCode::after,
.error-inviteCode::after {
  position: absolute;
  top: 42px;
  left: 2px;
  color: red;
}
.error-phone::after {
  content: "请输入用户名";
}
.error-verifyCode::after {
  content: "请输入密码/验证码";
}
.error-inviteCode::after {
  content: "请输入邀请码";
}
.login-box .border-red {
  border: 1px solid red;
  box-sizing: border-box;
}
.detail {
  padding-top: 25px;
}
.detail-title {
  font-size: 14px;
  color: rgb(97, 97, 97);
}
.detail-nav {
  padding-top: 5px;
  font-size: 12px;
  color: #999;
}
.detail-nav view {
  padding: 5px 0;
}
</style>
