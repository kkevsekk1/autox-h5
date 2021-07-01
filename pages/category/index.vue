<template>
  <view class="index-box">
    <view>{{data}}</view>
    <view class="header-title">全部分类</view>
    <view class="search">
      <input type="text"
             placeholder-style="sont-size:14px"
             placeholder="搜索商品"
             v-model="search">
      <text class="iconfont search-iconfon">&#xe617;</text>
    </view>
    <view class="content">
      <scroll-view class="content-left"
                   scroll-y="true"
                   :style="{ height: `${contentLeftHeighe-45}px` }">
        <text class="content-left-nav"
              :class="{ selected: curIndex == -1  }"
              @click="itemType(-1,'')">全部</text>
        <text class="content-left-nav"
              v-for="(item,index) in navList"
              :key="index"
              :class="{ selected: curIndex == index  }"
              @click="itemType(index,item.contentVal)">
          {{item.name}}
        </text>
      </scroll-view>
      <view>
        <view class="typeOrderBy"
              v-if="items.length!=0">
          <text v-for="orderBy,index in typeOrderBys"
                :key="index"
                @click="typeOrderBy(index,orderBy.type,priceOrderBy )">
            <text :class="{orderByRed:typeIndex === index}">{{orderBy.name}}</text>
            <text v-show="orderBy.type =='price'"
                  class="typeOrderBy-name">
              <text class="iconfont typeOrderBy-name-before"
                    :class="{orderByRed:priceOrderBy == 'asc' && typeIndex === index}">&#xea4c;</text>
              <text class="iconfont typeOrderBy-name-after"
                    :class="{orderByRed:priceOrderBy == 'desc' && typeIndex === index}">&#xea4d;</text>
            </text>
          </text>
        </view>
        <scroll-view class="content-right"
                     scroll-y="true"
                     @scrolltolower="reachBottom"
                     :style="{ height: `${contentLeftHeighe-30-45}px` }">
          <view class="content-right-nav"
                v-for="(item,index) in items"
                :key="index">
            <item-single class="item-single"
                         :item="item"
                         @handleCount="addCart"
                         @openLogo="openLogo" />
          </view>
        </scroll-view>
      </view>
    </view>
    <view class="footer"
          @click="ifPopupCart">
      <view class="footer-img"
            :class="{backgroundGray:cart.items.length ==0}">
        <text class="iconfont">&#xe6ab;</text>
      </view>
      <text class="footer-content">
        <text class="footer-selling-sum"
              :class="{colorGray:cart.items.length ==0}">
          <text class="iconfont footer-icon">&#xe657;</text>
          <text> 1345 </text>
        </text>
        <text class="footer-vip-sum"
              :class="{colorGray:cart.items.length ==0}">
          <text class="iconfont  footer-icon-vip">&#xe601;</text>
          <text class="iconfont footer-icon">&#xe657;</text>
          <text>12345</text>
        </text>
      </text>
      <view class="footer-createOrder"
            :class="{backgroundGray:cart.items.length ==0}"
            @click.stop="createOrder">去结算</view>
    </view>
    <!-- 图片弹窗 -->
    <popup-picture ref="popupPicture"
                   :popupPicture="popupPicture" />
    <!-- 购物车 -->
    <popup-cart ref="popupCart"
                :items="cart.items"
                @sweepCart="sweepCart"
                @handleCount="updateItems" />
  </view>
</template>

