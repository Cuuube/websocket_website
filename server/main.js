const Server = require('./server/app.js');
const WsServer = require('./ws_server/ws_app.js');

new WsServer(new Server());