<template>
  <view class="controlMine-box">
    <view class="head">
      <uni-row class="user-head">
        <uni-col :span="4"
                 class="img-logo">
          <img :src="logoImg"
               alt="" />
        </uni-col>
        <uni-col :span="15"
                 class="name-code"
                 style="padding: 10px 0 0 15px">
          <view>
            {{ mineData.name }}
          </view>
        </uni-col>
        <uni-col :span="5"
                 class="role"
                 style="padding-top: 10px">
          <text style="float: right"> {{ mineData.role }} </text>
        </uni-col>
      </uni-row>
      <uni-row class="money">
        <uni-col :span="24"
                 class="money-balance">
          <h2>欢迎使用</h2>
        </uni-col>
      </uni-row>
    </view>
    <view class="nav">
      <uni-row class="nav-list">
        <uni-col :xs="8"
                 :sm="6"
                 :md="4"
                 v-for="(functionData, index) in then"
                 :key="index">
          <functionItem :functionData="functionData"
                        class="nav-list-number">
          </functionItem>
        </uni-col>
      </uni-row>
    </view>
    <button class="btn-logout"
            type="default"
            @click="logOff">退出登录</button>
  </view>
</template>

<script>
import { request } from '../../server/request.js'
import functionItem from './functionItem'
export default {
  components: {
    functionItem,
  },
  data () {
    return {
      type: "特价品",
      mineData: '',
      logoImg: '../../static/portrait.png',
      then: [],
      roles: {
        1: '管理员',
        2: '普通用户',
        3: '服务商',
        4: '代理1',
        5: '代理2',
        6: '代理3',
        7: '商户',
      }
    }
  },
  created () {
    this.getMineData()
    this.getColumn(this.type)
  },
  methods: {
    getMineData () {
      uni.showLoading({
        title: '加载中',
      })
      request({
        url: '/auth/userInfoApp',
        method: 'get',
      }).then((res) => {
        let { code, data } = res.data
        uni.hideLoading()
        if (code == 200) {
          let { name, code, balance, role } = data
          role = this.roles[role]
          this.mineData = {
            name: name,
            code: code,
            role: role,
            balance: balance,
          }
        }
      })
    },
    logOff () {
      uni.reLaunch({
        url: '/pages/login/login?path=' + this.$route.path,
      })
    },
    convertContent (content) {
      content = content.replace('{{code}}', this.mineData.code)
      return content
    },
    getColumn (name) {
      request({
        url: '/program/getByName?name=' + name,
        method: 'get',
      }).then((res) => {
        let { code, data } = res.data
        if (code == 200) {
          data.children.forEach((element) => {
            let { type, name, content, icon1, icon2 } = element
            content = this.convertContent(content)
            if (name == '帮助中心') {
              content = content + '?type=' + this.type + '帮助中心'
            }
            this.then.push({
              type: type,
              imgPath: icon1 || icon2,
              functionName: name,
              path: content,
            })
          })
          console.log(this.then, 'then')
        }
      })
    },
  },
}
</script>

<style>
page {
  background-color: #f5f5f5;
}
.controlMine-box {
  padding: 10px;
  background: url(../../static/controlBack.png) no-repeat;
  background-size: 100% 170px;
}
.user-head {
  height: 70;
  margin: 10px 0 15px 0;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}
.img-logo {
  max-width: 70px;
}
.img-logo img {
  width: 100%;
  height: 100%;
}
.name-code view:nth-child(2) {
  font-size: 16px;
  margin-top: 5px;
}
.money {
  display: flex;
  align-items: center;
  height: 80px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0px 0px 8px #888888;
}
.money-balance {
  text-align: center;
}
.money-balance view:nth-child(1) {
  margin-bottom: 4px;
  font-size: 16px;
  font-weight: 700;
}
.money-balance view:nth-child(2) {
  font-size: 14px;
  color: #999;
}
.nav {
  margin: 40px 0;
}
.nav-list-number {
  height: 120px;
  text-align: center;
  background-color: #fff;
  border: 2px solid #f5f5f5;
}
.btn-logout {
  background-color: #409eff;
  color: white;
  margin-top: 22px;
  font-size: 16px;
  height: 50px;
  line-height: 50px;
}
</style>
