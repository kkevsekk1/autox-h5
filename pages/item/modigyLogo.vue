<template>
  <view class="modigyLogo-box">
    <view class="head">图片：</view>
    <uni-row class="content">
      <uni-col :span="24">
        <uni-file-picker v-model="imageValue"
                         disable-preview
                         :auto-upload="false"
                         fileMediatype="image"
                         mode="grid"
                         @select="select"
                         @delete="deleteLogo" />
      </uni-col>
    </uni-row>
    <view class="footer">
      <uni-row>
        <uni-col :span="8"
                 :push="3">
          <navigator url='/pages/item/items'>
            <button>取消</button>
          </navigator>
        </uni-col>
        <uni-col :span="8"
                 :push="5">
          <button style="background-color: #409eff;color:#fff;"
                  @click="saveLogo">保存</button>
        </uni-col>
      </uni-row>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      imageValue: [
        {
          "name": "logo.png",
          "extname": "txt",
          "url": "../../static/logo.png",
          "uuid": "1313214"
        },
        {
          "name": "logo.png",
          "extname": "png",
          "url": "../../static/logo.png",
          "uuid": "1313216"
        },
        {
          "name": "buy.png",
          "extname": "png",
          "url": "../../static/buy.png",
          "uuid": "131321"
        }
      ],
    }
  },
  methods: {
    console (e) {
      console.log(e)
    },
    // 文件点击
    select (e) {
      e.tempFiles.forEach(element => {
        let imageData = {
          "name": element.name,
          "extname": element.extname,
          "url": element.path,
          'uuid': element.uuid
        }
        this.imageValue.push(imageData)
      });
      console.log(e)
    },
    // 删除文件
    deleteLogo (e) {
      this.imageValue.forEach((element, index) => {
        if (element.uuid === e.tempFile.uuid) {
          this.imageValue.splice(index, 1)
        }
      })
    },
    saveLogo () {
      console.log(this.imageValue)
    }
  }
}
</script>

<style>
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
  width: 100%;
  background-color: #fff;
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px 0;
  background-color: #fff;
}
.footer button {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
}
</style>