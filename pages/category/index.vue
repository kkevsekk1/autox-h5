<template>
  <view class="index-box">
    <view class="header-title">全部分类</view>
    <view class="search">
      <input
        type="text"
        placeholder-style="sont-size:14px"
        placeholder="搜索商品"
        v-model="search"
      />
      <text class="iconfont search-iconfon">&#xe617;</text>
    </view>
    <view class="content">
      <scroll-view
        class="content-left"
        scroll-y="true"
        :style="{ height: `${contentLeftHeighe - 45}px` }"
      >
        <text
          class="content-left-nav"
          :class="{ selected: curIndex == -1 }"
          @click="itemType(-1, '')"
          >全部</text
        >
        <text
          class="content-left-nav"
          v-for="(item, index) in navList"
          :key="index"
          :class="{ selected: curIndex == index }"
          @click="itemType(index, item.contentVal)"
        >
          {{ item.name }}
        </text>
      </scroll-view>
      <view>
        <view class="typeOrderBy" v-if="items.length != 0">
          <text
            v-for="(sortType, index) in sortTypes"
            :key="index"
            @click="changeSort(sortType)"
          >
            <text :class="{ orderByRed: curSort.type === sortType.type }">{{
              sortType.name
            }}</text>
            <text v-show="sortType.type == 'price'" class="typeOrderBy-name">
              <text
                class="iconfont typeOrderBy-name-before"
                :class="{
                  orderByRed: curSort.vector == 'asc' && curSort.type == 'price',
                }"
                >&#xea4c;</text
              >
              <text
                class="iconfont typeOrderBy-name-after"
                :class="{
                  orderByRed: curSort.vector == 'desc' && curSort.type == 'price',
                }"
                >&#xea4d;</text
              >
            </text>
          </text>
        </view>
        <scroll-view
          class="content-right"
          scroll-y="true"
          @scrolltolower="reachBottom"
          :style="{ height: `${contentLeftHeighe - 30 - 45}px` }"
        >
          <view class="content-right-nav" v-for="item in items" :key="item.id">
            <item-single
              class="item-single"
              :item="item"
              @handleCount="toChangeCart"
              @imgClick="showImgs"
            />
          </view>
        </scroll-view>
      </view>
    </view>
    <view class="footer" @click="showOrHiddenCart">
      <view
        class="footer-img"
        :class="{ backgroundGray: cart.items.length == 0 }"
      >
        <text class="iconfont">&#xe6ab;</text>
      </view>
      <text class="footer-content">
        <text
          class="footer-selling-sum"
          :class="{ colorGray: cart.items.length == 0 }"
        >
          <text class="iconfont footer-icon">&#xe657;</text>
          <text> {{ countP }} </text>
        </text>
        <text
          class="footer-vip-sum"
          :class="{ colorGray: cart.items.length == 0 }"
        >
          <text class="iconfont footer-icon-vip">&#xe601;</text>
          <text class="iconfont footer-icon">&#xe657;</text>
          <text>{{ countH }}</text>
        </text>
      </text>
      <view
        class="footer-createOrder"
        :class="{ backgroundGray: cart.items.length == 0 }"
        @click.stop=""
        >去结算</view
      >
    </view>
    <!-- 图片弹窗 -->
    <popup-picture ref="popupPicture" :popupPicture="popupPicture" />
    <!-- 购物车 -->
    <popup-cart
      ref="popupCart"
      :items="cart.items"
      @sweepCart="cleanCart"
      @handleCount="toChangeItemsNumber"
    />
  </view>
</template>

