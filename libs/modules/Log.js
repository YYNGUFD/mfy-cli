
 
const {chalk}  = require('../tools/module') 
let log={}
const logObj={
  'error':chalk.red.bold,
  'warning':chalk.keyword('orange'),
  'success':chalk.green.bold,
  'info':chalk.blue, 
  'common':chalk,
}
for(let key in logObj){
  log[key] = function(msg){ 
    let fn = logObj[key]  
    console.log(fn(msg))
  } 
}   
module.exports = log;