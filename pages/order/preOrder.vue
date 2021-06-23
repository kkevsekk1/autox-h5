<template>
  <view>
    <uni-row :gutter="20">
      <uni-col :span="18">
        <view>
          <uni-easyinput
            v-model="search"
            style="background-color: #fff"
            placeholder="请输入条码"
          ></uni-easyinput>
        </view>
      </uni-col>
      <uni-col :span="6" style="text-align: left">
        <button
          class="mini-btn"
          style="background-color: #409eff"
          type="primary"
          size="mini"
          @click="scanBarcode">
          扫码
        </button>
      </uni-col>
    </uni-row>
    <uni-row v-for="item,index in  cart.items" :key="index" >
      <uni-col >
        <pre-order-item :item="item" :userType="userType"></pre-order-item>
      </uni-col>
    </uni-row>
  </view>
</template>

<script>
import preOrderItem from './preOrderItem.vue'
import UUID from '@/utils/uuid'
export default {
 components: { preOrderItem },
  data() {
    return {
      search: '',
      userType:'普通',
      cart: {
        uuid:'',
        user: {
          code: '',
        },
        items: [{}],
      },
    }
  },
  methods: {
    scanBarcode() {
      if (!this.cart.user.code) {
        alert('弹出出库单，设置信息')
        return
      }
      this.search = '2'
      //加载商品信息
     let rs = this.loadInfoByBarcode();
     //如果扫码查询结果 大于1 提供选择界面
      if(rs.length>1){
        
      }else if(rs.length==1){
        //只有1条，加入列表
        this.addItemToItems(rs[0]);
      }else {
        //商品不存在或没有库存，请先调整库存或入库

      }
    },
    addItemToItems(item){//添加商品到商品列表
      //如果列表中存在 者增加数量
        let barItem = this.cart.items.filter(tmpItem =>tmpItem.id ==time.id);
        if(barItem&&barItem.length>0){
          barItem.num+=item.num;
        }else{
          this.item.push(item);
        }
        //添加进购物车
    },
    callBackSetting() {//确定设置
      this.cart.user.code = '客户代码'
      this.cart.uuid = UUID();
      console.log(this.cart.uuid)
      //初始化购物车
    
      //继续扫码
      this.scanBarcode();
      
    },
   async loadInfoByBarcode() {
      uni.showLoading({
        title: '加载中',
      })
      let rs = await  request({
        url: '/item/findItems?search=' + this.search,
        method: 'get',
      });
      //处理rs 转换为商品列表
      return rs;
    },

  },
}
</script>

<style></style>
