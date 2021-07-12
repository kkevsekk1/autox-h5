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
    <uni-row :gutter="0"
             class="content">
      <uni-col :span="4"
               class="col-class">
        <text>{{ item.subTitle }}</text>
      </uni-col>
      <uni-col :span="6"
               class="col-class">
        <text style="font-size: 12px">
          存：{{ item.surplusStock | formatTotal }}{{ item.unit }}</text>
      </uni-col>
      <uni-col :span="7"
               v-show="userType != '代理'"
               class="col-class">
        <text style="font: 10px sans-serif">普通：</text>
        <text style="color: red">￥{{ item.sellingPrice}}</text>
      </uni-col>
      <uni-col :span="7"
               v-show="userType != '代理'"
               class="col-class">
        <text style="font: 10px sans-serif">会员：</text>
        <text style="color: red">￥{{ item.vipPrice }}</text>
      </uni-col>
      <uni-col :span="14"
               v-show="userType == '代理'"
               class="col-class">
        <text style="font: 10px sans-serif">代理：</text>
        <text style="color: red">￥{{ item.proxyPrice }}</text>
      </uni-col>
    </uni-row>
    <uni-row>
      <uni-col :span="10"
               class="col-class"
               style="margin-top: 5px">
        <uni-row>
          <uni-col :span="12"> 数量</uni-col>
          <uni-col :span="12"
                   style="position: relative">
            <lxc-count @handleCount="handleCountClick"
                       class="lxc-count"
                       :max="item.surplusStock"
                       :value="item.num"
                       :delayed="100">
            </lxc-count>
          </uni-col>
        </uni-row>
      </uni-col>
      <uni-col :span="7"
               v-show="userType != '代理'"
               class="col-class"
               style="padding-left: 5px; margin-top: 5px"><text style="font-size: 10px">普合：</text>
        <text>{{ sumP }}</text>
      </uni-col>
      <uni-col :span="7"
               v-show="userType != '代理'"
               class="col-class"
               style="padding-left: 5px; margin-top: 5px"><text style="font-size: 10px">会合：</text>
        <text>{{ sumH }}</text>
      </uni-col>
      <uni-col :span="14"
               v-show="userType == '代理'"
               class="col-class">
        <text style="font: 10px sans-serif">代合：</text>
        <text style="color: red">￥{{ numProxy }}</text>
      </uni-col>
    </uni-row>
  </view>
</template>

<script>
import lxcCount from '@/components/lxc-count/lxc-count.vue'
export default {
  components: {
    lxcCount,
  },
  props: {
    userType: {
      type: String,
    },
    item: {
      type: Object,
      num: {
        type: Number,
        default: 1,
      },
      univalence: null,
      title: null,
      surplusStock: null,
      unit: null,
      subTitle: null,
    },
  },
  data () {
    return {}
  },
  computed: {
    sumP: function () {
      return (this.item.sellingPrice * this.item.num).toFixed(2)
    },
    sumH: function () {
      return (this.item.vipPrice * this.item.num).toFixed(2)
    },
    numProxy () {
      return (this.item.proxyPrice * this.item.num).toFixed(2)
    }
  },
  watch: {
    'item.num': {
      handler (nv, ov) {
        this.handleCountClick(nv)
      },
    },
  },
  methods: {
    deleteItem () {
      this.$emit('deleteItem', this.item.id)
    },
    handleCountClick (val) {
      this.item.num = val
      this.$emit("itemNumChange", this.item);
    },
  },
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
