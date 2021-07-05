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
      <order-item :item="item"
                  @orderDetails="orderDetails"
                  @payment="payment"
                  @logistics="logistics"
                  @signFor="signFor"
                  @buyAgain="buyAgain" />
    </view>
    <!-- 物流弹窗 -->
    <uni-popup ref="popupLogistics"
               type="bottom"
               background-color="#fff"
               class="popupLogistics">
      <view>物流信息</view>
      <view>【快递公司】
        <text selectable="true"
              user-select="true">{{waybill.name}}</text>
      </view>
      <view>【运单号】
        <text selectable="true"
              user-select="true">{{waybill.num}}</text>
      </view>
      <view @click="$refs.popupLogistics.close()"> 确定 </view>
    </uni-popup>
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
        0: '待支付',
        1: '待发货',
        2: '已完成',
        3: '待评价',
        4: '已过期'
      },
      btnStatus: {
        0: ['订单详情', '立即付款'],
        1: ['查看物流', '订单详情', '确认收货'],
        2: ["订单详情", '再次购买'],
        3: ['订单详情'],
        4: ['订单详情', '再次购买'],
      },
      itemsBtns: [
        {
          name: '订单详情',
          type: "orderDetails"
        },
        {
          name: '立即付款',
          type: "payment"
        },
        {
          name: '查看物流',
          type: "logistics"
        },
        {
          name: '确认收货',
          type: "signFor"
        },
        {
          name: '再次购买',
          type: "buyAgain "
        },
      ],
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
      waybill: {
        name: "顺丰速发",
        num: "1313131"
      }
    }
  },
  created () {
    this.getOrders()
  },
  onReachBottom () {
    if (this.pages.index * this.pages.size < this.pages.count) {
      this.pages.index++;
      this.getOrders();
    } else {
      uni.showToast({ title: '没有更多了', iccon: 'none' })
    }
  },
  onPullDownRefresh () {
    this.pages.index = 1;
    this.items = [];
    this.getOrders();
    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 1000)
  },
  methods: {
    getOrders () {
      console.log(this.pages)
      uni.showLoading({ title: '加载中' })
      request({
        url: "/itemOrder/findMyOrder",
        method: "post",
        data: this.pages
      })
        .then(res => {
          uni.hideLoading()
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
              item.createTime = formatTime(item.createTime)
              item.orderItems.forEach(orderItem => {
                orderItem.picture = JSON.parse(orderItem.picture) || ''
              })
              // item.status = 0
              let btn = this.btnStatus[item.status]
              let btns = []
              btn.forEach(element => {
                let data = []
                data = this.itemsBtns.filter(res => {
                  return res.name == element
                })
                btns.push(data[0])
              })
              item.btns = btns
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
    },
    orderDetails (id) {
      uni.navigateTo({
        url: "/pages/order/orderDetails?id=" + id
      })
    },
    payment (id) {
      uni.navigateTo({
        url: "/pages/order/orderDetails?id=" + id
      })
    },
    logistics (id) {
      this.$refs.popupLogistics.open()
    },
    signFor (id) {
      console.log(id)
    },
    buyAgain (id) {
      console.log(id)
    },
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  padding: 10px;
  box-sizing: border-box;
  background-color: #f5f5f5;
  z-index: 99;
}
.header .sift {
  font-size: 16px;
}
.siftClass {
  color: red;
  border-bottom: 2px solid red;
}
.items {
  padding: 10px;
  padding-top: 43px;
  background-color: #fff;
  border-radius: 10px;
  margin: 10px 0;
}
.popupLogistics view {
  text-align: center;
  font-size: 14px;
  height: 45px;
  line-height: 45px;
}
.popupLogistics view:nth-child(1),
.popupLogistics view:nth-child(2) {
  border-bottom: 2px solid #f5f5f5;
}
.popupLogistics view:nth-child(4) {
  background-color: #9266f9;
  color: #fff;
  font-size: 16px;
}
</style>