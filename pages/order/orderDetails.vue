<template>
  <view class="orderDaeails">
    <view class="content">
      <view class="allclass content-payStatus">
        <view>
          <text>支付状态：</text>
          <text> {{ items.status }} </text>
          <text class="iconfont">&#xe603;</text>
        </view>
        <view v-if="items.status == '待支付'">
          订单超过30分钟自动取消，请在
          <text>{{ countDown }}</text>
          内完成支付
        </view>
      </view>
      <view class="allclass content-userSite">
        <text>地址</text>
        <view class="content-userSite-right">
          <view>
            <text> {{ consignee.name }} </text>
            <text style="padding-left: 10px"> {{ consignee.phone }} </text>
          </view>
          <view>
            {{ consignee.address }}
          </view>
        </view>
      </view>

      <view class="allclass content-orderDetail">
        <view class="border-bottom content-orderDetail-allclass">
          <uni-row>
            <uni-col :span="12">
              <text style="color: #999">订单号</text>
            </uni-col>
            <uni-col :span="12"
                     style="text-align: right">
              <text class="color-50">{{ items.id }}</text>
            </uni-col>
          </uni-row>
        </view>

        <view class="content-orderDetail-allclass">
          <uni-row>
            <uni-col :span="8">
              <text style="color: #999">下单时间</text>
            </uni-col>
            <uni-col :span="16"
                     style="text-align: right">
              <text class="color-50">{{ items.Time }}</text>
            </uni-col>
          </uni-row>
        </view>

        <view class="content-orderDetail-allclass">
          <uni-row>
            <uni-col :span="14">
              <view>商品名</view>
            </uni-col>
            <uni-col :span="5"
                     style="text-align: right">
              <text>价格</text>
            </uni-col>
            <uni-col :span="5"
                     style="text-align: right">
              <text>x 数量</text>
            </uni-col>
          </uni-row>
          <uni-row v-for="(orderItem, index) in items.orderItems"
                   :key="index"
                   style="padding: 10px 0px 5px 0">
            <uni-col :span="14">
              <uni-row>
                <uni-col :span="8"
                         style="width: 48px; height: 48px">
                  <img style="width: 100%; height: 100%"
                       :src="orderItem.picture[0] + '_z.jpg'"
                       alt="" />
                </uni-col>
                <uni-col :span="16"
                         style="padding-left:3px">
                  <view>{{orderItem.title}}</view>
                  <view style="font-size:12px;color:#999"> {{orderItem.subTitle}} </view>
                </uni-col>
              </uni-row>
            </uni-col>
            <uni-col :span="5"
                     style="text-align: right">
              <text>{{ orderItem.price }}</text>
            </uni-col>
            <uni-col :span="5"
                     style="text-align: right">
              <text>x {{ orderItem.quantity }}</text>
            </uni-col>
          </uni-row>
        </view>
      </view>
    </view>
    <view class="footer">
      <view class="actualPayment">
        <text>实付金额：</text>
        <text class="iconfont">&#xe657;</text>
        <text>{{ items.actualPayment }}</text>
      </view>
      <uni-row>
        <uni-col :xs="0"
                 :sm="6"
                 :md="14">
          <text class="iconfont"
                style="color:#f5f5f5">&#xe62c;</text>
        </uni-col>
        <uni-col :xs="24"
                 :sm="18"
                 :md="10">
          <uni-row :gutter="20"
                   v-if="items.status == '待支付'">
            <uni-col :span="12">
              <view class="row-btn-cancel"
                    @click="cancelOrder()">取消订单</view>
            </uni-col>
            <uni-col :span="12">
              <view class="row-btn-pay"
                    @click="toAuth">去支付</view>
            </uni-col>
          </uni-row>
        </uni-col>
        <uni-col :xs="24"
                 :sm="18"
                 :md="10">
          <view v-if="items.status == '待发货'"
                class="row-btn-pay"
                @click="service">
            联系客服
          </view>
        </uni-col>
      </uni-row>
    </view>
    <!-- 客服 -->
    <uni-popup ref="popupService"
               type="bottom"
               background-color="#fff">
      <view class="popupService">
        <view class="popupService-title">
          <text>客服热线：</text>
          <text selectable="true"
                user-select="true">13523230214</text>
        </view>
        <uni-row :gutter="20">
          <uni-col :span="12">
            <view class="row-btn-cancel"
                  style="background-color: #999; color: #fff"
                  @click="$refs.popupService.close()">取消</view>
          </uni-col>
          <uni-col :span="12">
            <view class="row-btn-pay"
                  @click="dialPhone">拨打</view>
          </uni-col>
        </uni-row>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { request } from '../../server/request.js'
