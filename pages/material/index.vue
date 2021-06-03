<template>
  <view class="material-box">
    <view class="top-fixed">
      <uni-row>
        <uni-col :span="18"
                 style="position: relative;">
          <input type="text"
                 placeholder="素材名称"
                 class="material-seek"
                 v-model="seekMaterial">
          <view class="iconfont magnifying-glass "> &#xe617; </view>
        </uni-col>
        <uni-col :span="6">
          <view class="add-ition"
                @click="addModify('add')">新增素材</view>
        </uni-col>
      </uni-row>
    </view>
    <view class="main">
      <view v-for="materialData in materialDatas"
            :key="materialData.id">
        <material-Row :materialData="materialData"
                      @modifyData="addModify"
                      @removeData="removeMaterial"></material-Row>
      </view>
    </view>
  </view>
</template>

<script>
import { request } from '../../server/request.js';
import { formatTime } from '../../utils/format.js'
import materialRow from "./materialRow"
export default {
  components: {
    materialRow,
  },
  data () {
    return {
      page: { size: 10, index: 1, pages: 3 },
      materialDatas: [],
      modifyData: '',
      seekMaterial: '',
      times: ""
    }
  },
  watch: {
    seekMaterial () {
      this.debounce(300)
    }
  },
  created () {
    this.getMaterialList()
  },
  onReachBottom () {
    if (this.page.index >= this.page.pages) {
      uni.showToast({ title: '到底了', iccon: 'none' })
    } else {
      this.page.index++
      this.getMaterialList();
    }
  },
  onPullDownRefresh () {
    this.page.index = 1;
    this.materialDatas = [];
    this.getMaterialList();
    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 1000)
  },
  methods: {
    debounce (wait) {
      if (this.times) {
        clearTimeout(this.times)
      }
      this.times = setTimeout(() => {
        this.page.index = 1;
        this.materialDatas = []
        this.getMaterialList()
      }, wait)
    },
    addModify (e) {
      if (e == "add") {
        uni.reLaunch({ url: "/pages/material/modifyMaterial" })
      } else {
        let { id } = e
        uni.reLaunch({
          url: "/pages/material/modifyMaterial?id=" + id
        })
      }
    },
    removeMaterial (id) {
      uni.showModal({
        title: '提示',
        content: '确定删除吗？',
        confirmColor: '#409EFE',
        success: function (res) {
          if (res.confirm) {
            request({
              url: "/material/deleteMaterial",
              method: "post",
              data: { id: id }
            })
              .then(res => {
                if (res.data.code == 200) {
                  location.reload();
                }
              })
          }
        }
      });
    },
    getMaterialList () {
      uni.showLoading({
        title: '加载中'
      });
      let data = { size: this.page.size, index: this.page.index, search: this.seekMaterial, orderby: "createTime desc" }
      console.log(data)
      request({
        url: "/material/getTextPage",
        method: "post",
        data: data
      })
        .then(res => {
          let { code, data } = res.data
          if (code == 200) {
            uni.hideLoading()
            this.page = { size: data.size, index: data.index, pages: data.pages }
            data.list.forEach(element => {
              let { id, materialName, materialURL, createTime } = element
              createTime = formatTime(createTime)
              this.materialDatas.push({ id: id, name: materialName, describe: materialURL, times: createTime })
            });
          }
        })
    }
  }
}
</script>

<style>
page {
  background-color: #f5f5f5;
}
.top-fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  background-color: #fff;
  z-index: 99;
}
.top-fixed .add-ition {
  height: 35px;
  line-height: 35px;
  text-align: center;
  background-color: #409efe;
  border-radius: 5px;
  color: #fff;
  font-size: 14px;
}
.top-fixed .material-seek {
  height: 35px;
  line-height: 35px;
  border: 1px solid #e4e3e3;
  border-radius: 5px;
  margin-right: 15px;
  box-sizing: border-box;
  padding-left: 25px;
  font-size: 14px;
}
.top-fixed .magnifying-glass {
  position: absolute;
  top: 10px;
  left: 7px;
  color: #b7b4b4;
}
.main {
  position: relative;
  padding-top: 55px;
}
</style>