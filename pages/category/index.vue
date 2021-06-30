<template>
  <view class="index-box">
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
                         @openLogo="openLogo" />
          </view>
        </scroll-view>
      </view>
    </view>
    <view class="footer">
      <view class="footer-img">
        <img src="../../static/8306ade4.png"
             alt="">
      </view>
      <text class="footer-content">
        <text class="footer-selling-sum">
          <text class="iconfont footer-icon">&#xe657;</text>
          <text> 1345 </text>
        </text>
        <text class="footer-vip-sum">
          <text class="iconfont  footer-icon-vip">&#xe601;</text>
          <text class="iconfont footer-icon">&#xe657;</text>
          <text>12345</text>
        </text>
      </text>
      <view class="footer-createOrder">去结算</view>
    </view>
    <!-- 图片弹窗 -->
    <uni-popup ref="popupPicture"
               type="bottom"
               background-color="#fff">
      <view @click="close"
            style="position:relative;height:40px;padding-top:5px;">
        <view class="popupPicture-itemTitle">{{itemTitle}}</view>
        <view class="popupPicture-itemId">商品码: {{itemId}} </view>
        <text class="iconfont popupPicture-icon"
              @click="close">&#xe62f;</text>
      </view>
      <scroll-view scroll-y="true"
                   style="height:500px;">
        <view v-for="(picture,index) in pictures"
              :key="index">
          <img class="popupPicture-img"
               :src="picture"
               alt="">
        </view>
      </scroll-view>
    </uni-popup>
  </view>
</template>

<script>
import itemSingle from './itemSingle '
import { request } from '../../server/request.js'
export default {
  components: { itemSingle },
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
      itemId: "",
      itemTitle: "",
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
      pictures: [],
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
    close () {
      this.$refs.popupPicture.close()
    },
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
      this.itemId = id
      this.pictures = []
      let item = this.items.filter(res => res.id == id)[0]
      this.itemTitle = item.title
      if (item.picture && item.picture.length !== 0) {
        item.picture.forEach(res => {
          this.pictures.push(res)
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
.popupPicture-icon {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 30px;
  color: #cecece;
}
.popupPicture-img {
  width: 100%;
  margin-bottom: 10px;
  padding: 0 10px;
  box-sizing: border-box;
}
.popupPicture-itemId,
.popupPicture-itemTitle {
  padding: 0 35px 0 10px;
}
.popupPicture-itemTitle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.popupPicture-itemId {
  font-size: 12px;
  color: #525252;
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
  top: 5px;
  left: 10px;
  width: 40px;
  height: 40px;
}
.footer-img img {
  width: 100%;
  height: 100%;
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
</style>