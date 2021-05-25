<template>
   <view>
   <view>{{feature.name}}</view>
   <button @click="run" >运行</button>
   </view>
</template>
<script>
export default {
    props: {
    feature:{
      id:Number|String,
      name:String,
      icon:String,
      appName:String,
      appVersion:String
    }
  },
 methods: {
    run(){
      console.log("item中run",this.feature.id);
      this.$emit('run', this.feature.id);
    }
 }
}
</script>
