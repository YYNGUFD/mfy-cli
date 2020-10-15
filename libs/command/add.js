
/**
 * 添加项目模版
 * add 
 */
const { fse, inquirer, } = require("../tools/module");
const path = require('path')
const co = require('co')
const async = require('async')
const log = require("../tools/log")
const templateConfig = ['.vue', '.json']

module.exports = async function (fileDir, options) {
  //只能输入相对路径 s
  if (path.isAbsolute(fileDir)) {
    log.error("pleacse input relative path")
    process.exit(0)
  }
  const { dir, base, ext } = path.parse(fileDir)
  //1.判断当前最后一个文件是否有后缀，如果没有后缀，则进行后缀选择，如果有直接创建文件
  let currentfileDir = base, resultExt = ext;
  if (!ext) {
    resultExt = await inquirer.prompt([
      {
        name: 'fileExt',
        type: 'checkbox',//类型比较丰富
        message: "please select file's type",
        choices: ['.js', '.ts', '.vue', '.json', '.less', '.css', '.scss'],
        validate: function (value) {
          var done = this.async();
          setTimeout(function () {
            if (value.length == 0) {
              done('You must select type of file');
              return;
            }
            done(null, true);
          }, 0);
        }
      },]
    )
    resultExt = resultExt.fileExt;
  }

  let funArr = resultExt.map((item) => {
    return async function (callback) {
      let result = await createFile(path.join(dir, currentfileDir + item), item, options.force);
      callback(null,result)
    }
  })  
  async.series(funArr, (err,result) => { 
    if(result.length ==funArr.length){ 
      printLog(result)
    } 
  }) 
}

function printLog(resultReason){  
  resultReason.forEach(result=>{
    let resultArr = result.msg.split("^")
    if(result.type){
      log.success('\r\t'+resultArr[0]+'====='+resultArr[1])
    }else{
      log.error('\r\t'+resultArr[0]+'====='+resultArr[1])
    }
  })
}

let createFile = async function (fileName, fileExt, force) {
  //2.判读文件是否存在
  if (fse.pathExistsSync(fileName)) {
    if (!force) {
      log.warning(`the file ${fileName} have existed`);
      //进行选择是否继续创建 如果继续创建则删除源文件 
      let op = await inquirer.prompt([{
        name: 'confirm',
        type: 'confirm',
        message: `Do you want to continue to create file ? if this will delete the same file`,
      }])
      if (op.confirm) {
        fse.removeSync(fileName);
      } else {
        return { type: false, msg: `${fileName} ^ Cancel create` }
      }
    } else {
      fse.removeSync(fileName);
    }
  }
  //3.如果是.vue文件或者是.json文件进行文本的copy 
  const tplPath = path.join(__dirname, '../../template/index' + fileExt);
  if (templateConfig.indexOf(fileExt) != -1) {
    await fse.copy(tplPath, fileName, err => {
      if (err) {
        log.error(err)
        process.exit(0)
      }
    })
  } else {
    //3.进行创建文件 先获取创建文件的路径  
    await fse.ensureFile(fileName, err => {
      if (err) {
        log.error(err)
        process.exit(0)
      }
    })
  }
  return { type: true, msg: `${fileName}  ^ Create successful` };
}
