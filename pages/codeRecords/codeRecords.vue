<template>
  <view class="container">
    <view class="record-box">
      <view class="record-list"
            v-if="codeRecords.length>0">
        <view v-for="item in codeRecords"
              :key="item.id">
          <record-item :record="item"></record-item>
        </view>
      </view>
      <view v-else>暂无扫码记录</view>
    </view>
  </view>
</template>

<script>
import { request } from '../../server/request.js'
import recordItem from './record.vue'
import { formatTime } from '../../utils/format.js'
export default {
  components: { recordItem },
  created () {
    this.initialData()
  },
  data () {
    return {
      codeRecords: [],
      pages: { index: 1, size: 5, count: 0 }
    }
  },
  onReachBottom () {
    // 当前页大于等于总页数
    if (this.pages.index >= this.pages.count) {
      uni.showToast({ title: '到底啦', icon: 'none' })
    } else {
      this.pages.index++
      this.getRecords()
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
      this.codeRecords = []
      this.getRecords()
    },
    getRecords () {
      const data = { index: this.pages.index + '', size: this.pages.size + '', orderby: 'id desc' }
      uni.showLoading({ title: '加载中' });
      request({
        url: '/qrcode/getscanrecord',
        method: 'post',
        data: data
      })
        .then((loadresult) => {
          uni.hideLoading()
          let { message, code, data } = loadresult.data
          if (code === 200) {
            this.pages = { count: data.count, index: data.index, size: data.size }
            data.list.forEach(record => {
              record.createTime = formatTime(record.createTime)
              this.codeRecords.push(record)
            })
          }
        })
    }
  }
}
</script>

<style>
page {
  background-color: #f8f8f8;
}
.container {
  position: relative;
  padding: 40rpx 20rpx;
  font-size: 24rpx;
}
.record-box {
  margin-top: 20rpx;
}
</style>
