

const path = require('path')
const { inquirer, fse } = require('../tools/module')
const Creator = require('../modules/Creator')
const log = require("../modules/Log")
//创建项目
module.exports = async function (projectName, options) {
  // todo 校验文件内容格式
  //获取当前命令执行时候的工作目录
  const cwd = process.cwd();

  //获取当前target的目录
  const targetDir = path.join(cwd, projectName)

  //判断当前的文件夹是否存在
  if (fse.existsSync(targetDir)) {
    // 命令中存在--force
    if (options && options.force) {
      await fse.remove(targetDir);
    } else {

      let { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',//类型比较丰富
          message: "Target directory already exits,please select new action",
          choices: [
            { name: 'Overwrite', value: 'overwrite' },
            { name: 'Cancel', value: false, },
          ]
        },
      ])
      if (!action) {
        log.info("Have no choice")
        process.exit(0)
      } else if (action == 'overwrite') {
        log.info(`\r Removing.....`)
        await fse.remove(targetDir);
        log.success(`\rThe file has been successfully deleted`)
      }
    }
  }

  //当前文件操作已经完成 开始创建项目

  let creator = new Creator(projectName, targetDir)
  creator.create();

}