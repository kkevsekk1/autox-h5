<template>
  <view class="selectuser-box">
    <view class="content">
      <view v-for="userData,index in userDatas"
            :key="index"
            class="user-data"
            @click="selectUser(userData)">
        <user-data style="border-bottom: 1px solid #dad9d9;"
                   :userData="userData"
                   :index="index"
                   :edit="'editUrse'"
                   @editUrse.stop="editUrse"
                   @deleteUrse.stop="deleteUrse"></user-data>
      </view>
      <view class="add-site"
            @click.stop="adduser">
        <text style="color:#9266f9">新增地址</text>
        <text class="iconfont user-icon">&#xe603; </text>
      </view>
    </view>
    <uni-popup ref="popup"
               type="center">
      <view class="popup">
        <uni-forms :modelValue="formData"
                   validate-trigger="bind"
                   ref="form">
          <uni-forms-item label="姓名："
                          name="name">
            <uni-easyinput type="text"
                           v-model="formData.name"
                           placeholder="请输入姓名" />
          </uni-forms-item>
          <uni-forms-item label="电话："
                          name="phone">
            <uni-easyinput type="text"
                           v-model="formData.phone"
                           placeholder="请输入电话" />
          </uni-forms-item>
          <uni-forms-item label="地址："
                          name="address">
            <uni-easyinput type="text"
                           v-model="formData.address"
                           placeholder="请输入收货地址" />
          </uni-forms-item>
          <view class="popup-btn-submit">
            <button @click="saveUser"
                    size="mini">保存</button>
          </view>
        </uni-forms>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import userData from './userData'
import { request } from '../../server/request.js'
import userService from '../../server/userService'
export default {
  components: { userData },
  data () {
    return {
      userDatas: [],
      formData: {
        name: '',
        phone: '',
        address: '',
        index: "",
        type: ''
      },
    }
  },
  created () {
    this.getUserData()
  },
  methods: {
    getUserData () {
      this.userDatas = []
      userService.loadAdress().then(address=>{
        this.userDatas = address
      })
    },
    async saveUser () {
      let formData = this.formData
      if (!formData.address || !formData.name || !formData.phone) {
        uni.showToast({
          title: "请将信息填写完毕",
          icon: "none"
        })
        return
      }
      if (this.formData.type == "add") {
        this.userDatas.unshift(formData)
      }
      if (this.formData.type == 'edit') {
        this.userDatas[this.formData.index] = formData
      }
      await this.save()
      this.$refs.popup.close()
    },
    save () {
      let address = JSON.stringify(this.userDatas)
      request({
        url: "/auth/address",
        method: "post",
        data: { address: address }
      })
        .then(res => {
          let { code, message } = res.data
          if (code == 200) {
            uni.showToast({
              title: message
            })
          } else {
            uni.showToast({
              title: "保存失败",
              icon: "none"
            })
          }
        })
    },
    adduser () {
      this.formData = {
        name: '',
        phone: '',
        address: '',
        idnex: '',
        type: "add"
      }
      this.$refs.popup.open()
    },
    editUrse (index) {
      this.formData = this.userDatas[index]
      this.formData.type = "edit"
      this.formData.index = index
      this.$refs.popup.open()
    },
    deleteUrse (index) {
      let thod = this
      uni.showModal({
        title: '确认删除',
        success: function (res) {
          if (res.confirm) {
            thod.userDatas.splice(index, 1)
            thod.save()
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });

    },
    selectUser (userData) {
      console.log(userData)
      let { name, phone, address } = userData
      let pages = getCurrentPages();  
      let prevPage = pages[ pages.length - 2 ];  
          prevPage.$vm.userData ={name,phone,address}
       uni.navigateBack();
    }
  }
}
</script>

<style>
page {
  background-color: #f5f5f5;
}
.selectuser-box {
  padding: 10px;
}
.content {
  border-radius: 5px;
  background-color: #fff;
}
.add-site {
  padding: 10px;
}
.user-icon {
  float: right;
  font-size: 16px;
  color: #999;
  transform: translateY(3px);
}
.popup {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
}
.popup-btn-submit {
  text-align: right;
}
.popup-btn-submit button {
  background-color: #9266f9;
  color: #fff;
}
.user-data {
  padding: 10px;
}
</style>