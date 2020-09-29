 
// https://api.github.com/orgs/mfy-template/repos
// https://api.github.com/repos/mfy-template/vue-template/tags
const axios = require('axios');
const {gitOwner} = require('../config');

//添加拦截器
axios.interceptors.response.use(res=>{
  return res.data;
})
async function getRepoList(){  
  let result = axios.get(`https://api.github.com/orgs/${gitOwner}/repos`);
  return result; 
}
async function getRepoTags(repo){
  let result = axios.get(`https://api.github.com/repos/${gitOwner}/${repo}/tags`);
  return result; 
}
module.exports={
  getRepoList:getRepoList,
  getRepoTags:getRepoTags
}