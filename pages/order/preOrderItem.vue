<template>
  <view class="preOrderItem">
    <uni-row :gutter="20"
             class="content">
      <uni-col :span="24"
               class="col-class">
        <view class="title">
          <text>{{ item.title }}</text>
          <text>（{{ item.surplusDays }}天）</text>
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
        <text style="color: red">单价：{{ item.univalence }}</text>
      </uni-col>
    </uni-row>
    <uni-row>
      <uni-col :span="16"
               class="col-class"
               style="margin-top:5px">
        <uni-row>
          <uni-col :span="10"> 数量： </uni-col>
          <uni-col :span="14"
                   style="  position: relative">
            <lxc-count @handleCount="handleCountClick"
                       class="lxc-count"
                       :max="item.surplusStock"
                       :value="item.num"
                       :delayed="100">
            </lxc-count>
          </uni-col>
        </uni-row>
      </uni-col>
      <uni-col :span="8"
               class="col-class"
               style="padding-left: 5px;margin-top:5px">
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
  props: ['item', 'num'],
  data () {
    return {
      sum: this.item.univalence
    }
  },
  watch: {
    num () {
      this.handleCountClick(this.num)
    },
    'item.univalence' () {
      this.countSum()
    }
  },
  methods: {
    deleteItem () {
      this.$emit('deleteItem', this.item.id)
    },
    handleCountClick (val) {
      this.item.num = val
      this.countSum()

    },
    countSum () {
      this.sum = this.item.num * this.item.univalence
      this.item.sum = this.sum
      this.$emit("subtotal")
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
  top: -4px;
  left: -49px;
}
</style>
