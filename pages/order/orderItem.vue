<template>
  <view>
    <uni-row>
      <uni-col :span="24"
               class="header">
        <text class="header-time">
          {{item.createTime}}
        </text>
        <text class="header-status"
              :class="{headerred: item.status==0 || item.status==1}">
          {{item.changeStatus}}
        </text>
      </uni-col>
      <uni-col :span="24"
               class="content">
        <view class="slide-img">
          <uni-row>
            <uni-col :xs="20"
                     :sm="22">
              <scroll-view scroll-x="true"
                           style="width:100%">
                <view style="overflow:hidden"
                      :style="{ width: `${(50+3)*item.sumNumber}px` }">
                  <view class="content-img"
                        v-for="(orderItem,index) in item.orderItems"
                        :key="index">
                    <img :src="orderItem.picture[0]+'_z.jpg'"
                         alt="">
                  </view>
                </view>
              </scroll-view>
            </uni-col>
            <uni-col :xs="4"
                     :sm="2">
              <view class="content-sumNumber">
                <text>共 {{item.sumNumber}} 件</text>
              </view>
            </uni-col>
          </uni-row>

        </view>
        <uni-row style="padding-bottom:10px;">
          <uni-col :span="12">
            <view class="order-serial">
              订单编号：{{item.id}}
            </view>
          </uni-col>
          <uni-col :span="12">
            <view class="actualPayment">
              <text>合计：</text>
              <text class="iconfont">&#xe657;</text>
              <text>{{item.actualPayment}}</text>
            </view>
          </uni-col>
        </uni-row>
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
  props: ['item']
}
</script>

<style>
.header {
  overflow: hidden;
  height: 40px;
  line-height: 40px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f3f3f3;
}
.header-time {
  font-size: 16px;
}
.header-status {
  float: right;
  font-size: 14px;
  color: #999;
}
.headerred {
  color: red;
}
.slide-img {
  background-color: #fbf9fa;
  border-radius: 10px;
  padding: 5px;
}
.content {
  padding-top: 10px;
}
.content-img {
  float: left;
  margin-right: 3px;
}
.content-img img {
  transform: translateY(2px);
  width: 50px;
  height: 50px;
}
.content-sumNumber {
  width: 100%;
  height: 54px;
  line-height: 54px;
  font-size: 12px;
  text-align: center;
  background-color: #f8f7ff;
}
.order-serial {
  font-size: 12px;
  color: #999;
  height: 40px;
  line-height: 40px;
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