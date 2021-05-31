<template>
  <view class="selectType-box">
    <swiper class="header"
            display-multiple-items="4">
      <swiper-item v-for="(scriptGroup, index) in scriptGroups"
                   :key="index"
                   @click="clickGroup(scriptGroup.appName)"
                   class="appName"
                   :class="scriptGroup.appName === checkedGroup ? 'selectAppName' : ''">
        <view>{{ scriptGroup.appName }}</view>
      </swiper-item>
    </swiper>
    <view class="nav">
      <view v-for="(script, index) in scriptList"
            :key="index"
            class="script-nav">
        <view @click="navigatorTo(script.id)">
          {{ script.name }}
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { request } from '../../server/request.js'
export default {
  data () {
    return {
      scriptGroups: [],
      scriptList: [],
      checkedGroup: '',
      path: '',
    }
  },
  async created () {
    this.path = this.$route.path
    let data = null
    try {
      data = await this.getDeviceGroups()
    } catch (error) {
      uni.showToast({ title: error, icon: 'none' })
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/login/login'
        })
      }, 2000)
    }
    if (!data) {
      console.log('显示没有功能可用')
    }
    this.scriptGroups = data
    let { checkedGroup } = uni.getStorageSync("choiseFeature")
    let optionCheckedGroup = checkedGroup
    this.checkedGroup = optionCheckedGroup ? optionCheckedGroup : scriptGroups[0].appName
    this.searchScrpit()
  },
  methods: {
    navigatorTo (scriptId) {
      let choiseFeature = {
        id: scriptId,
        path: this.path,
        checkedGroup: this.checkedGroup
      }
      uni.setStorageSync('choiseFeature', choiseFeature)
      uni.reLaunch({
        url: '/pages/ykapp/running?entrance=choiseFeature'
      })
    },
    getDeviceGroups: () => {
      return new Promise((resolve, reject) => {
        request({
          url: '/script/getScrpitGroup',
          method: 'post',
          data: {},
        }).then((res) => {
          let { code, data, message } = res.data
          if (code === 200) {
            resolve(data)
          }
          if (code === -1) {
            reject(message)
          }
        })
      })
    },
    clickGroup (groupName) {
      this.checkedGroup = groupName
      this.searchScrpit()
    },
    loadScript (data) {
      return new Promise((resolve, reject) => {
        request({
          url: '/userscript/searchScrpit',
          method: 'post',
          data: data,
        }).then((rs) => {
          let { data, code } = rs.data
          if (code == 200) {
            resolve(data)
          }
        })
      })
    },
    async searchScrpit () {
      // 获取脚本列表
      uni.showLoading({ title: '加载中' })
      let data = {
        index: 1,
        size: 10000,
        scriptSearch: '',
        appName: this.checkedGroup + '',
        orderby: 'id desc',
      }
      let rsData = await this.loadScript(data);
      uni.hideLoading();
      this.scriptList = []
      rsData.list.forEach((scriptInfo) => {
        let { id, appName, script } = scriptInfo
        this.scriptList.push({
          id: script.id,
          name: script.name,
          appId: id,
          appName: appName,
        })
      })
    },
  },
}
</script>
<style>
.header {
  display: flex;
  height: 40px;
  line-height: 40px;
}
.appName {
  height: 38px !important;
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
  padding: 20px 20px;
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
