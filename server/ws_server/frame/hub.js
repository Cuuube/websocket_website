// 核心组件，用于分发路由。此代码不指定实际路由，只抽象上做分发。

let { Request, Response } = require('./frame.js');

// 路由都写在这种js文件中，然后引入进来。
let routes = require('../routes_index.js');

class Hub {
    constructor () {
        this.station = new Map();
        this.m_instance = this;

        this.bindRoute();
    }

    bindRoute () {
        routes.forEach((Route) => {
            let route = new Route();
            this.station.set(route.id, route);
        })
    }

    do (connection, request) {
        let id = request.id;
        
        if (this.station.has(id)) {
            let response = new Response(id, connection);
            this.station.get(id).execute(request, response);
        }
    }

    static instance () {
        return Hub.m_instance;
    }
}

module.exports = Hub;
