<template>
  <view class="code-info">
<<<<<<< HEAD
    <navigator :url="'/pages/bindShop/bindShop?codeId='+ encodeURIComponent(JSON.stringify(code.id))"
               class="code-shopname"
               @click="$emit('showList',code.id)">{{code.shopName}}</navigator>
    <view class="code-content">
      <view class="code-id">
        <text>新码:{{code.newqrCode}}</text>
=======
    <text style="font-size: 26rpx;font-weight: bold;text-align: left;"
          @click="$emit('showList',code.id)">{{code.shopName}}</text>
    <view class="code-content">
      <view class="code-id">
        <text style="flex:1">code:{{code.newqrCode}}</text>
>>>>>>> b739d0f3f506d441216f39388b58a3e302630f5a
        <view>
          <button @click="$emit('previewImg',code.id)"
                  type="primary"
                  class="preview-button"
                  size="mini">预览</button>
          <button @click="$emit('identifyCode',{type:2,id:code.id})"
                  type="primary"
                  class="bind-code-button"
                  size="mini"
                  plain>绑定新码</button>
        </view>
      </view>
      <view class="code-url">
        <text class="url">{{code.url}}</text>
        <button @click="$emit('identifyCode',{type:1,id:code.id})"
                class="identify-code-button"
<<<<<<< HEAD
                type="primary"
                size="mini">识别原码</button>
=======
                size="mini">识别商家二维码</button>
>>>>>>> b739d0f3f506d441216f39388b58a3e302630f5a
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: ['code'],
  methods: {
    downImg () {
      uni.downloadFile({
        url: this.code.imgUrl, //仅为示例，并非真实的资源
        success: (res) => {
          if (res.statusCode === 200) {
            this.saveImg(res.tempFilePath)
          }
        },
        fail: (error) => {
          console.log(error, 'error')
        }
      });
    },
    saveImg (url) {
      var oA = document.createElement("a");
      oA.download = '';// 设置下载的文件名，默认是'下载'
      oA.href = url;
      document.body.appendChild(oA);
      oA.click();
      oA.remove(); // 下载之后把创建的元素删除
      uni.showToast({ title: '下载成功', icon: 'none' })
    }
  }
}
</script>

<style>
.code-info {
  margin-top: 20rpx;
  box-sizing: border-box;
  padding: 20rpx;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8rpx;
}
<<<<<<< HEAD
.code-id text {
  font-weight: bold;
}
=======
.code-id,
>>>>>>> b739d0f3f506d441216f39388b58a3e302630f5a
.code-url {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.code-url .url {
  flex: auto;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.code-id {
  padding: 20rpx 0;
}
.preview-button {
  width: 140rpx;
}
.bind-code-button {
  width: 180rpx;
  margin-left: 10rpx;
}
.identify-code-button {
<<<<<<< HEAD
  width: 140rpx;
  height: 50rpx;
  color: #007aff;
  font-size: 26rpx;
  border: 1rpx solid #007aff;
  background-color: rgba(0, 0, 0, 0);
  padding: 0;
  margin-right: -2rpx;
  line-height: 44rpx;
=======
  width: 260rpx;
>>>>>>> b739d0f3f506d441216f39388b58a3e302630f5a
}
</style>
