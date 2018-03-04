// 核心组件。为起websocket server的代码。

const WebSocketServer = require('websocket').server;
const http = require('http');

const { Request } = require('./frame/frame.js');
const hub = require('./frame/hub.js');

const PORT = 3456;

const server = http.createServer((req, res) => {
    console.log(`${new Date()} Receved request for ${req.url}`);
    res.writeHead(404);
    res.end();
});
server.listen(PORT, () => {
    console.log((new Date()) + ' Server is listening on port ' + PORT);
});

// -------------------------

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnetions: false,
});


wsServer.on('request', (req) => {
    const connection = req.accept('echo-protocol', req.origin);
    
    console.log('房间中共有：'+ wsServer.connections.length +'人');

    connection.on('message', (message) => {
        if (message.type === 'utf8') {
            console.log(`Received Message from ${req.origin}: "${message.utf8Data}"`);

            let request = new Request(message.utf8Data);
            hub.dealwith(connection, request);
        }
    });

    connection.on('close', function(reasonCode, description) {
        console.log(connection.remoteAddress + ' disconnected.');
        console.log('房间还剩下：'+ wsServer.connections.length +'人');
    });
})