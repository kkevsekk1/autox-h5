<template>
  <view class="code-info">
    <navigator :url="'/pages/bindShop/bindShop?codeId='+ encodeURIComponent(JSON.stringify(code.id))"
               class="code-shopname"
               @click="$emit('showList',code.id)">{{code.shopName}}</navigator>
    <view class="code-content">
      <view class="code-id">
        <text>新码:{{code.newqrCode}}</text>
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
                type="primary"
                size="mini">识别原码</button>
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
  border: 1rpx solid white;
  border-radius: 10rpx;
}
.code-shopname {
  color: #007aff;
  font-size: 34rpx;
  font-weight: bold;
  text-align: left;
}
.code-id {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 26rpx;
}
.code-id text {
  font-weight: bold;
}
.code-url {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24rpx;
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
  width: 100rpx;
  height: 50rpx;
  padding: 0;
  line-height: 50rpx;
  font-size: 26rpx;
}
.bind-code-button {
  width: 150rpx;
  height: 50rpx;
  padding: 0;
  line-height: 44rpx;
  margin-left: 20rpx;
  font-size: 26rpx;
}
.identify-code-button {
  width: 140rpx;
  height: 50rpx;
  color: #007aff;
  font-size: 26rpx;
  border: 1rpx solid #007aff;
  background-color: rgba(0, 0, 0, 0);
  padding: 0;
  margin-right: -2rpx;
  line-height: 44rpx;
}
</style>
