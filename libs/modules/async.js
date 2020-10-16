 const async  = require('async')
/**
 * 创建异步串行操作函数 函数之间无影响，进行串行执行即可
 */

function createSerialEventNoRe(arrFun,singleCallback,allCallBack){
  if(!singleCallback) {
    console.log("params error!")
  }
  let funArr = arrFun.map((item) => {
    return async function (callback) {
      singleCallback && await singleCallback(item);
      callback(null)
    }
  })
  async.series(funArr, (err, result) => {
    if(err){
       process.exit(0)
    } 
    if (result.length == funArr.length) {
        allCallBack(result)
    }
  })
}
module.exports={
  createSerialEventNoRe:createSerialEventNoRe
}