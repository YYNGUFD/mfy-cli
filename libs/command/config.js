const { inquirer, chalk ,fse} = require('../tools/module')
const {defaultOwner} = require('../config')
const path = require('path')  
const { isString } = require('../tools/util')
const log = console.log
//配置默认选项 
module.exports = async function (value, options) {

  //设置模板名字 解构相应的变量
  let { setTemplate } = options;

  //如果是设置模板字符样式
  if (setTemplate) {
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
    //名字输入后进行验证当前template的内容是否合理 
    // let repo = await wrapLoading(getRepoList, `Waiting for verify it`,result.repoName,)
    // if(repo.length==0){
    //   log(chalk.red(`Can't get the list for ${result.repoName} or the template of ${result.repoName} is empty`))
    // }

    //进行二次的确认
    let confirmResult = await inquirer.prompt([{
      name: 'confirm',
      type: 'confirm',
      message: `please confirm the template name ✋${result.repoName}`,
    }])  
    if(!confirmResult.consult) {
      log(chalk.red.bold("config exit!!!!"))
      process.exit(0) 
    }

    //进行更改文件 package.json 中的 gitOwner
    let targetPath =  path.join(process.cwd(),'package.json')
    //读取文件
    await fse.readJson(targetPath).then(packageJson=>{  
      packageJson.gitOwner = result.repoName; 
      //写入到.json文件中
      fse.writeJsonSync(targetPath,packageJson)
    }).catch(error=>{
      log(chalk.red.bold(error))
    })

  }




}