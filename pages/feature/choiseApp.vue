<template>
  <uni-row class="opoup">
    <uni-col :span="8"
             v-for="(app,index) in apps"
             :key="index"
             class="opoup-for"
             style="padding: 0 7px;">
      <view class="opoup-click"
            @click="checked(app.appName)">{{ app.appName }}</view>
    </uni-col>
  </uni-row>
</template>
<script>
import { request } from '../../server/request.js';
export default {
  data () {
    return {
      apps: [],
    }
  },
  created () {
    this.loadApp();
  },
  methods: {
    checked (appName) {
      console.log("选中")
      if (appName == "全部") {
        appName = "";
      }
      this.$emit('choiseApp', appName)
    },
    loadApp () {
      console.log("load");
      request({
        url: '/script/apps',
        method: 'get',
      }).then((res) => {
        let { code, data } = res.data
        console.log(data)
        if (code == 200) {
          this.apps = [{ appName: "全部" }]
          data.forEach(element => {
            this.apps.push(element);
          });
        }
      })
    },
  },
}
</script>
<style scoped>
.opoup {
  position: absolute;
  top: 37px;
  width: 100%;
  padding: 4px;
  padding-bottom: 50px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  z-index: 99;
}
.opoup .opoup-for {
  text-align: center;
  margin-top: 7px;
}
.opoup-click {
  height: 40px;
  line-height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  font-size: 16px;
  color: #606266;
  box-sizing: border-box;
  overflow: hidden;
}
</style>
