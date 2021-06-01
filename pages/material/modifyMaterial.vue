<template>
  <view class="modifyMaterial-box">
    <uni-row class="material-name">
      <uni-col :span="6">
        <view class="material-text">素材名称：</view>
      </uni-col>
      <uni-col :span="18">
        <input type="text"
               placeholder="素材名称"
               v-model="materialName"
               class="material-input"
               :class="verifyRed.inputRed">
      </uni-col>
      <view class="input-text"
            v-show="verifyRed.inputRed">请输入素材名称</view>
    </uni-row>
    <uni-row class="material-main">
      <uni-col :span="24">
        <view class="material-text">素材内容：</view>
      </uni-col>
      <uni-col :span="24">
        <textarea placeholder="素材内容"
                  maxlength=-1
                  v-model="materialContent"
                  style="width: auto;padding:5px"
                  class="material-textarea"
                  :class="verifyRed.textareaRed" />
      </uni-col>
      <view class="textarea-text"
            v-show="verifyRed.textareaRed">请输入素材内容</view>
    </uni-row>
    <view class="bottom-btn">
      <button @click="closePopup('save')">确定保存</button>
      <button @click="closePopup('cancel')">返回</button>
    </view>
  </view>
</template>

<script>
import { request } from '../../server/request.js';
export default {
  data () {
    return {
      materialName: '',
      materialContent: '',
      verifyRed: {
        inputRed: '',
        textareaRed: ''
      }
    }
  },
  onLoad (option) {
    let { id, name, describe } = option
    this.materialName = name
    this.materialContent = describe
  },
  methods: {
    closePopup (e) {
      if (e == "cancel") {
        uni.reLaunch({ url: "/pages/material/index" })
      }
      if (e == "save") {
        this.materiaContent()
      }
    },
    materiaContent () {
      this.verifyRed = {
        inputRed: '',
        textareaRed: ''
      }
      if (!this.materialName || !this.materialContent) {
        if (!this.materialName) {
          this.verifyRed.inputRed = 'border-red'
        }
        if (!this.materialContent) {
          this.verifyRed.textareaRed = 'border-red'
        }
      }
      this.addMaterial()
    },
    addMaterial () {
      let materiaData = {
        name: this.materialName,
        text: this.materialContent
      }
      request({
        url: "/material/addText",
        method: "post",
        data: materiaData
      })
        .then(res => {
          let { code } = res.data
          if (code == 200) {
            uni.reLaunch({ url: "/pages/material/index" })
          }
        })
    }
  }
}
</script>

<style>
.modifyMaterial-box {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  overflow: hidden;
}
.material-name {
  height: 35px;
  line-height: 35px;
}
.material-main {
  margin-top: 20px;
}
.material-main,
.material-name {
  position: relative;
}
.bottom-btn {
  overflow: hidden;
  margin-top: 70px;
}
.bottom-btn button {
  float: right;
  height: 35px;
  margin-left: 10px;
  line-height: 35px;
  font-size: 16px;
  background-color: #2cb1f6;
  color: #fff;
}
.material-text {
  font-size: 16px;
}
.material-input,
.material-textarea {
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  padding-left: 5px;
}
.material-input {
  height: 35px;
}
.material-textarea {
  margin-top: 10px;
}
.border-red {
  border: 1px solid #f56c6c;
}
.textarea-text,
.input-text {
  color: #f56c6c;
  font-size: 14px;
  position: absolute;
}
.textarea-text {
  bottom: -22px;
}
.input-text {
  bottom: -30px;
  left: 82px;
}
</style>