<script>
import itemSingle from './itemSingle '
import popupPicture from './popupPicture'
import popupCart from './popupCart'
import { request } from '../../server/request.js'
import shoppingCartService from '../../server/ShoppingCartService'
export default {
  components: { itemSingle, popupPicture, popupCart },
  computed: {
    contentLeftHeighe() {
      let height = document.documentElement.clientHeight - 93
      return height
    },
    countP() {
      let sumdata = 0
      this.cart.items.forEach((item) => {
        // console.log(item.sum, item.buyNunber, item.sellingPrice,'---')
        sumdata += Number(item.buyNunber * item.sellingPrice)
      })
      return sumdata.toFixed(2)
    },
    countH() {
      let sumdata = 0
      this.cart.items.forEach((item) => {
        // console.log(item.sum, item.buyNunber, item.vipPrice)
        sumdata += Number(item.buyNunber * item.vipPrice)
      })
      return sumdata.toFixed(2)
    },
  },

  watch: {
    search() {
      this.debounce(300)
    },
  },
  data() {
    return {
      popupPicture: {
        itemId: '',
        itemTitle: '',
        pictures: [],
      },
      cart: {
        uuid: 'appuser',
        showCart: false,
        items: [],
      },
      curSort: {
        type: 'id',
        vector: 'desc',
      },
      //
      search: '',
      type: '',
      page: { index: 1, size: 15, orderBy: 'id desc', count: 1000 },
      //
      curIndex: -1,
      navList: [],
      items: [],
      timer: '',
      typeIndex: 0,
      fid: -1,
      sortTypes: [
        {
          name: '综合',
          type: 'id',
        },
        {
          name: '价格',
          type: 'price',
        },
      ],
    }
  },
  async created() {
    this.fid = uni.getStorageSync('fid')
    this.getCategoryType('商品类型')
    await this.loadShoppingCart()
    this.loadItems()
  },
  onPullDownRefresh() {
    this.page.index = 1
    this.items = []
    this.loadItems()
    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 1000)
  },
  methods: {
    async loadShoppingCart() {
      if (uni.getStorageSync('token')) {
        let res = await shoppingCartService.getSCartItems(this.cart.uuid)
        res = res.data
        if (res.code == 200) {
          res.data.forEach((item) => {
            item.buyNunber = item.num
            this.cart.items.push(item)
          })
        }
        // console.log(res, '加载购车')
      }
    },
    reachBottom() {
      console.log(this.page.index*this.page.size,this.page.count,'-----')
      if(this.page.index*this.page.size<this.page.count){
        this.page.index++;
        this.loadItems();
      }else{
        uni.showToast({ title: '没有更多了', iccon: 'none' })
      }
    },
    debounce(wait) {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setTimeout(() => {
        this.page.index = 1
        this.items = []
        this.loadItems()
      }, wait)
    },
    loadItems() {
      uni.showLoading({ title: '加载中' })
      let data = {
        search: this.search,
        fid: this.fid,
        orderby: this.page.orderBy,
        index: this.page.index,
        size: this.page.size,
        type: this.type,
      }
      console.log(data)
      request({
        url: '/item/items',
        method: 'post',
        data,
      }).then((res) => {
        uni.hideLoading()
        let {
          code,
          data: { count, index, list },
        } = res.data

        if (code == 200) {
          this.page.index = index
          this.page.count = count
         list.forEach((item) => {
            item.buyNunber = 0
            if (this.cart.items.length > 0) {
              this.cart.items.forEach((res) => {
                if (res.id === item.id) {
                  item.buyNunber = res.buyNunber
                }
              })
            }
            this.items.push(item)
          })
        }
      })
    },
    getCategoryType(type) {
      request({
        url: '/system/getDictByType?shopId=' + this.fid + '&type=' + type,
        method: 'get',
      }).then((res) => {
        let { code, data } = res.data
        if (code == 200) {
          this.navList = data
        }
      })
    },
    itemType(index, type) {
      this.curIndex = index
      this.type = type
      this.items = []
      this.loadItems()
    },
    showImgs(id) {
      this.popupPicture.itemId = id
      this.popupPicture.pictures = []
      let item = this.items.find((res) => res.id == id)
      this.popupPicture.itemTitle = item.title
      try {
        item.pictures = JSON.parse(item.picture)
      } catch (error) {}
      if (item.pictures && item.pictures.length !== 0) {
        item.pictures.forEach((res) => {
          this.popupPicture.pictures.push(res)
        })
        this.$refs.popupPicture.open()
      }
    },
    changeSort(sortType) {
      if(this.curSort.type==sortType.type&&sortType.type=='id'){
        return;
      }
      this.curSort.type= sortType.type; 
      if (sortType.type == 'price') {
        this.curSort.vector = this.curSort.vector === 'asc' ? 'desc' : 'asc'
      } 
       if (sortType.type == 'id') {
           this.curSort.vector='desc';
       }
       let type = this.curSort.type;
       if(type=='price'){
          type='vipPrice'; 
       }
      this.page.orderBy = type + ' ' + this.curSort.vector;
      this.page.index=1;
      this.items = []
      this.loadItems()
    },

    toChangeCart(data) {
      console.log('去修改购车数量')
      let { num, itemId } = data
      if (num != 0) {
        let item = this.cart.items.find((item) => {
          return item.id == itemId
        })
        if (!item) {
          item = this.items.find((item) => {
            return item.id == itemId
          })
          this.cart.items.push(item)
        }
        item.buyNunber = num
        shoppingCartService.updateSCartItems(this.cart.uuid, itemId, num)
      } else {
        this.cart.items = this.cart.items.filter((item) => {
          if (item.id == itemId) {
            shoppingCartService.deleteSCartItem(this.cart.uuid, itemId)
            return false
          } else {
            return true
          }
        })
      }
    },
    showOrHiddenCart() {
      if (this.cart.items.length == 0 && !this.showCart) {
        uni.showToast({
          title: '你还没有挑选商品',
          icon: 'none',
          duration: 2000,
        })
        return
      }
      this.showCart = !this.showCart
      if (this.showCart) {
        this.$refs.popupCart.open()
      } else {
        this.$refs.popupCart.close()
      }
      console.log(this.cart.items)
    },
    cleanCart() {
      console.log('情况购物车')
      shoppingCartService.deleteSCart(this.cart.uuid)
      this.cart.items = []
      this.items.forEach((item) => {
        item.buyNunber = 0
      })
      this.$refs.popupCart.close()
    },
    toChangeItemsNumber(data) {
      let { num, itemId } = data
      console.log('去修改items的数量', this.cart.items, num, Number(num) != 0)
      if (num != 0) {
        //添加或修改
        for (let index = 0; index < this.items.length; index++) {
          const item = this.items[index]
          if (item.id == itemId) {
            item.buyNunber = num
            break
          }
        }
        shoppingCartService.updateSCartItems(this.cart.uuid, itemId, num)
      } else {
        this.cart.items = this.cart.items.filter((item) => {
          if (item.id == itemId) {
            console.log(item, itemId, '--------')
            shoppingCartService.deleteSCartItem(this.cart.uuid, itemId)
            return false
          }
          return true
        })
      }
    },
  },
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
