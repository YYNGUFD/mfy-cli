

const { getRepoList, getRepoTags } = require('../request/index')
const { wrapLoading } = require('../tools/util')
const { chalk, inquirer } = require('../tools/module')
const {gitOwner} = require('../config');

//downloadGitRepo 为普通方法，不支持promise
const downloadGitRepo = require('download-git-repo')
const util = require('util');
const path = require('path')
const log = console.log
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
    let template = await this.downloadGit(repo, tag);

    //进入当前的已经下载的内容 去

  }
  async getRepoList() {
    let repos = await wrapLoading(getRepoList, 'Waiting for download the repos');
    if (repos.length == 0) {
      log(chalk.red("No content is currently downloaded"))
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
    let tags = await wrapLoading(getRepoTags, `Waiting for fetch the template of ${repo} tags`, repo);
    if (tags.length == 0) {
      log(chalk.red("No content is currently downloaded"))
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
    console.log(repo,tag)
    console.log(requestUrl)
    //2.把路径资源下载到某个路径上(后续可以增加缓存功能) 
    let result =await this.downloadGitRepo(requestUrl, downloadUrl)
    // let result =await wrapLoading(this.downloadGitRepo,`Waiting for download the template of ${repo}`,requestUrl, downloadUrl);
    console.log(result)
    return downloadUrl;
  }


}
module.exports = Creator;