<template>
  <view class="setParameter-box">
    <view class="runnig-header">
      <view class="header">
        <text v-for="(step,index) in steps"
              :key="index"
              :class="{classGreen:index<stepIndex}">{{step}}</text>
      </view>
    </view>
    <set-params style="padding: 60px 0px 100px 0px;" v-show="stepIndex==1"
                :scriptId="scriptId"
                ref="setParams"></set-params>
    <choice-device v-show="stepIndex==2"
                   :entrance="entrance"
                   ref="choiceDevice"></choice-device>
    <view class="uni-btn">
      <button v-show="stepIndex==1"
              @click="next()"
              class="uni-btn-submit">下一步</button>
      <button v-show="stepIndex==2"
              @click="next()"
              :disabled="runable"
              class="uni-btn-submit">运行</button>
      <button class="uni-btn-default"
              @click="btnReturn()">返回</button>
    </view>
  </view>
</template>
<script>
import SetParams from './setParams.vue'
import choiceDevice from './choiceDevice.vue'
import { request } from '../../server/request.js'
export default {
  components: {
    SetParams, choiceDevice
  },

  data () {
    return {
      steps: ['选择功能', '设置参数', '选择设备', '运行'],
      stepIndex: 1,
      scriptId: 104,
      path: "",
      entrance: "",
      checkedGroup: "",
      runable: false,
    }
  },
  onLoad (option) {
    this.scriptId = option.id;
    this.path = option.path
    this.entrance = option.entrance
    this.checkedGroup = option.checkedGroup
  },
  methods: {
    next () {
      if (this.stepIndex == 2) {
        let devices =this.$refs.choiceDevice.getCheckedDevices();
        if (devices.length == 0) {
           this.toast('至少选一个设备');
           return;
        } else {

          if(this.$refs.setParams.chargeWay==3&&devices.length>this.$refs.setParams.deviceCount){
          this.toast('共'+devices.length+'台,超过授权设备数');
           return ;
          }
          this.running(this.$refs.setParams.scriptParams,devices, this.$refs.setParams.scriptName);
        }
      }
      if (this.stepIndex == 1) {
        if( (new Date(this.$refs.setParams.endTime).getTime())-(new Date().getTime())<0){
           this.toast('授权过期,请联系授权人员');
           return ;
        }
        let rs = this.checkParams(this.$refs.setParams.scriptParams);
        if (rs == 0) {
          this.stepIndex++;
        } else {
          alert(rs.name + " 不能为空！");
        }
      }
    },
    running (taskParams, devices, taskName) {
      const data = this.dealSubmitData(taskParams, devices, taskName);
      request({
        url: "/task/addTask",
        method: "post",
        data: data
      }).then(res => {
        const { code, message } = res.data;
        if (code === 200) {
          this.submitSuccess();
          this.toast(taskName + ",已运行");
        } else {
          this.toast(message);
        }
      });
    },
    submitSuccess () {
      this.runable = true;
      setTimeout(() => {
        this.runable = false;
      }, 5000);
    },
    toast (msg) {
      uni.showToast({ title: msg, icon: 'none' })
    },
    dealSubmitData (taskParams, devices, taskName) {
      taskParams = taskParams.filter((task) => { return Number(task.type) !== 5; });
      const paramsObj = Object.fromEntries(taskParams.map(item => [item.key, item.defaultValue]));
      const deviceIds = [-1];
      devices.forEach(device => {
        deviceIds.push(device.id);
      });
      const data = {
        name: taskName,
        scriptId: this.scriptId,
        deviceIds: deviceIds,
        runParameter: paramsObj,
        status: 1,
        type: 1
      };
      return data;
    },
    btnReturn () {
      if (this.stepIndex > 1) {
        this.stepIndex--;
      } else if (this.entrance == 'formMenu') {
        uni.reLaunch({
          url: this.path
        })
      } else {
        uni.reLaunch({
          url: this.path + "?checkedGroup=" + this.checkedGroup
        })
      }
    },
    checkParams (params) {
      for (let index = 0; index < params.length; index++) {
        var param = params[index];
        var exp = param.defaultValue;
        if (param.type != 5) {
          if (exp == 'undefined' || !exp || !/[^\s]/.test(exp)) {
            if (exp === true || exp === false) {
              continue;
            }
            return { name: param.name };
          }
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
