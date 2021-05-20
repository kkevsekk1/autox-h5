<template>
  <view class="setParameter">
    <view class="nav">
      <view class="title">
        <text>{{ title.name }}（{{ title.id }}）</text>
      </view>
      <form @submit="formSubmit">
        <view v-for="(parameter, index) in taskParameter" :key="index">
          <!-- 输入框 -->
          <view class="uni-form-input" v-if="parameter.type == 1">
            <view class="title-input">{{ parameter.name }}</view>
            <input
              class="uni-input"
              name="input"
              v-model="parameter.defaultValue"
            />
          </view>
          <!-- 下拉菜单 -->
          <view class="uni-title-picker" v-if="parameter.type == 2">
            <view class="title-picker">{{ parameter.name }}</view>
            <view class="uni-list-cell-db">
              <picker
                @change="bindPickerChange($event, parameter)"
                :value="parameter.checkIndex"
                :range="parameter.checkValue"
              >
                <view class="uni-input">{{
                  parameter.checkValue[parameter.checkIndex]
                }}</view>
              </picker>
            </view>
          </view>
          <!-- 多选框 -->
          <view class="uni-form--much" v-if="parameter.type == 3">
            <checkbox-group name="checkbox" class="much">
              <label class="label-much">
                <checkbox value="checkbox1" /><text>{{ parameter.name }}</text>
              </label>
            </checkbox-group>
          </view>
          <!-- 素材库 -->
          <view class="uni-title-picker" v-if="parameter.type == 4">
            <view class="title-picker">{{ parameter.name }}</view>
            <view class="uni-list-cell-db">
              <picker
                @change="materialChange($event, parameter)"
                :value="parameter.materialIndex"
                :range="materialData.materialValue"
              >
                <view class="uni-input">{{
                  materialData.materialValue[parameter.materialIndex]
                }}</view>
              </picker>
            </view>
          </view>
        </view>
        <view class="uni-btn">
          <button form-type="submit" class="uni-btn-submit">下一步</button>
          <button type="default" form-type="reset" class="uni-btn-default">
            返回
          </button>
        </view>
      </form>
    </view>
  </view>
</template>

<script>
import { request } from '../../server/request.js'
export default {
  props: {
    scriptId: Number,
  },
  data() {
    return {
      indexValue: 0,
      taskParameter: '',
      materialData: {},
      title: '',
      optionList: {
        optionId: '',
        optionAppName: '',
      },
      deviceGroupList: [],
      deviceList: [],
      scriptHaed: true,
      scriptIs: {
        isHidden: true,
        isRotate: false,
      },
    }
  },
  async created() {
    uni.showLoading({ title: '加载中' })
    this.loadScript()
    await this.loadRemember()
    uni.hideLoading()
  },
  onLoad(option) {},
  methods: {
    loadScript() {
      request({
        url: '/script/getScript?id=' + this.scriptId,
        method: 'get',
      }).then((res) => {
        let { data, code } = res.data
        if (code === 200) {
          console.log(data)
        }
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
