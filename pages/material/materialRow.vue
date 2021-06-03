<template>
  <view class="materialRowRow-box">
    <uni-row class="top-materialRow">
      <uni-col :span='14'
               class="material-Id">{{materialData.name}}（{{materialData.id}}）</uni-col>
      <uni-col :span="10"
               class="items"
               style="overflow:hidden">
        <view style="float:right;">{{materialData.times}}</view>
      </uni-col>
    </uni-row>
    <view class="describe">
      <view>{{materialData.describe}}</view>
    </view>
    <view class="bottom-materialRowRow">
      <view class="modification"
            @click="removeMaterial">删除</view>
      <view class="modification"
            @click="modifyMaterial">编辑</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    materialData: {
      id: Number | String,
      name: String,
      times: String,
      describe: String,
    }
  },
  methods: {
    modifyMaterial () {
      let modifyData = { id: this.materialData.id }
      this.$emit('modifyData', modifyData)
    },
    removeMaterial () {
      this.$emit("removeData", this.materialData.id)
    }
  }
}
</script>

<style>
.materialRowRow-box {
  position: relative;
  margin-top: 15px;
  padding: 10px;
  height: 100px;
  background-color: #fff;
}
.top-materialRow {
  position: relative;
  height: 20px;
  line-height: 20px;
}
.material-Id {
  font-size: 18px;
  font-weight: 700;
}
.items {
  font-size: 14px;
}
.describe {
  height: 40px;
  line-height: 20px;
  margin-top: 8px;
  font-size: 14px;
  overflow: hidden;
  color: #969799;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.bottom-materialRowRow {
  position: absolute;
  bottom: 10px;
  right: 10px;
  overflow: hidden;
}
.modification {
  height: 25px;
  line-height: 25px;
  text-align: center;
  background-color: #409efe;
  border-radius: 5px;
  color: #fff;
  width: 70px;
  float: right;
  font-size: 14px;
  margin-left: 10px;
}
</style>