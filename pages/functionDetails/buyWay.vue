<template>
  <view class="wayBuy-box">
    <view style="font-size:16px;font-weight:600">授权方式</view>
    <view style="color:#7a7a7a">
      <view class="empower">
        <view>
          <text>{{empower.isEmpower}}</text>
          <text v-show="empower.chargeWay=='1'"> 免费 </text>
          <text v-show="empower.chargeWay=='2'">
            {{empower.unitPrice}}币/次/台设备
          </text>
          <text v-show="empower.chargeWay=='3'">
            {{empower.endTime}}天 ({{empower.deviceCount}}台)
          </text>
        </view>
      </view>
      <radio-group @change="radioChange">
        <view v-show="specs.isFree==='true'"
              @click="checked = 'isFree'">
          <radio value="isFree"
                 :checked="checked === 'isFree'"
                 style="transform:scale(0.7)" />
          <text>免费</text>
        </view>
        <view v-show="specs.isFree==='false'"
              @click="theAmount">
          <radio value="unitPrice"
                 :checked="checked === 'unitPrice'"
                 style="transform:scale(0.7)" />
          <text>按量收费</text>
          <text style="margin-left:10px;">{{specs.unitPrice}}币/次/台设备</text>
        </view>
        <view v-show="specs.isFree==='false'">
          <text style=" margin-left: 28px;">包年包月</text>
          <view class="row-table">
            <uni-row>
              <uni-col class="col-table"
                       v-for="(title,index) in packetsTitle"
                       :key="index"
                       :span="6"> {{title}} </uni-col>
            </uni-row>
            <uni-row v-for="(packet,index) in specs.packets"
                     :key="index">
              <uni-col class="col-table"
                       :span="6"
                       v-for="(item,indexes) in packet"
                       :key="indexes">
                <view :class="pitchOn == item && indexes !== 'deviceCount'  ? 'clickColor': '' "
                      @click="buyType(packet,indexes,item)"> {{item}}</view>
              </uni-col>
            </uni-row>
          </view>
        </view>
        <view class="explain">
          <uni-row v-show="specs.isFree==='false'">
            <uni-col :span="24">升降级提醒: </uni-col>
            <uni-col :span="24">
              <view>1.新购设备数小于或等于当前设备，新购规格叠加时间，设备数将以新购为准</view>
              <view>2.新购设备数大于当前数设备，新购时间不与原时间叠加，视为自动放弃之前的剩余时间</view>
              <view>3.基于上述建议，一次购买足够的设备数和时间，或者在原授权到期后再升级</view>
            </uni-col>
          </uni-row>
        </view>
      </radio-group>
      <view>
        <view class="hasChosen">
          <text class="hasChosen-title">已选规格：</text>
          <text v-show="checked === 'isFree'">免费</text>
          <text v-show="checked === 'unitPrice'">
            <text>按量收费</text>
            <text style="margin-left:10px;">{{specs.unitPrice}}币/次/台设备</text>
          </text>
          <text v-show="checked === 'packages'">
            <text>{{unitFacility}}台设备，</text>
            <text> {{unitAbi}}A币/{{unitTime}} </text>
          </text>
        </view>
        <view v-show="checked === 'packages'">
          <text class="hasChosen-title"> 数&emsp;&emsp;量：</text>
          <lxc-count @handleCount="handleCountClick"
                     class="lxc-count-calss">
          </lxc-count>
          <text> {{unitTime}} </text>
        </view>
        <view style="float:right;height:29px;line-height:29px">
          <text v-show="checked === 'packages'"
                style="margin-right:14px;">共<text style="color:red">{{buyTime*unitAbi}}</text> A币</text>
          <button @click="getEmpower"
                  size="mini"
                  class="btn-Empower">授权</button>
        </view>
      </view>
    </view>
    <view></view>
  </view>
</template>

