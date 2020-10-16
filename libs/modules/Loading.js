const {ora} = require('../tools/module')
class  Loading{
  constructor(msg){ 
  }
  show(msg){
    this.spiner = ora(msg);
    this.spiner.start(); //开启加载 
  }
  fail(msg){
    if(!this.spiner) return 
    this.spiner.fail(msg)
  }
  succeed(msg){
    this.spiner.succeed();
  }
}
module.exports=new Loading();