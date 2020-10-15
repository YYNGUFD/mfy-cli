

const { getRepoList, getRepoTags } = require('../request/index')
const { wrapLoading, Loading } = require('../tools/util')
const { inquirer } = require('../tools/module')
const exec = require('child_process').exec
const { gitOwner } = require('../config');

//downloadGitRepo 为普通方法，不支持promise
const downloadGitRepo = require('download-git-repo')
const util = require('util');
const path = require('path')
const log = require("../tools/log")

const loading = new Loading();
class Creator {
  constructor(projectName, targetDir) {

    this.name = projectName; //项目文件名称
    this.target = targetDir; //项目文件目录

    //将downloadGitRepo 转化成promise的函数
    this.downloadGitRepo = util.promisify(downloadGitRepo)
  }
  async create() {
    //先获取当前的模版信息
    let repo = await this.getRepoList();

    //根据模版获取当前的版本信息
    let tag = await this.getRepoTags(repo);

    //根据选择的模版和版本下载当前的地址内容
    let downloadUrl = await this.downloadGit(repo, tag);

    // 下载完成后进入到当前的下载url中进行安装node_modules以及安装完成后进行提示
    let result = this.downloadNodeModules(downloadUrl);

  }
  async getRepoList() {
    let repos = await wrapLoading(getRepoList, 'Waiting for download the repos');
    if (repos.length == 0) {
      log.error("No content is currently downloaded")
    }
    //获取repos的name
    repos = repos.map(repo => repo.name)

    //用户交互展示出来
    let { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: "please choose a template to create project"
    })
    return repo;
  }

  async getRepoTags(repo) {
    let tags = await wrapLoading(getRepoTags, `Waiting for fetch the tags of template ${repo}`, repo);
    if (tags.length == 0) {
      log.error("No content is currently downloaded")
    }
    tags = tags.map(tag => tag.name)
    let { tag } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tags,
      message: "please choose this template of tags"
    })
    return tag;
  }
  async downloadGit(repo, tag) {
    let downloadUrl = path.resolve(process.cwd(), this.target);

    //先拼接出下载路径
    let requestUrl = `${gitOwner}/${repo}${tag ? '#' + tag : ''}`

    //2.把路径资源下载到某个路径上

    //todo 后续可以增加缓存功能 
    await wrapLoading(this.downloadGitRepo, `Waiting for download the template of ${repo}`, requestUrl, downloadUrl);
    return downloadUrl;
  }
  async downloadNodeModules(downLoadUrl) {
    let that = this;
    log.success('\n √ Generation completed!')

    const execProcess = `cd ${downLoadUrl} && npm install`;
    loading.show("Downloading node_modules")
    exec(execProcess, function (error, stdout, stderr) {
      if (error) {
        loading.fail(error)
        log.warning(`\rplease enter file《 ${that.name} 》 to install dependencies`)
        log.success(`\n cd ${that.name} \n npm install \n`)
        process.exit()
      } else {
        log.success(`\n cd ${that.name} \n npm run server \n`)
      }
      process.exit()
    });
    return true;
  }


}
module.exports = Creator;