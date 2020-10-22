 
 
# mfy-cli
## 命令介绍
### 创建项目
输入项目命令后进行输入项目名称，选择项目模版，选择项目版本，回车后即可
```
mfy-cli create [project-name]
```
###### 强制创建文件
此时将不检测当前创建文件目录中是否存在同名的文件夹，将会直接移除进行创建先的项目
```
mfy-cli create [project-name] -f
```
### config 配置项目

##### 默认的模版项目源 仅提供测试
```
https://github.com/mfy-template
```
##### 修改自定义的项目源
通过命令修改模版项目源，需要在github上创建自己的项目仓库模版organizations
执行以下命令 

```
mfy-cli config -sm
```
命令行交互
```
🌟---------------------------------------🌟
    👏 welcome to use mfy-cli👏    
🌟---------------------------------------🌟
? please input your template name mfy-template
? please confirm the template name ✋mfy-template Yes
🎉 config successful!!!
```
这样再次进行创建项目操作 就可以下载你自己模版下的文件了


#####  修改成默认源
```
mfy-cli config -smc
```

### 增加文件
###### 直接添加文件 含后缀名字
```
mfy-cli add mfy.js 
```
* 检测本目录下是否有同名文件，如果有则进行提示，根据后续选择进行操作，无同名文件将会直接创建
* 无同名文件
```jsx static
🌟---------------------------------------🌟
    👏 welcome to use mfy-cli👏    
🌟---------------------------------------🌟
All files have completed
        m.js.js  ===== Create successful
```
存在同名文件
```
🌟---------------------------------------🌟
    👏 welcome to use mfy-cli👏    
🌟---------------------------------------🌟
the file m.js.js have existed
? Do you want to continue to create file ? if this will delete the same file Yes
        m.js.js  ===== Create successful
```
###### 直接添加文件 不包含后缀名字

```
mfy-cli add mfy 
```
输入完成后，可选择文件名字后缀进行填充
```
🌟---------------------------------------🌟
    👏 welcome to use mfy-cli👏    
🌟---------------------------------------🌟
? please select file's type .js, .ts, .vue, .json
        mfy.js  ===== Create successful
        mfy.ts  ===== Create successful
        mfy.vue  ===== Create successful
        mfy.json  ===== Create successful
```
###### 输入参数为路径
```
mfy-cli add mfy/path.js
```
将会创建mfy文件夹和path.js
###### 输入参数为路径 未带后缀

```
mfy-cli add mfy/mfy1
```
此时将mfy为文件夹，mfy1为文件名称 进行选择创建文件后缀创建文件
##### 强制创建文件

```
mfy-cli add path -f
``` 
#####  创建模版文件
```
mfy-cli add -t <template-name>
```
选择后进行操作即可
```
🌟---------------------------------------🌟
    👏 welcome to use mfy-cli👏    
🌟---------------------------------------🌟
? Please input the template name: exit
? Please select template type vue
        exit/index.vue  ===== Create successful
        exit/index.less  ===== Create successful
        exit/index.js  ===== Create successful
```

[注意点]fileName 相对路径

### 删除文件/文件夹
###### 删除文件夹
```
mfy-cli delete pathName
```
###### 删除单个文件

```
mfy-cli delete filename.js
```
###### 删除同名、后缀名字不同的文件
```
mfy-cli delete fileName.*
```


