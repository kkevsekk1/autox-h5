<template>
  <view class="preOrder-box">
    <view v-if="cart.items.length>1"
          style="padding-bottom:40px;">
      <uni-row v-for="item,index in  cart.items"
               :key="index">
        <uni-col>
          <pre-order-item :item="item"
                          :userType="userType"
                          @deleteItem="deleteItem"
                          @subtotal="subtotal"></pre-order-item>
        </uni-col>
      </uni-row>
    </view>
    <view v-if="cart.items.length<=1">
      <view style="text-align:center;padding-top:20px;">暂无内容</view>
    </view>
    <view class="fiex-bottom">
      <uni-row>
        <uni-col :span="4">
          <picker @change="bindPickerChange"
                  :value="index"
                  :range="array"
                  class="picker ">
            <view style="font-size:14px">{{array[index]}}</view>
            <text class="iconfont popup-icon">&#xe603;</text>
          </picker>
        </uni-col>
        <uni-col :span="8"
                 style="font-size:14px">
          <text>共计：</text>
          <text style="color:red;"> {{sum}}</text>
        </uni-col>
        <uni-col :span="7"
                 style="text-align: left">
          <button class="mini-btn"
                  style="background-color: #409eff"
                  type="primary"
                  size="mini"
                  @click="scanBarcode">
            确认出库
          </button>
        </uni-col>
        <uni-col :span="5"
                 style="text-align: left">
          <button class="mini-btn"
                  style="background-color: #409eff"
                  type="primary"
                  size="mini"
                  @click="scanBarcode">
            扫码
          </button>
        </uni-col>
      </uni-row>
    </view>
    <!-- 弹窗 -->
    <uni-popup ref="popup"
               type="center">
      <view></view>
      <view></view>
      <button @click="$refs.popup.close()">取消</button>
    </uni-popup>
  </view>
</template>

<script>
import { request } from '../../server/request.js'
import preOrderItem from './preOrderItem.vue'
import UUID from '@/utils/uuid'
export default {
  components: { preOrderItem },
  data () {
    return {
      sum: "",
      search: '',
      userType: '普通',
      index: 0,
      array: ['普通', '会员', '代理'],
      cart: {
        uuid: '',
        user: {
          code: '',
        },
        items: [{}],
      },
    }
  },
  created () {
    this.datas()
  },
  methods: {
    datas () {
      request({
        url: '/item/findItems?search=2',
        method: 'get',
      })
        .then(res => {
          res.data.data.forEach(element => {
            element.num = 0
          })
          this.cart.items = res.data.data
        })
    },
    scanBarcode () {
      if (!this.cart.user.code) {
        alert('弹出出库单，设置信息')
        return
      }
      this.search = '2'
      //加载商品信息
      let rs = this.loadInfoByBarcode();
      //如果扫码查询结果 大于1 提供选择界面
      if (rs.length > 1) {
        console.log("12")
        this.$refs.popup.open()
      } else if (rs.length == 1) {
        //只有1条，加入列表
        this.addItemToItems(rs[0]);
      } else {
        //商品不存在或没有库存，请先调整库存或入库

      }
    },
    addItemToItems (item) {//添加商品到商品列表
      //如果列表中存在 者增加数量
      let barItem = this.cart.items.filter(tmpItem => tmpItem.id == time.id);
      if (barItem && barItem.length > 0) {
        barItem.num += item.num;
      } else {
        console.log(item, "item")
        this.item.push(item);
      }
      //添加进购物车
    },
    callBackSetting () {//确定设置
      this.cart.user.code = '客户代码'
      this.cart.uuid = UUID();
      console.log(this.cart.uuid)
      //初始化购物车

      //继续扫码
      this.scanBarcode();

    },
    async loadInfoByBarcode () {
      // uni.showLoading({
      //   title: '加载中',
      // })
      let rs = await request({
        url: '/item/findItems?search=' + this.search,
        method: 'get',
      });
      //处理rs 转换为商品列表
      return rs;
    },
    bindPickerChange: function (e) {
      this.index = e.target.value
      this.userType = this.array[e.target.value]
    },
    deleteItem (id) {
      let deleteIndex
      this.cart.items.forEach((element, index) => {
        if (element.id === id) {
          deleteIndex = index
          return
        }
      });
      this.cart.items.splice(deleteIndex, 1)
      this.count()
    },
    subtotal (data) {
      let { id, sum } = data
      this.cart.items.forEach((element) => {
        if (element.id === id) {
          element.sum = sum
        }
      });
      this.count()
    },
    count () {
      let sumdata = 0
      this.cart.items.forEach((element) => {
        sumdata += Number(element.sum)
      });
      this.sum = sumdata
    }
  },
}
</script>

<style>
page {
  background-color: #f5f5f5;
}
.fiex-bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 40px;
  padding: 0 10px;
  box-sizing: border-box;
  line-height: 40px;
  background-color: #fff;
}
.popup-icon {
  position: absolute;
  right: 10px;
  top: 0px;
  transform: rotate(90deg);
  font-size: 12px;
  color: #848484;
}
.mini-btn {
  float: right;
  transform: translateY(6px);
}
</style>
