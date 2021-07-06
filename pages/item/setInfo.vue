<template>
  <view style="padding: 8px">
    <uni-row class="row-class">
      <uni-col :span="4"
               class="title"> 条码： </uni-col>
      <uni-col :span="12">
        <view>
          <uni-easyinput v-model="item.barcode"
                         style="background-color: #fff"
                         placeholder="请输入内容"></uni-easyinput>
        </view>
      </uni-col>
      <uni-col :span="8"
               style="padding-left: 10px ;margin-top: 3px">
        <button class="mini-btn"
                style="background-color: #409eff;"
                type="primary"
                size="mini"
                @click="scanBarcode">
          扫码
        </button>
      </uni-col>
    </uni-row>
    <view class="row-class">
      <uni-row>
        <uni-col :span="4"
                 class="title"> 品名： </uni-col>
        <uni-col :span="12">
          <uni-easyinput v-model="item.title"
                         style="background-color: #fff"
                         placeholder="请输入品名"></uni-easyinput>
        </uni-col>
        <uni-col :span="8"
                 class="title">
          <view v-if="showUpdate"
                style="font-size: 10px; color: red; padding-left: 10px">
            将修改 ({{ item.id }})
          </view>
          <view v-if="!showUpdate"
                style="font-size: 10px; color: green; padding-left: 10px">
            将新增品规
          </view>
        </uni-col>
      </uni-row>
    </view>
    <uni-row>
      <uni-col :span="4"
               class="title"> 规格： </uni-col>
      <uni-col :span="12">
        <uni-easyinput v-model="item.subTitle"
                       style="background-color: #fff"
                       placeholder="请输入规格"></uni-easyinput>
      </uni-col>
      <uni-col :span="8"
               class="title">
        <view v-if="allItems.length>1&&!isUpdate">
          <picker @change="allItemSpecBindPickerChange"
                  :value="index"
                  :range="allItemSpecs"
                  class="title">
            <view style="font-size: 14px;color:red">有多个规格</view>
            <text class="iconfont popup-icon">&#xe603;</text>
          </picker>
        </view>
      </uni-col>
    </uni-row>
    <uni-row class="row-class">
      <uni-col :span="4"
               class="title"> 效期： </uni-col>
      <uni-col :span="10"
               class="title">
        <picker mode="date"
                :value="itemEndDate"
                :start="startDate"
                :end="endDate"
                @change="bindDateChange"
                class="picker">
          <view class="uni-input">{{ itemEndDate }}</view>
          <text class="iconfont popup-icon">&#xe603;</text>
        </picker>
      </uni-col>
      <uni-col :span="4"
               class="title"
               :push="1">
        剩余：
      </uni-col>
      <uni-col :span="5"
               :push="1">
        <picker @change="bindPickerChangeTime"
                :value="itemSurplusDays"
                :range="timeArray"
                class="title">
          <view style="font-size: 14px">{{ itemSurplusDays }}天</view>
          <text class="iconfont popup-icon-surplus">&#xe603;</text>
        </picker>
      </uni-col>
    </uni-row>
    <uni-row class="row-class">
      <uni-col :span="4"
               class="title"> 库存： </uni-col>
      <uni-col :span="10">
        <uni-easyinput v-model="item.surplusStock"
                       style="background-color: #fff"
                       placeholder="请输入库存"></uni-easyinput>
      </uni-col>
      <uni-col :span="4"
               :push="1"
               class="title">
        单位：
      </uni-col>
      <uni-col :span="5"
               :push="1"
               style="position: relative;">
        <uni-easyinput v-model="item.unit"
                       style="background-color: #fff;padding-right:20px"
                       placeholder="请输入"></uni-easyinput>
        <picker @change="unitBindPickerChange"
                :value="unitIndex"
                :range="unitArray"
                class="title unitPicker">
          <text class="iconfont popup-icon">&#xe603;</text>
        </picker>
      </uni-col>
    </uni-row>
    <uni-row class="row-class">
      <uni-col :span="4"
               class="title"> 价格： </uni-col>
      <uni-col :span="20">
        <uni-row>
          <uni-col :span="12"
                   style="margin-bottom: 10px">
            <uni-row>
              <uni-col :span="8"
                       class="title"> 普通 </uni-col>
              <uni-col :span="16">
                <uni-easyinput v-model="item.sellingPrice"
                               style="background-color: #fff"
                               placeholder="请输入价格"></uni-easyinput>
              </uni-col>
            </uni-row>
          </uni-col>
          <uni-col :span="12"
                   style="margin-bottom: 10px">
            <uni-row>
              <uni-col :span="8"
                       class="title"
                       style="padding: 3px">
                会员
              </uni-col>
              <uni-col :span="16">
                <uni-easyinput v-model="item.vipPrice"
                               style="background-color: #fff"
                               placeholder="请输入价格"></uni-easyinput>
              </uni-col>
            </uni-row>
          </uni-col>
          <uni-col :span="12"
                   style="margin-bottom: 10px">
            <uni-row>
              <uni-col :span="8"
                       class="title"> 代理 </uni-col>
              <uni-col :span="16">
                <uni-easyinput v-model="item.proxyPrice"
                               style="background-color: #fff"
                               placeholder="请输入价格"></uni-easyinput>
              </uni-col>
            </uni-row>
          </uni-col>
          <uni-col :span="12"
                   style="margin-bottom: 10px">
            <uni-row>
              <uni-col :span="8"
                       class="title"
                       style="padding: 3px">
                进货
              </uni-col>
              <uni-col :span="16">
                <uni-easyinput v-model="item.jinPrice"
                               style="background-color: #fff"
                               placeholder="请输入价格"></uni-easyinput>
              </uni-col>
            </uni-row>
          </uni-col>
          <uni-col :span="12"
                   style="margin-bottom: 10px">
            <uni-row>
              <uni-col :span="8"
                       class="title"> 正价 </uni-col>
              <uni-col :span="16">
                <uni-easyinput v-model="item.originalPrice"
                               style="background-color: #fff"
                               placeholder="请输入价格"></uni-easyinput>
              </uni-col>
            </uni-row>
          </uni-col>
          <uni-col :span="12"
                   style="margin-bottom: 10px">
            <uni-row>
              <uni-col :span="8"
                       class="title"
                       style="padding: 3px">
                备用
              </uni-col>
              <uni-col :span="16">
                <uni-easyinput v-model="item.remarkPrice"
                               style="background-color: #fff"
                               placeholder="请输入价格"></uni-easyinput>
              </uni-col>
            </uni-row>
          </uni-col>
        </uni-row>
      </uni-col>
    </uni-row>
    <uni-row class="row-class">
      <uni-col :span="4"
               class="title"> 状态： </uni-col>
      <uni-col :span="12">
        <picker @change="bindPickerChange"
                :value="index"
                :range="array"
                class="picker title">
          <view style="font-size: 14px">{{ array[index] }}</view>
          <text class="iconfont popup-icon">&#xe603;</text>
        </picker>
      </uni-col>
    </uni-row>
    <uni-row style="margin:10px 0;">
      <uni-col :span="7"
               class="title">
        <text>生产日期：</text>
      </uni-col>
      <uni-col :span="12"
               class="title">
        <picker mode="date"
                :value="expiration.createItemDate"
                @change="createBindDateChange"
                class="picker">
          <view class="uni-input">{{ expiration.createItemDate }}</view>
          <text class="iconfont popup-icon">&#xe603;</text>
        </picker>
      </uni-col>
    </uni-row>
    <uni-row>
      <uni-col :span="7"
               class="title">
        <text>保质期：</text>
      </uni-col>
      <uni-col :span="8"
               style="border:1px solid #ddd">
        <uni-row>
          <uni-col :span="14">
            <input v-model="expiration.numTime"
                   class="expiration-date"
                   placeholder="请输入" />
          </uni-col>
          <uni-col :span="10">
            <picker @change="timeUnitChange"
                    :value="expiration.timeIndex"
                    :range="expiration.timeArray"
                    style="border:0"
                    class="picker expiration-pocker">
              <view style="font-size: 14px">{{ expirationPicker }}</view>
              <text class="iconfont popup-icon"
                    style="right: 5px;">&#xe603;</text>
            </picker>
          </uni-col>
        </uni-row>
      </uni-col>
    </uni-row>
    <view>
      <button size="mini"
              class="popup-save"
              @click="saveItem">保存</button>
    </view>
  </view>
