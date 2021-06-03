<template>
  <view >
    <set-params style="margin-top: 20px;" :scriptId="scriptId"
                ref="setParams"></set-params>
                <view style="height:80px;">&nbsp;</view>
    <view class="uni-btn" v-if="true">
      <button @click="next()"
              :disabled="runable"
              class="uni-btn-submit">试运行</button>
      <button class="uni-btn-default"
              @click="btnReturn()">返回</button>
    </view>
    <uni-popup ref="popup" type="message"  >
	    <uni-popup-message :type="msgType" :message="msgContent" :duration="5000"></uni-popup-message>
    </uni-popup>
    
  </view>
</template>
<script>
import SetParams from '../ykapp/setParams'
import { request } from '../../server/request.js'
export default {
  components: {
    SetParams
  },
  data () {
    return {
      scriptId: 104,
      path: "",
      entrance: "",
      checkedGroup: "",
      runable: false,
      msgContent:"",
      msgType:""
    }
  },
  onLoad (option) {
    this.scriptId = option.id||104;
  },
  methods: {
    next () {
        let rs = this.checkParams(this.$refs.setParams.scriptParams);
        if (rs == 0) {
          this.toast("正在处理...");
          this.running(this.$refs.setParams.scriptParams,[],this.$refs.setParams.scriptName);
        } else {
          this.toast(rs.name + " 不能为空！");
        }
    },
    running (taskParams, devices, taskName) {
      const data = this.dealSubmitData(taskParams, devices, taskName);
      request({
        url: "/task/addTask",
        method: "post",
        data: data
      }).then(res => {
        const { code, message,data} = res.data;
        if (code === 200) {
          this.submitSuccess();
          this.loadCode(data.insertId);
        } else {
          this.toast(message);
        }
      });
    },
    loadCode(taskId){
      request({
        url: "/task/getRunCode?taskId="+taskId,
        method: "GET",
      }).then(res => {
        const { code, message,data} = res.data;
        if (code === 200) {
           try {
             android.runScript(data.code,data.name);
             uni.showToast({ title: "启动成功", duration:2000})
             this.msgType="success"
             this.msgContent="【AutoXjs】仅能试运行脚本，"+10+"分钟后关闭！\r\n长期运行，请联系第三授权方或自助开通！";
             this.$refs.popup.open("center")
           } catch (error) {
             this.msgType="error"
             this.msgContent="错误\r\n"+error+"\r\n请在【AutoXjs】app中运行";
             this.$refs.popup.open("center")
           }
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
      const deviceIds = [-1,-2];
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
     uni.navigateBack();
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
