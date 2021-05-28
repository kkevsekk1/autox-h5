<template>
  <view class="choiceDevice-box">
    <view class="choiceDevice">
      <view class="script-header">
        <view class="script-haed"
              :class="groupAll ? 'pitchOn' : ''"
              @click="clickGroupAll">全部</view>
        <view class="list-name"
              v-show="deviceGroup.show">
          <swiper class="swiper"
                  display-multiple-items="3">
            <swiper-item v-for="(group, index) in deviceGroups"
                         :key="index"
                         class="for-list"
                         @click="clickGroup(group)"
                         :class="group.isShow ? 'pitchOn' : ''">
              <view>{{ group.name }}</view>
            </swiper-item>
          </swiper>
        </view>
        <view class="refresh iconfont"
              @click="reLoadDevices"
              :class="deviceGroup.rotate ? 'scriptRotate' : ''">&#xe636;</view>
      </view>
      <view class="script-main">
        <view class="script-input">
          <input type="text"
                 v-model="searchStr"
                 placeholder="名称，可用空格分隔" />
          <view class="iconfont"> &#xe617; </view>
        </view>
        <uni-table ref="uniTable"
                   emptyText="暂无数据"
                   type="selection"
                   @selection-change="selectionChange">
          <uni-tr>
            <uni-th width="60%"
                    :sortable=true
                    @sort-change="sortDevice('name',$event)">名称</uni-th>
            <uni-th width="10%"
                    :sortable=true
                    @sort-change="sortDevice('group')">分组</uni-th>
            <uni-th width="30%">状态</uni-th>
          </uni-tr>
          <uni-tr v-for="device in showDevices"
                  :key="device.id">
            <uni-td>{{ device.name }}</uni-td>
            <uni-td>{{ device.category }}</uni-td>
            <uni-td :class="device.statusColor">{{ device.showStatus }}</uni-td>
          </uni-tr>
        </uni-table>
      </view>
      <button @click="test()"> {{content}} </button>
    </view>
  </view>
</template>

<script>
import { request } from '../../server/request.js'
export default {
  props: ["entrance"],
  data () {
    return {
      deviceGroups: [],
      devices: [],
      checkedGroupName: [],
      groupAll: true,
      searchStr: "",
      deviceGroup: {
        show: true,
        rotate: false,
      },
      content: "test"
    }
  },
  watch: {
    searchStr () {
      this.clearSelection();
    }
  },
  computed: {
    showDevices: {
      get () {
        let searchStr = this.searchStr;
        const checkedGroupName = this.checkedGroupName;
        if (searchStr) {
          searchStr = searchStr.replace(new RegExp(" ", "gm"), "|");
          var reg = new RegExp(searchStr, 'ig')
          return this.filterDeviceByGroupNames(checkedGroupName).filter(function (e) {
            return e.name.match(reg);
          })
        };
        return this.filterDeviceByGroupNames(checkedGroupName);
      },
      set () {
      }
    },
  },
  created () {
    this.getDeviceGroups()
  },
  methods: {
    test () {
      this.content = "测试";
      try {
        var x = android.getUid();
        this.content = x;
      } catch (error) {
        this.content = error;
        console.log(error);
      }
    },
    toggleRowSelection () {
      this.$nextTick(() => {
        let entrance = this.$props.entrance
        let toggleRow = ''
        if (entrance == "formMenu") {
          toggleRow = 0
          let showDevices = this.showDevices[0]
          showDevices.showStatus = "本机"
          showDevices.statusColor = "deviceIsPurple"
        } else
          if (!entrance) {
            for (let index = 0; index < this.showDevices.length; index++) {
              let showDevices = this.showDevices[index]
              if (showDevices.id == this.equipmentId) {
                toggleRow = index
                showDevices.showStatus = "本机"
                showDevices.statusColor = "deviceIsPurple"
              }
            }
          }
        this.$refs.uniTable.toggleRowSelection([toggleRow], true)
      })
    },
    sortDevice (name, e) {
      console.log(name, e)
    },
    getCheckedDevices () {
      let rs = this.devices.filter(device => {
        return device.checked;
      })
      return rs;
    },
    clearSelection () {
      this.$refs.uniTable.clearSelection();
    },
    // 选择发送改变
    selectionChange (e) {
      this.devices.forEach(device => {
        device.checked = false;
      })
      this.showDevices.forEach((device, index) => {
        if (e.detail.index.includes(index)) {
          device.checked = true;
        }
      })
    },
    filterDeviceByGroupNames (checkedGroupName) {
      var rsDevices = [];
      if (checkedGroupName.length === 0) {
        rsDevices = this.devices;
      } else {
        checkedGroupName.forEach(name => {
          let devices = [];
          devices = this.devices.filter(device => { return device.category === name; });
          rsDevices = rsDevices.concat(devices);
        });
      }
      return rsDevices;
    },
    getDeviceGroups () {
      // 获取设备分组
      this.deviceGroups = []
      const data = {}
      request({
        url: '/device/findcategory',
        method: 'post',
        data,
      }).then((res) => {
        let { code, data } = res.data
        if (code === 200) {
          this.deviceGroups = []
          if (data) {
            data.forEach((device) => {
              this.deviceGroups.push({ name: device.category, check: false })
            })
            this.getdevices()
          }
        }
      })
    },
    getdevices () {
      // 查询设备列表
      this.listLoading = true
      const data = {
        index: 1,
        size: 10000,
        search: '',
        category: '',
      }
      this.listLoading = true
      request({
        url: '/device/findpage',
        method: 'post',
        data,
      }).then((res) => {
        let entrance = this.$props.entrance
        let { data, code } = res.data
        if (code === 200) {
          this.devices = []
          data.list.forEach((element) => {
            let { status, name, id, category } = element
            let showStatus = status === 0 ? '离线' : '在线'
            let statusColor = status == 0 ? 'deviceIsRed' : 'deviceIsGreen'
            if (entrance == "formMenu") {
              if (element.id == this.equipmentId) {
                element.showStatus = showStatus
                this.devices.push(element)
              }
            } else {
              this.devices.push({
                name: name,
                category: category,
                showStatus: showStatus,
                status: status,
                id: id,
                statusColor: statusColor,
              })
            }
          })
          this.toggleRowSelection()
        }
      })
    },
    clickGroup (group) {
      this.clearSelection();
      this.groupAll = false;
      if (!group.isShow) {
        this.$set(group, 'isShow', false)
      }
      group.isShow = !group.isShow
      if (group.isShow) {
        this.checkedGroupName.push(group.name)
      } else {
        this.checkedGroupName = this.checkedGroupName.filter(groupName => {
          if (group.name == groupName) {
            return false;
          }
          return true;
        })
      }
      if (this.checkedGroupName.length == 0) {
        this.groupAll = true;
      }
    },
    clickGroupAll () {
      this.groupAll = true
      this.checkedGroupName = [];
      this.clearSelection();
    },
    reLoadDevices () {
      this.groupAll = true
      this.deviceGroup.show = false
      this.deviceGroup.rotate = true
      setTimeout(() => {
        this.deviceGroup.show = true
        this.deviceGroup.rotate = false
      }, 500)
      this.getDeviceGroups()
    },
  },
}
</script>

<style>
page {
  margin: 0;
  padding: 0;
}
.choiceDevice-box {
  padding-top: 60px;
  padding-bottom: 100px;
}
.choiceDevice {
  margin: 0 10px;
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
  width: 20%;
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
.deviceIsPurple {
  color: #a418be;
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
