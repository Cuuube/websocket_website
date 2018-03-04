// 核心组件，用于分发路由。此代码不指定实际路由，只抽象上做分发。

let { Request, Response } = require('./frame.js');

// 路由都写在这种js文件中，然后引入进来。
let routes = require('../routes_index.js');

class Hub {
    constructor () {
        this.station = new Map();

        this.bindRoute();
    }

    bindRoute () {
        routes.forEach((Route) => {
            let route = new Route();
            this.station.set(route.id, route);
        })
    }

    dealwith (connection, request) {
        // 可以优化，现在是每一个用户连接上，所有路由类会马上全部实例化保存在内存。这样不合适。应该收到请求后再进行实例，调用。
        let id = request.id;
        
        if (this.station.has(id)) {
            let response = new Response(id, connection);
            this.station.get(id).execute(request, response);
        }
    }
}

module.exports = new Hub();