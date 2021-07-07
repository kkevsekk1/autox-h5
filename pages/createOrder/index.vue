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
      <view class="footer-advertising"
            v-if="roleName =='特价用户'">
        <uni-row>
          <uni-col :span="18"
                   style="padding-top:5px">
            <text>开通
              <text style="color:red">VIP会员</text>
              ，可比特价还省
              <text style="color:red">{{saveSum}}</text>
              元</text>
          </uni-col>
          <uni-col :span="6">
            <text class="footer-vip">立即开通</text>
          </uni-col>
        </uni-row>
      </view>
      <view style="height: 45px;line-height: 45px;">
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
      priceMap: {
        '特价用户': 'sellingPrice',
        'VIP会员': 'vipPrice',
      },
      priceTypes: {
        '特价用户': '1',
        'VIP会员': '2',
      },
      roleName: "",
    }
  },
  computed: {
    sum () {
      let sum = 0
      this.items.forEach(item => {
        sum += item[this.priceMap[this.roleName]] * item.num;
      })
      return sum.toFixed(2)
    },
    saveSum () {
      let vipsum = 0
      this.items.forEach(item => {
        vipsum += item.vipPrice * item.num;
      })
      let saveSum = this.sum - vipsum
      return saveSum.toFixed(2)
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
        try {
          this.userData = JSON.parse(user.adress)[0];
        } catch (error) {
          console.log(error);
        }
        let { level } = user
        if (level == 3) {
          this.roleName = 'VIP会员'
        } else {
          this.roleName = "特价用户"
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
        priceType: '2',
        orderType: this.priceTypes[this.roleName],
        items: orderItems
      }
      console.log(data)
      request({
        url: "/itemOrder/buyItems",
        method: "post",
        data,
      }).then(res => {
        console.log(res)
        let { code, message, data } = res.data
        if (code == 200) {
          uni.showToast({
            title: message,
          })
          shoppingCartService.deleteSCart(this.uuid)
          uni.reLaunch({
            url: "/pages/order/orderDetails?id=" + data.id
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
  padding-bottom: 150px;
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
  padding: 10px;
}
.item-single {
  padding: 10px 0;
  border-bottom: 1px solid rgb(238, 238, 238);
}
.item-single:last-child {
  border: none;
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  background-color: #fff;
}
.footer-left {
  float: left;
  padding-left: 10px;
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
.footer-advertising {
  font-size: 14px;
  padding: 10px;
  box-sizing: border-box;
  background-color: #fef6e1;
}
.footer-vip {
  float: right;
  background-color: red;
  color: #fff;
  font-weight: 800;
  padding: 5px 10px;
  border-radius: 15px;
}
</style>