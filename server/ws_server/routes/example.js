// 这里写路由，写法就按照如下方式：
/**
 * exports后面的单词和类名相同，只用来标识路由用途（不可重复）
 * 类中的id和前端传来的id相同，用于作为路由的唯一标识符（不可重复）
 * excute方法，用于接收到请求之后的执行调用。主要逻辑放在这里。
 * req中包含传来的数据。在req.data和req.params中。
 * res中包含websocket的connection对象。res.send可以多次执行。
 */

exports.HelloRoute = class HelloRoute {
    constructor () {
        this.id = 'hello';
    }
    execute (req, res) {
        res.send({
            msg: 'World！'
        });
        res.send({
            msg: '这是来自服务器的回应！'
        });
        res.send({
            msg: '这是来自服务器的回应！'
        });
    }
}

exports.PingRoute = class PingRoute {
    constructor () {
        this.id = 'ping';
    }
    execute (req, res) {
        res.send({
            msg: 'pong'
        });
    }
}

exports.ToBoardcast = class ToBoardcast {
    constructor () {
        this.id = 'toBoardcast';
    }
    execute (req, res) {
        const WsServer = require('../ws_app.js');
        WsServer.boardcast({
            msg: '服务器来的广播！'
        });
    }
}