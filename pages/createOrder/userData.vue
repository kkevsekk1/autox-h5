<template>
  <view class="user-box">
    <view v-if="userData.name || userData.phone || userData.address">
      <view class="title"> {{userData.address}} </view>
      <view class="content">
        <text style="padding-right:5px;">{{userData.name}} </text>
        <text> {{userData.phone}}</text>
      </view>
    </view>
    <view v-if="!userData.name && !userData.phone && !userData.address">
      请选择收获地址
    </view>
    <text v-show="!edit"
          class="iconfont user-icon">&#xe603; </text>
    <text v-show="edit=='editUrse' "
          class="iconfont user-icon user-icon-edit"
          @click.stop="$emit('editUrse',index)">&#xe619;</text>
    <text v-show="edit=='editUrse' "
          class="iconfont user-icon  user-icon-delete "
          @click.stop="$emit('deleteUrse',index)">&#xe60b;</text>
  </view>
</template>

<script>
export default {
  props: ['userData', 'edit', 'index']
}
</script>

<style>
.user-box {
  position: relative;
  padding: 10px 0;
  padding-right: 25px;
  font-size: 16px;
}
.user-icon {
  position: absolute;
  right: 0;
  top: 50%;
  font-size: 16px;
  transform: translateY(-8px);
  color: #999;
}
.content {
  padding-top: 10px;
  font-size: 12px;
  color: #999;
}
.user-icon-edit {
  font-size: 25px;
  transform: translateY(-6px);
}
.user-icon-delete {
  transform: translateY(-35px);
  font-size: 20px;
  color: red;
}
</style>