<template>
  <view class="index-box">
    <uni-row>
      <uni-col :span='24'
               class="header"
               style=" padding: 20px 30px;">
        <view class="header-subordinate">
          <view class="header-vip">
            <text>超级VIP</text>
          </view>
          <uni-row style="position:relatiive">
            <uni-col :span="12"
                     class="header-money">
              <view v-if="!ifVip">
                <view class="header-money-leiji">会员惊喜价({{time}}天)</view>
                <text>
                  <text class="iconfont">&#xe657;</text>
                  <text> {{amount}} </text>
                </text>
              </view>
              <view v-if="ifVip">
                <view class="header-money-leiji">累计已省</view>
                <text>
                  <text class="iconfont">&#xe657;</text>
                  <text> {{userData.saveSum}} </text>
                </text>
              </view>
            </uni-col>
            <uni-col :span="12"
                     class="header-buy">
              <view v-if="!ifVip">
                <text class="header-buy-buyVip"
                      @click="toAuthOrBuy">立即开通</text>
              </view>
              <view v-if="ifVip">
                <text class="header-buy-daoqi">{{userData.emdTime}}到期</text>
                <text @click="toAuthOrBuy"> 续费</text>
              </view>
            </uni-col>
          </uni-row>
        </view>
      </uni-col>
      <uni-col :span='24'
               style="margin-top: 50px;position: relative;">
        <view class="swiper-superior ">
          <view class="swiper">
            <swiper :autoplay='true'
                    :interval='1500'
                    :circular="true"
                    :vertical="true"
                    class="swiper-cotnent">
              <swiper-item v-for="(swiper,index) in swipers"
                           :key="index">
                <view class="swiper-cotnent-text"> {{swiper.content}} </view>
              </swiper-item>
            </swiper>
          </view>
        </view>
        <view class="content-superior">
          <view class="content">
            <view class="content-title">会员权益</view>
            <view style="padding-top:10px;">
              <uni-row class="content-nav"
                       v-for="(explain,index) in explains"
                       :key="index">
                <uni-col :xs="3"
                         :sm="1"
                         class="content-nav-icon">
                  <text class="iconfont"
                        v-html="explain.icon"></text>
                </uni-col>
                <uni-col :xs="21"
                         :sm="23"
                         style="padding-left: 10px;"
                         class="content-nav-particular">
                  <view> {{index+1}}. {{explain.title}} </view>
                  <view> {{explain.content}} </view>
                </uni-col>
              </uni-row>
            </view>
          </view>
        </view>
      </uni-col>
    </uni-row>
  </view>
</template>

