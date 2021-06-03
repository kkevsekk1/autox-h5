<template>
  <view class="modifyMaterial-box">
    <uni-row class="material-name">
      <uni-col :span="7">
        <view class="material-text">素材名称：</view>
      </uni-col>
      <uni-col :span="17">
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
                  auto-height=true
                  :class="verifyRed.textareaRed" />

      </uni-col>
      <view class="textarea-text"
            v-show="verifyRed.textareaRed">请输入素材内容</view>
    </uni-row>
    <view class="bottom-btn">
      <button @click="closePopup('save')"
              class="save">确定保存</button>
      <button @click="closePopup('cancel')">返回</button>
    </view>
  </view>
</template>

<script>
import { request } from '../../server/request.js';
export default {
  data () {
    return {
      id: "",
      materialName: '',
      materialContent: '',
      verifyRed: {
        inputRed: '',
        textareaRed: ''
      }
    }
  },
  onLoad (option) {
    this.id = option.id
  },
  created () {
    this.getMaterialList()
  },
  methods: {
    closePopup (e) {
      if (e == "cancel") {
        uni.reLaunch({ url: "/pages/material/index" })
      }
      if (e == "save") {
        if (!this.id) {
          this.materiaContent()
        } else {
          this.addMateria()
        }
      }
    },
    addMateria () {
      let data = { id: this.id, text: this.materialContent, name: this.materialName }
      request({
        url: "/material/updateText",
        method: "post",
        data: data
      })
        .then(res => {
          let { code, message } = res.data
          if (code == 200) {
            uni.showToast({
              title: message,
            })
            setTimeout(() => {
              uni.reLaunch({ url: "/pages/material/index" })
            }, 1000)
          }
        })
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
          let { code, message } = res.data
          if (code == 200) {
            uni.showToast({
              title: message,
            })
            setTimeout(() => {
              uni.reLaunch({ url: "/pages/material/index" })
            }, 1000)
          }
        })
    },
    getMaterialList () {
      let data = { size: 999 }
      request({
        url: "/material/getTextPage",
        method: "post",
        data: data
      })
        .then(res => {
          let { code, data } = res.data
          if (code === 200) {
            data.list.forEach(element => {
              if (element.id == this.id) {
                let { materialURL, materialName } = element
                this.materialName = materialName
                this.materialContent = materialURL
              }
            });
          }
        })
    },
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
  position: fixed;
  bottom: 0;
  right: 0;
  background-color: #fff;
  width: 100%;
  padding: 10px 20px;
}
.bottom-btn button {
  float: right;
  height: 35px;
  margin-left: 10px;
  line-height: 35px;
  font-size: 16px;
}
.bottom-btn .save {
  background-color: #409efe;
  color: #fff;
}
.bottom-btn button .material-text {
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
  margin-bottom: 40px;
}
.border-red {
  border: 1px solid #f56c6c;
}
.textarea-text,
.input-text {
  color: #f56c6c;
  font-size: 12px;
  position: absolute;
}
.textarea-text {
  bottom: 20px;
}
.input-text {
  bottom: -30px;
  left: 190rpx;
}
</style>