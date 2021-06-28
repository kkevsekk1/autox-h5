<template>
  <view class="modigyLogo-box">
    <view class="head">图片：</view>
    <uni-row class="content">
      <uni-col :span="24">

        <uni-file-picker v-model="imageValue"
                         disable-preview
                         fileMediatype="image"
                         mode="grid"
                         :auto-upload="false"
                         @select="select"
                         @success="success"
                         @fail="fail" />
      </uni-col>
    </uni-row>
    <view class="footer">
      <uni-row>
        <uni-col :span="8"
                 :push="3">
          <button>取消</button>
        </uni-col>
        <uni-col :span="8"
                 :push="5">
          <button style="background-color: #409eff;color:#fff;">保存</button>
        </uni-col>
      </uni-row>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      imageValue: []
    }
  },
  methods: {
    // 获取上传状态
    select (e) {
      console.log('选择文件：', e)
    },

    // 上传成功
    success (e) {
      console.log('上传成功')
    },

    // 上传失败
    fail (e) {
      console.log('上传失败：', e)
    }
  }
}
</script>

<style>
page {
  background-color: #f5f5f5;
}
.modigyLogo-box {
  padding: 10px;
}
.content {
  padding: 43px 0 50px 0;
}
.head {
  position: fixed;
  top: 0;
  left: 0;
  padding: 10px;
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px 0;
}
.footer button {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
}
</style>