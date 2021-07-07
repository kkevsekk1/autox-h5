<template>
  <view>
    <uni-popup ref="popupCart"
               type="bottom"
               background-color="#fff">
      <view class="popup-cart">
        <view class="header">
          <text>已选商品</text>
          <text @click="deleteCatr">
            <text class="iconfont">&#xe62b;</text>
            <text>清空</text>
          </text>
        </view>
        <scroll-view scroll-y="true"
                     :style="{ height: `${contentLeftHeighe - 200}px` }">
          <view class="content"
                style=" border-top:2px  solid #f8f8f8;"
                v-for="item in items"
                :key="item.id">
            <item-single class="item-single"
                         :item="item"
                         @handleCount=" handleCount" />
          </view>
        </scroll-view>
      </view>
    </uni-popup>
    <popup-confirm ref="popupDelete"
                   :confirm="confirm"
                   @notarize="notarize" />

  </view>
</template>

<script>
import itemSingle from './itemSingle '
import popupConfirm from './popupConfirm'
export default {
  components: { itemSingle, popupConfirm },
  props: ['items'],
  data () {
    return {
      confirm: {
        title: "清空购物车",
        btnRight: "清空"
      }
    }
  },
  computed: {
    contentLeftHeighe () {
      let height = document.documentElement.clientHeight - 93
      return height
    },
  },
  methods: {
    open () {
      this.$refs.popupCart.open()
    },
    close () {
      this.$refs.popupCart.close()
    },
    deleteCatr () {
      this.$refs.popupDelete.open()
    },
    notarize () {
      this.$emit("sweepCart")
    },
    handleCount (data) {
      this.$emit('handleCount', data)
    }
  }
}
</script>

<style>
.popup-cart {
  padding-bottom: 45px;
}
.header {
  padding: 10px;
  height: 30px;
  line-height: 30px;
}
.header text:nth-child(1) {
  font-size: 14px;
  font-weight: 700;
}
.header text:nth-child(2) {
  float: right;
  font-size: 12px;
  font-weight: 300;
  color: #999;
}
.item-single {
  padding: 10px;
}
</style>