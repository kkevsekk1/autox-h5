<template>
  <view class="isErvice-box">
    <view class="header">
      <text class="classGreen">选择功能</text>
      <text :class="ShowHidden == 1 ?'classGreen': ''">设置参数 </text>
      <text>选择设备</text>
      <text>运行</text>
    </view>
    <view class="setparameter"
          v-if="ShowHidden == 0">
      <view class="nav">
        <view class="title">
          <text>{{title.name}}（{{ title.id }}）</text>
        </view>
        <form @submit="formSubmit">
          <view v-for="(parameter,index) in taskParameter"
                :key="index">
            <!-- 输入框 -->
            <view class="uni-form-input"
                  v-if="parameter.type==1">
              <view class="title-input">{{parameter.name}}</view>
              <input class="uni-input"
                     name="input"
                     :placeholder="parameter.defaultValue" />
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
          <view class="uni-btn-v">
            <button form-type="submit">下一步</button>
            <button type="default"
                    form-type="reset"></button>
          </view>
        </form>
      </view>
    </view>
    <view class="choiceDevice"
          v-if="ShowHidden == 1">
      <view class="script-header">
        <view class="script-haed "
              :class="scriptHaed?'pitchOn':''"
              @click="scriptAll">全部</view>
        <view class="list-name "
              v-show="scriptIs.isHidden">
          <swiper class="swiper"
                  display-multiple-items=3>
            <swiper-item v-for="( listSelection, scriptIndex) in deviceGroupList"
                         :key="scriptIndex"
                         class="for-list"
                         @click="scriptForList(listSelection,listSelection.name)"
                         :class="listSelection.isShow ? 'pitchOn':''">
              <view>{{listSelection.name}}</view>
            </swiper-item>
          </swiper>
        </view>
        <view class="refresh iconfont"
              @click="reLoadDevice"
              :class="scriptIs.isRotate ? 'scriptRotate': ''">&#xe636;</view>
      </view>
      <view class="script-main">
        <view class="script-input">
          <input type="text"
                 placeholder="请输入">
          <view class="iconfont"> &#xe617; </view>
        </view>
        <uni-table emptyText="暂无数据"
                   type="selection">
          <uni-tr>
            <uni-th width='60%'
                    :sortable="true">名称</uni-th>
            <uni-th width='10%'
                    :sortable="true">分组</uni-th>
            <uni-th width='30%'>状态</uni-th>
          </uni-tr>
          <uni-tr v-for="(deviceItem) in deviceList"
                  :key="deviceItem.id">
            <uni-td>{{deviceItem.name}}</uni-td>
            <uni-td>{{deviceItem.category}}</uni-td>
            <uni-td :class="deviceItem.status==0? 'deviceIsRed':'deviceIsGreen'">{{deviceItem.showStatus}}</uni-td>
          </uni-tr>
        </uni-table>
      </view>
    </view>
  </view>
</template>

<script>
import { request } from '../../server/request.js';
export default {
  data () {
    return {
      ShowHidden: 1,
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
    this.getDeviceGroups()
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
          let { optionId } = this.optionList
          if (code === 200) {
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
    getDeviceGroups () {
      // 获取设备分组
      this.deviceGroupList = [];
      const data = {};
      request({
        url: "/device/findcategory",
        method: "post",
        data
      })
        .then(res => {
          let { code, data } = res.data
          if (code === 200) {
            this.deviceGroupList = []
            if (data) {
              data.forEach(device => {
                this.deviceGroupList.push({ name: device.category, check: false });
              });
              this.getDeviceList()
            }
          }
        });
    },
    getDeviceList () {
      // 查询设备列表
      this.listLoading = true;
      const data = {
        index: 1,
        size: 10000,
        search: '',
        category: '',
      };
      this.listLoading = true;
      request({
        url: "/device/findpage",
        method: "post",
        data
      }).then(res => {
        let { data, code } = res.data
        if (code === 200) {
          this.deviceList = [];
          data.list.forEach(element => {
            let { status, name, id, category } = element
            let showStatus = status === 1 ? '在线' : '离线';
            this.deviceList.push({ name: name, category: category, showStatus: showStatus, status: status, id: id })
          })
          console.log(this.deviceList)
        }
      });
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
  top: 7px;
  right: -23px;
  border-right: 1px solid #a6abb8;
  border-top: 1px solid #a6abb8;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}
.setparameter .nav {
  padding: 10px 20px;
  font-size: 28rpx;
  color: #606266;
}
.setparameter .nav .title {
  text-align: center;
  font-size: 40rpx;
  font-weight: 300;
}
.uni-form-input,
.uni-form--much,
.uni-title-picker {
  margin-top: 30px;
}
/* input框 */
.uni-form-input {
  height: 30px;
  line-height: 30px;
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
  height: 30px;
  width: 70%;
  border: 1px solid #d7dae2;
  border-radius: 5px;
  font-size: 28rpx;
  padding-left: 10px;
}
/* 下拉菜单 */
.uni-title-picker {
  overflow: hidden;
  height: 30px;
  line-height: 30px;
  display: flex;
  justify-content: space-between;
}
.uni-title-picker .uni-list-cell-db,
.uni-title-picker .title-picker {
  float: left;
}
.uni-title-picker .uni-list-cell-db {
  height: 30px;
  width: 70%;
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
  width: 70%;
}
.uni-form--much .label-much {
  width: 30%;
  margin-bottom: 10px;
}
/* 选择设备 */
.choiceDevice {
  margin: 10px 20px;
  border: 1px solid #e5e5e9;
  border-radius: 5px;
}
.script-header {
  height: 35px;
  line-height: 35px;
  display: flex;
  background-color: #e5e5e9;
}
.script-haed {
  width: 60px;
  text-align: center;
}
.refresh {
  width: 40px;
  text-align: center;
}
.list-name {
  position: relative;
  width: 480rpx;
  overflow: hidden;
  box-sizing: border-box;
}
.for-list-name {
  position: absolute;
  display: flex;
}
.for-list {
  width: 155rpx;
  text-align: center;
}
.pitchOn {
  background-color: #fff;
}
.scriptRotate {
  transform: rotate(360deg);
  transition: all 0.5s;
}
.deviceIsGreen {
  color: green;
}
.deviceIsRed {
  color: red;
}
.script-input {
  padding: 10px 15px;
  position: relative;
}
.script-input view {
  position: absolute;
  top: 18px;
  left: 23px;
  font-size: 15px;
  color: #d6d5d5;
}
.script-input input {
  width: 70%;
  height: 20px;
  line-height: 20px;
  padding: 3px 0;
  padding-left: 30px;
  border: 1px solid #e5e5e9;
  font-size: 12px;
  border-radius: 3px;
}
</style>