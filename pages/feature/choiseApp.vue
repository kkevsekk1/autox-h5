<template>
<view style="background-color:#00ff00;">
  <view v-for="(app,index) in apps" :key="index" >
    <view @click="checked(app.appName)">{{ app.appName }}</view>
  </view>
</view>
</template>
<script>
import { request } from '../../server/request.js';
export default {
  data() {
    return {
      apps: [],
    }
  },
  created () {
   this.loadApp();
  },
  methods: {
    checked(appName) {
      console.log("选中")
      if(appName=="全部"){
        appName="";
      }
      this.$emit('choiseApp',appName)
    },
    loadApp() {
      console.log("load");
      request({
        url: '/script/apps',
        method: 'get',
      }).then((res) => {
        let { code, data } = res.data
        console.log(data)
        if (code == 200) {
          this.apps=[{appName:"全部"}]
          data.forEach(element => {
              this.apps.push(element);
            });
        }
      })
    },
  },
}
</script>
