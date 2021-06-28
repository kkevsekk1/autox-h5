<template>
  <view class="modigyLogo-box">
    <view class="head"></view>
    <uni-row class="content">
      <uni-col :span="24">
        <uni-file-picker ref="files"
                         v-model="imageValue"
                         :autoUpload="false"
                         title="最多上传9张图片"
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
                  @click="saveLogo">保存 </button>
        </uni-col>
      </uni-row>
    </view>
  </view>
</template>

<script>
import { request } from '../../server/request.js'
export default {
  data () {
    return {
      ifSave: 1,
      id: '',
      signal: {},
      images: [],
      imageValue: [],
    }
  },
  created () {
    this.id = this.$route.query.id
    this.getByIdAPP()
  },
  async mounted () {
    let x = await this.getSign();
    this.signal = x;
  },
  methods: {
    getByIdAPP () {
      request({
        url: "/item/getByIdAPP?id=" + this.id,
        method: "get"
      })
        .then(res => {
          let { code, data } = res.data
          if (code == 200) {
            if (data.picture) {
              data.picture = JSON.parse(data.picture)
              data.picture.forEach(item => {
                this.imageValue.push({
                  url: item
                })
              })
            }
          }
        })
    },
    // 文件点击
    select (e) {
      this.ifSave = 0
      e.tempFiles.forEach((logoPath, index) => {
        let element = logoPath;
        let data = {};
        data["key"] = 'tjpimg/' + element.uuid + '.' + element.extname;
        data["policy"] = this.signal.policyBase64;
        data["OSSAccessKeyId"] = this.signal.accessid;
        data["success_action_status"] = 200;
        data["signature"] = this.signal.signature;
        data["name"] = element.name;
        uni.uploadFile({
          url: this.signal.host,
          filePath: element.path,
          formData: data,
          success: () => {
            const url = this.signal.host + '/' + data.key;
            this.imageValue.push({ url: url })
            if (index + 1 === e.tempFiles.length) {
              this.ifSave = 1
            }
          },
        })
      })
    },
    async getSign () {
      let signal = await request({
        url: "/activity/getuploadSign",
        method: "get",
      });
      signal = signal.data
      console.log('signal_____', signal);
      const result = {};
      result.policyBase64 = signal.data.policy;
      result.accessid = signal.data.accessid;
      result.signature = signal.data.signature;
      result.host = signal.data.host;
      return result;
    },
    // 删除文件
    deleteLogo (e) {
      this.imageValue.forEach((element, index) => {
        if (element.url === e.tempFile.url) {
          this.imageValue.splice(index, 1)
        }
      })
    },
    saveLogo () {
      if (this.ifSave == 0) {
        uni.showToast({
          title: "图片正在上传中，请稍等",
          icon: "none"
        })
        return
      }
      let images = []
      this.imageValue.forEach(res => {
        images.push(res.url)
      })
      images = JSON.stringify(images)
      let data = {
        id: this.id,
        images: images
      }
      request({
        url: "/item/updateImages",
        method: "post",
        data,
      })
        .then(res => {
          let { code, message } = res.data
          if (code == 200) {
            uni.navigateTo({
              url: "/pages/item/items"
            })
            uni.showToast({
              title: message,
            })
          }
        })
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