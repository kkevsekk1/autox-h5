<template>
  <view style="padding:8px" >
<uni-row class="demo-uni-row" :gutter=20 >
    <uni-col :span="18">
    <view >
			<uni-easyinput  v-model="search" placeholder="请输入内容"></uni-easyinput>
		</view>
    </uni-col>
    <uni-col :span="6" style="text-align:left;">
      <button class="mini-btn" type="primary" size="mini" @click="scanBarcode" >扫码</button>
    </uni-col>
</uni-row>
<uni-row class="demo-uni-row">
    <uni-col :span="24">
    <view v-for="item,index in datas" :key="index">
        <view>{{item.name}}</view>
    </view>
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
      search:'',
       datas:[],
       timer:'',
    }
  },
  watch: {
    search () {
      this.debounce(300,this.loadData)
    }
  },
  created () {
   
  },
  onReachBottom () {
    // 当前页大于等于总页数

  },
  methods: {
    scanBarcode(){
        this.search="123"
    },
    debounce (wait,fun) {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setTimeout(() => {
       fun();
      }, wait)
    },
   loadData () {
      uni.showLoading({
        title: '加载中',
      })
      request({
        url: '/item/findItems?search='+this.search,
        method: 'get',
      }).then((res) => {
        uni.hideLoading()
        const { message, code, data } = res.data
        if (code === 200) {
     
          data.forEach((item) => {
            this.datas.push(item)
          })
        }
      })
    },
  }  
    
}
</script>

<style>

</style>
