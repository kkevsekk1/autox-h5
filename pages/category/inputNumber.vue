<template>
  <view class="number-box">
    <text class="iconfont iconfont-subtract  "
          v-show="showHidden"
          @click=" subtractNum">&#xeb41;</text>
    <input type="number"
           class="input"
           v-show="showHidden"
           v-model="localityNum"
           @blur="loseFocus">
    <text class="iconfont iconfont-add "
          @click=" addNum ">&#xe615;</text>
  </view>
</template>

<script>
export default {
  props: {
    num: {
      num: 0
    },
    max: {
      default: 999,
    },
    min: {
      default: 0,
    },
  },
  data () {
    return {
      localityNum: '',
    }
  },
  computed: {
    showHidden () {
      if (this.localityNum > (this.min) || typeof (this.localityNum) == "string") {
        return true
      }
      if (this.localityNum <= (this.min)) {
        return false
      }
    }
  },
  watch: {
    num (val, oldval) {
      this.localityNum = Number(val)
    },
    localityNum (val, oldval) {
      this.handleCount(Number(val))
    }
  },
  created () {
    this.localityNum = this.num
  },
  methods: {
    handleCount (val) {
      if (val < this.min) {
        this.localityNum = this.min
        return
      }
      if (val > this.max) {
        this.localityNum = this.max
        this.$emit('maximum')
        return
      }
      this.$emit("handleCount", val)
    },
    loseFocus () {
      if (Number(this.localityNum) == 0) {
        this.localityNum = 0
      }
      console.log(this.localityNum)
    },
    addNum () {
      this.localityNum = Number(this.localityNum) + 1
    },
    subtractNum () {
      this.localityNum = Number(this.localityNum) - 1
    }
  }
}
</script>

<style>
.number-box {
  display: flex;
}
.iconfont-subtract {
  display: inline-block;
  font-size: 20px;
  transform: translateY(-2px);
}
.input {
  width: 25px;
  text-align: center;
  font-size: 14px;
  color: #000;
}
.iconfont-add {
  font-size: 18px;
}
</style>