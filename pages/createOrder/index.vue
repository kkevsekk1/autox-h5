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
import { request } from "../../server/request.js"
import shoppingCartService from '../../server/ShoppingCartService'
import userService from '../../server/userService'
export default {
  components: { itemSingle, userData },
  data () {
    return {
      items: [],
      userData: {
        name: '同城可配送',
        address: '请添加收货地址'
      },
      uuid: "appuser",
      userType: '普通',//
      priceMap: {
        普通: 'sellingPrice',
        会员: 'vipPrice',
        代理: 'proxyPrice',
      },
    }
  },
  computed: {
    sum () {
      let sum = 0
      this.items.forEach(item => {
        sum += item[this.priceMap[this.userType]] * item.num;
      })
      return sum
    }
  },
  created () {
    this.loadCartItems();
    this.loadUserInfo();
  },
  methods: {
    loadCartItems () {
      shoppingCartService.getSCartItems(this.uuid)
        .then(res => {
          console.log(res);
          let { code, message, data } = res.data;
          if (code == 200) {
            this.items = []
            data.forEach(item => {
              this.items.push(item);
            });
            uni.showToast({
              'title': message,
            })
          } else {
            uni.showToast({
              'title': '确认失败，请重新选择商品',
              icon: 'none',
              duration: 5000,
            })
          }
        });
    },
    loadUserInfo () {
      userService.loadUserInfo().then(user => {
        console.log(user);
        try {
          this.userData = JSON.parse(user.adress)[0];
        } catch (error) {
          console.log(error);
        }

      })
    },
    selectuser () {
      uni.navigateTo({
        url: '/pages/createOrder/selectuser'
      })
    },
    submit () {
      let { name, phone, address } = this.userData
      if (!name || !phone || !address) {
        uni.showToast({
          title: "请选择收获地址",
          icon: "none"
        })
        return
      }
      let orderItems = []
      this.items.forEach(item => {
        orderItems.push({
          id: item.id,
          quantity: item.num
        })
      })
      let data = {
        address: address,
        name: name,
        phone: phone,
        priceType: 1,
        orderType: 2,
        items: orderItems
      }
      console.log(data)
      request({
        url: "/itemOrder/buyItems",
        method: "post",
        data,
      }).then(res => {
        let { code, message } = res.data
        if (code == 200) {
          uni.showToast({
            title: message,
          })
          uni.navigateTo({
            url: "/pages/order/orders"
          })
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