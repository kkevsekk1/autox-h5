<template>
  <view class="login-box">
    <uni-forms :value="user"
               ref="form"
               :rules="rules">
      <h2 class="login-header">账号登录</h2>
      <uni-forms-item label="用户名"
                      name="phone"
                      required>
        <uni-easyinput type="text"
                       v-model="user.phone"
                       placeholder="用户名" />
      </uni-forms-item>
      <uni-forms-item label="密码"
                      name="verifyCode"
                      required>
        <uni-easyinput type="password"
                       v-model="user.verifyCode"
                       placeholder="密码" />
      </uni-forms-item>
      <button @click="submitForm"
              type="primary">登录</button>
    </uni-forms>
  </view>
</template>

<script>
import { request } from '../../server/request.js'
export default {
  data () {
    return {
      user: { phone: '', verifyCode: '' },
      rules: {
        phone: {
          rules: [{ required: true, errorMessage: '请输入正确的用户名' }]
        },
        verifyCode: {
          rules: [{ required: true, errorMessage: '请输入密码' }, {
            minLength: 6,
            errorMessage: '密码不得少于6位数',
          }]
        }
      }
    }
  },
  created () {
    uni.removeStorageSync('token')
  },
  methods: {
    submitForm (form) {
      this.$refs.form.submit().then((res) => {
        request({
          url: '/sms/verification',
          method: 'post',
          data: res
        })
          .then((loadresult) => {
            let { code, message, data } = loadresult.data
            uni.showToast({ title: message, icon: 'none' })
            if (code === 200) {
              uni.setStorageSync('token', data.token)
              setTimeout(() => {
                uni.reLaunch({ url: '/pages/index/index' })
              }, 2000)
            }
          })
      })
    }
  }
}
</script>

<style>
.login-box {
  padding: 40rpx;
  font-size: 28rpx;
}
.login-header {
  font-weight: bold;
  font-size: 48rpx;
  line-height: 80rpx;
  text-align: center;
  margin-bottom: 20rpx;
}
</style>
