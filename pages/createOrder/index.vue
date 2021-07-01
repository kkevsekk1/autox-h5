<template>
  <view class="index-box">
    <view class="header">
      <uni-forms :modelValue="formData"
                 validate-trigger="bind"
                 ref="form"
                 :rules="rules">
        <uni-forms-item label="姓名："
                        name="name">
          <uni-easyinput type="text"
                         v-model="formData.name"
                         placeholder="请输入姓名" />
        </uni-forms-item>
        <uni-forms-item label="电话："
                        name="phone">
          <uni-easyinput type="text"
                         v-model="formData.phone"
                         placeholder="请输入电话" />
        </uni-forms-item>
        <uni-forms-item label="地址："
                        name="address">
          <uni-easyinput type="text"
                         v-model="formData.address"
                         placeholder="请输入收货地址" />
        </uni-forms-item>
      </uni-forms>
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
import itemSingle from './itemSingle'
import Items from "../../server/Items"
import { request } from "../../server/request.js"
export default {
  components: { itemSingle },
  data () {
    return {
      items: [],
      orderItems: [],
      formData: {
        name: '',
        phone: '',
        address: '',
      },
      rules: {
        name: {
          rules: [
            {
              required: true,
              errorMessage: "请输入姓名",
            }
          ]
        },
        phone: {
          rules: [
            {
              required: true,
              errorMessage: "请输入电话号码"
            },
            {
              maxLength: 11,
              minLength: 11,
              errorMessage: "请填写11位的电话号码"
            },
            {
              pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
              errorMessage: "请填写正确的电话号码"
            }
          ]
        },
        address: {
          rules: [
            {
              required: true,
              errorMessage: "请输入收获地址"
            },
          ]
        }
      }
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
    submit () {
      this.$refs.form.submit().then(res => {
        if (!res.address || !res.name || !res.phone) {
          uni.showToast({
            title: "请将信息填写完毕",
            icon: "none"
          })
          return
        }
        let data = {
          address: res.address,
          name: res.name,
          phone: res.phone,
          priceType: 'sellingPrice',
          orderType: "id desc",
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
      }).catch(err => { })
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
  padding: 20px 40px;
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