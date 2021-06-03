<template>
  <view>
    <web-view :src="externalPath"></web-view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      externalPath: ""
    }
  },
  onLoad (option) {
    let { externalPath, path } = option
    this.resiliency(externalPath, path)
  },
  methods: {
    resiliency (externalPath, path) {
      this.externalPath = externalPath
      setTimeout(() => {
        uni.reLaunch({
          url: path
        })
      }, 1000)
    }
  }
}
</script>

<style>
</style>