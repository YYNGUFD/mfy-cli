
/**
 * 删除项目
 */
const { fse, chalk, inquirer } = require("../tools/module")
const path = require("path")
const log = console.log
module.exports = async (fileDir, args) => {
  /**
   * 1.判断当前项目是否存在
   * 2.存在进行提示 是否删除
   * 3.不存在进行提示
   */
  if (!fse.existsSync(fileDir)) {
    log(chalk.red.bold("the filename of " + fileDir + " is not exists"))
    process.exit(0)
  }

  //文件存在 判断是否是文件夹 如果是文件夹并且内部包含文件 则进行提示 选择
  let result = fse.statSync(fileDir);
  if (result.isDirectory()) {
    let files = fse.readdirSync(fileDir)
    if (files.length > 0) {
      let op = await inquirer.prompt([{
        name: 'confirm',
        type: 'confirm',
        message: `this dirtory has file ,Do you want to continue to delete it ?`,
      }])
      if (!op.confirm) {
        log(chalk.blue("you cancel this operation"))
        process.exit(0)
      }
    }
  }
  //直接进行删除即可
  try {
    fse.removeSync(fileDir)
    log(chalk.green.bold("Delete successfully"))
  }
  catch (err) {
    log(chalk.red.bold(err))
  }

} 