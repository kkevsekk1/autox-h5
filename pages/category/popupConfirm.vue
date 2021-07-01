<template>
  <uni-popup ref="popup"
             type="center">
    <view class="content">
      <view class="title"> {{confirm.title}} </view>
      <view class="btn">
        <button @click="$refs.popup.close()"> 取消 </button>
        <button @click="notarize"> {{confirm.btnRight}} </button>
      </view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  props: ['confirm'],
  methods: {
    open () {
      this.$refs.popup.open()
    },
    notarize () {
      this.$emit('notarize')
      this.$refs.popup.close()
    }
  }
}
</script>

<style>
.content {
  padding: 10px;
  width: 240px;
  height: 100px;
  text-align: center;
  border-radius: 20px;
  background-color: #fff;
}
.title {
  padding: 15px 0;
  font-size: 16px;
  font-weight: 800;
}
.btn {
  display: flex;
  padding-top: 15px;
}
.btn button {
  flex: 1;
  text-align: center;
  height: 32px;
  line-height: 32px;
  margin: 0 5px;
  border-radius: 16px;
}
.btn button:nth-child(1) {
  border: 1px solid rgb(214, 214, 214);
}
.btn button:nth-child(2) {
  background-color: #9266f9;
  color: #fff;
}
</style>