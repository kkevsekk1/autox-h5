<template>
  <view class="preOrder-box">
    <view v-if="cart.user.code"
          class="bead">
      <uni-row :gutter="20">
        <uni-col :span="4"
                 class="bade-name">
          <text>客户 :</text>
        </uni-col>
        <uni-col :span="20">
          <uni-easyinput v-model="cart.user.code"
                         style="background-color: #fff"
                         placeholder="请输入客户代码或者会员号"></uni-easyinput>
        </uni-col>
      </uni-row>
    </view>
    <view v-if="cartItems.length > 0"
          class="contnet"
          :style="cart.user.code ? 'padding-top:66px ' : ''">
      <uni-row v-for="(item, index) in cartItems"
               :key="index">
        <uni-col>
          <pre-order-item :item="item"
                          @itemNumChange="itemNumChange"
                          @deleteItem="removeItem"></pre-order-item>
        </uni-col>
      </uni-row>
    </view>
    <view v-if="cartItems.length == 0">
      <view style="text-align: center; padding-top: 20px">暂无内容</view>
    </view>
    <view class="fiex-bottom">
      <uni-row>
        <uni-col :span="4">
          <view @click="openHistory()"
                style="font-size: 14px">历史</view>
        </uni-col>

        <uni-col :span="10">
          <text style="font-size: 10px">普通价：</text>
          <text style="color: red; font-size: 14px"> ￥{{ countP }}</text>
        </uni-col>
        <uni-col :span="10">
          <text style="font-size: 10px">会员价：</text>
          <text style="color: red; font-size: 14px"> ￥{{ countH }}</text>
        </uni-col>
      </uni-row>
      <uni-row>
        <uni-col :span="7">
          <picker @change="bindPickerChange"
                  :value="index"
                  :range="array"
                  class="picker">
            <view style="font-size: 10px">以 <text style="color: blue">{{ array[index] }}</text> 结算</view>
          </picker>
        </uni-col>
        <uni-col :span="7">
          <text style="font-size: 10px">共：</text>
          <text style="color: red; font-size: 14px"> ￥{{ count }}</text>
        </uni-col>
        <uni-col :span="5"
                 style="text-align: left">
          <button class="mini-btn"
                  style="background-color: #409eff"
                  type="primary"
                  size="mini"
                  @click="$refs.popupSum.open()">
            完成
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
              style="text-align: center"> 设置出库单</view>
        <uni-row class="popup-row">
          <uni-col :span="5"
                   style="text-align: center">
            <text style="height: 36px; line-height: 36px"> 客户： </text>
          </uni-col>
          <uni-col :span="19">
            <uni-easyinput v-model="cart.user.code"
                           style="background-color: #fff"
                           placeholder="请输入客户代码或者会员号"></uni-easyinput>
          </uni-col>
        </uni-row>
        <uni-row>
          <uni-col :span="6"
                   :offset="18">
            <button size="mini"
                    style="background-color: #409eff; color: #fff; margin-top: 10px"
                    @click="callBackSetting">
              确定
            </button>
          </uni-col>
        </uni-row>
      </view>
    </uni-popup>

    <!-- 扫码 -->
    <uni-popup ref="popupItems"
               type="bottom"
               background-color="#f5f5f">
      <view class="popup-items">
        <view class="popup-item-search">
          <uni-easyinput v-model="search"
                         style="background-color: #fff; height: 25px; margin-bottom: 10px"
                         placeholder="请输入搜索内容"></uni-easyinput>
        </view>
        <view style="padding-top: 55px">
          <scroll-view class="popup-iten-conten"
                       scroll-y="true">
            <uni-row>
              <uni-col v-if="popupItems.length > 0"
                       :span="24">
                <view v-for="(item, index) in popupItems"
                      :key="index"
                      @click="addCart(item)"
                      style="margin: 10px 0; background: #fff; padding: 10px">
                  <uni-row :gutter="20">
                    <uni-col :span="6"
                             class="popup-item-img">
                      <img src="../../static/logo.png"
                           alt="" />
                    </uni-col>
                    <uni-col :span="18"
                             style="font-size: 14px">
                      <view style="font-size: 16px; font-weight: 700">{{ item.title }}
                      </view>
                      <uni-row class="popup-item-nav">
                        <uni-col :span="24">
                          <view> {{ item.subTitle }} </view>
                        </uni-col>
                        <uni-col :span="24">
                          <view>剩余：{{ item.surplusDays }} 天</view>
                        </uni-col>
                        <uni-col :span="24">
                          <text>库存：{{ item.surplusStock }} {{ item.unit }}
                          </text>
                          <text style="float: right; color: red">单价： {{ item.univalence }} 元</text>
                        </uni-col>
                      </uni-row>
                    </uni-col>
                  </uni-row>
                </view>
              </uni-col>
              <uni-col v-if="popupItems.length == 0"
                       :span="24">
                <view class="popupItems-false">没有该品种，请先入库</view>
              </uni-col>
            </uni-row>
          </scroll-view>
        </view>
        <view class="popup-item-btn">
          <button size="mini"
                  style="float: right"
                  @click="cancel">取消</button>
        </view>
      </view>
    </uni-popup>
    <!-- 确认出库 -->
    <uni-popup ref="popupSum"
               type="center">
      <view class="popupSum">
        <uni-row>
          <uni-col class="popupSum-nav"
                   :offset="3"
                   :span="21">
            <text>{{ name }}</text>
          </uni-col>
          <uni-col class="popupSum-nav"
                   :offset="3"
                   :span="21">
            <text>共计：{{ sumTo }} 件</text>
          </uni-col>
          <uni-col class="popupSum-nav"
                   :offset="3"
                   :span="21">
            <text>合计：{{ count }} 元</text>
          </uni-col>
          <uni-col></uni-col>
          <uni-col :offset="2"
                   :span="8"
                   class="btn-storage">
            <button size="mini"
                    style="float: right"
                    @click="temporaryStore">
              暂存退出
            </button>
          </uni-col>
          <uni-col :offset="4"
                   :span="8"
                   class="btn-delivery">
            <button size="mini"
                    @click="createOrder">确定出库</button>
          </uni-col>
        </uni-row>
      </view>
    </uni-popup>
    <!-- 暂存 -->
    <uni-popup ref="popupClient"
               type="right">
      <uni-row class="popupClient">
        <uni-col :span="24"
                 class="popupClient-title"> 暂存区 </uni-col>
        <uni-col :span="24">
          <view class="popipClient-content"
                v-for="(cart, index) in histroyCarts"
                :key="index">
            <view @click="toHistoryCart(cart)">
              <view style="font-size: 14px">{{ cart.name }}</view>
              <view style="font-size: 12px">{{
                cart.createTime | formatTime
              }}</view>
              <view class="iconfont icon-delete"
                    @click.stop="clearHistoryCart(cart.uuid)">&#xe62f;</view>
            </view>
          </view>
        </uni-col>
      </uni-row>
    </uni-popup>
  </view>