<script>
import lxcCount from '@/components/lxc-count/lxc-count.vue'
export default {
  components: {
    lxcCount
  },
  props: ['specs', 'empower'],
  data () {
    return {
      pitchOn: "",
      checked: "",
      spanNumber: "6",
      packetsTitle: ['设备数', "每天", "每月", "每年"],
      unitFacility: "0",
      unitAbi: "0",
      unitTime: "天",
      buyTime: "",
    }
  },
  computed: {
    chargeWay: function () {
      if (this.checked == "isFree") {
        return "1"
      }
      if (this.checked == "unitPrice") {
        return "2"
      }
      if (this.checked == "packages") {
        return "3"
      }
    },
    deviceCount: function () {
      if (this.checked == "packages") {
        return this.unitFacility
      } else {
        return ""
      }
    },
    packetType: function () {
      if (this.unitTime == "天") {
        return "1"
      }
      if (this.unitTime == "月") {
        return "2"
      }
      if (this.unitTime == "年") {
        return "3"
      }
    },
    lengthTime: function () {
      if (this.checked == "packages") {
        return this.buyTime
      } else {
        return ""
      }
    },
  },
  methods: {
    handleCountClick (e) {
      this.buyTime = e
    },
    radioChange (evt) {
      this.checked = evt.detail.value
    },
    theAmount () {
      this.checked = 'unitPrice'
      this.pitchOn = ''
      this.unitFacility = '0'
      this.unitAbi = '0'
      this.buyTime = ''
    },
    buyType (packet, index, item) {
      if (index !== "deviceCount") {
        this.pitchOn = item
        let timeName
        if (index === "unitDay") {
          timeName = "天"
        }
        if (index === "unitMonth") {
          timeName = "月"
        }
        if (index === "unitYear") {
          timeName = "年"
        }
        this.unitFacility = packet['deviceCount']
        this.unitAbi = item
        this.unitTime = timeName
        this.checked = 'packages'
      }
    },
    getEmpower () {
      let sum = this.buyTime * this.unitAbi
      let data = {
        chargeWay: this.chargeWay,
        deviceCount: this.deviceCount,
        packetType: this.packetType,
        lengthTime: this.lengthTime,
      }
      if (!this.chargeWay) {
        uni.showToast({
          title: "请选择授权类型",
          icon: "none"
        })
        return null
      }
      if (this.lengthTime || this.checked !== "packages") {
        uni.showModal({
          title: '提示',
          content: '是否确定购买？',
          success: function (res) {
            if (res.confirm) {
              this.$emit("buy", data)
            }
          }.bind(this)
        });
      } else {
        uni.showToast({
          title: "请选择购买数量",
          icon: "none"
        })
      }
    }
  }
}
</script>

<style>
.wayBuy-box {
  font-size: 14px;
}
.empower,
.radio-class {
  font-size: 14px;
  margin: 10px 0;
}
.wayBuy-box .time-input {
  display: inline-block;
  font-size: 14px;
  width: 30px;
  border: 1px solid #ddd;
  background-color: #fff;
}
.row-table {
  max-width: 400px;
  margin-top: 5px;
  margin-left: 30px;
  font-size: 12px;
  border-top: 1px solid #000;
  border-right: 1px solid #000;
  background-color: #fff;
}
.col-table {
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-left: 1px solid #000;
  border-bottom: 1px solid #000;
}
.clickColor {
  background-color: #409efe;
  color: #fff;
}
.floatRight {
  float: right;
}
.prices-elect {
  margin-left: 30px;
  margin-top: 10px;
  height: 20px;
  line-height: 20px;
}
.hasChosen {
  margin-top: 20px;
}
.hasChosen-title {
  font-size: 14px;
  color: #409efe;
}
.btn-Empower {
  float: right;
  background-color: #409efe;
  color: #fff;
}
.explain {
  margin-left: 30px;
  margin-top: 5px;
  font-size: 10px;
  color: red;
}
.lxc-count-calss {
  display: inline-block;
  position: relative;
  top: 10px;
  margin-right: 5px;
}
</style>