<script>
import Items from "../../server/Items"
import itemSingle from './itemSingle '
import popupPicture from './popupPicture'
import popupCart from './popupCart'
import { request } from '../../server/request.js'
export default {
  components: { itemSingle, popupPicture, popupCart },
  computed: {
    contentLeftHeighe () {
      let height = document.documentElement.clientHeight - 93
      return height
    }
  },
  watch: {
    search () {
      this.debounce(300)
    }
  },
  data () {
    return {
      data: Items.data,
      popupPicture: {
        itemId: "",
        itemTitle: "",
        pictures: [],
      },
      cart: {
        ifCart: false,
        items: [],
      },
      shopId: "-1",
      search: "",
      priceOrderBy: "asc",
      orderBy: "id desc",
      type: '',
      page: { index: 1, size: 999, },
      curIndex: -1,
      navList: [],
      items: [],
      timer: '',
      typeIndex: 0,
      typeOrderBys: [
        {
          name: "综合",
          type: "id"
        },
        {
          name: "价格",
          type: "price"
        }
      ]
    }
  },
  created () {
    this.getCategoryType('商品类型')
    this.gatItems()
  },
  onPullDownRefresh () {
    this.page.index = 1;
    this.items = [];
    this.gatItems();
    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 1000)
  },
  methods: {
    reachBottom () {
      uni.showToast({ title: '到底了', iccon: 'none' })
    },
    debounce (wait) {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setTimeout(() => {
        this.page.index = 1;
        this.items = [];
        this.gatItems();
      }, wait)
    },
    gatItems () {
      uni.showLoading({ title: '加载中' });
      let data = { search: this.search, fid: '2', orderBy: this.orderBy, index: this.page.index, size: this.page.size, type: this.type };
      console.log(data)
      request({
        url: '/item/items',
        method: 'post',
        data,
      }).then((res) => {
        uni.hideLoading()
        let { code, data: { count, index, list, size } } = res.data
        if (code == 200) {
          this.page = {
            index: index,
            size: size,
            count: count
          }

          list.forEach(item => {
            item.picture = JSON.parse(item.picture)
            if (item.picture) {
              item.commodityLogo = item.picture[0]
            }
            item.buyNunber = 0
            if (this.cart.items.length > 0) {
              this.cart.items.forEach(res => {
                if (res.id === item.id) {
                  item.buyNunber = res.buyNunber

                }
              })
            }
            this.items.push(item)
          });
        }
      })
    },
    getCategoryType (type) {
      request({
        url: '/system/getDictByType?shopId=' + this.shopId + '&type=' + type,
        method: 'get',
      })
        .then(res => {
          let { code, data } = res.data
          if (code == 200) {
            this.navList = data
          }
        })
    },
    itemType (index, type) {
      this.curIndex = index
      this.type = type
      this.items = []
      this.gatItems()
    },
    openLogo (id) {
      this.popupPicture.itemId = id
      this.popupPicture.pictures = []
      let item = this.items.filter(res => res.id == id)[0]
      this.popupPicture.itemTitle = item.title
      if (item.picture && item.picture.length !== 0) {
        item.picture.forEach(res => {
          this.popupPicture.pictures.push(res)
        })
        this.$refs.popupPicture.open()
      }
    },
    typeOrderBy (index, type, priceOrderBy) {
      let order
      this.typeIndex = index
      if (type == 'price') {
        this.priceOrderBy = priceOrderBy === "asc" ? 'desc' : 'asc';
        order = this.priceOrderBy
      } else {
        this.priceOrderBy = 'desc'
        order = "desc"
      }
      this.orderBy = type + ' ' + order
      this.items = []
      this.gatItems();
    },
    addCart (data) {
      let { num, itemId } = data
      let cartItems = this.cart.items
      let tmp
      for (let index = 0; index < cartItems.length; index++) {
        if (cartItems[index].id === itemId) {
          tmp = cartItems[index]
          break
        }
      }
      if (tmp) {
        cartItems.forEach(item => {
          if (item.id == itemId) {
            item.buyNunber = num
          }
        })
      } else {
        this.items.forEach(item => {
          if (item.id == itemId) {
            item.buyNunber = num
            cartItems.push(item)
          }
        })
      }
      if (num == 0) {
        this.cart.items = this.cart.items.filter(item => {
          return item.id != itemId
        });
      }
      console.log(data)
      // this.cart.items = this.items.filter(item => item.buyNunber !== 0)
    },
    ifPopupCart () {
      if (this.cart.items.length == 0) {
        return
      }
      this.ifCart = !this.ifCart
      if (this.ifCart) {
        this.$refs.popupCart.open()
      } else {
        this.$refs.popupCart.close()
      }
      console.log(this.cart.items)
    },
    sweepCart () {
      this.cart.items = []
      this.items.forEach(item => {
        item.buyNunber = 0
      })
      this.$refs.popupCart.close()
    },
    updateItems (data) {
      let { num, itemId } = data
      this.items.forEach(item => {
        if (item.id === itemId) {
          item.buyNunber = num
        }
      })
      if (num == 0) {
        this.cart.items = this.cart.items.filter(item => {
          return item.id != itemId
        });
      }
      console.log(this.cart.items)
    },
    createOrder () {
      Items.createOrder = this.cart.items
      uni.navigateTo({
        url: "/pages/createOrder/index"
      })
    }
  }
}
</script>

<style>
.index-box {
  font-size: 14px;
}
.header-title {
  text-align: center;
  height: 44px;
  line-height: 44px;
  font-size: 16px;
  font-weight: 700;
}
.search {
  position: relative;
  padding: 6px;
}
.search input {
  padding-left: 40px;
  font-size: 14px;
  height: 32px;
  line-height: 32px;
  border-radius: 16px;
  color: #6d6d6d;
  background-color: #f7f7f7;
}
.search-iconfon {
  position: absolute;
  top: 10px;
  left: 20px;
  font-size: 20px;
  color: #6d6d6d;
}
.content {
  display: flex;
  padding-top: 5px;
}
.content-left {
  width: 100px;
  background-color: #f8f8f8;
}
.content-left-nav {
  display: block;
  text-align: center;
  height: 45px;
  line-height: 45px;
}
.selected {
  background-color: #fff;
  font-weight: 700;
}
.content-right-nav {
  padding: 10px;
}
.typeOrderBy {
  display: flex;
}
.typeOrderBy text {
  flex: 1;
  height: 30px;
  line-height: 30px;
  text-align: center;
}
.orderByRed {
  color: #fa2209;
}
.typeOrderBy-name {
  position: relative;
  top: 0;
  color: #999;
  font-size: 14px;
}
.typeOrderBy-name-before {
  position: absolute;
}
.typeOrderBy-name-after {
  position: absolute;
}
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 45px;
  line-height: 45px;
  padding-right: 110px;
  padding-left: 50px;
  box-sizing: border-box;
  background-color: #fff;
  z-index: 100;
}
.footer-createOrder {
  position: absolute;
  top: 5px;
  right: 10px;
  width: 100px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  font-size: 15px;
  font-weight: 800;
  border-radius: 17px;
  color: #fff;
  background: #9266f9;
}
.footer-img {
  position: absolute;
  top: 2px;
  left: 10px;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 20px;
  background-color: #9266f9;
}
.footer-img text {
  font-size: 20px;
  color: #fff;
  display: inline-block;
  transform: translate(-1px, 2px);
}
.footer-content {
  padding-left: 10px;
}
.footer-selling-sum,
.footer-vip-sum {
  font-weight: 800;
}
.footer-selling-sum {
  font-size: 16px;
  color: #9266f9;
}
.footer-vip-sum {
  padding-left: 10px;
  font-size: 14px;
  color: #ff4b36;
}
.footer-icon {
  font-size: 12px;
}
.footer-icon-vip {
  transform: translateY(2px);
  display: inline-block;
  font-size: 20px;
}
.backgroundGray {
  background-color: #828283 !important;
}
.colorGray {
  color: #828283 !important;
}
</style>