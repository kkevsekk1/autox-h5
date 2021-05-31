<template>
  <view class="container">
    <input type="text"
           v-model="searchContent"
           class="search-content"
           placeholder="请输入口令搜索内容" />
    <button class="search-btn"
            @click="searchWord"
            size="mini">搜索</button>
    <view class="record-box">
      <view v-if="datas.length > 0"
            class="record-list">
        <view v-for="item in datas"
              :key="item.id">
          <view class="record-info"
                v-if="item.isGet">
            <view class="record-header">
              <text>口令类型：{{ item.type }}</text>
              <text>口令内容：{{ item.content }}</text>
              <button type="primary"
                      size="mini"
                      @click="bindWord(item)">
                领取
              </button>
            </view>
            <view class="record-content">
              <view style="margin-top: 20rpx">创建时间：{{ item.createTime }}</view>
              <view style="line-height: 80rpx">商家名称：{{ item.publisherName }}</view>
            </view>
          </view>

          <view class="record-info-change"
                v-else>
            <view class="record-header">
              <text>口令类型：{{ item.type }}</text>
              <text>口令内容：{{ item.content }}</text>
              <button type="primary"
                      size="mini"
                      class="record-change">
                已领取
              </button>
            </view>
            <view class="record-content">
              <view style="margin-top: 20rpx">创建时间：{{ item.createTime | time }}</view>
              <view style="line-height: 80rpx">商家名称：{{ item.publisherName }}</view>
            </view>
          </view>
        </view>
      </view>
      <view v-else>暂无扫码记录</view>
    </view>
  </view>
</template>

<script>
import { request } from '../../server/request.js'
import { formatTime } from '../../utils/format.js'
export default {
  data () {
    return {
      searchContent: '',
      datas: [],
      pages: {
        index: 1,
        size: 5,
        count: 0,
      },
    }
  },
  created () {
    this.initialData()
  },
  onReachBottom () {
    // 当前页大于等于总页数
    if (this.pages.index >= this.pages.count) {
      uni.showToast({
        title: '到底啦',
        icon: 'none',
      })
    } else {
      this.pages.index++
      this.getDatas()
    }
    // 进入下一页
  },
  onPullDownRefresh () {
    this.initialData()
    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 1000)
  },
  methods: {
    initialData () {
      this.pages.index = 1
      this.datas = []
      this.getDatas()
    },
    getDatas () {
      const data = {
        index: this.pages.index + '',
        size: this.pages.size + '',
        search: '',
        orderby: 'createTime',
      }
      uni.showLoading({
        title: '加载中',
      })
      request({
        url: '/word/pagetoshop',
        method: 'post',
        data: data,
      }).then((loadresult) => {
        // console.log(loadresult)
        uni.hideLoading()
        const { message, code, data } = loadresult.data
        if (code === 200) {
          this.pages = {
            count: data.count,
            index: data.index,
            size: data.size,
          }
          data.list.forEach((record) => {
            record.createTime = formatTime(record.createTime)
            record.isGet = false
            this.changeCodeType(record)
            this.datas.push(record)
          })
        }
        this.selecteWords()
        if (code === -1) {
          uni.showToast({
            title: message,
            icon: 'none',
          })
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/login/login',
            })
          }, 2000)
        }
      })
    },
    selecteWords () {
      var ids = [-1]
      this.datas.forEach((item) => {
        ids.push(item.id)
      })
      request({
        url: '/word/check',
        method: 'post',
        data: {
          ids: ids,
        },
      }).then((res) => {
        this.isGetCode(res.data.data)
      })
    },
    isGetCode (data) {
      for (var i = 0; i < this.datas.length; i++) {
        if (this.idInIt(this.datas[i].id, data)) {
          this.datas[i].isGet = false
        } else {
          this.datas[i].isGet = true
        }
      }
    },
    changeCodeType (item) {
      if (item.type == 1) {
        item.type = '支付宝'
      }
      if (item.type == 2) {
        item.type = '抖音'
      }
      if (item.type == 3) {
        item.type = '淘宝'
      }
    },
    idInIt (id, checkDatas) {
      for (var i = 0; i < checkDatas.length; i++) {
        if (checkDatas[i].wordId == id) {
          return true
        }
      }
      return false
    },
    bindWord (word) {
      uni.showLoading({
        title: '领取中',
      })
      request({
        url: '/word/release?id=' + word.id,
        method: 'get',
      }).then((loadresult) => {
        uni.hideLoading()
        const { message, code, data } = loadresult.data
        word.isGet = false
        this.$router.go(0)
        if (code === 200) {
          uni.showToast({
            title: message,
            icon: 'none',
          })
          this.pages = {
            count: data.count,
            index: data.index,
            size: data.size,
          }
          data.list.forEach((record) => {
            record.createTime = formatTime(record.createTime)
            this.datas.push(record)
          })
        }
      })
    },
    searchWord () {
      const data = {
        index: this.pages.index + '',
        size: this.pages.size + '',
        search: this.searchContent,
        orderby: 'createTime',
      }
      uni.showLoading({
        title: '加载中',
      })
      request({
        url: '/word/pagetoshop',
        method: 'post',
        data: data,
      }).then((loadresult) => {
        uni.hideLoading()
        const { message, code, data } = loadresult.data
        if (code === 200) {
          this.datas = []
          this.pages = {
            count: data.count,
            index: data.index,
            size: data.size,
          }
          data.list.forEach((record) => {
            record.createTime = formatTime(record.createTime)
            record.isGet = false
            this.changeCodeType(record)
            this.datas.push(record)
          })
        }
      })
    },
  },
}
</script>

<style>
page {
  background-color: #f4f4f5;
}

.container {
  position: relative;
  padding: 40rpx 20rpx;
  font-size: 14px;
}
.search-content {
  width: 560rpx;
  display: inline-block;
  height: 80rpx;
  padding-left: 5px;
  line-height: 80rpx;
  font-size: 24rpx;
}
.search-btn {
  background-color: #007aff;
  color: white;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 26rpx;
  border-radius: 0 40rpx 40rpx 0;
}
.record-box {
  margin-top: 20rpx;
  overflow: hidden;
}

.record-info {
  background-color: white;
  padding: 25rpx;
  margin-bottom: 20rpx;
  border-radius: 20rpx;
  color: #333333;
}
.record-info-change {
  background-color: white;
  padding: 25rpx;
  margin-bottom: 20rpx;
  border-radius: 20rpx;
  color: #999999;
}
.record-header {
  font-weight: bold;
  position: relative;
}

.record-header :nth-child(2) {
  /* color: red; */
  font-weight: normal;
  margin: 20rpx 0 0 0;
  display: block;
  width: 70%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.record-header button {
  float: right;
  background-color: #df0024;
  position: absolute;
  right: 0rpx;
  top: 0rpx;
  border-radius: 0 20rpx 0 20rpx;
}
.record-info-change .record-change {
  float: right;
  background-color: #cccccc;
  position: absolute;
  right: 0rpx;
  top: 0rpx;
  border-radius: 0 20rpx 0 20rpx;
}
.record-content :nth-child(2) {
  margin-bottom: -10rpx;
}
</style>
