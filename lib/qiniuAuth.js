'use strict'
var qiniu = require('qiniu')

class QiniuAuth{
  constructor(ak, sk){
    this.accessKey = ak
    this.secretKey = sk
    this.options =  {scope: "minzheng"}
  }
  static getToken(){
    if(this.mac == undefined)
        this.mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    var putPolicy = new qiniu.rs.PutPolicy(this.options);
    return putPolicy.uploadToken(this.mac);
  }
}

module.exports = new QiniuAuth()
