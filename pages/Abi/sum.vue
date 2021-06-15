<template>
  <view class="sum">
    <view class="sum-title"> {{title}} </view>
    <view class="sum-input">
      <text>￥</text>
      <input type="number"
             v-model="inputNumber">
      <text class="iconfont sum-input-empty"
            @click="emptyBuyNumber"
            v-show="inputNumber">&#xe62f;</text>
    </view>
    <view class="sum-balance"
          v-show="balance">
      <text v-show="!isExceed">
        <text>A币余额：{{balance}} </text>
      </text>
      <text v-show="isExceed">
        <text style="color:#ff3030;">输入金额超过可用余额</text>
      </text>
    </view>
  </view>
</template>

<script>
export default {
  props: ['title', 'balance'],
  data () {
    return {
      inputNumber: "",
      isExceed: false,
    }
  },
  watch: {
    inputNumber (index) {
      this.isExceed = Number(index) > Number(this.balance) ? true : false;
      let data = {
        index: index,
        isExceed: this.isExceed
      }
      this.$emit("inputNumber", data)
    },
  },
  methods: {
    emptyBuyNumber () {
      this.inputNumber = ''
    },
  }
}
</script>

<style>
.sum {
  padding: 10px;
  border-radius: 10px;
  background-color: #fff;
}
.sum-title {
  margin-top: 10px;
  font-size: 14px;
}
.sum-input {
  display: flex;
  margin: 20px 0 10px 0;
  align-items: center;
  font-size: 30px;
}
.sum-input input {
  font-size: 35px;
  display: inline-block;
}
.sum-input-empty {
  font-size: 25px;
  color: #dbdbdb;
}
.sum-balance {
  border-top: 1px solid #f5f5f5;
  padding-top: 8px;
  font-size: 12px;
  color: #999;
}
</style>