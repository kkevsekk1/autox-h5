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
          <uni-row class="goodsRank">
            <uni-col :span="8">
              <view class="timeRank"
                    @click="rank('date')"
                    style="float:left">
                <text>更新日期</text>
                <view class="icon">
                  <view class="iconfont iconTop "
                        :class="sortDate ? 'color-blove':''">&#xea4c;</view>
                  <view class="iconfont iconBottom "
                        :class="sortDate ? '':'color-blove'">&#xea4d;</view>
                </view>
              </view>
            </uni-col>
            <uni-col :span="8"
                     style="text-align: center;">
              <view class="runNumberRank"
                    @click="rank('run')">
                <text>运行量</text>
                <view class="icon">
                  <view class="iconfont iconTop "
                        :class=" sortRun ? 'color-blove':''">&#xea4c;</view>
                  <view class="iconfont iconBottom"
                        :class=" sortRun ? '':'color-blove'">&#xea4d;</view>
                </view>
              </view>
            </uni-col>
            <uni-col :span="8">
              <view class="appFiltrate"
                    @click="popUp = !popUp"
                    style="float:right">
                <text>{{appFiltrate}}</text>
                <view class="iconfont iconLeft color-blove">&#xea4d;</view>
              </view>
            </uni-col>
          </uni-row>
          <view v-show="popUp">
            <choise-app @choiseApp="onChoiseApp"></choise-app>
          </view>
        </view>
      </view>
    </view>
    <view class="goodsList-content">
      <view v-for=" feature in features"
            :key="feature.id"
            class="goodsList-nav">
        <feature-item :feature="feature"
                      @run="run"
                      @skipDetails="skipDetails"></feature-item>
      </view>
    </view>
  </view>
</template>

<script>
import { request } from '../../server/request.js';
import featureItem from './featueItem'
import choiseApp from './choiseApp'
export default {
  components: {
    featureItem: featureItem,
    choiseApp: choiseApp
  },
  data () {
    return {
      appFiltrate: "app筛选",
      search: "",
      appName: "",
      page: { index: 1, size: 20, orderBy: "id desc", pages: 2 },
      features: [],
      popUp: false,
      sortDate: true,
      sortRun: true,
    }
  },
  watch: {
    search (val) {
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
    this.page.index = 1;
    this.features = [];
    this.loadFeatures();
    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 1000)
  },
  methods: {
    onChoiseApp (appName) {
      console.log("onChooiseApp", appName);
      this.appName = appName;
      this.popUp = false;
      this.features = [];
      this.page.index = 1;
      this.loadFeatures();
      console.log(appName)
      this.appFiltrate = appName ? appName : "app筛选";
    },
    run (id) {
      console.log(id)
      uni.navigateTo({
        url: "/pages/feature/running?id=" + id
      })
    },
    skipDetails (id) {
      console.log(id)
      uni.navigateTo({
        url: "/pages/functionDetails/index?id=" + id
      })
    },
    rank (type) {
      this.page.index = 1;
      this.features = [];
      if (type == "date") {
        this.page.orderBy = this.sortDate ? "updateTime desc" : "updateTime asc";
        this.sortDate = !this.sortDate
      }
      if (type == "run") {
        this.page.orderBy = this.sortRun ? "id desc" : "id asc";
        console.log(this.page.orderBy)
        this.sortRun = !this.sortRun
        console.log(this.sortRun)
      }
      this.loadFeatures();
    },
    // 防抖动
    debounce (wait) {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setTimeout(() => {
        this.page.index = 1;
        this.features = [];
        this.loadFeatures();
      }, wait)
    },
    loadFeatures () {
      uni.showLoading({ title: '加载中' });
      let data = { search: this.search,status:'1', appName: this.appName, orderBy: this.page.orderBy, index: this.page.index, size: this.page.size };
      request({
        url: "/script/list",
        method: "post",
        data: data
      })
        .then(res => {
          uni.hideLoading()
          let { code, data: { list, pages } } = res.data;
          console.log(res.data, "数据");
          if (code == 200) {
            list.forEach(element => {
              this.features.push(element)
            });
            console.log(this.features)
            this.page.pages = pages;
            console.log(this.features[0])
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
  top: 0;
  width: 100%;
  z-index: 9;
}
.goodsList-header {
  padding: 10px 8px;
  background: #f5f5f5;
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
  font-size: 14px;
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
  margin-top: 10px;
  height: 33px;
  line-height: 31px;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  background-color: #fff;
  padding: 0 5px;
  overflow: hidden;
}
.goodsRank text {
  color: #409efe;
  font-size: 14px;
}
.goodsRank view {
  display: inline-block;
  font-size: 16px;
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
  padding-top: 100px;
}
.goodsList-nav {
  background-color: #fff;
  margin: 10px 0;
  padding: 10px 20px;
}
</style>