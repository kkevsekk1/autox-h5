<template>
  <view>
    <view class="head">详情</view>
    <view class="particular-box">
      <view class="title"> {{title}} </view>
      <view class="content"> {{content}} </view>
      <uni-row class="feedback">
        <uni-col :span="12"
                 class="solve-col">
          <view class="solve"
                :class="solve =='up'?'solveGreen':''"
                @click="solveClick('up')">
            <view class="iconfont">&#xe9a2;</view>
            <view>已解决</view>
          </view>
        </uni-col>
        <uni-col :span="12"
                 class="solve-col">
          <view class="solve"
                :class="solve=='down'?'solveGreen':''"
                @click="solveClick('down')">
            <view class="iconfont">&#xe9a4;</view>
            <view>未解决</view>
          </view>
        </uni-col>
      </uni-row>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      solve: "",
      title: "",
      content: "",
      index: 1
    }
  },
  onLoad () {
    let helpCenter = uni.getStorageSync("helpCenter")
    this.title = helpCenter.title
    this.content = helpCenter.content
  },
  methods: {
    solveClick (e) {
      if (this.index === 1) {
        this.index++
        this.solve = e
      }
    }
  }
}
</script>

<style>
page {
  background-color: #f5f5f5;
}
.head {
  position: fixed;
  top: 0;
  text-align: center;
  height: 40px;
  line-height: 40px;
  font-size: 20px;
  font-weight: 800;
  width: 100%;
  background: #ececec;
  z-index: 99;
}
.particular-box {
  padding: 0 15px;
  padding-top: 40px;
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