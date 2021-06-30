
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
  let data ={uuid,items:[{id:itemId,num:num}]};  
  request({
    url: '/item/updateSCartItems',
    method: 'post',
    data,
  }).then((res) => {
      console.log(res);  
  })
}
 //更新某个购车商品信息
 getShoppingCarts(){
  return request({
      url: '/item/getShoppingCarts',
      method: 'get',
    });
 }

  deleteSCart(uuid){
  return request({
      url: '/item/deleteSCart?uuid='+uuid,
      method: 'get',
    }).then((res)=>{
      console.log(res);
    });
 }
deleteSCartItem(uuid,itemId){
  return request({
      url: '/item/deleteSCartItem?uuid='+uuid+'&itemId='+itemId,
      method: 'get',
    }).then((res)=>{
      console.log(res);
    });
 }
 getSCartItems(uuid){
  return request({
    url: '/item/getSCartItems?uuid='+uuid,
    method: 'get',
  });
 }

}

export  default  new ShoppingCartService();