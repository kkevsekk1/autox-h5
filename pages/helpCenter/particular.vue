<template>
  <view class="particular-box">
    <view class="title"> {{title}} </view>
    <view class="content"> {{content}} </view>
    <uni-row class="feedback">
      <uni-col :span="12"
               class="solve-col">
        <view class="solve"
              :class="solve =='up'?'solveGreen':''"
              @click="solve='up'">
          <view class="iconfont">&#xe9a2;</view>
          <view>已解决</view>
        </view>
      </uni-col>
      <uni-col :span="12"
               class="solve-col">
        <view class="solve"
              :class="solve=='down'?'solveGreen':''"
              @click="solve='down'">
          <view class="iconfont">&#xe9a4;</view>
          <view>未解决</view>
        </view>
      </uni-col>
    </uni-row>
  </view>
</template>

<script>
export default {
  data () {
    return {
      solve: "",
      title: "",
      content: "",
    }
  },
  onLoad () {
    let helpCenter = uni.getStorageSync("helpCenter")
    this.title = helpCenter.title
    this.content = helpCenter.content
  },
}
</script>

<style>
page {
  background-color: #f5f5f5;
}
.particular-box {
  padding: 0 15px;
  background-color: #fff;
}
.title {
  position: relative;
  height: 60px;
  line-height: 60px;
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: 700;
}
.title::after {
  content: "";
  display: block;
  height: 2px;
  border-bottom: 1px solid #dfdfdf;
}
.content {
  padding-top: 20px;
  font-size: 16px;
  line-height: 24px;
}
.feedback {
  padding: 30px 0;
}
.solve-col {
  text-align: center;
}
.solve {
  display: inline-block;
  width: 105px;
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  border: 1px solid #919191;
  color: #919191;
  border-radius: 5px;
}
.solveGreen {
  border: 1px solid #039702;
  color: #039702;
}
.solve view {
  display: inline-block;
}
.solve view:nth-child(1) {
  margin-right: 5px;
}
</style>