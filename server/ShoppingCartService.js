
import { request } from './request.js'
export class ShoppingCartService{

  //为某个会员初始化一个购物车
 initShoppingCart(uuid,name,code,phone){
    let data ={uuid,name,code,phone};  
    request({
      url: '/item/initShoppingCart',
      method: 'post',
      data,
    }).then((res) => {
        console.log(res);  
    })
 }
 //更新某个购车商品信息
 updateSCartItems(uuid,itemId,num){
   if(num==0){
     return;
   }
  let data ={uuid,items:[{id:itemId,num:num}]};  
  request({
    url: '/item/updateSCartItems',
    method: 'post',
    data,
  }).then((res) => {
      console.log(res);  
  })
}
 //获取所有的购车
 getShoppingCarts(){
  return request({
      url: '/item/getShoppingCarts',
      method: 'get',
    });
 }
//删除其中一个购物车
  deleteSCart(uuid){
  return request({
      url: '/item/deleteSCart?uuid='+uuid,
      method: 'get',
    }).then((res)=>{
      console.log(res);
    });
 }

 //删除某个购车商品
deleteSCartItem(uuid,itemId){
  return request({
      url: '/item/deleteSCartItem?uuid='+uuid+'&itemId='+itemId,
      method: 'get',
    }).then((res)=>{
      console.log(res);
    });
 }
 //获取购物车所有商品
 getSCartItems(uuid){
  return request({
    url: '/item/getSCartItems?uuid='+uuid,
    method: 'get',
  });
 }
 
}

export  default  new ShoppingCartService();