</template>
<script>
//进入界面1.根据id 加载商品，--不选规格
import { request } from '../../server/request.js'
import { formatTime } from '../../utils/format.js'
import isWx from '../../utils/weixinCheck'
import weixinService from '../../server/weixinService.js'
export default {
  data () {
    const currentDate = this.getDate({
      format: true,
    })
    return {
      surplusTime: '',
      search: '',
      id: -1,
      item: { barcode: '', endTime: currentDate },
      index: 0,
      array: ['上架', '下架'],
      arrays: {
        上架: '0',
        下架: '1',
      },
      timeArray: [],
      unitIndex: '',
      unitArray: ['瓶', '袋', '罐', '盒', '件', '套', '箱', '根', '包', '把', '个', '提'],
      allItems: [],
      allItemSpecs: [],
      itemEndDate: currentDate,
      itemSurplusDays: 0,
      isUpdate: false,
      showUpdate: false,
      allEndTimes: [],
      expiration: {
        createItemDate: "",
        numTime: "",
        timeIndex: 1,
        timeArray: ['日', '月', '年'],
        pickerData: '',
        unitTimes: {
          日: 1,
          月: 30,
          年: 365,
        },

      },
      preOrder: {
        random: "",
        search: "",
      },
    }
  },
  watch: {
    'item.barcode' () {
      this.debounce(300, this.loadItems)
    },
    'item.endTime' () {
      console.log("endTime")
      this.itemEndDate = formatTime(this.item.endTime).slice(0, 10)
      this.itemSurplusDays = this.surplusDays(new Date(this.item.endTime))
      if (!this.isUpdate) {
        for (let index = 0; index < this.allEndTimes.length; index++) {
          console.log(this.item.endTime, this.allEndTimes[index])
          this.showUpdate = false;
          if (formatTime(this.item.endTime).slice(0, 10) == formatTime(this.allEndTimes[index]).slice(0, 10)) {
            this.showUpdate = true;
            break;
          }
        }
      }
    },
    'item.unit' (val) {
      this.unitIndex = this.unitArray.indexOf(val)
    },
    'expiration.numTime' (val) {
      this.deadline()
    }
  },
  created () {
    this.preOrder.search = this.$route.query.search || ''
    this.preOrder.random = this.$route.query.random || ''
    if (this.preOrder.search != '') {
      this.item.barcode = this.preOrder.search
      this.item.title = "临时商品"
    }
    this.id = this.$route.query.id || -1
    if (this.id == -1) {
      this.isUpdate = false;
      this.showUpdate = false;
    } else {
      this.isUpdate = true;
      this.showUpdate = true;
    }
    for (let index = 0; index <= 730; index++) {
      this.timeArray.push(index)
    }
    this.loadData()
  },
  mounted () {
    this.initWeixin()
  },
  computed: {
    startDate () {
      return this.getDate('start')
    },
    endDate () {
      return this.getDate('end')
    },
    expirationPicker () {
      return this.expiration.timeArray[this.expiration.timeIndex]
    }
  },
  methods: {
    allItemSpecBindPickerChange (e) {
      let item = this.allItems[e.target.value]
      this.item = item
    },
    initWeixin () {
      let jssdk = weixinService.setWxJsdk(encodeURIComponent(location.href.split('#')[0]));
      console.log(jssdk);
    },
    scanBarcode () {
      console.log(this.item.barcode)
      if (isWx()) {
        let _this = this;
        jssdk.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['barCode'], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
            let results = result.split(',');
            if (results.length > 1) {
              result = results[1];
            }
            _this.item.barcode = result;
          },
          fail: function (error) {
            uni.showToast({ title: error, icon: 'none' })
          },
        })
      } else {
        this.item.barcode = '123';
        console.log(this.item.barcode);
      }
    },
    loadItems () {
      request({
        url: '/item/findItems?search=' + this.item.barcode,
        method: 'get',
      }).then((res) => {
        this.allItems = [];
        this.allItemSpecs = [];
        this.allEndTimes = [];
        const { message, code, data } = res.data
        if (code === 200) {

          data.forEach((item) => {
            this.allItems.push(item)
            let spec = '效期：' + this.dateFormatStr(new Date(item.endTime)) +
              ',  规格：' + item.subTitle
            this.allItemSpecs.push(spec);
            this.allEndTimes.push(formatTime(item.endTime).slice(0, 10));
          })
          if (!this.isUpdate && this.allItems.length > 0) {
            this.item = this.allItems[0];
          }
        }
      })
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
        if (code === 200 && data) {
          this.index = data.status
          this.item = data
        }
      })
    },
    debounce (wait, fun) {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setTimeout(() => {
        fun()
      }, wait)
    },
    bindPickerChange: function (e) {
      this.index = e.target.value
    },
    bindDateChange: function (e) {
      let date = e.target.value
      this.item.endTime = date + ' 00:00:00'
    },
    createBindDateChange: function (e) {
      this.expiration.createItemDate = e.target.value
      this.deadline()
    },
    surplusDays (date) {
      let now = new Date()
      let until = new Date(date)
      let days = (until - now) / 1000 / 3600 / 24 + 1
      let surplusTime = Math.floor(days)
      return surplusTime
    },
    getDate (type) {
      const date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      if (type === 'start') {
        year = year - 60
      } else if (type === 'end') {
        year = year + 2
      }
      month = month > 9 ? month : '0' + month
      day = day > 9 ? day : '0' + day
      return `${year}-${month}-${day}`
    },
    dateFormatStr (date) {
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      month = month > 9 ? month : '0' + month
      day = day > 9 ? day : '0' + day
      return `${year}-${month}-${day}`
    },
    unitBindPickerChange (e) {
      this.unitIndex = e.target.value
      this.item.unit = this.unitArray[this.unitIndex]
    },
    saveItem () {
      let { barcode, title, subTitle, endTime, surplusStock, unit, sellingPrice,
        vipPrice, proxyPrice, jinPrice, originalPrice, remarkPrice, status } = this.item
      status = this.arrays[this.array[this.index]]
      if (!surplusStock || !sellingPrice || !vipPrice || !proxyPrice) {
        uni.showToast({
          title: "请将库存、价格填写完毕",
          icon: "none"
        })
        return
      }
      let data = {
        id: this.id,
        barcode: barcode,
        title: title,
        subTitle: subTitle,
        endTime: endTime,
        totalStock: Number(surplusStock),
        unit: unit,
        sellingPrice: Number(sellingPrice),
        vipPrice: Number(vipPrice),
        proxyPrice: Number(proxyPrice),
        jinPrice: Number(jinPrice),
        originalPrice: Number(originalPrice),
        remarkPrice: Number(remarkPrice),
        status: Number(status),
        isUpdate: this.showUpdate
      }
      request({
        url: '/item/addOrUpdate',
        method: 'post',
        data,
      }).then((res) => {
        console.log(data)
        let { code, message } = res.data
        if (code == 200) {
          uni.showToast({
            title: message,
          })
          setTimeout(() => {
            if (this.preOrder.search) {
              uni.reLaunch({
                url: '/pages/order/preOrder?random=' + this.preOrder.random + "&search=" + this.preOrder.search,
              })
              return
            }
            console.log("123")
            uni.reLaunch({
              url: '/pages/item/items?barcode=' + barcode,
            })
          }, 300)
        }
      })
    },
    addTime (m) {
      return m < 10 ? '0' + m : m
    },
    bindPickerChangeTime (e) {
      // formatTime(this.item.endTime).slice(0, 10)
      let endDate = new Date(new Date(formatTime(new Date()).slice(0, 10)).getTime()
        + e.target.value * 24 * 3600 * 1000)
      this.item.endTime = formatTime(endDate);
    },
    timeUnitChange (e) {
      this.expiration.timeIndex = e.target.value
      this.deadline()
    },
    deadline () {
      let createTime = this.expiration.createItemDate
      let numTime = this.expiration.numTime
      let unitTime = this.expirationPicker
      let unitTimes = this.expiration.unitTimes
      if (createTime && numTime && unitTime) {
        createTime = createTime + ' 00:00:00'
        let numTimeMs = (numTime * unitTimes[unitTime] + 1) * 24 * 3600 * 1000
        let now = new Date()
        let created = new Date(createTime)
        numTimeMs = numTimeMs - (now - created)
        let endDate = new Date(new Date(formatTime(new Date()).slice(0, 10)).getTime()
          + numTimeMs)
        this.item.endTime = formatTime(endDate);
      }
    }
  },
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
.popup-icon-surplus {
  position: absolute;
  left: 30px;
  top: 0px;
  transform: rotate(90deg);
  font-size: 12px;
  color: #848484;
}
.picker {
  height: 36px;
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
.unitPicker {
  position: absolute;
  top: 0;
  right: -5px;
}
.expiration-date {
  height: 36px;
  padding-left: 5px;
  font-size: 14px;
  border-radius: 3px;
  border-right: 0;
}
.expiration-pocker {
  height: 36px;
  line-height: 36px;
}
</style>
