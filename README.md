## 这个是干什么的？
这是一个用websocket连接前后端，来代替某些api的框架。
后端架构需要：
页面渲染服务器一个，websocket服务器一个。
两个服务器端口可能不同，但可以放在一个仓库共享代码，也可以接入同一个框架。
前端即插即用，也比较方便。

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

根据唯一id来指定路由。

### 怎么开始
1. npm install
2. node server/websocket_server/app.js
3. 手动点开./client/index.html
4. 打开浏览器控制台看log

### 改动代码
1. 前端改client/index.js
2. 后端改server/websocket_server/routes/example.js，添加路由