<template>
  <view @click="pitchOn">
    <view class="nav-type">
      <view>
        <img :src="appData.imgPath"
             alt="">
      </view>
      <view> {{appData.appName}} </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    appData: {
      id: String || Number,
      imgPath: String,
      appName: String,
      path: String
    }
  },
  methods: {
    pitchOn () {
      uni.navigateTo({
        url: this.appData.path
      })
    }
  }
}
</script>

<style>
.nav-type {
  transform: translateY(50%);
}
.nav-type view:nth-child(1) {
  display: inline-block;
  width: 40px;
  height: 40px;
  max-width: 60px;
  max-height: 60px;
  margin-bottom: 10px;
}
.nav-type view:nth-child(1) img {
  width: 100%;
  height: 100%;
}
.nav .nav-type view:nth-child(2) {
  font-size: 14px;
  font-weight: 700;
}
</style>