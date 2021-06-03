<template>
  <view class="controlMine-box">
    <view class="head">
      <uni-row class="user-head">
        <uni-col :span="4"
                 class="img-logo">
          <img :src="logoImg"
               alt="">
        </uni-col>
        <uni-col :span="15"
                 class="name-code"
                 style="padding: 10px 0 0 15px;">
          <view>
            {{ mineData.name}}
          </view>
          <view>
            您好，您的邀请码: {{ mineData.code}}
          </view>
        </uni-col>
        <uni-col :span="5"
                 class="role"
                 style="padding-top:10px">
          <text> {{mineData.role}} </text>
        </uni-col>
      </uni-row>
      <uni-row class="money">
        <uni-col :span="8"
                 class="money-balance">
          <view> {{mineData.balance}}A币 </view>
          <view>用户余额</view>
        </uni-col>
      </uni-row>
    </view>
    <view class="nav">
      <uni-row class="nav-list">
        <uni-col :xs="8"
                 :sm="6"
                 :md="4"
                 v-for="appData in appDataList"
                 :key="appData.id">
          <open-app :appData="appData"
                    @pitchOn="pitchOn"
                    class="nav-list-number"> </open-app>
        </uni-col>
      </uni-row>
    </view>
    <button class="btn-logout"
            type="default"
            @click="logOff ">退出登录</button>
  </view>
</template>

<script>
import { request } from '../../server/request.js';
import openApp from "./openApp"
export default {
  components: {
    openApp
  },
  data () {
    return {
      mineData: '',
      logoImg: "../../static/portrait.png",
      externalPath: "http://120.25.164.233:8080/appstore/app/20210524111935.apk",
      appDataList: [
        {
          id: "1",
          imgPath: "../../static/buy.png",
          appName: "购买A币"
        },
        {
          id: "2",
          imgPath: "../../static/share.png",
          appName: "推荐朋友"
        },
        {
          id: "3",
          imgPath: "../../static/downloadApp.png",
          appName: "下载更新"
        },
        {
          id: "4",
          imgPath: "../../static/appControl.png",
          appName: "应用商店"
        },
        {
          id: "5",
          imgPath: "../../static/material.png",
          appName: "管理素材"
        },
        {
          id: "6",
          imgPath: "../../static/extractAb.png",
          appName: "提现A币"
        }
      ]
    }
  },
  created () {
    this.getMineData()
  },
  methods: {
    pitchOn (id) {
      let path
      switch (id) {
        case "3":
          path = "/pages/externalLinks/externalLinks?externalPath=" + this.externalPath + "&path="
            + this.$route.path
          break;
        case "4":
          path = "/pages/feature/index"
          break;
        case "5":
          path = "/pages/material/index"
          break;
      }
      uni.navigateTo({
        url: path
      })
    },
    getMineData () {
      request({
        url: '/auth/userInfoApp',
        method: 'get',
        data: '',
      })
        .then(res => {
          let { code, data, message } = res.data
          if (code == 200) {
            console.log(data)
            let { name, code, balance, role } = data
            role = role == '7' ? '普通用户' : '代理商'
            this.mineData = {
              name: name,
              code: code,
              role: role,
              balance: balance
            }
            console.log(this.mineData)
          }
        })
    },
    logOff () {
      uni.reLaunch({
        url: "/pages/login/login?path=" + this.$route.path
      })
    }
  }
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