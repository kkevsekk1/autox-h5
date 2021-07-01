<template>
  <view class="index-box">
    <view class="header"
          @click="selectuser">
      <user-data :userData="userData"></user-data>
    </view>
    <view class="content">
      <view v-for="(item,index) in items"
            :key="index"
            class="item-single">
        <item-single :item="item" />
      </view>
    </view>
    <view class="footer">
      <text class="footer-left">
        <text>合计：</text>
        <text class="iconfont">&#xe657;</text>
        <text>{{sum}}</text>
      </text>
      <text class="footer-right">
        <text @click="submit">提交订单</text>
      </text>
    </view>
  </view>
</template>

<script>
import userData from './userData'
import itemSingle from './itemSingle'
import Items from "../../server/Items"
import { request } from "../../server/request.js"
export default {
  components: { itemSingle, userData },
  data () {
    return {
      items: [],
      orderItems: [],
      userData: '',
      uuid: "",
    }
  },
  computed: {
    sum () {
      let sum = 0
      this.items.forEach(item => {
        sum += item.sumPrice
      })
      return sum
    }
  },
  created () {
    this.createdItem()
    let { name = '', phone = '', address = '', } = this.$route.query
    this.getSCartItems()
    this.userData = {
      name: name,
      phone: phone,
      address: address,
    }
  },
  methods: {
    createdItem () {
      let items = Items.createOrder
      items.forEach(item => {
        item.sumPrice = item.buyNunber * item.sellingPrice
        this.orderItems.push({
          id: item.id,
          quantity: item.buyNunber
        })
      })
      this.items = items
    },
    selectuser () {
      console.log("123")
      uni.redirectTo({
        url: '/pages/createOrder/selectuser'
      })
    },
    submit () {
      let data = {
        address: this.userData.address,
        name: this.userData.name,
        phone: this.userData.phone,
        priceType: 1,
        orderType: 2,
        items: this.orderItems
      }
      console.log(data)
      request({
        url: "/itemOrder/buyItems",
        method: "post",
        data,
      })
        .then(res => {
          let { code, message } = res.data
          if (code == 200) {
            uni.showToast({
              title: message,
            })
          }
        })
    },
    selectUser (data) {
      this.userData = data
    },
  }
}
</script>

<style>
page {
  background-color: #f5f5f5;
}
.index-box {
  padding: 10px;
}
.header {
  padding: 10px;
  border-radius: 10px;
  background-color: #fff;
}
.content {
  background-color: #fff;
  border-radius: 10px;
  margin-top: 10px;
  padding-bottom: 45px;
}
.item-single {
  padding: 10px;
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 45px;
  line-height: 45px;
  overflow: hidden;
  background-color: #fff;
}
.footer-left {
  float: left;
  padding-left: 20px;
  font-weight: 800;
}
.footer-left text:nth-child(1) {
  font-size: 12px;
  display: inline-block;
  transform: translateY(-2px);
}
.footer-left text:nth-child(2) {
  font-size: 14px;
  color: #fa2209;
}
.footer-left text:nth-child(3) {
  color: #fa2209;
  font-size: 20px;
}
.footer-right {
  float: right;
  padding-right: 10px;
}
.footer-right text {
  display: inline-block;
  width: 100px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  border-radius: 20px;
  color: #fff;
  background-color: #9266f9;
}
</style>