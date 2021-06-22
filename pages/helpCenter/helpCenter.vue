<template>
  <view>
    <view class="head">帮助中心</view>
    <view v-for="(helpCenterData,index) in helpCenterDataList"
          :key="index"
          @click="seekParticular(helpCenterData.title,helpCenterData.content)"
          class="helpCenterTitle">
      <view> {{helpCenterData.title}} </view>
      <view class="iconfont leftArrows ">&#xe603;</view>
    </view>
  </view>
</template>

<script>
import { request } from '../../server/request.js';
export default {
  data () {
    return {
      helpCenterDataList: '',
    }
  },
  created () {
    this.getHelpCenterData()
  },
  methods: {
    getHelpCenterData () {
      uni.showLoading({
        title: '加载中'
      });
      request({
        url: "/doc/getByType?type=帮助",
        method: "get"
      })
        .then(res => {
          uni.hideLoading()
          let { code, data } = res.data
          if (code == 200) {
            this.helpCenterDataList = data
          }
        })
    },
    seekParticular (title, content) {
      let helpCenter = { title: title, content: content }
      uni.setStorageSync("helpCenter", helpCenter)
      uni.navigateTo({
        url: "/pages/helpCenter/particular"
      })
    }
  }
}
</script>

<style>
page {
  background-color: #f5f5f5;
}
.head {
  position: fixed;
  top: 0;
  text-align: center;
  height: 40px;
  line-height: 40px;
  font-size: 20px;
  font-weight: 800;
  width: 100%;
  background: #ececec;
  z-index: 99;
}
.helpCenterTitle {
  position: relative;
  top: 40px;
  margin: 3px 0;
  padding-left: 15px;
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  background: #fff;
}
.leftArrows {
  position: absolute;
  top: 0;
  right: 14px;
  color: #dadada;
}
</style>