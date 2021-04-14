<template>
  <view class="addShop_box">
    <button class="addBtn"
            @click="addShop"
            type="default">添加商铺</button>
    <view v-for="item in shopList"
          :key="item.id">
      <view class="shop-list">
        <view class="content">
          <view>店铺名称：{{ item.name }}</view>
          <view>店铺电话：{{ item.account }}</view>
        </view>
      </view>
    </view>

    <uni-popup ref="popup"
               type="center">
      <uni-forms :value="user"
                 ref="form"
                 :rules="rules"
                 class="addshop">
        <uni-forms-item label="商铺名"
                        name="name"
                        required>
          <uni-easyinput type="text"
                         v-model="user.name"
                         placeholder="商铺名" />
        </uni-forms-item>
        <uni-forms-item label="密码"
                        name="password"
                        required>
          <uni-easyinput type="password"
                         v-model="user.password"
                         placeholder="密码" />
        </uni-forms-item>
        <uni-forms-item label="电话号码"
                        name="account"
                        required>
          <uni-easyinput type="text"
                         v-model="user.account"
                         placeholder="电话号码" />
        </uni-forms-item>
        <button @click="submitForm"
                type="primary">提交</button>
      </uni-forms>
    </uni-popup>
  </view>
</template>
<script>
import {
  request
} from '../../server/request.js'
export default {
  data () {
    return {
      shopList: [],
      pages: {
        index: 1,
        size: 10,
        count: 0
      },
      user: { account: '', password: '', name: '' },
      rules: {
        account: {
          rules: [{ required: true, errorMessage: '请输入正确的电话号码' }, {
            length: 11
          }]
        },
        password: {
          rules: [{ required: true, errorMessage: '请输入密码' }, {
            minLength: 6,
            errorMessage: '密码不得少于6位数',
          }]
        },
        name: {
          rules: [{ required: true, errorMessage: '请输入正确的店铺名' }]
        }
      }
    }
  },
  created () {
    this.initialData()
  },
  onReachBottom () {
    // 当前页大于等于总页数
    if (this.pages.index >= this.pages.count) {
      uni.showToast({
        title: '到底啦',
        icon: 'none'
      })
    } else {
      this.pages.index++
      this.getShopList()
    }
    // 进入下一页
  },
  onPullDownRefresh () {
    this.initialData()
    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 1000)
  },
  methods: {
    initialData () {
      this.getShopList()
    },
    getShopList () {
      request({
        url: '/auth/getShopPage',
        method: 'post',
        data: {
          index: this.pages.index.toString(),
          size: '10',
          search: '',
          orderby: 'id desc'
        }
      }).then((loadresult) => {
        console.log(loadresult.data)
        uni.hideLoading();
        const { message, code, data } = loadresult.data;
        if (code === 200) {
          this.pages = {
            count: data.pages,
            index: data.index,
            size: data.size
          };
          console.log(this.pages)
          loadresult.data.data.list.forEach((item) => {
            this.shopList.push(item)
          })
        }
      })
    },
    addShop () {
      this.$refs.popup.open()
    },
    submitForm (form) {
      this.$refs.form.submit().then((res) => {
        console.log(res)
        request({
          url: '/auth/addShop',
          method: 'post',
          data: res
        })
          .then((loadresult) => {
            let { code, message, data } = loadresult.data
            console.log(loadresult)
          })
      })
      this.$router.go(0)
    }
  }
}
</script>
<style>
page {
  background-color: #f8f8f8;
}
.addShop_box {
  position: relative;
  padding: 40rpx;
  font-size: 28rpx;
}

.addShop_box .addBtn {
  background-color: #007aff;
  color: white;
}
.addShop_box .addshop {
  width: 700rpx;
  background-color: white;
  padding: 20rpx;
  border: 2rpx #999999 solid;
  border-radius: 15rpx;
}
.shop-list {
  border: 2rpx solid #ccc;
  padding: 10rpx;
  margin-top: 25rpx;
  margin-bottom: 25rpx;
  border-radius: 25rpx;
}

.content {
  font-weight: bold;
  position: relative;
}
</style>
