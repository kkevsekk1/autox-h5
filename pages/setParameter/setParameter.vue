<template>
  <view class="setParameter-box">
    <view class="setParameter-header">
      <view class="header">
        <text class="classGreen">选择功能</text>
        <text>设置参数 </text>
        <text>选择设备</text>
        <text>运行</text>
      </view>
    </view>
    <view class="setParameter">
      <view class="nav">
        <view class="title">
          <text>{{title.name}}（{{ title.id }}）</text>
        </view>
        <form @submit="formSubmit">
          <view v-for="(parameter,index) in taskParameter"
                :key="index"
                class="uni-form-input">
            <!-- 输入框 -->
            <view class="uni-form-input"
                  v-if="parameter.type==1">
              <view class="title-input">{{parameter.name}}</view>
              <input class="uni-input"
                     name="input"
                     v-model="parameter.defaultValue" />
            </view>
            <!-- 下拉菜单 -->
            <view class="uni-title-picker"
                  v-if="parameter.type==2">
              <view class="title-picker">{{parameter.name}}</view>
              <view class="uni-list-cell-db">
                <picker @change="bindPickerChange($event,parameter)"
                        :value="parameter.checkIndex"
                        :range="parameter.checkValue">
                  <view class="uni-input">{{parameter.checkValue[parameter.checkIndex]}}</view>
                </picker>
              </view>
            </view>
            <!-- 多选框 -->
            <view class="uni-form--much"
                  v-if="parameter.type==3">
              <checkbox-group name="checkbox"
                              class="much">
                <label class="label-much">
                  <checkbox value="checkbox1" /><text>{{parameter.name}}</text>
                </label>
              </checkbox-group>
            </view>
            <!-- 素材库 -->
            <view class="uni-title-picker"
                  v-if="parameter.type==4">
              <view class="title-picker">{{parameter.name}}</view>
              <view class="uni-list-cell-db">
                <picker @change="materialChange($event,parameter)"
                        :value="parameter.materialIndex"
                        :range="materialData.materialValue">
                  <view class="uni-input">{{materialData.materialValue[parameter.materialIndex]}}</view>
                </picker>
              </view>
            </view>
          </view>
          <view class="uni-btn">
            <button form-type="submit"
                    class="uni-btn-submit">下一步</button>
            <button type="default"
                    form-type="reset"
                    class="uni-btn-default">返回</button>
          </view>
        </form>
      </view>
    </view>
  </view>
</template>

<script>
import { request } from '../../server/request.js';
export default {
  data () {
    return {
      indexValue: 0,
      taskParameter: "",
      materialData: {},
      title: "",
      optionList: {
        optionId: "",
        optionAppName: "",
      },
      deviceGroupList: [],
      deviceList: [],
      scriptHaed: true,
      scriptIs: {
        isHidden: true,
        isRotate: false,
      }
    }
  },
  created () {
    let { optionId, optionAppName } = this.optionList
    this.searchScrpit(optionId, optionAppName)
    this.getMaterialList()
  },
  onLoad (option) {
    this.optionList = {
      optionId: option.id,
      optionAppName: option.appName
    }
  },
  methods: {
    formSubmit: function (e) {
      console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
      setTimeout(() => {
        uni.navigateTo({ url: "/pages/choiceDevice/choiceDevice" })
      }, 2000)
    },
    bindPickerChange (e, parameter) {
      let value = e.target.value
      this.taskParameter.forEach(item => {
        if (item.key == parameter.key) {
          item.checkIndex = value;
        }
      })
      this.$forceUpdate();
    },
    materialChange (e, material) {
      let value = e.target.value
      this.taskParameter.forEach(res => {
        if (res.key == material.key) {
          res.materialIndex = value;
        }
      })
      this.$forceUpdate();
    },
    getMaterialList () {
      // 素材库
      this.materialValue = [];
      const data = {
        index: 1,
        size: 10000
      };
      return request({
        url: "/material/getTextPage",
        method: "post",
        data
      }).then(res => {
        let { data } = res.data
        let materialValue = []
        data.list.forEach(material => {
          materialValue.push(material.materialName);
        });
        this.materialData = { materialValue: materialValue }
      });
    },
    searchScrpit (optionId, appName) {
      uni.showLoading({ title: '加载中' });
      // 获取脚本列表
      let res = {
        index: 1,
        size: 10000,
        scriptSearch: '',
        appName: appName,
        orderby: "id desc"
      }
      request({
        url: "/userscript/searchScrpit",
        method: "post",
        data: res
      })
        .then(res => {
          let { data, code } = res.data
          if (code === 200) {
            uni.hideLoading()
            data.list.forEach(element => {
              if (element.script.id == optionId) {
                let { name, id } = element.script
                this.title = { name: name, id: id }
                this.taskParameter = JSON.parse(element.script.taskParameter)
              }
            });
            this.dealParameter(this.taskParameter)
          }
        })
    },
    dealParameter (list) {
      list.forEach(item => {
        if (item.type == 2) {
          item.checkIndex = 0;
        }
        if (item.type == 4) {
          item.materialIndex = 0;
        }
      })
    },
    scriptForList (listSelection, name) {
      this.scriptHaed = false
      if (!listSelection.isShow) {
        this.$set(listSelection, "isShow", false)
        listSelection.isShow = !listSelection.isShow
      } else {
        listSelection.isShow = !listSelection.isShow
      }
      this.deviceList.forEach(dataList => {
        if (dataList.category == name) {

        }
      })
    },
    scriptAll () {
      this.scriptHaed = true
      this.deviceGroupList.forEach(res => {
        res.isShow = false
      })
    },
    reLoadDevice () {
      this.scriptHaed = true
      this.scriptIs.isHidden = false
      this.scriptIs.isRotate = true
      setTimeout(() => {
        this.scriptIs.isHidden = true;
        this.scriptIs.isRotate = false;
      }, 500);
      this.getDeviceGroups();
    }
  }
}
</script>

<style>
@font-face {
  font-family: "iconfont";
  src: url("../../iconfont/iconfont.ttf?t=1621477806456") format("truetype");
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.setParameter-header {
  width: 100%;
  position: fixed;
  background-color: #f5f7fa;
  z-index: 999;
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
.uni-form-input {
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