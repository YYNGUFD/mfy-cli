
/**
 * 添加项目模版
 * add 
 */
const { fse, inquirer, } = require("../tools/module");
const path = require('path')
const async = require('async')
const log = require("../tools/log") 
const {addTemplate,templateConfig,fileExtList} = require('../config/template')

module.exports = async function (fileDir, options) {
  //创建模版文件
  if (options.template) {
    await createTemplate(fileDir)
    return;
  }
  //创建单个文件
  createSingleFile(fileDir,options)
}
/**
 * 打印内容
 * @param {*} resultReason 
 */
function printLog(resultReason) {
  resultReason.forEach(result => {
    let resultArr = result.msg.split("^")
    if (result.type) {
      log.success('\r\t' + resultArr[0] + '=====' + resultArr[1])
    } else {
      log.error('\r\t' + resultArr[0] + '=====' + resultArr[1])
    }
  })
}

/**
 * 创建单个文本文件
 * @param {*} fileDir 
 */
async function createSingleFile(fileDir,options){
    //只能输入相对路径
  if (path.isAbsolute(fileDir)) {
    log.error("pleacse input relative path")
    process.exit(0)
  }
  const { dir, base, ext } = path.parse(fileDir)
  //1.判断当前最后一个文件是否有后缀，如果没有后缀，则进行后缀选择，如果有直接创建文件
  let currentfileName = base, resultExt = ext;
  if (!ext) {
    resultExt = await inquirer.prompt([
      {
        name: 'fileExt',
        type: 'checkbox',//类型比较丰富
        message: "please select file's type",
        choices: fileExtList,
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
  resultExt=resultExt.map(item=>currentfileName+item)
  await createFileEvent(resultExt,dir,options.force)
  log.success("All files have completed")
} 

/**
 * 创建文件模版
 * @param {*} templateName 输入要创建的模版名称
 */
 async function createTemplate(templateName) { 
  /**
   * 1.模版名字输入是否合理  没有模版则进行添加文件名称 文件中不包含/字符 * 
   */
  //2.输入模版名字
  //2.1 选择创建的样式类型
  let createDirName = templateName;
  if (!createDirName) {
    let dirInputName = inquirer.prompt([{
      name: 'dirname',
      type: 'input',
      message: 'Please input the template name:'
    }])
    createDirName = dirInputName.dirname;
  }
  if (/\//g.test(createDirName)) {
    log.error("The template name has special icon '/', Can't to create ,please operate again")
    process.exit(1)
  } 
  //当前文件夹是否存在
  if (fse.pathExistsSync(createDirName)) {
    log.warning("Dirtory has exists will delete...")
    fse.removeSync(createDirName)
  }
  //选择要进行生成的模版类型
  let type =Object.keys(addTemplate) ;
  let resultTemType =await inquirer.prompt([{
    name: 'type',
    type: 'list',
    choices:type,
    message: 'Please select template type'
  }])
  let templateType = resultTemType.type;  
  await createFileEvent(addTemplate[templateType],createDirName,true)
  log.success(`👋 ${createDirName} 👋Template create successfully`)
}

/**
 * 创建文件的异步函数
 * @param {*} arr  当前文件的文件名称 [index.js,c.js]
 * @param {*} dirName 文件夹名称
 * @param {*} force 是否需要强制去更新 
 */
 async function createFileEvent(arr,dirName,force){
  let funArr = arr.map((item) => {
    return async function (callback) { 
      let fileName = path.join(dirName,item)
      let result = await createFile(fileName, force); 
       callback(null, result) 
    }
  })
  async.series(funArr, (err, result) => {
    if (result.length == funArr.length) {
      printLog(result)
    }
  }) 
}


/**
 * 创建文件
 * @param {*} fileName  文件名字
 * @param {*} force 是否需要强制创建
 */
 async function  createFile (fileName, force) { 
  const { ext } = path.parse(fileName)
  const fileExt =ext;
  //2.判读文件是否存在ext
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
