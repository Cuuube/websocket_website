const fs = require('fs');
const path = require('path');
const http = require('http');

const { PORT } = require('../config.js');
const ext2ContentType = require('../../utils/content-type.js');

class Server {
    constructor () {
        this.core = http.createServer(this.staticRoute);

        this.init();
        Server.m_instance = this;
    }

    init () {
        this.core.listen(PORT, () => {
            console.log('Server is listening on http://0.0.0.0:' + PORT);
        });
    }

    // 简单的路由实现
    staticRoute (req, res) {
        let url = req.url === '/' ? 'index.html' : req.url;
        let fileRoute = path.join(__dirname, '../../client', url);
        
        fs.readFile(fileRoute, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('404');
                return ;
            }
            let contentType = ext2ContentType(path.extname(fileRoute));
            res.writeHead(200, {'Content-Type': contentType});
            res.end(data);
        });
    }

    static instance () {
        return Server.m_instance;
    }

    getHttpServer () {
        return this.core;
    }
}

module.exports = Server;
