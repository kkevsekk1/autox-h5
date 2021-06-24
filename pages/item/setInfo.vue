<template>
  <view style="padding:8px">
    <view class="row-class">
      <uni-row class="demo-uni-row "
               :gutter=20>
        <uni-col :span="4"
                 class="title">
          条码：
        </uni-col>
        <uni-col :span="15">
          <view>
            <uni-easyinput v-model="item.barcode"
                           style="background-color:#fff"
                           placeholder="请输入内容"></uni-easyinput>
          </view>
        </uni-col>
        <uni-col :span="5"
                 style="text-align:left;">
          <button class="mini-btn"
                  style="background-color:#409eff;float:right;margin-top:3px;"
                  type="primary"
                  size="mini"
                  @click="scanBarcode">扫码</button>
        </uni-col>
      </uni-row>
    </view>
    <view class="row-class">
      <uni-row>
        <uni-col :span="4"
                 class="title">
          品名：
        </uni-col>
        <uni-col :span="15">
          <uni-easyinput v-model="item.title"
                         style="background-color:#fff"
                         placeholder="请输入品名"></uni-easyinput>
        </uni-col>
      </uni-row>
    </view>
    <view class="row-class">
      <uni-row>
        <uni-col :span="4"
                 class="title">
          规格：
        </uni-col>
        <uni-col :span="15">
          <uni-easyinput v-model="item.subtitle"
                         style="background-color:#fff"
                         placeholder="请输入规格"></uni-easyinput>
        </uni-col>
        <uni-col :span="4">
          <view class="drop-down-icon">
            <view class="iconfont">&#xe603;</view>
          </view>
        </uni-col>
      </uni-row>
    </view>
    <view class="row-class">
      <uni-row>
        <uni-col :span="4"
                 class="title">
          效期：
        </uni-col>
        <uni-col :span="12"
                 class="title">
          <picker mode="date"
                  :value="date"
                  :start="startDate"
                  :end="endDate"
                  @change="bindDateChange"
                  class="picker">
            <view class="uni-input">{{date}}</view>
            <text class="iconfont popup-icon">&#xe603;</text>
          </picker>
        </uni-col>
        <uni-col :span="4"
                 class="title"
                 style="padding-left:10px;">
          剩余：
        </uni-col>
        <uni-col :span="4">
          <picker @change="bindPickerChangeTime"
                  :value="timeIndex"
                  :range="timeArray"
                  class="title">
            <view style="font-size:14px">{{surplusTime}}天</view>
            <text class="iconfont popup-icon">&#xe603;</text>
          </picker>
        </uni-col>
      </uni-row>
    </view>
    <view class="row-class">
      <uni-row>
        <uni-col :span="4"
                 class="title">
          库存：
        </uni-col>
        <uni-col :span="8">
          <uni-easyinput v-model="item.surplusStock"
                         style="background-color:#fff"
                         placeholder="请输入库存"></uni-easyinput>
        </uni-col>
        <uni-col :span="4"
                 class="title"
                 style="padding-left:10px;">
          单位：
        </uni-col>
        <uni-col :span="8">
          <uni-easyinput v-model="item.unit"
                         style="background-color:#fff"
                         placeholder="请输入单位"></uni-easyinput>
        </uni-col>
      </uni-row>
    </view>
    <view class="row-class">
      <uni-row>
        <uni-col :span="4"
                 class="title">
          价格：
        </uni-col>
        <uni-col :span="20">
          <uni-row>
            <uni-col :span="12"
                     style="margin-bottom:10px">
              <uni-row>
                <uni-col :span="8"
                         class="title">
                  普通
                </uni-col>
                <uni-col :span="16">
                  <uni-easyinput v-model="item.sellingPrice"
                                 style="background-color:#fff"
                                 placeholder="请输入价格"></uni-easyinput>
                </uni-col>
              </uni-row>
            </uni-col>
            <uni-col :span="12"
                     style="margin-bottom:10px">
              <uni-row>
                <uni-col :span="8"
                         class="title"
                         style="padding:3px;">
                  会员
                </uni-col>
                <uni-col :span="16">
                  <uni-easyinput v-model="item.vipPrice"
                                 style="background-color:#fff"
                                 placeholder="请输入价格"></uni-easyinput>
                </uni-col>
              </uni-row>
            </uni-col>
            <uni-col :span="12"
                     style="margin-bottom:10px">
              <uni-row>
                <uni-col :span="8"
                         class="title">
                  代理
                </uni-col>
                <uni-col :span="16">
                  <uni-easyinput v-model="item.proxyPrice"
                                 style="background-color:#fff"
                                 placeholder="请输入价格"></uni-easyinput>
                </uni-col>
              </uni-row>
            </uni-col>
            <uni-col :span="12"
                     style="margin-bottom:10px">
              <uni-row>
                <uni-col :span="8"
                         class="title"
                         style="padding:3px;">
                  进货
                </uni-col>
                <uni-col :span="16">
                  <uni-easyinput v-model="item.jinPrice"
                                 style="background-color:#fff"
                                 placeholder="请输入价格"></uni-easyinput>
                </uni-col>
              </uni-row>
            </uni-col>
            <uni-col :span="12"
                     style="margin-bottom:10px">
              <uni-row>
                <uni-col :span="8"
                         class="title">
                  正价
                </uni-col>
                <uni-col :span="16">
                  <uni-easyinput v-model="item.originalPrice"
                                 style="background-color:#fff"
                                 placeholder="请输入价格"></uni-easyinput>
                </uni-col>
              </uni-row>
            </uni-col>
            <uni-col :span="12"
                     style="margin-bottom:10px">
              <uni-row>
                <uni-col :span="8"
                         class="title"
                         style="padding:3px;">
                  备用
                </uni-col>
                <uni-col :span="16">
                  <uni-easyinput v-model="item.remarkPrice"
                                 style="background-color:#fff"
                                 placeholder="请输入价格"></uni-easyinput>
                </uni-col>
              </uni-row>
            </uni-col>
          </uni-row>
        </uni-col>
      </uni-row>
    </view>
    <view class="row-class">
      <uni-row>
        <uni-col :span="4"
                 class="title">
          状态：
        </uni-col>
        <uni-col :span="15">
          <picker @change="bindPickerChange"
                  :value="index"
                  :range="array"
                  class="picker  title">
            <view style="font-size:14px">{{array[index]}}</view>
            <text class="iconfont popup-icon">&#xe603;</text>
          </picker>
        </uni-col>
      </uni-row>
    </view>
    <view>
      <button size="mini"
              class="popup-save"
              @click="saveItem">保存</button>
    </view>
  </view>
