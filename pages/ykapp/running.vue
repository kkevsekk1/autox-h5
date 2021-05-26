<template>
  <view class="setParameter-box">
    <view class="runnig-header">
      <view class="header">
        <text v-for="(step,index) in steps"
              :key="index"
              :class="{classGreen:index<stepIndex}">{{step}}</text>
      </view>
    </view>
    <set-params v-show="stepIndex==1"
                :scriptId="scriptId"
                ref="setParams"></set-params>
    <choice-device v-show="stepIndex==2"
                   ref="choiceDevice"></choice-device>
    <view class="uni-btn">
      <button v-show="stepIndex==1"
              @click="next()"
              class="uni-btn-submit">下一步</button>
      <button v-show="stepIndex==2"
              @click="next()"
              class="uni-btn-submit">运行</button>
      <button class="uni-btn-default"
              @click="btnReturn()">返回</button>
    </view>
  </view>
</template>
<script>
import SetParams from './setParams.vue'
import choiceDevice from './choiceDevice.vue'
export default {
  components: {
    SetParams, choiceDevice
  },
  data () {
    return {
      steps: ['选择功能', '设置参数', '选择设备', '运行'],
      stepIndex: 1,
      scriptId: 104,
    }
  },
  onLoad (option) {
    this.scriptId = option.id;
  },
  methods: {
    next () {
      // console.log(this.$refs.setParams.scriptParams, "参数");
      // console.log(this.$refs.choiceDevice.getCheckedDevices());
      if (this.stepIndex == 2) {
        if (this.$refs.choiceDevice.getCheckedDevices().length == 0) {
          alert("至少选一个设备");
        }
        // else {
        //   this.stepIndex++;
        // }
      }
      if (this.stepIndex == 1) {
        let rs = this.checkParams(this.$refs.setParams.scriptParams);
        if (rs == 0) {
          this.stepIndex++;
        } else {
          alert(rs.name + " 不能为空！");
        }
      }
    },
    btnReturn () {
      if (this.stepIndex > 1) {
        this.stepIndex--;
      } else {
        history.back()
      }
    },
    checkParams (params) {
      for (let index = 0; index < params.length; index++) {
        var param = params[index];
        var exp = param.defaultValue;
        // console.log(param, exp == 'undefined' || !exp || !/[^\s]/.test(exp));
        if (exp == 'undefined' || !exp || !/[^\s]/.test(exp)) {
          return { name: param.name };

        }
      }
      return 0;
    }
  }
}
</script>
<style>
.runnig-header {
  width: 100%;
  position: fixed;
  top: 0;
  background-color: #f5f7fa;
  z-index: 99;
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
  content: "";
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
  content: "";
  display: none;
}
.uni-btn {
  position: fixed;
  bottom: 0;
  right: 10px;
  width: 100%;
  padding: 10px 0;
  background-color: #fff;
  overflow: hidden;
  height: 40px;
  line-height: 40px;
}
.uni-btn-submit {
  float: right;
  width: 100px;
  margin-left: 10px;
  background-color: #409eff;
  color: #fff;
  font-size: 14px;
}
.uni-btn-default {
  float: right;
  width: 140rpx;
  font-size: 14px;
  color: #606266;
}
</style>
