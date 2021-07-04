<template>
  <view>
    <uni-row>
      <uni-col :span="24"
               class="header">
        <text class="header-time">
          下单时间：{{item.createTime}}
        </text>
        <text class="header-status"
              :class="{headerred: item.status==0 || item.status==1}">
          {{item.changeStatus}}
        </text>
      </uni-col>
      <uni-col :span="24"
               class="content">
        <view>
          <scroll-view scroll-x="true"
                       :style="{ width: `${scrollWidth - 40-67}px` }"
                       class="scroll-view">
            <view class="scroll-view-img"
                  :style="{ width: `${67*item.sumNumber}px` }">
              <view class="content-img"
                    v-for="(orderItem,index) in item.orderItems"
                    :key="index">
                <img :src="orderItem.picture[0]+'_z.jpg'"
                     alt="">
              </view>
            </view>
          </scroll-view>
          <view class="content-sumNumber">
            共 {{item.sumNumber}} 件
          </view>
        </view>
        <view class="order-serial">
          订单编号：{{item.id}}
        </view>
        <view class="actualPayment">
          <text>合计：</text>
          <text class="iconfont">&#xe657;</text>
          <text>{{item.actualPayment}}</text>
        </view>
      </uni-col>
      <uni-col :span="24"
               class="offter">
        <text v-for="btn,index in item.btns"
              :key="index"
              @click="$emit(btn.type,item.id)">
          {{btn.name}}
        </text>
      </uni-col>
    </uni-row>
  </view>
</template>

<script>
export default {
  props: ['item',],
  computed: {
    scrollWidth () {
      let width = document.documentElement.clientWidth
      return width
    },
  },

}
</script>

<style>
.header {
  overflow: hidden;
  height: 40px;
  line-height: 40px;
}
.header-time {
  font-size: 16px;
  font-weight: 700;
}
.header-status {
  float: right;
  font-size: 14px;
  color: #999;
}
.headerred {
  color: red;
}
.scroll-view {
  display: inline-block;
}
.scroll-view-img {
  overflow: hidden;
}
.content-img {
  float: left;
  margin-right: 2px;
  width: 65px;
  height: 67px;
  background-color: #f8f8f8;
}
.content-img img {
  width: 100%;
  height: 100%;
}
.content-sumNumber {
  float: right;
  width: 67px;
  height: 67px;
  line-height: 67px;
  font-size: 12px;
  text-align: center;
  background-color: #f8f8f8;
}
.order-serial {
  font-size: 12px;
  color: #999;
  padding: 10px 0;
}
.actualPayment {
  text-align: right;
  height: 40px;
  line-height: 40px;
}
.actualPayment text:nth-child(1) {
  font-size: 12px;
}
.actualPayment text:nth-child(2) {
  font-size: 14px;
}
.actualPayment text:nth-child(3) {
  font-size: 16px;
}
.offter {
  text-align: right;
}
.offter text {
  display: inline-block;
  width: 70px;
  height: 26px;
  line-height: 26px;
  border-radius: 15px;
  font-size: 14px;
  margin-left: 5px;
  text-align: center;
  border: 1px solid #999;
}
.offter text:last-child {
  border: 1px solid #9266f9;
  color: #9266f9;
}
</style>