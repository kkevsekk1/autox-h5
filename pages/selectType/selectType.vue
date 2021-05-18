<template>
  <view class="selectType-box">
    <view class="header">
      <view v-for="appNameList in  scriptGroupList"
            :key='appNameList'
            @click="searchScrpit(appNameList)"
            class="appName"
            :class="appNameList===clickAppName ? 'selectAppName':'' ">
        {{ appNameList }}
      </view>
    </view>
    <view class="nav">
      <view v-for="(script,index) in scriptList"
            :key="index"
            class="script-nav">
        <navigator :url="'/pages/isErvice/isErvice?id=' + script.id + '&appName=' + script.appName">
          {{script.name}}
        </navigator>
      </view>
    </view>
  </view>
</template>

<script>
import { request } from '../../server/request.js';
export default {
  data () {
    return {
      scriptGroupList: [],
      scriptList: [],
      clickAppName: "",

    }
  },
  created () {
    this.getDeviceGroups()
  },
  methods: {
    getDeviceGroups () {
      // 获取脚本分组
      const data = {};
      request({
        url: "/script/getScrpitGroup",
        method: "post",
        data
      }).then(res => {
        let { code, data, message } = res.data
        if (code === 200) {
          data.forEach(element => {
            this.scriptGroupList.push(element.appName)
          });
          this.clickAppName = this.scriptGroupList[0]
          this.searchScrpit(this.clickAppName)
        }
        if (code === -1) {
          uni.showToast({ title: message, icon: "none" })
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/login/login?path=selectType'
            })
          }, 2000)
        }
      });
    },
    searchScrpit (appName) {
      this.clickAppName = appName
      // 获取脚本列表
      uni.showLoading({ title: '加载中' });
      this.scriptList = []
      let res = {
        index: 1,
        size: 10000,
        // commonlyUsed: '',
        scriptSearch: '',
        appName: appName + "",
        orderby: "id desc"
      }
      request({
        url: "/userscript/searchScrpit",
        method: "post",
        data: res
      })
        .then(res => {
          uni.hideLoading()
          let { data, code } = res.data
          if (code === 200) {
            data.list.forEach(scriptInfo => {
              console.log(scriptInfo)
              let { id, appName, script } = scriptInfo
              this.scriptList.push({ id: script.id, name: script.name, appId: id, appName: appName })
            })
          }
        })
    },
  }
}
</script>

<style>
.header {
  display: flex;
  height: 30px;
  line-height: 30px;
}
.appName {
  flex: 1;
  text-align: center;
  color: #707070;
  border-bottom: 2px solid #e4e7ed;
}
.selectAppName {
  color: #409eff;
  border-bottom: 2px solid #409eff;
}
.nav {
  padding: 15px 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: center;
}
.nav .script-nav {
  width: 49%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: #409eff;
  color: #fff;
  margin: 1% 0;
  border-radius: 5px;
}
</style>