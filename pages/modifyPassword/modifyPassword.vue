<template>
  <view class="modifypassword_box">
    <uni-forms :modelValue="Password"
               :rules="rules"
               ref="form"
               calss="password-forms">
      <uni-forms-item name="firstPassword">
        <uni-easyinput type="text"
                       v-model="Password.firstPassword"
                       class="easyinput"
                       placeholder="请输入新密码" />
      </uni-forms-item>
      <button class="button-modify "
              @click="submit"
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
      },
      rules: {
        firstPassword: {
          rules: [
            {
              minLength: 6,
              errorMessage: '密码长度不得少于 {minLength}位',
            }
          ]
        },
      }
    }
  },
  methods: {
    submit () {
      this.$refs.form.submit().then(res => {
        if (!res.firstPassword) {
          uni.showToast({
            title: "请输入新密码",
            icon: "none"
          })
          return
        }
        request({
          url: '/auth/password',
          method: 'post',
          data: { password: res.firstPassword },
        })
          .then((loadresult) => {
            uni.showToast({
              title: "密码修改成功",
              icon: "none"
            })
          })
      })
    },
  }
}
</script>

<style scoped>
.modifypassword_box {
  margin: 0 auto;
  background-color: #f5f5f5;
  padding: 0 18px;
  padding-top: 20px;
}
.easyinput {
  background-color: #eeeeee;
  border-radius: 5px;
}
.button-modify {
  margin-top: 22px;
  background-color: #409eff;
}
</style>