<template>
  <view class="orderDaeails">
    <view class="content">
      <view class="allclass content-payStatus">
        <view>
          <text>支付状态：</text>
          <text> {{items.changeStatus}} </text>
          <text class="iconfont">&#xe603;</text>
        </view>
        <view>
          订单超过30分钟自动取消，请在20分18秒内完成支付
        </view>
      </view>
      <view class="allclass content-userSite">
        <text>地址</text>
        <view class="content-userSite-right">
          <view>
            <text> {{items.name}} 账上</text>
            <text> {{items.phone}} 13452001201</text>
          </view>
          <view>
            {{items.address}}
            城市情网去的法律积分了
          </view>
        </view>
      </view>
      <view class="allclass content-orderDetail"
            style="overflow:hidden">
        <view class="border-bottom">
          <uni-rwo>
            <uni-col :span="12">
              <text style="color:#999">订单号</text>
            </uni-col>
            <uni-col :span="12"
                     style="text-align: right;">
              <text>{{items.id}}</text>
            </uni-col>
          </uni-rwo>
        </view>
        <view class="content-Time">
          <uni-rwo>
            <uni-col :span="8">
              <text style="color:#999">下单时间</text>
            </uni-col>
            <uni-col :span="16"
                     style="text-align: right;">
              <text>{{items.createTime}}</text>
            </uni-col>
          </uni-rwo>
        </view>
        <view class="border-bottom">
          <uni-rwo>
            <uni-col :span="12">
              <text style="color:#999">下单时间</text>
            </uni-col>
            <uni-col :span="6"
                     style="text-align: right;">
              <text>{{items.createTime}}</text>
            </uni-col>
            <uni-col :span="6"
                     style="text-align: right;">
              <text>{{items.createTime}}</text>
            </uni-col>
          </uni-rwo>
        </view>
      </view>
    </view>
    <view class="footer">
      <view class="actualPayment">
        <text>实付金额：</text>
        <text class="iconfont">&#xe657;</text>
        <text>{{items.actualPayment}}</text>
      </view>
      <uni-row :gutter="20"
               class="row-btn">
        <uni-col :span="12">
          <view class="row-btn-cancel">取消订单</view>
        </uni-col>
        <uni-col :span="12">
          <view class="row-btn-pay">去支付</view>
        </uni-col>
      </uni-row>
    </view>
  </view>
</template>

<script>
import { request } from "../../server/request.js"
import { formatTime } from '../../utils/format.js'
export default {
  data () {
    return {
      orderId: "",
      items: []
    }
  },
  created () {
    this.orderId = this.$route.query.id
    this.getOrderDetails()
  },
  methods: {
    getOrderDetails () {
      request({
        url: "/itemOrder/getById?id=" + this.orderId,
        method: "get"
      })
        .then(res => {
          let { code, data } = res.data
          if (code == 200) {
            data.createTime = formatTime(data.createdTime)
            this.items = data
            console.log(this.items)
          }
        })
    }
  }
}
</script>

<style>
page {
  background-color: #f5f5f5;
}
.allclass {
  padding: 10px;
  margin: 10px 0;
  font-size: 14px;
  border-radius: 5px;
  background-color: #fff;
}
.orderDaeails {
  padding: 10px;
}
.content-payStatus view:nth-child(1) {
  font-size: 20px;
  font-weight: 800;
}
.content-payStatus view:nth-child(2) {
  padding-top: 20px;
  padding-bottom: 10px;
  font-size: 14px;
  font-weight: 800;
}
.content-userSite {
  overflow: hidden;
  color: #999;
}
.content-userSite-right {
  float: right;
  color: #505050;
}
.content-userSite-right view:nth-child(1) {
  text-align: right;
}
.border-bottom {
  border-bottom: 2px solid #999;
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 0 10px;
  width: 100%;
  box-sizing: border-box;
  background-color: #f5f5f5;
}
.actualPayment {
  text-align: right;
  font-size: 14px;
}
.actualPayment text:nth-child(2) {
  font-size: 14px;
  font-weight: 800;
  color: red;
}
.actualPayment text:nth-child(3) {
  font-size: 14px;
  color: red;
}
.row-btn-cancel,
.row-btn-pay {
  display: inline-block;
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
}
.row-btn-cancel {
  color: #9266f9;
  background-color: #fff;
}
.row-btn-pay {
  background-color: #9266f9;
  color: #fff;
}
</style>