<template>
  <view class="orderItem-box">
    <view class="header">
      <view v-for="sift,index in sifts"
            :key="index"
            class="sift"
            :class="{siftClass :siftIndex==index }"
            @click="siftStatus(index,sift.status)">
        <text> {{sift.title}} </text>
      </view>
    </view>
    <view class="items"
          v-for="item,index in items"
          :key="index">
      <order-item :item="item" />
    </view>
  </view>
</template>
<script>
import orderItem from "./orderItem.vue"
import { request } from "../../server/request.js"
import { formatTime } from '../../utils/format.js'
export default {
  components: { orderItem },
  data () {
    return {
      pages: { status: -1, index: 1, size: 10, orderby: "id desc", count: '' },
      items: [],
      statuss: {
        0: '待付款',
        1: '代发货',
        2: '已完成',
        3: '待评价',
        4: '已过期'
      },
      sifts: [
        {
          title: "全部",
          status: ''
        },
        {
          title: "待付款",
          status: 0
        },
        {
          title: "待发货",
          status: 1
        },
        {
          title: "已完成",
          status: 2
        },
        {
          title: "待评价",
          status: 3
        },
        {
          title: "已过期",
          status: 4
        },

      ],
      siftIndex: "",
    }
  },
  created () {
    this.getOrders()
  },
  methods: {
    getOrders () {
      this.items = []
      request({
        url: "/itemOrder/findMyOrder",
        method: "post",
        data: this.pages
      })
        .then(res => {
          console.log(res)
          let { code, data: { count, index, list, size, orderby } } = res.data
          if (code == 200) {
            this.pages = {
              status: -1,
              index: index,
              size: size,
              orderby: orderby,
              count: count
            }
            list.forEach(item => {
              let sum = 0
              item.createTime = formatTime(item.createTime)
              item.orderItems.forEach(orderItem => {
                orderItem.picture = JSON.parse(orderItem.picture) || ''
              })
              item.changeStatus = this.statuss[item.status]
              item.sumNumber = item.orderItems.length
              this.items.push(item)
            });
          }
        })
    },
    siftStatus (index, siftStatus) {
      this.siftIndex = index
      this.pages.status = siftStatus
      this.getOrders()
    }
  }
}
</script>

<style>
page {
  background-color: #f5f5f5;
}
.orderItem-box {
  padding: 10px;
}
.header {
  display: flex;
  justify-content: space-evenly;
}
.header .sift {
  font-size: 16px;
  padding-bottom: 5px;
}
.siftClass {
  color: red;
  border-bottom: 2px solid red;
}
.items {
  padding: 10px;
  background-color: #fff;
  border-radius: 10px;
  margin: 10px 0;
}
</style>