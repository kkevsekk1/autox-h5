<template>
  <view @click="pitchOn">
    <view class="nav-type">
      <view>
        <img :src="functionData.imgPath"
             alt="">
      </view>
      <view> {{functionData.functionName}} </view>
    </view>
    <uni-popup ref="popup"
               type="center">
      <view class="list">
        <view>内容已复制</view>
        <textarea v-model="functionData.path" />
        <view @click="closePopup"> <img src="../../static/btn_skip.png"
               alt=""> </view>
      </view>
    </uni-popup>
    <uni-popup ref="member"
               type="center">
      <view class="list">
        <view>提示</view>
        <textarea v-model="functionData.path" />
        <button type="default"
                @click="closeMember">我知道了</button>
      </view>
    </uni-popup>
    
  </view>
</template>

<script>
import { setClipboardData } from '@/uni_modules/u-clipboard/js_sdk'
export default {
  props: ["functionData"],
  methods: {
    pitchOn () {
      console.log(111, this.functionData);
      let { type, path } = this.functionData
      if (type === "内部链接") {
        console.log(path),
          this.openMember();
        uni.navigateTo({
          url: path
        })
      }
      if (type === "外部链接") {
        window.location.href = path
      }
      if (type === '复制功能') {
        this.openPopup()
      }
    },
    openPopup () {
      setClipboardData(this.functionData.path);
      this.$refs.popup.open();
    },
    closePopup () {
      this.$refs.popup.close();
    },
    openMember () {
      setClipboardData(this.functionData.path);
      this.$refs.member.open();
    },
    closeMember () {
      this.$refs.member.close();
    }
  }

}
</script>

<style>
.nav-type {
  transform: translateY(50%);
}
.nav-type view:nth-child(1) {
  display: inline-block;
  width: 40px;
  height: 40px;
  max-width: 60px;
  max-height: 60px;
  margin-bottom: 10px;
}
.nav-type view:nth-child(1) img {
  width: 100%;
  height: 100%;
}
.nav .nav-type view:nth-child(2) {
  font-size: 14px;
  font-weight: 700;
}
.list {
  width: 310px;
  height: 265px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.list view {
  margin: 0 auto;
}
.list view:nth-child(1) {
  font-size: 16px;
  text-align: center;
}
.list textarea {
  margin: 0 auto;
  width: 250px;
  height: 125px;
  padding: 10px;
  font-size: 14px;
  background-color: #f5f5f5;
}
.list view:nth-child(3) {
  width: 200px;
}
.list view:nth-child(3) img {
  width: 100%;
}
</style>