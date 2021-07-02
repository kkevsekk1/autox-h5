<template>
  <view class="itemsSingle">
    <view class="logo">
      <img :src="itemFirstImage" alt="" />
    </view>
    <view class="content">
      <view class="content-details">
        <view class="content-details-title"> {{ item.title }} </view>
        <view class="content-details-subTitle"> {{ item.subTitle }} </view>
        <view class="content-details-subTitle"> x{{ item.num }} {{item.unit}} </view>
      </view>
      <view class="content-sumPrice">
        <text class="iconfont">&#xe657;</text>
        <text> {{ item.vipPrice }} 显示2个价格 </text>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: ['item'],
  computed: {
    itemFirstImage() {
      try {
        // console.log(this.item.picture)
        let pictures = JSON.parse(this.item.picture)
        if (pictures && pictures.length > 0) {
          return pictures[0] + '_x.jpg'
        }
      } catch (error) {}
      return ''
    },
  },
}
</script>

<style>
.itemsSingle {
  display: flex;
  position: relative;
}
.logo {
  width: 60px;
  height: 60px;
}
.logo img {
  width: 100%;
  height: 100%;
}
.content {
  padding-top: 3px;
  padding-left: 10px;
}
.content-details-title {
  font-size: 14px;
}
.content-details-subTitle {
  padding-top: 3px;
  color: #999;
  font-size: 12px;
  font-weight: 300;
}
.content-sumPrice {
  position: absolute;
  right: 10px;
  top: 10px;
}
.content-sumPrice text:nth-child(1) {
  font-size: 12px;
}
</style>
