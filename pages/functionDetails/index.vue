<template>
  <view>
    <uni-row class="area">
      <uni-col :span="24"
               class="title">
        <text>{{features.name}} </text>
        <text class="scriptVersion"> {{features.scriptVersion}} </text>
        <text class="updateTime">{{features.updateTime}}</text>
      </uni-col>
      <uni-col :span="12"
               class="col-parameter">
        <text>适配：</text>
        <text>
          <text>{{features.appName}} </text>
          <text> v{{features.appVersion}} </text>
        </text>
      </uni-col>
      <uni-col :span="12"
               class="col-parameter">
        <text>开发者：</text>
        <text> {{features.username}}</text>
      </uni-col>
      <uni-col :span="12"
               class="col-parameter">
        <text>运行次数：</text>
        <text>{{features.playCount}}</text>
      </uni-col>
      <uni-col :span="24"
               class="col-parameter">
        <text>试运行：</text>
        <text> {{specs.tryTime}}分钟 </text>
        <text class="tryTime"> 如未授权,试用{{specs.tryTime}}分钟后停止</text>
      </uni-col>
    </uni-row>
    <uni-row class="area">
      <uni-col :span="24">
        <buy-way v-if="specs&&empower"
                 :empower="empower"
                 :specs="specs"
                 @buy="buy"></buy-way>
      </uni-col>
    </uni-row>
    <uni-row class="area">
      <uni-col :span="24"
               class="detail">
        <view class="title">介绍说明</view>
        <view class="detail-content">
          <rich-text :nodes="detail"></rich-text>
        </view>
      </uni-col>
    </uni-row>
  </view>
</template>

<script>
import { request } from '../../server/request.js';
import { formatTime } from '../../utils/format.js'
import buyWay from './buyWay'
export default {
  components: {
    buyWay
  },
  data () {
    return {
      features: "",
      specs: "",
      detail: "",
      empower: {},
    }
  },
  created () {
    this.functionDetails()
    this.getIsEmpower()
  },
  methods: {
    functionDetails () {
      request({
        url: "/script/getScript?id=" + this.$route.query.id,
        method: "get",
      })
        .then(res => {
          let { code, data } = res.data
          if (code === 200) {
            data.updateTime = formatTime(data.updateTime)
            this.features = data
            this.specs = JSON.parse(data.specs) || ""
            this.detail = data.detail
          }
        })
    },
    getIsEmpower () {
      let data = {
        scriptId: this.$route.query.id,
      }
      request({
        url: "/userscript/seleteUserScript",
        method: "post",
        data: data
      })
        .then(res => {
          let { code, data } = res.data
          console.log(res)
          if (code == 200) {
            let { endTime, chargeWay, unitPrice, deviceCount } = data
            let newTime = new Date(endTime).getTime()
            let oldTime = new Date().getTime()
            let lefttime = newTime - oldTime
            let leftd = Math.floor(lefttime / (1000 * 365 * 24))
            this.empower = {
              endTime: leftd,
              chargeWay: chargeWay,
              unitPrice: unitPrice,
              deviceCount: deviceCount,
            }
          }
          if (res.data.message === "用户尚未授权该脚本") {
            this.empower.isEmpower = "未授权"
          } else {
            this.empower.isEmpower = "当前授权："
          }
        })
    },
    buy (data) {
      data.scriptId = this.$route.query.id
      request({
        url: "/userScript/buy",
        method: "post",
        data: data
      })
        .then(res => {
          let { message } = res.data
          if (message == "余额不足") {
            uni.showToast({
              title: message,
              icon: "none"
            })
            return
          }
          uni.showToast({
            title: message
          })
        })
    }
  }
}
</script>

<style>
page {
  background-color: #f5f5f5;
}
.area {
  margin-bottom: 2px;
  padding: 10px;
  background-color: #fff;
}
.title {
  position: relative;
  margin: 2px 0;
  font-size: 16px;
  font-weight: 600;
}
.updateTime {
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: 12px;
  color: #7a7a7a;
  font-weight: 500;
}
.scriptVersion {
  margin-left: 18px;
  font-size: 14px;
  font-weight: 500;
  color: #409efe;
}
.col-parameter {
  margin: 1px 0;
  font-size: 12px;
  color: #7a7a7a;
}
.tryTime {
  margin-left: 10px;
  color: red;
  font-size: 10px;
}
.detail {
  margin-top: 30px;
}
.detail-title {
  margin: 10px 0;
  font-size: 14px;
  font-weight: 700;
}
.detail-content {
  word-wrap: break-word;
  padding: 0 5px;
  font-size: 12px;
}
</style>