<script>
import { formatTime } from '../../utils/format.js'
import { request } from '../../server/request.js'
import userService from '../../server/userService'
export default {
  data () {
    return {
      ifVip: false,
      explains: [
        {
          title: "全场两折起",
          content: "全场商品，最低两折起，优惠多多。",
          icon: "&#xe605;"
        },
        {
          title: '快递到家',
          content: "当天下单，当天发货，享受快递急速服务。",
          icon: "&#xe644;"
        },
        {
          title: '推荐会员赠送好礼',
          content: "推荐好友开通会员，即可获得牛奶1提。",
          icon: "&#xe64f;"
        },
        {
          title: '99元或一次消费300元开通会员',
          content: "花费99元或者一次消费满300元即可开通会员",
          icon: "&#xe654;"
        },
      ],
      userData: [],
      orderId: '',
      code: '',
      swipers: [],
      amount: '99',
      openId: null,
      time: "365"
    }
  },
  watch: {
    code (nv, ov) {
      if (nv) {
        if (nv) {
          this.code2OpenId(nv);
        }
      }
    },
  },
  created () {
    this.getUserData()
    this.addSwipers()
    this.code = this.$route.query.code;
  },
  methods: {
    code2OpenId (wxcode) {
      request({
        url: '/auth/wxCode2OpenId?code=' + wxcode,
        method: 'get',
      }).then((res) => {
        let { code, data } = res.data;
        console.log(res);
        if (code == 200) {
          this.buyVip();
        }
      })
    },
    toAuthOrBuy () {
      if (this.openId) {
        this.buyVip();
        return;
      }
      let url = encodeURI("http://xcx.ar01.cn/pages/buyVip/index");
      let param = encodeURI("id=122");
      location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3f4bf3f856017bd4&redirect_uri=" +
        url + "&response_type=code&scope=snsapi_base&state=" + param + "#wechat_redirect"
    },
    getUserData () {
      userService.loadUserInfo().then(user => {
        let { level, vipExpirationTime } = user
        if (level == 3) {
          this.ifVip = true
          vipExpirationTime = formatTime(vipExpirationTime).slice(0, 10).replaceAll('-', '.')
        }
        this.openId = user.openId;
        this.userData = {
          emdTime: vipExpirationTime || '0000.00.00',
          saveSum: "1231"
        }
      })
    },
    addSwipers () {
      let index = 0
      let maxIndex = 100
      let phones = ['130', '131', '132', '155', '156', '186', '185', '186', '185', '134', '135', '136',
        '137', '138', '139', '150', '151', '152', '157', '158', '159', '182', '183', '188', '187', '133', '153', '180', '181', '189',]
      for (; index < maxIndex; index++) {
        let random = Math.round(Math.random() * 100)
        let phone = (phones[Math.round(Math.random() * (phones.length - 1))]) + '∗∗∗∗' + (Math.round(Math.random() * (8238 - 2217)) + 2217)
        if (random < 20) {
          let content = '恭喜' + phone + '开通了VIP会员，尽享全场超低折扣'
          this.swipers.push({
            content: content
          })
        } else {
          let content = '恭喜' + phone + '一次性消费满了300元，激活了VIP会员'
          this.swipers.push({
            content: content
          })
        }
      }
    },
    buyVip () {
      let data = {
        amount: this.amount,
        accountType: '-1',
        payType: "0",
        type: '-1',
        title: '购买会员',
        subTitle: '-1',
        status: '-1'
      }
      request({
        url: "/bill/generate",
        method: "post",
        data,
      })
        .then(res => {
          let { code, data: { id } } = res.data
          if (code == 200) {
            this.toPay(id)
          }
        })
    },
    toPay (id) {
      request({
        url: '/bill/prePay?id=' + Number(id),
        method: 'get'
      })
        .then((res) => {
          let { data, code, message } = res.data;
          console.log(data, '123')
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
            }
          })
        })
    },
  }
}
</script>

<style>
page {
  background-color: #f5f5f5;
}
.header {
  background-color: #9266f9;
}
.header-subordinate {
  padding: 10px;
  border-radius: 10px;
  background-color: #642ae9;
}
.header-vip {
  padding-bottom: 25px;
  font-size: 20px;
  font-weight: 800;
  color: #ffd1b5;
}
.header-buy-buyVip {
  display: inline-block;
  text-align: center;
  width: 80px;
  height: 24px;
  line-height: 24px;
  border-radius: 12px;
  background-color: #ffd1b5;
  color: #642ae9;
}
.header-money {
  font-size: 30px;
  color: #ffd1b5;
}
.header-money-leiji {
  padding-bottom: 3px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
}
.header-buy {
  position: absolute;
  right: 0;
  bottom: 5px;
  font-size: 14px;
  text-align: right;
  color: #ffd1b5;
}
.header-buy-daoqi {
  padding-right: 5px;
  color: #fff;
}
.content-superior {
  position: absolute;
  top: 40px;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}
.content {
  padding: 10px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px;
}
.content-title {
  text-align: center;
  font-size: 16px;
  font-weight: 700;
}
.content-nav {
  padding: 10px 0;
  border-bottom: 1px solid #f2f2f2;
}
.content-nav-icon {
  text-align: center;
  height: 40px;
  line-height: 40px;
  border-radius: 5px;
  background-color: #fafafa;
}
.content-nav-icon text {
  font-size: 30px;
  color: #9266f9;
}
.content-nav-particular view:nth-child(1) {
  font-size: 14px;
  font-weight: 700;
}
.content-nav-particular view:nth-child(2) {
  padding-top: 5px;
  font-size: 12px;
  font-weight: 500;
  color: #999;
}
.swiper-superior {
  padding: 0 11px;
}
.swiper {
  background-color: #dc9663;
  border-radius: 10px;
  height: 60px;
}
.swiper-cotnent {
  padding-left: 10px;
  height: 40px;
  line-height: 40px;
}
.swiper-cotnent-text {
  font-size: 12px;
  font-weight: 500;
  color: #fff;
}
</style>