
/**
 * 添加项目模版
 * add 
 */
const { fse, inquirer,} = require("../tools/module");
const path = require('path')
const log = require("../tools/log") 
const templateConfig = ['.vue','.json']
module.exports = async function (fileDir, options) {
  //只能输入相对路径 s
  if(path.isAbsolute(fileDir)){
    log.error("pleacse input relative path")
    process.exit(0)
  }
  const { dir, base, ext } = path.parse(fileDir) 
  //1.判断当前最后一个文件是否有后缀，如果没有后缀，则进行后缀选择，如果有直接创建文件
  let fileName = base,resultExt=ext;
  if (!ext) {
    resultExt = await inquirer.prompt([
      {
        name: 'fileExt',
        type: 'list',//类型比较丰富
        message: "please select file's type",
        choices: ['.js', '.ts', '.vue', '.json', '.less', '.css', '.scss']
      },
    ])
    resultExt = resultExt.fileExt;
    fileName +=resultExt;
  } 
  const fileDirCurrent = path.join(dir,fileName) 

  //2.判读文件是否存在
  if(fse.pathExistsSync(fileDirCurrent)){
    log.warning("the file have existed"); 
    //进行选择是否继续创建 如果继续创建则删除源文件 
     let op =  await inquirer.prompt([{
      name: 'confirm',
      type: 'confirm',
      message: `Do you want to continue to create file ? if this will delete the same file`,
     }])   
     if(op.confirm){
        fse.removeSync(fileDirCurrent);
      }
  } 
  //3.如果是.vue文件或者是.json文件进行文本的copy 
  const tplPath = path.join(__dirname, '../../template/index'+resultExt); 
  if(templateConfig.indexOf(resultExt)!=-1){ 
   await fse.copy(tplPath, fileDirCurrent, err => {
      if (err) {  
        log.error(err)
        process.exit(0)
      }
      log.success("File creation successful")
    })
  }else{
    //3.进行创建文件 先获取创建文件的路径  
    await fse.ensureFile(fileDirCurrent,err=>{
      if(err){
        log.error(err) 
        process.exit(0)
      }else{
        log.success("File created successful")
      } 
    }) 
  }
}