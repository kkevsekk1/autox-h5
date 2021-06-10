<template>
  <view class="setParameter">
    <view class="title">
      <text>{{ scriptName }}（{{ scriptId }}）</text>
    </view>
    <view style="margin-top:20px"
          v-if="scriptParams&&scriptParams.length==0">
      无需设置参数，点击下一步
    </view>
    <uni-row :gutter="12">
      <view v-for="(param, index) in scriptParams"
            :key="index">
        <!-- 输入框 -->
        <uni-col style="text-align: right"
                 :span="6"
                 v-if="param.type == 1">
          <view>{{ param.name }}</view>
        </uni-col>
        <uni-col :span="18"
                 v-if="param.type == 1">
          <uni-easyinput v-model="param.defaultValue"
                         :placeholder="param.des||'请输入'+param.name"></uni-easyinput>
          <view style="font-size:14px;color:green;line-height:20px">{{param.des}}</view>
        </uni-col>
        <!-- 下拉菜单 -->
        <uni-col style="text-align: right; "
                 :span="6"
                 v-if="param.type == 2 || param.type == 4">
          <view>{{ param.name }}</view>
        </uni-col>
        <uni-col :span="18"
                 v-if="param.type == 2 || param.type == 4">
          <picker @change="bindPickerChange($event, scriptParams, param)"
                  :value="param.defaultValue"
                  :range="param.checkValue"
                  class="pull-down-menu">
            <view>{{ param.checkedValue }}</view>
          </picker>
        </uni-col>
        <!-- 多选框 -->
        <uni-col :span="6"
                 v-if="param.type == 5"
                 style="line-height:20px;text-align: right;">
          <view>
            {{param.name}}
          </view>
        </uni-col>
        <uni-col :span="18"
                 v-if="param.type == 5"
                 style="line-height:20px;">
          <view style="font-size:12px;color:green;">
            {{param.des||"&nbsp;"}}
          </view>
        </uni-col>
        <uni-col :span="param.span"
                 :offset="param.offset"
                 v-if="param.type == 3"
                 style="line-height:20px">
          <view>
            <checkbox @click="checkBoxChange(param)"
                      :checked="param.defaultValue"
                      style="transform-origin:0 0 ; transform:scale(0.8)"><text style="font-size: 17.5px">{{ param.name }}</text></checkbox>
          </view>
        </uni-col>
      </view>
    </uni-row>
  </view>
</template>
<script>
import { request } from '../../server/request.js'
export default {
  props: {
    scriptId: Number | String,
  },
  data () {
    return {
      rememberParams: null,
      scriptParams: null,
      materials: null,
      scriptName: '加载...',
    }
  },
  async created () {
    uni.showLoading({ title: '加载中' })
    await this.loadMaterials()
    let rememberParamsStr = await this.loadRemember()
    this.rememberParams = JSON.parse(rememberParamsStr)
    await this.loadScript()
    this.convertParams(this.rememberParams)
    this.convertLayout()
    uni.hideLoading()
    this.$forceUpdate()
  },
  methods: {
    checkBoxChange (e) {
      e.defaultValue = !e.defaultValue;
      // console.log(e.defaultValue,e.name)
    },
    loadScript () {
      return new Promise((resolve, reject) => {
        request({
          url: '/script/getScript?id=' + this.scriptId,
          method: 'ge7t',
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
    loadRemember () {
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
    loadMaterials () {
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
    bindPickerChange (e, params, param) {
      let index = e.target.value
      params.forEach((item) => {
        if (item.key == param.key) {
          item.checkedValue = param.checkValue[index]
          item.defaultValue = param.checkKey[index]
        }
      })
      this.$forceUpdate()
    },
    convertLayout () {
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
        item.offset = 0;
        if (item.gindex) {
          item.span = 9
          if (item.gindex % 2 == 1) {
            item.offset = 6
            if (item.total == item.gindex) {
              item.span = 18
            }
          }
        }
      })
    },
    convertParams (rememberParams) {
      this.scriptParams.forEach((param) => {
        if (rememberParams && rememberParams[param.key] && rememberParams[param.key] != '') {
          param.defaultValue = rememberParams[param.key]
        }

        if (param.type == 2) {
          //普通选择
          //checkValue 数组，checkedValue选中的显示值，defaultValue 放置参数值
          param.checkKey = param.checkValue
        
          if (param.defaultValue instanceof Array) {
            param.checkedValue = param.checkValue[0]
            param.defaultValue = param.checkKey[0]
          }
          param.checkedValue = param.defaultValue;
        }
        if (param.type === 4) {
          //素材
          param.checkValue = []
          param.checkKey = []
          let index = 0
          for (let key in this.materials) {
            const value = this.materials[key]
            param.checkValue.push(value)
            param.checkKey.push(key)
              console.log(index,param.defaultValue,key)
            if (index == 0 || param.defaultValue === key) {
              console.log(index,param.defaultValue,key,"----")
              param.checkedValue = value //默认显示值 //
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
.setParameter {
  margin: 0 10px;
  color: #606266;
}
.setParameter .title {
  text-align: center;
  font-size: 20px;
  font-weight: 300;
}
.pull-down-menu {
  height: 36px;
  line-height: 36px;
  border: 1px solid #d7dae2;
  border-radius: 4px;
  padding-left: 10px;
  position: relative;
  box-sizing: border-box;
  font-size: 14px;
}
.pull-down-menu::after {
  content: "";
  width: 8px;
  height: 8px;
  position: absolute;
  top: 10px;
  right: 8px;
  border-right: 1px solid #a6abb8;
  border-bottom: 1px solid #a6abb8;
  transform: rotate(45deg);
}
.uni-col {
  padding-top: 3px;
}
.script-params::after {
  content: "";
  display: block;
  clear: both;
}
</style>
