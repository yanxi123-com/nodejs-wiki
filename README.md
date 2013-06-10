七日知识管理系统
====

本系统构建在node.js上，是面向个人的知识管理系统，可以随时添加、编辑和查看你的页面，不断积累各方面知识。

作为一个完全开源的 node.js 项目，希望对 node.js 感兴趣的朋友可以积极贡献，共同来完善。

作者微博: http://weibo.com/yanxicom

官方网站: http://qiri.com/

######特性
 - 移动设备支持良好，便于手机随时操作
 - 打开浏览器就能工作，手机和电脑通用
 - 私密性好，登陆后才能查看
 - 采用流行的Wiki语法，页面内容丰富多彩
 - 创建页面数量没有限制
 - 支持子页面，并能创建无限级子页面

######示例
 - [七日官方网站](http://qiri.com/)
 - 用本系统录入的图书 [人性的弱点](http://qiri.com/page/51ae14a1ce68cc121f000001)

### 安装指南
 - 安装 mongodb 数据库
 - 安装 node.js 环境
 - 下载本项目 [最新版 zip 压缩包](https://github.com/yanxi-com/qiri/archive/master.zip)
 - 进入项目目录，运行 `npm install`
 - 创建 logs 文件夹，用于存放 log
 - 复制 config.original.js 到 config.js, 并更新相关配置
 - 启动 node.js `node app.js`

##### Mongodb 索引
```js
db.users.ensureIndex( { email: 1 }, {unique : true} );
db.users.ensureIndex( { qqUid: 1 } );
db.pages.ensureIndex( { userId: 1 } );
db.pages.ensureIndex( { parentId: 1 } );
db.pages.ensureIndex( { parentId: 1, title: 1 }, {unique : true} );
```

### 技术一览
###### 服务器端
 - [node.js](http://nodejs.org) 首次将javascript用于服务器端，事件驱动，无阻挡IO
 - [express](https://npmjs.org/package/express) 目前node.js非常流行的一款 MVC 框架
 - [underscore.js](http://underscorejs.org/) 工具库（也用于客户端）
 - [ejs](https://npmjs.org/package/ejs) 模板语言

###### 客户端
 - [jQuery](http://jquery.com/) 神一样的框架，居家旅行必备
 - [jQuery Mobile](http://jquerymobile.com/) 适合PC和移动设备，不用做多个版本
 - [require.js](http://requirejs.org/) 所有javascript都统一管理，使html代码看起来非常简洁清晰

###### 数据持久层
 - [Mongodb](http://www.mongodb.org/) 面向文档的数据库
 - [Mongoose](http://mongoosejs.com/) 用于node.js的API接口，访问数据库就像操作本地对象

