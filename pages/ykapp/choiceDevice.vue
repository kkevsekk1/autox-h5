<template>
  <view class="choiceDevice-box">
    <view class="choiceDevice">
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
    <view class="uni-btn">
      <button type="submit"
              class="uni-btn-submit">运行</button>
      <button type="default"
              class="uni-btn-default">返回</button>
    </view>
  </view>
</template>

<script>

import { request } from '../../server/request.js';
export default {
  data () {
    return {
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
    this.getDeviceGroups()
  },
  methods: {
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
.choiceDevice {
  margin: 10px 10px;
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
.swiper {
  height: 35px;
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
.uni-btn {
  position: absolute;
  bottom: 10px;
  right: 0;
  margin-top: 40px;
  overflow: hidden;
  margin-right: 10px;
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