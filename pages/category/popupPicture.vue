<template>
  <uni-popup ref="popupPicture"
             type="bottom"
             background-color="#fff">
    <view style="position:relative;height:40px;padding-top:5px;">
      <view class="popupPicture-itemTitle">{{popupPicture.itemTitle}}</view>
      <view class="popupPicture-itemId">商品码: {{popupPicture.itemId}} </view>
      <text class="iconfont popupPicture-icon"
            @click="$refs.popupPicture.close()">&#xe62f;</text>
    </view>
    <scroll-view scroll-y="true" 
                 style="height:500px; padding:">
        <view style="padding:70px 0px">
      <view v-for="(picture,index) in popupPicture.pictures"
            :key="index">
        <img class="popupPicture-img"
             :src="picture"
             alt="">
      </view>
        </view>
    </scroll-view>
  </uni-popup>

</template>

<script>
export default {
  props: ['popupPicture'],
  methods: {
    open () {
      this.$refs.popupPicture.open()
    },
  }
}
</script>

<style>
.popupPicture-icon {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 30px;
  color: #cecece;
}
.popupPicture-img {
  width: 100%;
  margin-bottom: 10px;
  padding: 0 10px;
  box-sizing: border-box;
}
.popupPicture-itemId,
.popupPicture-itemTitle {
  padding: 0 35px 0 10px;
}
.popupPicture-itemTitle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.popupPicture-itemId {
  font-size: 12px;
  color: #525252;
}
</style>