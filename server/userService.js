
import { request } from './request.js'
class UserService{

 loadAdress(){
  return  new Promise((reslove,reject)=>{
    this._requestUserInfo().then(res => {
        let { code,message, data: { adress } } = res.data
        if (code == 200) {
          reslove(JSON.parse(adress));
        }else{
          reject(message);
        }
      })
  });
 }
  _requestUserInfo(){
   return request({
      url: '/auth/userInfoApp',
      method: 'get',
    });
 }
 loadUserInfo(){
  return  new Promise((reslove,reject)=>{
     this._requestUserInfo().then(res => {
        let { code,message, data } = res.data
        if (code == 200) {
          reslove(data);
        }else{
          reject(message);
        }
      })
  });
 }
}

export  default  new UserService();