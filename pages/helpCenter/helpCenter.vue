<template>
  <view>
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
export default {
  data () {
    return {
      helpCenterDataList: ""
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
      uni.request({
        url: "http://yapi.ar01.cn/mock/85/help/list",
        success: (res) => {
          uni.hideLoading()
          this.helpCenterDataList = res.data
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
.helpCenterTitle {
  position: relative;
  margin: 3px 0;
  padding-left: 15px;
  height: 50px;
  line-height: 50px;
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