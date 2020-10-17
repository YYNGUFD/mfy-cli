
/**
 * 删除项目
 */
const { fse, inquirer} = require("../tools/module")
const loading = require("../modules/Loading")
const path = require("path")
const log = require("../modules/Log")
module.exports = async (fileDir, args) => {
  const {dir,base} = path.parse(fileDir)
  /**
   * 1.判断当前项目是否存在
   * 2.存在进行提示 是否删除
   * 3.不存在进行提示
   */ 
  //正则匹配到文件内容  
  let fileLists=[];
  //正则匹配式 删除文件
  if(/(.*)$/g.test(fileDir)){ 
    //获取dir文件夹下的所有的和m.*的匹配文件 
    let files = fse.readdirSync(path.join('./',dir))
    let sFileName = base.split(".")[0]
    files.forEach(item=>{
      if(item.indexOf(sFileName)!=-1 && fse.statSync(path.join(dir,item)).isFile())
      fileLists.push(item)
    })  
    if(fileLists.length==0){
      log.error("Nothing files matched!!!")
      return ;
    }
     //文件存在 判断是否是文件夹 如果是文件夹并且内部包含文件 则进行提示 选择
    fileLists.forEach(file=>{ 
      let filePath = path.join(dir,file)
      let fi = fse.statSync(filePath)
      if(fi.isFile()){
        fse.removeSync(filePath)
      }
    }) 
    log.success("\rDelete successfully") 
   
    return ;
  }
  if (!fse.existsSync(fileDir)) {
    log.warning("the filename of " + fileDir + " is not exists")
    process.exit(0)
  }
 
  let result = fse.statSync(fileDir); 
  if (result.isDirectory()) {
    let files = fse.readdirSync(fileDir)
    if (files.length > 0) {
      let op = await inquirer.prompt([{
        name: 'confirm',
        type: 'confirm',
        message: `This dirtory has file ,Do you want to continue to delete it ?`,
      }])
      if (!op.confirm) {
        log.info("You cancel this operation!")
        process.exit(0)
      }
    }
  }
  //直接进行删除即可
  loading.show("Deleting files....")
  try {
    fse.removeSync(fileDir)
    loading.succeed();
    log.success("\rDelete successfully")
  }
  catch (err) { 
    loading.fail(err);
  }
} 