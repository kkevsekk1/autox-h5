<template>
  <view class="setParameter-box">
    <view class="header">
      <text v-for="(step,index) in steps" :key="index"  :class="{classGreen:index<stepIndex}">{{step}}</text>
    </view>
    <set-params v-if="stepIndex==1" :scriptId="scriptId" ref="setParams" ></set-params>
    <choice-device v-if="stepIndex==2" ref ="choiceDevice" ></choice-device>
    <button @click="next()" >下一步</button>
  </view>
</template>
<script>
import SetParams from './setParams.vue'
import choiceDevice from './choiceDevice.vue'
export default {
  components: {
    SetParams,choiceDevice
  },
  data() {
    return {
      steps: ['选择功能', '设置参数', '选择设备', '运行'],
      stepIndex: 1,
      scriptId:104
    }
  },
  onLoad (option) {
    this.scriptId = option.id;
  },
   methods: {
     next(){
      this.stepIndex++;
       console.log(this.$refs.setParams.scriptParams);
       console.log(this.$refs.choiceDevice);
     }
   }
}
</script>
<style>
@font-face {
  font-family: 'iconfont';
  src: url('../../iconfont/iconfont.ttf?t=1621477806456') format('truetype');
}
.iconfont {
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.header {
  background-color: #f5f7fa;
  height: 50px;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header text {
  position: relative;
}
.classGreen {
  color: #67c239;
}
.header text::after {
  content: '';
  width: 10px;
  height: 10px;
  position: absolute;
  top: 2px;
  right: -23px;
  border-right: 1px solid #a6abb8;
  border-top: 1px solid #a6abb8;
  transform: rotate(45deg);
}
.header text:last-of-type::after {
  content: '';
  display: none;
}
.setParameter .nav {
  padding: 10px 10px;
  font-size: 28rpx;
  color: #606266;
}
.setParameter .nav .title {
  text-align: center;
  font-size: 20px;
  font-weight: 300;
}
.uni-form-input,
.uni-form--much,
.uni-title-picker {
  margin-top: 20px;
}
/* input框 */
.uni-form-input {
  height: 40px;
  line-height: 40px;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
}
.uni-form-input .title-input {
  float: left;
  margin-right: 10px;
}
.uni-form-input .uni-input {
  float: left;
  box-sizing: border-box;
  height: 40px;
  width: 80%;
  border: 1px solid #d7dae2;
  border-radius: 5px;
  font-size: 28rpx;
  padding-left: 10px;
}
/* 下拉菜单 */
.uni-title-picker {
  overflow: hidden;
  height: 40px;
  line-height: 40px;
  display: flex;
  justify-content: space-between;
}
.uni-title-picker .uni-list-cell-db,
.uni-title-picker .title-picker {
  float: left;
}
.uni-title-picker .uni-list-cell-db {
  height: 40px;
  width: 80%;
  margin-left: 10px;
  border: 1px solid #d7dae2;
  border-radius: 5px;
  padding-left: 10px;
  position: relative;
  box-sizing: border-box;
}
.uni-title-picker .uni-list-cell-db::after {
  content: '';
  width: 8px;
  height: 8px;
  position: absolute;
  top: 10px;
  right: 8px;
  border-right: 1px solid #a6abb8;
  border-bottom: 1px solid #a6abb8;
  transform: rotate(45deg);
}
/* 多选 */
.uni-form--much {
  overflow: hidden;
}
.uni-form--much .much {
  float: right;
  width: 80%;
}
.uni-form--much .label-much {
  width: 30%;
  margin-bottom: 10px;
}
.uni-btn {
  margin-top: 40px;
  overflow: hidden;
  height: 40px;
  line-height: 40px;
}
.uni-btn-default {
  float: right;
  width: 70px;
  font-size: 14px;
  color: #606266;
}
.uni-btn-submit {
  float: right;
  width: 100px;
  margin-left: 10px;
  background-color: #409eff;
  color: #fff;
  font-size: 14px;
}
</style>
