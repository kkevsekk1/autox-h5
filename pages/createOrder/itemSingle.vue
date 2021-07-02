<template>
  <view class="itemsSingle">
    <uni-row>
      <uni-col :xs="5"
               :sm="2">
        <view class="logo">
          <img :src="itemFirstImage"
               alt="" />
        </view>
      </uni-col>
      <uni-col :xs="19"
               :sm="22">
        <uni-row>
          <uni-col :span="24">
            <view class="content-details-title"> {{ item.title }} </view>
          </uni-col>
        </uni-row>
        <uni-row>
          <uni-col :span="8">
            <view class="content-details-subTitle"
                  style="color:#999"> {{ item.subTitle }} </view>
          </uni-col>
          <uni-col :span="16"
                   style="text-align: right;">
            <text class="iconfont color-selling"
                  style="font-size:12px">&#xe657;</text>
            <text class="color-selling"> {{item.sellingPrice}} </text>
            <text class="iconfont  color-vip"
                  style="font-size:16px;padding-left:10px">&#xe601;</text>
            <text class="iconfont color-vip "
                  style="font-size:12px;">&#xe657;</text>
            <text class="color-vip">{{item.vipPrice}}</text>
          </uni-col>
        </uni-row>
        <uni-row>
          <uni-col :span="4">
            <view class="content-details-subTitle"> x{{ item.num }} {{item.unit}} </view>
          </uni-col>
          <uni-col :span="20"
                   style="text-align: right;">
            <text style="font-size:12px;">小计: </text>
            <text class="iconfont color-selling"
                  style="font-size:12px;padding-left:10px">&#xe657;</text>
            <text class="color-selling"> {{sellingPriceSum}} </text>
            <text class="iconfont color-vip "
                  style="font-size:16px;padding-left:10px">&#xe601;</text>
            <text class="iconfont color-vip"
                  style="font-size:12px;">&#xe657;</text>
            <text class="color-vip ">{{vipPriceSum}}</text>
          </uni-col>
        </uni-row>
      </uni-col>
    </uni-row>
  </view>
</template>
<script>
export default {
  props: ['item'],
  computed: {
    itemFirstImage () {
      try {
        console.log(this.item.picture)
        let pictures = JSON.parse(this.item.picture)
        if (pictures && pictures.length > 0) {
          return pictures[0] + '_x.jpg'
        }
      } catch (error) { }
      return ''
    },
    sellingPriceSum () {
      return this.item.num * this.item.sellingPrice
    },
    vipPriceSum () {
      return this.item.num * this.item.vipPrice
    }
  },
}
</script>

<style>
.itemsSingle {
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
  padding-left: 10px;
}
.content-details-subTitle {
  padding-top: 3px;
  font-size: 12px;
}
.content-sumPrice {
  width: 100%;
  text-align: right;
  padding-bottom: 5px;
}
.iconfont-vip {
  position: absolute;
  top: -2px;
}
.color-selling {
  color: #9266f9;
}
.color-vip {
  color: red;
}
</style>
