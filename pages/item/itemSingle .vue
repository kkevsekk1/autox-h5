<template>
  <view>
    <uni-row>
      <uni-col :span="8">
        <img src="../../static/logo.png"
             class="title-img"
             alt="">
      </uni-col>
      <uni-col :span="16">
        <view>
          <text class="title">{{item.title}}</text>
          <text style="float:right;margin-right:8px;"> {{item.status}} </text>
        </view>
        <uni-row style="margin-top:10px">
          <uni-col :span="16"
                   style="font-size: 14px;">
            <view> {{ item.subtitle}} / {{item.unit}} </view>
            <view>剩余：{{item.surplusStock}}{{item.unit}}</view>
            <view>库存：{{item.totalStock}}{{item.unit}} </view>
          </uni-col>
          <uni-col :span="8">
            <button size='mini'
                    class="btn-set"
                    style="float:right"
                    @click="setItem(item.id)">基础</button>
            <button size='mini'
                    class="btn-repertory"
                    style="float:right;margin-top:3px;"
                    @click="popupRepertory(item)">库存</button>
          </uni-col>
        </uni-row>
      </uni-col>
    </uni-row>
    <uni-row style="margin-top:10px;font-size:14px;">
      <uni-col :span="8">
        <view>普通价：{{item.sellingPrice}} </view>
        <view>会员价：{{item.vipPrice}}</view>
      </uni-col>
      <uni-col :span="8">
        <view>代理价：{{item.proxyPrice}}</view>
        <view>进货价：{{item.jinPrice}} </view>
      </uni-col>
      <uni-col :span="8">
        <view>正价：{{item.originalPrice}}</view>
        <view>备用价：{{item.remarkPrice}}</view>
      </uni-col>
    </uni-row>
  </view>
</template>

<script>
export default {
  props: ['item'],
  methods: {
    setItem (id) {
      this.$emit("setItem", id)
    },
    popupRepertory (item) {
      let data = {
        id: item.id,
        totalStock: item.totalStock,
        unit: item.unit,
        status: item.status
      }
      this.$emit("popupRepertory", data)
    }
  }
}
</script>

<style>
.title-img {
  width: 90px;
  height: 90px;
}
.title {
  font-size: 16px;
  font-weight: 700;
}
.btn-repertory,
.btn-set {
  background: #409eff;
  color: #fff;
}
</style>