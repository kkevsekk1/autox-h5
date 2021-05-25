<template>
  <view class="goodsList-box">
    <view class="fixation-header">
      <view class="goodsList-header">
        <view class="input-seek">
          <input type="text"
                 placeholder="请输入内容"
                 v-model="search"
                 placeholder-class="inputSeek">
          <text class="iconfont">&#xe617;</text>
        </view>
        <view style=" position: relative;">
          <view class="goodsRank">
            <view class="timeRank"
                  @click="rank('date')">
              <text>日期</text>
              <view class="icon">
                <view class="iconfont iconTop color-blove">&#xea4c;</view>
                <view class="iconfont iconBottom color-blove">&#xea4d;</view>
              </view>
            </view>
            <view class="runNumberRank"
                  @click="rank('run')">
              <text>运行量</text>
              <view class="icon">
                <view class="iconfont iconTop color-blove">&#xea4c;</view>
                <view class="iconfont iconBottom">&#xea4d;</view>
              </view>
            </view>
            <view class="appFiltrate"
                  @click="clickFilter()" >
              <text>app筛选</text>
              <view class="iconfont iconLeft color-blove">&#xea4d;</view>
            </view>
          </view>
        </view>
      </view>
          <view v-show="popUp">
            <choise-app  @choiseApp="onChoiseApp"></choise-app> 
          </view>
    </view>
        <view v-for=" feature in features" :key="feature.id">
        <feature-item :feature="feature"  @run="run" ></feature-item>
    </view>
  </view>
</template>

<script>
import { request } from '../../server/request.js';
import featureItem  from './featueItem'
import choiseApp from './choiseApp'
export default {
    components: {
    featureItem:featureItem,
    choiseApp:choiseApp
  },
  data () {
    return {
      search: "",
      appName:"",
      page: { index: 1, size: 20,orderBy:"id desc" ,pages:2},
      features:[],
      popUp:false,
    }
  },
  watch: {
    search (val){
      this.debounce(300);
    }
  },
  created () {
   this.loadFeatures()
  },
  onReachBottom () {
    if (this.page.index >= this.page.pages) {
      uni.showToast({ title: '到底了', iccon: 'none' })
    } else {
      this.page.index++
      this.loadFeatures();
    }
  },
  onPullDownRefresh () {
    this.page.index =1;
    this.features=[];
    this.loadFeatures();
    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 1000)
  },
  methods: {
    clickFilter(){
      console.log("弹出筛选");
      this.popUp=true;
    },
    onChoiseApp(appName){
      console.log("onChooiseApp",appName);
      this.appName =appName;
      this.popUp=false;
      
      this.features=[];
      this.page.index=1;
      this.loadFeatures();
    },
    run(id){
      console.log("index",id)
    },
    rank(type){
      console.log("排序");
      this.page.index=1;
      this.features=[];
      if(type=="date"){
        this.page.orderBy="updateTime desc"
      }
      if(type=="run"){
        this.page.orderBy="id desc"
      }
      this.loadFeatures();
    },
    // 防抖动
    debounce (wait) {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setTimeout(() => {
       this.page.index=1;
       this.features=[];
       this.loadFeatures();
      }, wait)
    },
    loadFeatures () {
      uni.showLoading({ title: '加载中' });
      let data ={search:this.search,appName:this.appName,orderBy:this.page.orderBy,index:this.page.index,size:this.page.size};
      request({
        url: "/script/list",
        method: "post",
        data: data
      })
        .then(res => {
          uni.hideLoading()
          let { code, data:{list,pages} } = res.data;
          console.log(data);
          if (code == 200) {
             list.forEach(element => {
              this.features.push(element)
            });
            this.page.pages =pages;
          }
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
.nav-bottom .software,
.nav-bottom .run {
  float: left;
  margin-right: 15px;
}
.nav-bottom .tiem {
  float: right;
  position: relative;
  top: 2px;
}
.software view,
.run view {
  display: inline;
}
.nav-bottom .software view:nth-child(1) {
  font-size: 32rpx;
  color: #409efe;
}
.nav-bottom .software view:nth-child(2) {
  margin: 0 7px 0 3px;
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
.nav-bottom .softwareEdition {
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