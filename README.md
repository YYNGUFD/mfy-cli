<!--
 * @Descripttion: 
 * @version: 
 * @Author: mafengyan
 * @Date: 2020-09-29 10:17:14
 * @LastEditors: mafengyan
 * @LastEditTime: 2020-10-15 09:31:51
-->
 
 
# mfy-cli
  
## 使用开发配置
### 创建项目
```
mfy-cli create [project-name]
```
### config 配置项目
#### default template
```
https://github.com/mfy-template
```
#### 修改自定义的项目源

```
mfy-cli config -sm
```
### 修改成默认源
```
mfy-cli config -smc
```

### 增加文件
```
mfy-cli add fileName 
```
* fileName 可以是绝对路径

### 删除文件/文件夹
```
mfy-cli delete fileName
```
* filename 可以是文件或者文件夹

