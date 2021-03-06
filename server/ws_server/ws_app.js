// 核心组件。为起websocket server的代码。

const WebSocketServer = require('websocket').server;

const { Request, Response } = require('./frame/frame.js');
const Hub = require('./frame/hub.js');
const RoomController = require('./rooms/room_controller.js');

class WsServer {
    constructor (server) {
        this.core = new WebSocketServer({
            httpServer: server.getHttpServer(),
            autoAcceptConnetions: false,
        });
        this.hub = new Hub();

        this.init();

        WsServer.m_instance = this;
    }

    init () {
        this.core.on('request', (req) => {
            const connection = req.accept('echo-protocol', req.origin);
            
            console.log('房间中共有：'+ this.getAllConnections().length +'人');
        
            connection.on('message', (message) => {
                if (message.type === 'utf8') {
                    // 客户机的唯一身份表示可以用req.key指示。或者自己写身份认证
                    console.log(`Received Message from ${req.key}: "${message.utf8Data}"`);
        
                    let request = new Request(message.utf8Data, connection);
                    // request.setConnection(connection);
                    this.hub.do(request);
                }
            });
        
            connection.on('close', (reasonCode, description) => {
                console.log(connection.remoteAddress + ' disconnected.');
                console.log('房间还剩下：'+ this.getAllConnections().length +'人');
                connection.removeAllListeners();
                RoomController.instance().removeConnection(connection);
            });
        })
    }

    static instance () {
        return WsServer.m_instance;
    }

    getAllConnections () {
        return this.core.connections;
    }

    static boardcast (...data) {
        WsServer.m_instance.getAllConnections().forEach(connection => {
            let response = new Response('boardcast', connection);
            response.send(...data);
        });
    }

    
}

module.exports = WsServer;
