<template>
  <view class="goodsList-box">
    <view class="fixation-header">
      <view class="goodsList-header">
        <view class="input-seek">
          <input type="text"
                 placeholder="请输入内容"
                 v-model="inputSeek"
                 placeholder-class="inputSeek">
          <text class="iconfont">&#xe617;</text>
        </view>
        <view style=" position: relative;">
          <view class="goodsRank">
            <view class="timeRank">
              <text>日期</text>
              <view class="icon">
                <view class="iconfont iconTop color-blove">&#xea4c;</view>
                <view class="iconfont iconBottom color-blove">&#xea4d;</view>
              </view>
            </view>
            <view class="runNumberRank">
              <text>运行量</text>
              <view class="icon">
                <view class="iconfont iconTop color-blove">&#xea4c;</view>
                <view class="iconfont iconBottom">&#xea4d;</view>
              </view>
            </view>
            <view class="appFiltrate"
                  @click="modifyPopup">
              <text>app筛选</text>
              <view class="iconfont iconLeft color-blove">&#xea4d;</view>
            </view>
          </view>
          <!-- 弹窗 -->
          <view v-show="opoup"
                class="opoup">
            <view v-for="opoupData in opoupList"
                  :key="opoupData.id"
                  class="opoup-for"
                  @click="modifyPopup">
              <view> {{opoupData.name}} </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="goodsList-content">
      <view class="goodsList-nav"
            v-for="goodsData in goodsInformation"
            :key="goodsData.id">
        <view class="nav-top">
          <view class="nav-logo">
            <img :src="goodsData.logoImg"
                 alt="">
          </view>
          <view class="nav-content">
            <view class="content-top">
              <view class="appNameEdition">
                <view class="appName"> {{goodsData.appName}} </view>
                <view class="appEdition"> {{goodsData.appEdition}} </view>
              </view>
              <view class="name">
                <text class="iconfont iconfontName">&#xef98;</text>
                <text> {{goodsData.name}} </text>
              </view>
              <button class="btn-operation">运行</button>
            </view>
            <view class="describe">
              <text>{{goodsData.describe}}</text>
            </view>
          </view>
        </view>
        <view class="nav-bottom">
          <view class="TikTok">
            <view class="iconfont">&#xe8db;</view>
            <view>抖音</view>
            <view class="TikTokEdition">v {{goodsData.TikTokEdition}} </view>
          </view>
          <view class="run">
            <view class="iconfont">&#xe60a;</view>
            <view class="runNumber"> {{goodsData.runNumber}} </view>
          </view>
          <view class="tiem">
            <view class="startTime"> {{goodsData.startTime}} </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { request } from '../../server/request.js';
export default {
  data () {
    return {
      opoup: false,
      inputSeek: "",
      opoupList: [],
      goodsDataList: [],
      goodsInformation: [],
    }
  },
  watch: {
    inputSeek (val) {
      this.goodsInformation = []
      this.goodsDataList.forEach(res => {
        console.log(res)
        if (res.appName == val) {
          this.goodsInformation.push(res)
        } else if (!val) {
          this.goodsInformation = this.goodsDataList
        }
      })
    }
  },
  created () {
    this.goodsList()
    this.commodityGroup()
  },
  methods: {
    modifyPopup () {
      // console.log(JSON.stringify(this.opoupList))
      this.opoup = !this.opoup
    },
    // 获得商品分组
    commodityGroup () {
      this.opoupList = []
      request({
        url: "/commodityGroup",
        method: "post",
      })
        .then(res => {
          let { statusCode, data } = res
          if (statusCode == 200) {
            data.forEach(element => {
              this.opoupList.push(element)
            });
          }
        })
    },
    // 获取应用数据列表
    goodsList () {
      request({
        url: "/goodsList",
        method: "post",
      })
        .then(res => {
          let { statusCode, data } = res
          if (statusCode == 200) {
            data.forEach(element => {
              this.goodsDataList.push(element)
            });
          }
          this.goodsInformation = this.goodsDataList
        })
    }
  }
}
</script>

