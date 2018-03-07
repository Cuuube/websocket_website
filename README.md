## 这个是干什么的？
这是一个使用了`发布/订阅`模式，用websocket连接前后端，来代替某些api的框架。
后端架构需要：
页面渲染服务器一个，websocket服务器一个。
两个服务器端口可能不同，但可以放在一个仓库共享代码，也可以接入同一个框架。
前端即插即用，也比较方便。

### 一些思想
前后端交互数据结构（暂定）：
```javascript
// 前端后端交互json：
// 前端 -> 后端：
let req = {
    id: 'xxx',
    params: { },
    data: {
        // ...
    }
}
//  后端 -> 前端：
let res = {
    id: 'xxx',
    params: { },
    status: 200, // http sttus code
    data: {  }
}
// 存在ws map中的格式：
let savedCb = {
    successCb: () => {},
    errorCb: () => {},
}

```

根据唯一`id`来指定频道。客户机端带上这个id，就可以访问服务器端的频道。
`params`中放一些设置的参数。
`data`放主要传输数据。
`status`为仿http状态码。`400`以上调用`onerror`，以下调用`onload`方法。

### 结构
主服务器在server/server/app.js中，暂时用原生js实现了个简单静态服务器
websocket服务器在server/ws_server/ws_app.js中。使用了第三方websocket包。
浏览器端代码在client下面。浏览器端下面的文件都可以被路由读到。

### 怎么开始
1. npm install
2. npm run start
3. 访问http://0.0.0.0:3456
4. 打开浏览器控制台看log

### 如何改动代码
1. 前端改client/index.js
2. 后端改server/ws_server/routes/example.js，添加路由