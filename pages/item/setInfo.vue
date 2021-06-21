<template>
  <view style="padding:8px" >
<uni-row class="demo-uni-row" :gutter=20 >
    <uni-col :span="24">
    <view >
        hello 
		</view>
    </uni-col>
</uni-row>
<uni-row class="demo-uni-row">
    <uni-col :span="24"  >
        <view style="text-align:center;padding-top:20px;">{{item.title}}</view>
  </uni-col>
</uni-row>
  </view>
</template>
<script>
import { request } from '../../server/request.js'
import { formatTime } from '../../utils/format.js'
export default {
  data () {
    return {
      id:28,
      item:{},
    }
  },
  created (optins) {
      console.log(optins);
      this.loadData()
  },
  onReachBottom () {
    // 当前页大于等于总页数

  },
  methods: {
   loadData () {
      uni.showLoading({
        title: '加载中',
      })
      request({
        url: '/item/getByIdAPP?id='+this.id,
        method: 'get',
      }).then((res) => {
        uni.hideLoading()
        const { message, code, data } = res.data
        if (code === 200) {
          this.item =data;
          console.log(data)
        }
      })
    },
  }     
}
</script>

<style>

</style>