</template>

<script>
import { request } from '../../server/request.js'
import preOrderItem from './preOrderItem.vue'
import UUID from '@/utils/uuid'
import isWx from '../../utils/weixinCheck'
import weixinService from '../../server/weixinService.js'
import shoppingCartService from '../../server/ShoppingCartService'

export default {
  components: { preOrderItem },
  data () {
    return {
      name: '张三',
      search: '',
      userType: '普通',
      index: 0,
      array: ['普通', '会员', '代理'],

      cart: {
        uuid: '',
        user: {
          code: '',
        },
      },
      cartItems: [],
      popupItems: [],
      histroyCarts: [],
      univalences: {
        普通: 'sellingPrice',
        会员: 'vipPrice',
        代理: 'proxyPrice',
      },
    }
  },
  computed: {
    count () {
      let sumdata = 0
      this.cartItems.forEach((item) => {
        console.log(item.sum, item.num, item.univalence)
        sumdata += Number(item.num * item.univalence)
      })
      return sumdata.toFixed(2)
    },
    countP () {
      let sumdata = 0
      this.cartItems.forEach((item) => {
        console.log(item.sum, item.num, item.sellingPrice)
        sumdata += Number(item.num * item.sellingPrice)
      })
      return sumdata.toFixed(2)
    },
    countH () {
      let sumdata = 0
      this.cartItems.forEach((item) => {
        console.log(item.sum, item.num, item.vipPrice)
        sumdata += Number(item.num * item.vipPrice)
      })
      return sumdata.toFixed(2)
    },
    sumTo () {
      let numTodata = 0
      this.cartItems.forEach((item) => {
        numTodata += Number(item.num)
      })
      return numTodata
    },
  },
  watch: {
    search: function () {
      this.debounce(300, this.loadInfoByBarcode)
    },
  },
  mounted () {
    this.initWeixin()
  },
  methods: {
    cancel () {
      this.$refs.popupItems.close()
      this.search = ''
    },
    openHistory () {
      this.$refs.popupClient.open()
      shoppingCartService.getShoppingCarts().then((res) => {
        let data = res.data.data
        console.log(data)
        if (data) {
          this.histroyCarts = []
          data.forEach((item) => {
            this.histroyCarts.push(item)
          })
        }
      })
    },
    initWeixin () {
      let jssdk = weixinService.setWxJsdk(
        encodeURIComponent(location.href.split('#')[0])
      )
      console.log(jssdk)
    },
    async scanBarcode () {
      if (!this.cart.user.code) {
        this.$refs.popup.open()
        return
      }
      if (isWx()) {
        let _this = this
        jssdk.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['barCode'], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
            let results = result.split(',')
            if (results.length > 1) {
              result = results[1]
            }
            _this.search = result
          },
          fail: function (error) {
            uni.showToast({ title: error, icon: 'none' })
          },
        })
      } else {
        this.search = Math.ceil(Math.random() * 100)
      }
      //加载商品信息
    },
    debounce (wait, fun) {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setTimeout(() => {
        fun()
      }, wait)
    },
    addItemToItems (item) {
      //添加商品到商品列表
      //如果列表中存在 者增加数量
      let index = this.cartItems.findIndex((tmpItem) => tmpItem.id == item.id)
      //初始化数量
      item.num = 1
      if (index != -1) {
        let targetItems = this.cartItems.filter(
          (tmpItem) => tmpItem.id == item.id
        )
        let targetItem = targetItems[0]
        targetItem.num += item.num
        this.$set(this.cartItems, index, targetItem)
        shoppingCartService.updateSCartItems(
          this.cart.uuid,
          targetItem.id,
          targetItem.num
        )
      } else {
        this.cartItems.push(item)
        shoppingCartService.updateSCartItems(this.cart.uuid, item.id, item.num)
      }
      uni.showToast({
        title: '添加成功',
      })
      this.search = ''
      //添加进购物车
    },
    itemNumChange (item) {
      shoppingCartService.updateSCartItems(this.cart.uuid, item.id, item.num)
    },
    callBackSetting () {
      //确定设置
      if (this.cart.user.code == '' || !this.cart.user.code) {
        uni.showToast({
          title: '请将内容填写完毕',
          icon: 'none',
        })
        return
      }
      this.cart.uuid = UUID()
      console.log(this.cart.uuid)
      this.$refs.popup.close()
      //初始化购物车
      shoppingCartService.initShoppingCart(
        this.cart.uuid,
        this.cart.user.code,
        this.cart.user.code
      )
      //继续扫码
      this.scanBarcode()
    },
    async loadInfoByBarcode () {
      if (!this.search) {
        return
      }
      uni.showLoading({
        title: '加载中',
      })
      let rs = await request({
        url: '/item/findItems?search=' + this.search + '&status=' + 0,
        method: 'get',
      })
      uni.hideLoading()
      //处理rs 转换为商品列表
      rs = rs.data.data
      rs.forEach((item) => {
        item.surplusDays = this.surplusDays(item.endTime)
        item.univalence = item[this.univalences[this.userType]]
        item.num = Number(item.num || -1)
      })
      this.popupItems = rs
      //如果扫码查询结果 大于1 提供选择界面
      if (rs.length > 1) {
        this.$refs.popupItems.open()
      } else if (rs.length == 1) {
        //只有1条，加入列表
        this.addItemToItems(rs[0])
      } else {
        //商品不存在或没有库存，请先调整库存或入库
        this.$refs.popupItems.open()
      }
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
      this.cartItems.forEach((item) => {
        item.univalence = item[this.univalences[this.userType]]
      })
    },
    removeItem (id) {
      this.cartItems = this.cartItems.filter((item) => {
        return item.id != id;
      })
      shoppingCartService.deleteSCartItem(this.cart.uuid, id);
    },
    addCart (item) {
      this.addItemToItems(item)
      this.$refs.popupItems.close()
    },
    temporaryStore () {
      if (this.cartItems.length === 0) {
        uni.showToast({
          title: '目前没有商品可暂存',
          icon: 'none',
        })
        return null
      }
      this.cartItems = []
      this.cart = { user: { code: '' } }
      console.log(this.cart, "this.cart")
      this.$forceUpdate()
      this.$refs.popupSum.close()
      uni.showToast({
        title: '暂存成功',
      })
    },
    clearHistoryCart (uuid) {
      shoppingCartService.deleteSCart(uuid)
      this.histroyCarts = this.histroyCarts.filter((cart) => {
        return cart.uuid != uuid
      })
    },
    toHistoryCart (cart) {
      this.cart = { user: { code: '' } }
      this.cart.uuid = cart.uuid
      this.cart.user.code = cart.code
      //1 查询出， 购物车的商品和数量，
      shoppingCartService.getSCartItems(cart.uuid).then((res) => {
        res = res.data
        uni.showToast({
          title: res.message,
        })
        this.cartItems = []
        if (res.code == 200) {
          res.data.forEach((item) => {
            item.surplusDays = this.surplusDays(item.endTime)
            item.univalence = item[this.univalences[this.userType]]
            item.num = Number(item.num || -1)
            this.cartItems.push(item)
          })
        }
      })
      this.$refs.popupClient.close()
    },
    createOrder () {
      let priceType = this.univalences[this.array[this.index]]
      console.log(this.cartItems, this.cart.uuid)
    }
  },
}
</script>