<style>
page {
  background-color: #f5f5f5;
}
/* 头部 */
.fixation-header {
  position: fixed;
  width: 100%;
  height: 90px;
  background: #fff;
  z-index: 9;
}
.goodsList-header {
  padding: 0 8px;
}
.input-seek {
  position: relative;
  background-color: #fff;
}
.input-seek input {
  height: 40px;
  line-height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  padding-left: 40px;
  font-size: 28rpx;
}
.inputSeek {
  color: #c0c4cc;
}
.input-seek text {
  font-size: 18px;
  position: absolute;
  top: 50%;
  left: 20px;
  color: #c0c4cc;
  transform: translate(-9px, -10px);
}
.goodsRank {
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 33px;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  background-color: #fff;
  padding: 0 5px;
}
.goodsRank text {
  color: #409efe;
  font-size: 14rpx;
}
.goodsRank view {
  display: inline-block;
  font-size: 24rpx;
  color: #dcdfe6;
}
.goodsRank .icon {
  position: relative;
  top: 2px;
  margin-left: 5px;
}
.goodsRank .iconTop {
  position: absolute;
  top: 0;
}
.goodsRank .color-blove {
  color: #409efe;
}
.goodsRank .iconLeft {
  transform: rotate(-90deg);
}

/* 列表 */
.goodsList-content {
  padding-top: 87px;
}
.goodsList-nav {
  height: 100px;
  background-color: #fff;
  margin: 10px 0;
  padding: 10px 20px;
}
.nav-top {
  height: 64px;
  display: flex;
  justify-content: space-between;
}
.nav-top .nav-logo {
  width: 64px;
}
.nav-top .nav-logo img {
  width: 100%;
}
.nav-content {
  width: 260px;
}
.content-top {
  height: 22px;
}
.content-top .appName {
  font-size: 32rpx;
  font-weight: 600;
  margin-right: 5px;
}
.content-top .appNameEdition {
  margin-right: 15px;
}
.content-top .appNameEdition,
.content-top .appNameEdition view,
.content-top .name {
  display: inline-block;
}
.content-top .appEdition,
.content-top .name text {
  font-size: 24rpx;
  color: #faad14;
}
.content-top .name .iconfontName {
  font-size: 44rpx;
  margin-right: 3px;
  color: #409efe;
}
.content-top .btn-operation {
  float: right;
  width: 66px;
  height: 22px;
  font-size: 14px;
  background-color: #67c239;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.nav-content .describe {
  width: 532rpx;
  height: 34px;
  font-size: 24rpx;
  color: #969799;
  overflow: hidden;
  margin-top: 6px;
  position: relative;
}
.nav-content .describe ::after {
  content: ".....";
  width: 18px;
  height: 18px;
  background-color: #fff;
  position: absolute;
  top: 17px;
  right: 3px;
}
.nav-bottom {
  height: 18px;
  margin-top: 15px;
  font-size: 24rpx;
  color: #faad14;
  overflow: hidden;
}
.nav-bottom .TikTok,
.nav-bottom .run {
  float: left;
  margin-right: 15px;
}
.nav-bottom .tiem {
  float: right;
  position: relative;
  top: 2px;
}
.TikTok view,
.run view {
  display: inline;
}
.nav-bottom .TikTok view:nth-child(1) {
  font-size: 32rpx;
  color: #409efe;
}
.nav-bottom .TikTok view:nth-child(2) {
  margin: 0 5px;
}
.nav-bottom .run view:nth-child(1) {
  font-size: 52rpx;
  color: #409efe;
  position: relative;
  top: -5px;
}
.nav-bottom .runNumber {
  position: relative;
  top: -10px;
  margin-left: 3px;
}
.nav-bottom .TikTokEdition {
  color: #df343f;
}
/* 弹窗 */
.opoup {
  position: absolute;
  top: 37px;
  padding: 4px;
  padding-bottom: 100px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  z-index: 99;
}
.opoup .opoup-for {
  float: left;
  width: 30%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  margin: 4px;
  font-size: 28rpx;
  color: #606266;
}
</style>