</template>
<script>
import { request } from '../../server/request.js'
export default {
  data () {
    const currentDate = this.getDate({
      format: true
    })
    return {
      surplusTime: "",
      date: currentDate,
      search: "",
      id: '',
      item: {},
      datas: [],
      index: '',
      array: ['上架', '下架'],
      arrays: {
        '上架': '0',
        '下架': '1'
      },
      timeArray: [],
      timeIndex: "",
    }
  },
  watch: {
    search () {
      this.debounce(300, this.loadData)
    }
  },
  created () {
    this.id = this.$route.query.id
    this.loadData()
  },
  computed: {
    startDate () {
      return this.getDate('start');
    },
    endDate () {
      return this.getDate('end');
    }
  },
  methods: {
    loadItems () {
      if (!this.item.barcode) {
        console.log('不允许搜索词为空', this.search, '333')
        return;
      }
      request({
        url: '/item/findItems?search=' + this.search,
        method: 'get',
      }).then((res) => {
        this.datas = [];
        const { message, code, data } = res.data
        if (code === 200) {
          data.forEach((item) => {
            this.datas.push(item)
          })
        }
      })
    },
    scanBarcode () {
      console.log(jssdk)
      this.search = "123"
    },
    loadData () {
      uni.showLoading({
        title: '加载中',
      })
      request({
        url: '/item/getByIdAPP?id=' + this.id,
        method: 'get',
      }).then((res) => {
        uni.hideLoading()
        const { message, code, data } = res.data
        if (code === 200) {
          for (let index = 1; index <= 730; index++) {
            this.timeArray.push(index)
          }
          this.date = data.endTime.slice(0, 10)
          this.index = data.status
          this.item = data;
          this.surplusDate()
        }
      })
    },
    debounce (wait, fun) {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setTimeout(() => {
        fun();
      }, wait)
    },
    bindPickerChange: function (e) {
      this.index = e.target.value
    },
    bindDateChange: function (e) {
      this.date = e.target.value
      this.surplusDate()
    },
    surplusDate () {
      let now = new Date()
      let until = new Date(this.date)
      let days = ((until - now) / 1000 / 3600 / 24) + 1;
      this.surplusTime = Math.floor(days);
      this.timeIndex = this.surplusTime - 1
    },
    getDate (type) {
      const date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      if (type === 'start') {
        year = year - 60;
      } else if (type === 'end') {
        year = year + 2;
      }
      month = month > 9 ? month : '0' + month;;
      day = day > 9 ? day : '0' + day;
      return `${year}-${month}-${day}`;
    },
    saveItem () {
      let item = this.item
      item.status = this.arrays[this.array[this.index]]
      let data = {
        id: this.id,
        barcode: item.barcode,
        title: item.title,
        subtitle: item.subtitle,
        endTime: this.date,
        totalStock: Number(item.surplusStock),
        unit: item.unit,
        sellingPrice: Number(item.sellingPrice),
        vipPrice: Number(item.vipPrice),
        proxyPrice: Number(item.proxyPrice),
        jinPrice: Number(item.jinPrice),
        originalPrice: Number(item.originalPrice),
        remarkPrice: Number(item.remarkPrice),
        status: Number(item.status),
      }
      request({
        url: "/item/addOrUpdate",
        method: "post",
        data,
      })
        .then(res => {
          console.log(data)
          let { code, message } = res.data
          if (code == 200) {
            uni.showToast({
              title: message,
            })
            setTimeout(function () {
              uni.reLaunch({
                url: "/pages/item/items"
              })
            }, 300)
          }
        })
    },
    addTime (m) {
      return m < 10 ? '0' + m : m
    },
    bindPickerChangeTime (e) {
      this.surplusTime = this.timeArray[e.target.value]
      let now = this.surplusTime * 24 * 3600 * 1000
      let until = new Date().getTime()
      let days = now + until
      let time = new Date(days);
      let y = time.getFullYear();
      let m = time.getMonth() + 1;
      let d = time.getDate();
      this.date = y + '-' + this.addTime(m) + '-' + this.addTime(d)
    }
  }
}
</script>

<style>
.row-class {
  margin: 10px 0;
}
.title {
  height: 36px;
  line-height: 36px;
}
.popup-icon {
  position: absolute;
  right: 10px;
  top: 0px;
  transform: rotate(90deg);
  font-size: 12px;
  color: #848484;
}
.picker {
  width: 175px;
  height: 30px;
  padding-left: 5px;
  border-radius: 3px;
  border: 1px solid #dddddd;
  position: relative;
}
.popup-save {
  position: fixed;
  bottom: 10px;
  right: 10px;
  margin-left: 10px;
  background: #409eff;
  color: #fff;
}
</style>
