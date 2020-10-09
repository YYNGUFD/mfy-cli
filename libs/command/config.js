const { inquirer, chalk ,fse} = require('../tools/module')
const {defaultOwner} = require('../config') 
const path = require('path')  
const { isString } = require('../tools/util')
const log = console.log
//配置默认选项 
module.exports = async function (value, options) {

  //设置模板名字 解构相应的变量
  let { setTemplate,defaultConfig} = options;
  console.log(options)

  //如果是设置模板字符样式
  if (setTemplate) {
    configTemplate(options)
  }

  if(defaultConfig){ 
    editTemplate(defaultOwner)
  }

}
async function editTemplate(name,msg){
  //进行更改文件 package.json 中的 gitOwner
  let targetPath =  path.join(process.cwd(),'package.json')
  //读取文件
  await fse.readJson(targetPath).then(packageJson=>{  
    packageJson.gitOwner = name; 
    //写入到.json文件中
    fse.writeJsonSync(targetPath,packageJson)
    log(chalk.green.bold(msg?msg:"🎉 config successful!!!"))
  }).catch(error=>{
    log(chalk.red.bold(error))
  })
}
async function configTemplate(options){
    //输入当前用户自定义的内容
    let result = await inquirer.prompt([{
      name: 'repoName',
      type: 'input',
      message: "please input your template name",
      validate:function (input) {
        var done = this.async();
        if (!input || !isString(input)) {
          log(chalk.red("Input error or empty ,please input again!!")) 
          done(null, false);
          return false 
          //用户未输入 则表示用默认的配置项目
        }
        done(null, true);
      }
    }]) 
    //进行二次的确认
    let confirmResult = await inquirer.prompt([{
      name: 'confirm',
      type: 'confirm',
      message: `please confirm the template name ✋${result.repoName}`,
    }])  

    if(!confirmResult.confirm) {
      log(chalk.red.bold("You have select exit this config!"))
      process.exit(0) 
    }
    editTemplate(result.repoName,'🎉 config successful!!!')   
}