<style>
page {
  background-color: #f5f5f5;
}
.bead {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
  padding: 10px;
  z-index: 99;
}
.bade-name {
  text-align: center;
  line-height: 36px;
}
.contnet {
  padding: 0 0 80px 0;
}
.fiex-bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 80px;
  line-height: 40px;
  padding: 0 10px;
  box-sizing: border-box;
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
  box-sizing: border-box;
  z-index: 99;
  padding: 10px;
}
.popup-item-btn {
  position: fixed;
  bottom: 0;
  right: 0;
  height: 30px;
  width: 100%;
  padding-right: 10px;
  background-color: #fff;
  z-index: 99;
  padding: 10px;
}
.popup-items {
  height: 505px;
}

.popup-iten-conten {
  height: 400px;
  background-color: #f5f5f5;
}
.popupItems-false {
  text-align: center;
  padding-top: 20px;
}
.popupSum {
  width: 300px;
  border-radius: 5px;
  padding: 10px;
  background-color: #fff;
}
.popupSum-item {
  width: 300px;
  height: 500px;
  overflow: auto;
  background-color: #fff;
}
.btn-storage button {
  background-color: #f5f5f5;
}
.btn-delivery button {
  background-color: #409eff;
  color: #fff;
}
.btn-storage,
.btn-delivery {
  padding-top: 10px;
}
.popupSum-nav {
  padding-bottom: 5px;
}
.popupClient {
  width: 140px;
  height: 100%;
  background-color: #f5f5f5;
}
.popupClient-title {
  padding: 10px 0;
  font-size: 16px;
  text-align: center;
}
.popipClient-content {
  position: relative;
  background: #fff;
  padding: 10px;
  margin: 2px;
}
.icon-delete {
  position: absolute;
  right: 3px;
  top: 3px;
  font-size: 15px;
  color: rgb(212, 76, 76);
}
</style>
