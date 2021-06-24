<template>
  <view class="preOrderItem">
    <view class="title">
      <text>{{item.title}}</text>
      <view class="iconfont icon-delete"
            @click="deleteItem">&#xe62f;</view>
    </view>
    <uni-row :gutter=20
             class="content">
      <uni-col :span="8"
               class="col-class">
        <text>{{item.subTitle}}</text>
      </uni-col>
      <uni-col :span="8"
               class="col-class">
        <text> 库存： {{item.surplusStock}}{{item.unit}}</text>
      </uni-col>
      <uni-col :span="8"
               class="col-class">
        <text style="color:red">单价：{{univalence}}</text>
      </uni-col>
      <uni-col :span="8"
               class="col-class">
        <text>剩余：{{surplusTime}} 天</text>
      </uni-col>
      <uni-col :span="8"
               class="col-class">
        <uni-row>
          <uni-col :span="10">
            数量：
          </uni-col>
          <uni-col :span="14">
            <input v-model="item.purchaseNumber"
                   style="font-size:14px;color:red;"
                   placeholder-style="font-size:14px;"
                   placeholder="数量">
          </uni-col>
        </uni-row>
      </uni-col>
      <uni-col :span="8"
               class="col-class">
        <text>小计：{{sum}} 元</text>
      </uni-col>
    </uni-row>
  </view>
</template>

<script>
export default {
  props: ['item', 'userType'],
  computed: {
    univalence () {
      let univalences = {
        '普通': 'sellingPrice',
        '会员': 'vipPrice',
        '代理': 'proxyPrice',
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
      let days = ((until - now) / 1000 / 3600 / 24) + 1;
      return Math.floor(days);
    },
    sum () {
      let sum = this.item.purchaseNumber * this.univalence
      this.subtotal(sum)
      return sum
    }
  },
  data () {
    return {
    }
  },
  watch: {
    'item.purchaseNumber' () {
      if (Number(this.item.purchaseNumber) > Number(this.item.surplusStock)) {
        this.item.purchaseNumber = ''
      }
    }
  },
  methods: {
    deleteItem () {
      this.$emit('deleteItem', this.item.id)
    },
    subtotal (sum) {
      let data = {
        id: this.item.id,
        sum: sum
      }
      this.$emit("subtotal", data)
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
  font-size: 14px;
  margin-top: 10px;
}
.col-class {
  margin-bottom: 5px;
}
</style>