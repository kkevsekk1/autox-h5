<template>
  <view class="preOrderItem">
    <uni-row :gutter="20"
             class="content">
      <uni-col :span="24"
               class="col-class">
        <view class="title">
          <text>{{ item.title }}</text>
          <view class="iconfont icon-delete"
                @click="deleteItem">&#xe62f;</view>
        </view>
      </uni-col>
    </uni-row>
    <uni-row :gutter="20"
             class="content">
      <uni-col :span="8"
               class="col-class">
        <text>{{ item.subTitle }}</text>
      </uni-col>
      <uni-col :span="8"
               class="col-class">
        <text> 库存： {{ item.surplusStock }}{{ item.unit }}</text>
      </uni-col>
      <uni-col :span="8"
               class="col-class">
        <text style="color: red">单价：{{ univalence }}</text>
      </uni-col>
    </uni-row>
    <uni-row>
      <uni-col :span="8"
               class="col-class">
        <text>剩余：{{ surplusTime }} 天</text>
      </uni-col>
      <uni-col :span="8"
               class="col-class">
        <uni-row>
          <uni-col :span="10"> 数量： </uni-col>
          <uni-col :span="14"
                   style="  position: relative">
            <lxc-count @handleCount="handleCountClick"
                       class="lxc-count"
                       style="transform: scale(0.7);"
                       :value="item.num"
                       :delayed="100">
            </lxc-count>
          </uni-col>
        </uni-row>
      </uni-col>
      <uni-col :span="8"
               class="col-class"
               style="padding-left: 5px;">
        <text>小计：{{ sum }} 元</text>
      </uni-col>
    </uni-row>
  </view>
</template>

<script>
import lxcCount from '@/components/lxc-count/lxc-count.vue'
export default {
  components: {
    lxcCount
  },
  props: ['item', 'userType'],
  computed: {
    univalence () {
      let univalences = {
        普通: 'sellingPrice',
        会员: 'vipPrice',
        代理: 'proxyPrice',
      }
      return this.item[univalences[this.userType]] || ''
    },
    surplusTime () {
      if (!this.item.endTime) {
        return
      }
      let now = new Date()
      let date = this.item.endTime.slice(0, 10)
      let until = new Date(date)
      let days = (until - now) / 1000 / 3600 / 24 + 1
      return Math.floor(days)
    },
    sum () {
      let sum = this.item.num * this.univalence
      this.subtotal(sum)
      return sum
    },
  },
  data () {
    return {}
  },
  watch: {
    'item.num' () {
      if (Number(this.item.num) > Number(this.item.surplusStock)) {
        this.item.num = ''
      }
    },
  },
  methods: {
    deleteItem () {
      this.$emit('deleteItem', this.item.id)
    },
    subtotal (sum) {
      let data = {
        id: this.item.id,
        sum: sum,
      }
      this.$emit("subtotal", data)
    },
    handleCountClick (val) {
      this.item.num = val
    }
  }
}
</script>

<style>
.preOrderItem {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #fff;
}
.title {
  position: relative;
}
.title text {
  font-size: 16px;
  font-weight: 700;
}
.icon-delete {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 20px;
  color: rgb(212, 76, 76);
}
.content {
  margin-top: 10px;
}
.col-class {
  font-size: 14px;
  margin-bottom: 5px;
}
.lxc-count {
  position: absolute;
  top: -8px;
  left: -25px;
}
</style>
