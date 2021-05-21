<template>
  <view class="setParameter">
    <view class="nav">
      <view class="title">
        <text>{{ scriptName }}（{{ scriptId }}）</text>
      </view>
      <uni-row :gutter="12">
        <view v-for="(param, index) in scriptParams" :key="index">
          <!-- 输入框 -->
          <uni-col style="text-align: right" :span="6" v-if="param.type == 1">
            <view>{{ param.name }}</view>
          </uni-col>
          <uni-col :span="18" v-if="param.type == 1">
            <uni-easyinput
              v-model="param.defaultValue"
              placeholder="请输入内容"
            ></uni-easyinput>
          </uni-col>
          <!-- 下拉菜单 -->
          <uni-col
            style="text-align: right"
            :span="6"
            v-if="param.type == 2 || param.type == 4"
          >
            <view>{{ param.name }}</view>
          </uni-col>
          <uni-col :span="18" v-if="param.type == 2 || param.type == 4">
            <picker
              @change="bindPickerChange($event, scriptParams, param)"
              :value="param.defaultValue"
              :range="param.checkValue">
              <view class="uni-input">{{ param.checkedValue }}</view>
            </picker>
          </uni-col>
          <!-- 多选框 -->
          <uni-col :span="param.span" :offset="param.offset" v-if="param.type == 3">
            <checkbox value="checkbox1"><text>{{ param.name }}</text></checkbox>
          </uni-col>
        </view>
      </uni-row>
    </view>
  </view>
</template>
<script>
import { request } from '../../server/request.js'
export default {
  props: {
    scriptId: Number | String,
  },
  data() {
    return {
      rememberParams: null,
      scriptParams: null,
      materials: null,
      scriptName: '加载...',
    }
  },
  async created() {
    uni.showLoading({ title: '加载中' })
    await this.loadMaterials()
    let rememberParams = await this.loadRemember()
    this.rememberParams = JSON.parse(rememberParams)
    await this.loadScript()
    console.log()
    this.convertParams(rememberParams)
    this.convertLayout()
    uni.hideLoading()
    this.$forceUpdate()
  },
  methods: {
    loadScript() {
      return new Promise((resolve, reject) => {
        request({
          url: '/script/getScript?id=' + this.scriptId,
          method: 'get',
        }).then((res) => {
          let {
            data: { name: scriptName, taskParameter: scriptParams },
            code,
          } = res.data
          if (code === 200) {
            this.scriptParams = scriptParams
            this.scriptName = scriptName
            resolve(code)
          }
        })
      })
    },
    loadRemember() {
      return new Promise((resolve, reject) => {
        request({
          url: '/userScript/remember?scriptId=' + this.scriptId,
          method: 'get',
        }).then((res) => {
          let { data, code } = res.data
          if (code === 200) {
            resolve(data)
          }
        })
      })
    },
    loadMaterials() {
      const data = {
        index: 1,
        size: 10000,
      }
      return new Promise((resolve, reject) => {
        request({
          url: '/material/getTextPage',
          method: 'post',
          data,
        }).then((res) => {
          this.materials = {}
          const {
            data: { list = [] },
          } = res.data
          list.forEach((material) => {
            this.materials[material.id] = material.materialName
          })
          resolve(this.materials)
        })
      })
    },
    bindPickerChange(e, params, param) {
      let index = e.target.value
      params.forEach((item) => {
        if (item.key == param.key) {
          item.checkedValue = param.checkValue[index]
          item.defaultValue = param.checkKey[index]
        }
      })
      this.$forceUpdate()
    },
    convertLayout() {
      let type = -1
      let gindex = -1
      let tmpParam = null
      let lastParam = null
      for (let index = 0; index < this.scriptParams.length; index++) {
        const param = this.scriptParams[index]
        if (param.type == 3 && param.type != type) {
          //start
          gindex = 0
          tmpParam = param
        }
        if (param.type == 3) {
          //
          gindex++
          param.gindex = gindex
        }
        if (param.type !== 3 && type == 3) {
          //end
          tmpParam.total = gindex
          lastParam.total = tmpParam.total
        }
        type = param.type
        lastParam = param
      }
      this.scriptParams.forEach((item) => {
        item.offset=0;
        if (item.gindex) {
          console.log(item.total, item.gindex)
          item.span = 9
          if (item.gindex % 2 == 1) {
            item.offset=6
            if (item.total == item.gindex) {
              item.span = 15
            }
          }
        }
      })
    },
    convertParams(rememberParams) {
      this.scriptParams.forEach((param) => {
        if (rememberParams &&rememberParams[param.key] && rememberParams[param.key] != '') {
          param.defaultValue = rememberParams[param.key]
        }
        if (param.type === 2) {
          //普通选择
          //checkValue 数组，checkedValue选中的显示值，defaultValue 放置参数值
          param.checkKey = param.checkValue
          if (param.defaultValue instanceof Array) {
            param.checkedValue = param.checkValue[0]
            param.defaultValue = param.checkKey[0]
          }
        }
        if (param.type === 4) {
          //素材
          param.checkValue = []
          param.checkKey = []
          let index = 0
          for (let key in this.materials) {
            const value = this.materials[key]
            param.checkValue.push(value)
            param.checkKey.push(value)
            if (index == 0 || param.defaultValue == key) {
              param.checkedValue = value //默认显示值
              param.defaultValue = key //程序使用的值
            }
            index++
          }
        }
        if (param.type === 3) {
          if (param.defaultValue == 'true' || param.defaultValue == 1) {
            param.defaultValue = true
          }
          if (param.defaultValue == 'false' || param.defaultValue == 0) {
            param.defaultValue = false
          }
        }
      })
    },
  },
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
