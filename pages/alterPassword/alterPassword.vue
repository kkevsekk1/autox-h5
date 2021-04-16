<template>
  <view class="alterpassword_box">
    <uni-forms :value="Password"
               :rules="rules"
               ref="form">
      <uni-forms-item name="firstPassword"
                      required>
        <uni-easyinput type="password"
                       v-model="Password.firstPassword"
                       placeholder="请输入新密码" />
      </uni-forms-item>
      <uni-forms-item name="againPassword"
                      required>
        <uni-easyinput type="password"
                       v-model="Password.againPassword"
                       placeholder="再次输入新密码" />
      </uni-forms-item>
      <button class="button "
              @click="getPassword"
              type="primary">确认修改</button>
    </uni-forms>
  </view>
</template>

<script>
import { request } from '../../server/request.js'
export default {
  data () {
    return {
      Password: {
        firstPassword: "",
        againPassword: "",
      },
      rules: {
        firstPassword: {
          rules: [{
            minLength: 6,
            errorMessage: '密码不得少于6位数',
          }]
        },
        againPassword: {
          rules: [{
            minLength: 6,
            errorMessage: '密码不得少于6位数',
          }]
        }
      }
    }
  },
  methods: {
    getPassword (form) {
      this.$refs.form.submit().then((res) => {
        if (res.firstPassword === res.againPassword) {
          request({
            url: '/auth/password',
            method: 'post',
            data: { password: this.Password.againPassword },
          })
            .then((loadresult) => {
              uni.showToast({
                title: "密码修改成功",
                icon: "none"
              })
            })
        } else {
          uni.showToast({
            title: "两次输入密码不一致",
            icon: "none"
          })
        }
      })
    },
  }
}
</script>

<style  scoped>
.alterPassword_box {
  margin: 0 auto;
  background-color: #f5f5f5;
}
.alterpassword_box {
  margin: 20px;
  padding: 0 25rpx;
}
.uni-forms-item {
  margin: 10rpx 0;
  background-color: #eeeeee;
  border-radius: 5px;
}
::v-deep .uni-forms-item__inner {
  padding: 0;
}
::v-deep .uni-easyinput__content {
  height: 100rpx;
  padding-left: 15rpx;
  font-size: 30rpx;
}
button {
  background-color: #007aff;
  color: white;
  margin-top: 44rpx;
  font-size: 32rpx;
  height: 100rpx;
  line-height: 100rpx;
}
</style>