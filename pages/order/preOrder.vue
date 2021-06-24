<template>
  <view class="preOrder-box">
    <uni-row v-if="cart.user.code">
      <uni-col :span='6'>
        <text>客户</text>
      </uni-col>
      <uni-col :span="18">
        <uni-easyinput v-model="cart.user.code"
                       style="background-color: #fff"
                       placeholder="请输入客户代码或者会员号"></uni-easyinput>
      </uni-col>
    </uni-row>
    <view v-if="cartItems.length>0"
          style="padding-bottom:40px;">
      <uni-row v-for="item,index in  cartItems"
               :key="index">
        <uni-col>
          <pre-order-item :item="item"
                          :userType="userType"
                          @deleteItem="deleteItem"
                          @subtotal="subtotal"></pre-order-item>
        </uni-col>
      </uni-row>
    </view>
    <view v-if="cartItems.length==0">
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
    <!-- 弹窗会员码 -->
    <uni-popup ref="popup"
               type="center">
      <view class="popup-out">
        <view class="popup-row"
              style="text-align:center"> 设置出库单</view>
        <uni-row class="popup-row">
          <uni-col :span="6"
                   style="text-align:right">
            <text style="height:36px;line-height:36px;">
              客户：
            </text>
          </uni-col>
          <uni-col :span="18">
            <uni-easyinput v-model="cart.user.code"
                           style="background-color: #fff"
                           placeholder="请输入客户代码或者会员号"></uni-easyinput>
          </uni-col>
        </uni-row>
        <uni-row class="popup-row">
          <uni-col :span="6"
                   :offset="18">
            <button size="mini"
                    style="background-color:#409eff;color:#fff;margin-top:10px;"
                    @click="callBackSetting">
              确定
            </button>
          </uni-col>
        </uni-row>
      </view>
    </uni-popup>

    <uni-popup ref="popupItems"
               type="bottom"
               background-color="#f5f5f">
      <view class="popup-items">
        <view class="popup-item-search">
          <uni-easyinput v-model="search"
                         style="background-color: #fff;height:25px;margin-bottom:10px"
                         placeholder="请输入搜索内容"></uni-easyinput>
        </view>
        <uni-row class="popup-iten-conten">
          <uni-col v-if="popupItems.length>0"
                   :span="24">
            <view v-for="( item, index ) in popupItems"
                  :key="index"
                  @click="addCart(item)"
                  style="margin-bottom:10px;background:#fff;padding:10px;">
              <uni-row :gutter="20">
                <uni-col :span="6"
                         class="popup-item-img">
                  <img src="../../static/logo.png"
                       alt="">
                </uni-col>
                <uni-col :span="18"
                         style="font-size:14px">
                  <view style="font-size: 16px;font-weight:700">{{item.title}} </view>
                  <uni-row class="popup-item-nav">
                    <uni-col :span="24">
                      <view> {{item.subTitle}} </view>
                    </uni-col>
                    <uni-col :span="24">
                      <view>剩余：{{item.surplusDays}} 天</view>
                    </uni-col>
                    <uni-col :span="24">
                      <text>库存：{{item.surplusStock}} {{item.unit}} </text>
                      <text style="float:right;color:red">单价： {{ item.univalence}} 元</text>
                    </uni-col>
                  </uni-row>
                </uni-col>
              </uni-row>
            </view>
          </uni-col>
          <uni-col v-if="popupItems.length==0"
                   :span="24">
            <view class="popupItems-false">暂无内容</view>
          </uni-col>
        </uni-row>
        <view class="popup-item-btn">
          <button size="mini"
                  style="float:right;"
                  @click="$refs.popupItems.close()">取消</button>
        </view>
      </view>
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
        }
      },
      cartItems: [],
      popupItems: "",
      univalences: {
        普通: 'sellingPrice',
        会员: 'vipPrice',
        代理: 'proxyPrice',
      }
    }
  },
  created () {
    // this.datas()
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
          this.cartItems = res.data.data
        })
    },
    async scanBarcode () {
      if (!this.cart.user.code) {
        this.$refs.popup.open()
        return
      }
      this.search = '2'
      //加载商品信息
      let rs = await this.loadInfoByBarcode();
      //如果扫码查询结果 大于1 提供选择界面

      this.popupItems = rs
      console.log(rs, '123')

      if (rs.length > 1) {
        console.log('22')
        this.$refs.popupItems.open()
      } else if (rs.length == 1) {
        //只有1条，加入列表
        this.addItemToItems(rs[0]);
      } else {
        //商品不存在或没有库存，请先调整库存或入库
        this.$refs.popupItems.open()
      }
    },
    addItemToItems (item) {//添加商品到商品列表
      //如果列表中存在 者增加数量

      let index = this.cartItems.findIndex(tmpItem => tmpItem.id == item.id);
      //初始化数量
      item.num = 1;
      if (index != -1) {
        let targetItems = this.cartItems.filter(tmpItem => tmpItem.id == item.id);
        let targetItem = targetItems[0];
        targetItem.num += item.num;
        this.$set(this.cartItems, index, targetItem);
        // console.log(this.cartItems,index, targetItem);
      } else {
        this.cartItems.push(item);
      }
      uni.showToast({
        title: "添加成功"
      })
      //添加进购物车
    },
    callBackSetting () {//确定设置
      if (this.cart.user.code == '' || !this.cart.user.code) {
        uni.showToast({
          title: "请将内容填写完毕",
          icon: "none"
        })
        return
      }
      this.cart.uuid = UUID();
      console.log(this.cart.uuid)
      this.$refs.popup.close()
      //初始化购物车

      //继续扫码
      this.scanBarcode();

    },
    async loadInfoByBarcode () {
      uni.showLoading({
        title: '加载中',
      })
      let rs = await request({
        url: '/item/findItems?search=' + this.search,
        method: 'get',
      });
      uni.hideLoading()
      //处理rs 转换为商品列表
      rs = rs.data.data
      rs.forEach(item => {
        item.surplusDays = this.surplusDays(item.endTime)
        item.univalence = item[this.univalences[this.userType]]
      })
      return rs;
    },
    surplusDays (date) {
      let now = new Date()
      let until = new Date(date)
      let days = (until - now) / 1000 / 3600 / 24 + 1
      let surplusTime = Math.floor(days)
      return surplusTime
    },
    bindPickerChange: function (e) {
      this.index = e.target.value
      this.userType = this.array[e.target.value]
    },
    deleteItem (id) {
      let deleteIndex
      this.cartItems.forEach((element, index) => {
        if (element.id === id) {
          deleteIndex = index
          return
        }
      });
      this.cartItems.splice(deleteIndex, 1)
      this.count()
    },
    subtotal (data) {
      let { id, sum } = data
      this.cartItems.forEach((element) => {
        if (element.id === id) {
          element.sum = sum
        }
      });
      this.count()
    },
    count () {
      let sumdata = 0
      this.cartItems.forEach((element) => {
        sumdata += Number(element.sum)
      });
      this.sum = sumdata
    },
    addCart (item) {
      this.addItemToItems(item)

      this.$refs.popupItems.close()
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
  z-index: 9;
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
.popup-out {
  width: 260px;
  background-color: #fff;
  border-radius: 5px;
  padding: 10px;
}
.popup-row {
  margin-bottom: 10px;
}
.popup-items {
  position: relative;
}
.popup-item-img img {
  width: 100%;
}
.popup-item-nav {
  margin-bottom: 10px;
}
.popup-item-search {
  position: fixed;
  width: 100%;
  background-color: #fff;
  z-index: 99;
  padding: 10px;
}
.popup-item-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  height: 30px;
  width: 100%;
  padding-right: 10px;
  background-color: #fff;
  z-index: 99;
  padding: 10px;
}
.popup-iten-conten {
  height: 500px;
  overflow: auto;
  padding: 66px 0 30px 0;
  background-color: #f5f5f5;
}
.popupItems-false {
  text-align: center;
  padding-top: 20px;
}
</style>
