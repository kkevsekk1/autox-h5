<template>
  <view>
    <view class="nav-top">
      <uni-row class="content-top">
        <uni-col :span="12"
                 class="appNameEdition">
          <view @click="skipDetails">
            <view class="appName"> {{feature.name}} </view>
            <view class="appEdition"> {{feature.scriptVersion}} </view>
          </view>
        </uni-col>
        <uni-col :span="7"
                 class="name">
          <text class="iconfont iconfontName">&#xef98;</text>
          <text> {{feature.username}} </text>
        </uni-col>
        <uni-col :span="5">
          <button class="btn-operation"
                  @click="run">试运行</button>
        </uni-col>
      </uni-row>
    </view>
    <view class="describe">
      <text>{{feature.description}}</text>
    </view>
    <uni-row class="nav-bottom">
      <uni-col :span="8"
               class="software">
        <view class="iconfont">&#xe62c;</view>
        <view>{{feature.appName}}</view>
        <view class="softwareEdition">v{{feature.appVersion}} </view>
      </uni-col>
      <uni-col :span="7"
               class="run">
        <view class="iconfont">&#xe60a;</view>
        <view class="runNumber"> {{feature.playCount}} </view>
      </uni-col>
      <uni-col :span="9"
               class="tiem">
        <view class="startTime"> {{feature.updateTime}} </view>
      </uni-col>
    </uni-row>
  </view>
</template>
<script>
import { formatTime } from '../../utils/format.js'
export default {
  props: {
    feature: {
      id: Number | String,
      name: String,
      icon: String,
      appName: String,
      appVersion: String
    }
  },
  data () {
    return {
      logoImg: "../../static/logo.png",
    }
  },
  created () {
    this.formattingTime()
  },
  methods: {
    formattingTime () {
      this.feature.createTime = formatTime(this.feature.createTime)
      this.feature.updateTime = formatTime(this.feature.updateTime)
    },
    run () {
      this.$emit('run', this.feature.id);
    },
    skipDetails () {
      this.$emit("skipDetails", this.feature.id)
    }
  }
}
</script>
<style>
.content-top {
  height: 22px;
}
.content-top .appName {
  font-size: 15px;
  font-weight: 600;
  margin-right: 5px;
}
.content-top .appNameEdition,
.content-top .appNameEdition view,
.content-top .name {
  display: inline-block;
}
.content-top .appNameEdition {
  position: relative;
  top: 4px;
}
.content-top .appEdition,
.content-top .name text {
  font-size: 13px;
  color: #faad14;
}
.content-top .name .iconfontName {
  font-size: 22px;
  margin-right: 3px;
  color: #409efe;
}
.content-top .btn-operation {
  float: right;
  /* width: 66px; */
  /* height: 22px; */
  font-size: 13px;
  background-color: #67c239;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.describe {
  width: 100%;
  font-size: 12px;
  color: #969799;
  margin-top: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.nav-bottom {
  height: 18px;
  margin-top: 15px;
  font-size: 12px;
  color: #faad14;
  overflow: hidden;
}
.nav-bottom .software,
.nav-bottom .run {
  float: left;
}
.nav-bottom .tiem {
  position: relative;
  top: 2px;
}
.startTime {
  float: right;
}
.software view,
.run view {
  display: inline;
}
.nav-bottom .software view:nth-child(1) {
  font-size: 16px;
  color: #409efe;
}
.nav-bottom .software view:nth-child(2) {
  margin: 0 7px 0 3px;
}
.nav-bottom .run view:nth-child(1) {
  font-size: 26px;
  color: #409efe;
  position: relative;
  top: -5px;
}
.nav-bottom .runNumber {
  position: relative;
  top: -10px;
  margin-left: 3px;
}
.nav-bottom .softwareEdition {
  color: #df343f;
}
</style>