import { formatTime } from '../../utils/format.js'
export default {
  data () {
    return {
      orderId: '',
      code: '',
      items: [],
      countDown: '',
      servicePhone: '18081280120',
      statuss: {
        0: '待支付',
        1: '待发货',
        2: '已完成',
        4: '已取消'
      },
      consignee: '',
    }
  },
  watch: {
    code (nv, ov) {
      if (nv) {
        this.code2OpenId(nv);
      }
    },
  },
  async created () {
    this.orderId = this.$route.query.id
    let state = this.$route.query.state;
    if (state) {
      let orderParm = this.parseParam(decodeURI(state));
      this.orderId = orderParm.id;
      this.code = this.$route.query.code;
    }
    await this.getOrderDetails()
    this.countDownTime()
  },
  methods: {
    parseParam (param) {
      console.log(param)
      var para = param, arr_para = para.split('&'), i = 0, n = arr_para.length;
      var rs = {};
      for (; i < n; i++) {
        var arr = arr_para[i].split('=');
        rs[arr[0]] = arr[1];
      }
      return rs;
    },
    toAuth () {
      let url = encodeURI("http://xcx.ar01.cn/pages/order/orderDetails");
      let param = encodeURI("id=" + this.orderId);
      location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3f4bf3f856017bd4&redirect_uri=" +
        url + "&response_type=code&scope=snsapi_base&state=" + param + "#wechat_redirect"
    },
    code2OpenId (wxcode) {
      request({
        url: '/auth/wxCode2OpenId?code=' + wxcode,
        method: 'get',
      }).then((res) => {
        let { code, data } = res.data;
        console.log(res);
        if (code == 200) {
          this.toPay(data.openId);
        }
      })
    },
    toPay (openId) {
      request({
        url: '/itemOrder/prePay?id=' + this.orderId + "&openId=" + openId,
        method: 'get',
      }).then((res) => {
        let { data, code, message } = res.data;
        console.log(data)
        WeixinJSBridge.invoke('getBrandWCPayRequest', {
          "appId": data.appid,     //公众号ID，由商户传入     
          "timeStamp": data.timeStamp,         //时间戳，自1970年以来的秒数     
          "nonceStr": data.nonceStr, //随机串     
          "package": "prepay_id=" + data.prepayId,
          "signType": "MD5",         //微信签名方式：     
          "paySign": data.paySign //微信签名 
        }, function (res) {
          if (res.err_msg == 'get_brand_wcpay_request:ok') {
            uni.showToast({
              title: "付款成功"
            })
            uni.reLaunch({ url: '/pages/order/orders' });
          }
        })
      })
    },
    countDownTime () {
      let clearTime = setInterval(() => {
        let now = new Date()
        let until = new Date(this.items.createTime)
        let ms = until - now + 1800 * 1000
        var m = Math.floor(ms / (1000 * 60)) % 60;
        var s = Math.floor(ms / 1000) % 60;
        this.countDown = m + "分" + s + "秒"
        if (m <= 0 && s <= 0 && this.items.status == '待支付') {
          // this.cancellationOfrder()
          clearInterval(clearTime)
        }
      }, 1000)
    },
    async getOrderDetails () {
      request({
        url: '/itemOrder/getById?id=' + this.orderId,
        method: 'get',
      })
        .then((res) => {
          let { code, data } = res.data
          if (code == 200) {
            data.orderItems.forEach((orderItem) => {
              orderItem.picture = JSON.parse(orderItem.picture) || ''
            })
            data.Time = formatTime(data.createTime)
            // data.status = 0
            this.consignee = JSON.parse(data.consignee)
            data.consignee = JSON.parse(data.consignee)
            data.status = this.statuss[data.status]
            this.items = data
          }
        })
    },
    cancelOrder () {
      const shod = this
      uni.showModal({
        title: '温馨提示',
        content: '是否确定取消订单',
        confirmColor: '#9266f9',
        success: function (res) {
          if (res.confirm) {
            shod.cancellationOfrder()
          }
        },
      })
    },
    cancellationOfrder () {
      let id = this.items.id
      request({
        url: "/itemOrder/cancel?id=" + id,
        method: "get"
      })
        .then(res => {
          let { code, message } = res.data
          console.log(res)
          if (code == 200) {
            uni.showToast({
              title: message
            })
            uni.reLaunch({
              url: "/pages/order/orders"
            })
          }
        })
    },
    service () {
      this.$refs.popupService.open()
    },
    dialPhone () {
      uni.makePhoneCall({
        phoneNumber: this.servicePhone,
      })
    },
  },
}
</script>

<style>
page {
  background-color: #f5f5f5;
}
.allclass {
  padding: 10px;
  margin: 10px 0;
  font-size: 14px;
  border-radius: 5px;
  background-color: #fff;
}
.orderDaeails {
  padding: 10px;
  padding-bottom: 150px;
}
.content-payStatus view:nth-child(1) {
  font-size: 18px;
  font-weight: 800;
}
.content-payStatus view:nth-child(2) {
  padding-top: 20px;
  padding-bottom: 10px;
  font-size: 14px;
  font-weight: 800;
}
.content-userSite {
  overflow: hidden;
  color: #999;
}
.content-userSite-right {
  float: right;
  color: #505050;
}
.content-userSite-right view:nth-child(1) {
  text-align: right;
}
.color-50 {
  color: #505050;
}
.border-bottom {
  border-bottom: 1px solid rgb(216, 215, 215);
}
.content-orderDetail-allclass {
  overflow: hidden;
  padding: 10px 0;
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  background-color: #f5f5f5;
}
.actualPayment {
  text-align: right;
  font-size: 14px;
  padding-bottom: 5px;
}
.actualPayment text:nth-child(2) {
  font-size: 14px;
  font-weight: 800;
  color: red;
}
.actualPayment text:nth-child(3) {
  font-size: 18px;
  color: red;
}
.row-btn-cancel,
.row-btn-pay {
  display: inline-block;
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  border-radius: 10px;
}
.row-btn-cancel {
  color: #9266f9;
  background-color: #fff;
}
.row-btn-pay {
  background-color: #9266f9;
  color: #fff;
}
.popupService {
  padding: 10px;
}
.popupService-title {
  font-size: 16px;
  padding-top: 10px;
  padding-bottom: 20px;
  text-align: center;
}
</style>
