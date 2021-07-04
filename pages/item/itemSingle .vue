<template>
  <view>
    <uni-row>
      <uni-col :span="7">
        <view @click="modigyLogo(item.id)">
          <img :src="itemFirstImage"
               class="title-img"
               alt="">
        </view>
      </uni-col>
      <uni-col :span="17">
        <view>
          <text class="title">{{item.title}}</text>
          <text style="font-size:10px;color:orange;padding-left:3px;">剩{{itemSurplusDays}}天</text>
          <text style="float:right;margin-right:8px;"> {{item.status}} </text>
        </view>
        <uni-row style="margin-top:10px">
          <uni-col :span="16"
                   style="font-size: 14px;">
            <view> {{ item.subTitle}} </view>
            <view>库存：{{item.surplusStock}}{{item.unit}}</view>
            <view style="font-size: 10px;">货号：{{item.id}}</view>
            <view style="font-size: 10px;">条码：{{item.barcode}}</view>
          </uni-col>
          <uni-col :span="8">
            <button size='mini'
                    class="btn-set"
                    style="float:right"
                    @click="setItem(item.id)">设置</button>
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
        <view>进货价：*** </view>
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
  computed: {
    itemSurplusDays () {
      return this.surplusDays(this.item.endTime);
    },
  itemFirstImage(){
      try {
        // console.log(this.item.picture)
        let  pictures = JSON.parse(this.item.picture)
        if (pictures&& pictures.length>0) {
           return  pictures[0]+'_z.jpg';
        }
      } catch (error) {
      }
        return ''
    },
  },
  methods: {
    surplusDays (date) {
      let now = new Date()
      let until = new Date(date)
      let days = (until - now) / 1000 / 3600 / 24 + 1
      let surplusTime = Math.floor(days)
      return surplusTime
    },
    setItem (id) {
      this.$emit("setItem", id)
    },
    popupRepertory (item) {
      let data = {
        id: item.id,
        surplusStock: item.surplusStock,
        unit: item.unit,
        status: item.status
      }
      this.$emit("popupRepertory", data)
    },
    modigyLogo (id) {
      this.$emit("modigyLogo", id)
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