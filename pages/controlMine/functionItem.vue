<template>
  <view @click="pitchOn">
    <view class="nav-type">
      <view>
        <img :src="functionData.imgPath"
             alt="">
      </view>
      <view> {{functionData.functionName}} </view>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      externalLinks: "/pages/externalLinks/externalLinks"
    }
  },
  props: ["functionData"],
  methods: {
    pitchOn () {
      let { type, path, externalPath } = this.functionData
      if (type === "internalLinks") {
        uni.navigateTo({
          url: path
        })
      }
      if (type === "externalLinks") {
        uni.navigateTo({
          url: this.externalLinks + "?externalPath=" + externalPath + "&path=" + path
        })
      }
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