<template>
  <view class="container">
    <view class="search-content">
      <input type="text"
             v-model="shopName"
             ref="search"
             v-on:keydown.13="searchShop"
             placeholder="请搜索商家名称">
    </view>
    <view class="search">
      <img src="../../static/search.png"
           alt="">
    </view>
    <view v-for="item in shopData"
          :key="item.shopId">
      <view class="shop-list"
            @click="bindCode(item.shopId)">
        <view class="content">
          <view>
            <img class="shop-img"
                 src="../../static/shopLogo.png"
                 alt="">
          </view>
          <view class="shop-name">{{ item.shopName }}</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { request } from '../../server/request.js'
export default {
  data () {
    return {
      codeId: '',
      shopList: [],
      shopData: [],
      shopName: "",
      pages: {
        index: 1,
        size: 10,
        count: 0
      },
    }
  },
  created () {
    this.initialData()
  },
  onLoad: function (option) {
    const item = JSON.parse(decodeURIComponent(option.codeId));
    this.codeId = item
  },
  onReachBottom () {
    // 当前页大于等于总页数
    if (this.pages.index >= this.pages.count) {
      uni.showToast({ title: '到底啦', icon: 'none' })
    } else {
      this.pages.index++
      this.getShopList()
    }
    // 进入下一页
  },
  onPullDownRefresh () {
    this.initialData()
    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 1000)
  },
  methods: {
    initialData () {
      this.getShopList()
    },
    searchShop () {
      request({
        url: '/auth/getShopPage',
        method: 'post',
        data: { index: this.pages.index.toString(), size: '15', search: this.shopName, orderby: 'id desc' }
      }).then((res) => {
        if (res.data.data.count != 0) {
          this.shopData = []
          let tmplist = []
          res.data.data.list.forEach((shop) => {
            tmplist.push(shop.name)
            this.shopData.push({ shopName: shop.name, shopId: shop.id })
          })
        } else {
          uni.showToast({
            title: '暂无该商家',
            icon: 'none'
          });
        }
      })
    },
    bindCode (id) {
      request({
        url: '/qrcode/bindingshop',
        method: 'get',
        data: { shopId: id, qrcodeId: this.codeId },
      }).then((res) => {
        uni.showToast({
          title: res.data.message,
          icon: 'none'
        });
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/index/index'
          });
        }, 2000);
      })
    },
    getShopList () {
      request({
        url: '/auth/getShopPage',
        method: 'post',
        data: { index: this.pages.index.toString(), size: '15', search: '', orderby: 'id desc' },
      }).then((loadresult) => {
        let { code, message, data } = loadresult.data
        if (code === 200) {
          this.pages = {
            count: data.pages,
            index: data.index,
            size: data.size
          };
          let tmplist = []
          data.list.forEach((shop) => {
            tmplist.push(shop.name)
            this.shopData.push({ shopName: shop.name, shopId: shop.id })
          })
          this.shopList.push({ letter: '商家', data: tmplist })
          console.log(this.shopData)
        } else {
          uni.showToast({ title: message, icon: 'none' })
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
.container {
  position: relative;
}
.search img {
  display: block;
  width: 36rpx;
  height: 36rpx;
  position: absolute;
  top: 18rpx;
  left: 50rpx;
}
.search-content {
  height: 70rpx;
  border: 2rpx solid #999999;
  border-radius: 35rpx;
  background-color: white;
  margin: 5rpx 20rpx 40rpx 20rpx;
}
.search-content input {
  display: block;
  position: absolute;
  top: 14rpx;
  left: 86rpx;
}
.shop-list .content {
  height: 100rpx;
  margin: 0 20rpx 10rpx 20rpx;
  background-color: white;
  position: relative;
  border-radius: 10rpx;
}
.shop-list .shop-img {
  display: block;
  width: 70rpx;
  height: 70rpx;
  position: absolute;
  top: 16rpx;
  left: 40rpx;
}
.shop-list .shop-name {
  position: absolute;
  top: 35rpx;
  left: 132rpx;
  font-size: 30rpx;
  color: #007aff;
  font-weight: bold;
}
</style>