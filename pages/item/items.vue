<template>
  <view>
    <view class="head">
      <uni-row class="demo-uni-row"
               :gutter="20">
        <uni-col :span="18">
          <view>
            <uni-easyinput v-model="search"
                           style="background-color: #fff"
                           placeholder="请输入内容"></uni-easyinput>
          </view>
        </uni-col>
        <uni-col :span="6"
                 style="text-align: left">
          <button class="mini-btn"
                  style="background-color: #409eff; float: right; margin-top: 5px"
                  type="primary"
                  size="mini"
                  @click="scanBarcode">
            扫码
          </button>
        </uni-col>
      </uni-row>
    </view>
    <uni-row class="demo-uni-row content">
      <uni-col :span="24"
               v-if="datas.length > 0">
        <view v-for="(item, index) in datas"
              :key="index">
          <item-single :item="item"
                       class="item-single"
                       @popupRepertory="popupRepertory"
                       @setItem="setItem"
                       @modigyLogo="modigyLogo"></item-single>
        </view>
      </uni-col>
      <uni-col :span="24"
               v-if="datas.length == 0">
        <view style="text-align: center; padding-top: 20px">暂无内容</view>
      </uni-col>
    </uni-row>
    <!-- 库存弹窗 -->
    <uni-popup ref="popup"
               type="center">
      <view class="popupRepertory">
        <view class="popup-title">库存设置</view>
        <view class="popup-content">
          <view class="popup-nav">
            <text>库存：</text>
            <input type="number"
                   v-model="itemSingle.surplusStock"
                   placeholder-style="font-size:14px"
                   placeholder="请输入数量" />
            <text style="margin-left: 5px"> {{ itemSingle.unit }} </text>
          </view>
          <view class="popup-nav">
            <text>状态：</text>
            <picker @change="bindPickerChange"
                    :value="index"
                    :range="array"
                    class="picker">
              <view style="font-size: 14px">{{ array[index] }}</view>
              <text class="iconfont popup-icon">&#xe603;</text>
            </picker>
          </view>
        </view>
        <uni-row>
          <uni-col :span="12">
            <button size="mini"
                    style="float: right; margin-right: 10px"
                    @click="$refs.popup.close()">
              取消
            </button>
          </uni-col>
          <uni-col :span="12">
            <button size="mini"
                    class="popup-save"
                    @click="saveRepertory">
              保存
            </button>
          </uni-col>
        </uni-row>
      </view>
    </uni-popup>
  </view>
</template>
<script>
import { request } from '../../server/request.js'
import itemSingle from './itemSingle '
import { formatTime } from '../../utils/format.js'
import isWx from '../../utils/weixinCheck'
import weixinService from '../../server/weixinService.js'
export default {
  components: { itemSingle },
  data () {
    return {
      search: '',
      datas: [],
      timer: '',
      fid: '51',
      index: '',
      array: ['上架', '下架'],
      arrays: {
        上架: '0',
        下架: '1',
      },
      itemSingle: '',
      orderby: '',
      searchText: '',
      type: '',
      statuss: {
        0: '已上架',
        1: '已下架',
      },
    }
  },
  watch: {
    search () {
      this.debounce(300, this.loadData)
    },
  },
  created () {
    this.search = this.$route.query.barcode;
  },
  mounted () {
    this.initWeixin()
  },
  methods: {
    initWeixin () {
      let jssdk = weixinService.setWxJsdk(
        encodeURIComponent(location.href.split('#')[0])
      )
      console.log(jssdk)
    },
    scanBarcode () {
      console.log(jssdk)
      if (isWx()) {
        let _this = this
        jssdk.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['barCode'], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
            let results = result.split(',')
            if (results.length > 1) {
              result = results[1]
            }
            _this.search = result
          },
          fail: function (error) {
            uni.showToast({ title: error, icon: 'none' })
          },
        })
      } else {
        this.search = '123'
      }
    },
    debounce (wait, fun) {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setTimeout(() => {
        fun()
      }, wait)
    },
    loadData () {
      if (!this.search) {
        this.search = ""
        console.log('不允许搜索词为空', this.search, '333')
        // return
      }
      uni.showLoading({
        title: '加载中',
      })
      request({
        url: '/item/findItems?search=' + this.search,
        method: 'get',
      }).then((res) => {
        this.datas = []
        uni.hideLoading()
        const { message, code, data } = res.data
        if (code === 200) {
          data.forEach((item) => {
            item.status = this.statuss[item.status]
            item.picture = JSON.parse(item.picture)
            if (item.picture) {
              item.commodityLogo = item.picture[0]
            }
            this.datas.push(item)
          })
        }
      })
    },
    bindPickerChange: function (e) {
      this.index = e.target.value
    },
    popupRepertory (data) {
      this.itemSingle = data
      this.index = data.status === '已上架' ? 0 : 1
      this.$refs.popup.open()
    },
    saveRepertory () {
      let data = {
        id: this.itemSingle.id,
        status: this.arrays[this.array[this.index]],
        totalStock: this.itemSingle.surplusStock,
      }
      request({
        url: '/item/setStatus',
        method: 'post',
        data,
      }).then((res) => {
        let { code, message } = res.data
        if (code == 200) {
          uni.showToast({
            title: message,
          })
          this.loadData()
          this.$refs.popup.close()
        } else {
          uni.showToast({
            title: message,
            icon: 'none',
          })
        }
      })
    },
    setItem (id) {
      uni.navigateTo({
        url: '/pages/item/setInfo?id=' + id,
      })
    },
    modigyLogo (id) {
      uni.navigateTo({
        url: "/pages/item/modigyLogo?id=" + id
      })
    }
  },
}
</script>

<style>
page {
  background-color: #f5f5f5;
}
.head {
  width: 100%;
  padding: 8px;
  background: #f5f5f5;
  box-sizing: border-box;
  position: fixed;
  z-index: 9;
}
.content {
  padding-top: 55px;
}
.item-single {
  margin-bottom: 10px;
  background-color: #fff;
  padding: 10px;
}
.popupRepertory {
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
}
.popup-title {
  text-align: center;
  font-size: 16px;
  font-weight: 700;
}
.popup-content {
  margin: 15px 0 30px 0;
  font-size: 14px;
}
.popup-save {
  margin-left: 10px;
  background: #409eff;
  color: #fff;
}
.popup-nav {
  display: flex;
  height: 30px;
  line-height: 30px;
  margin-bottom: 10px;
}
.popup-nav input,
.popup-nav .picker {
  width: 175px;
  height: 30px;
  padding-left: 5px;
  border-radius: 3px;
  border: 1px solid #dddddd;
}
.popup-nav .picker {
  position: relative;
}
.popup-icon {
  position: absolute;
  right: 10px;
  top: 4px;
  transform: rotate(90deg);
  font-size: 12px;
  color: #848484;
}
</style>
