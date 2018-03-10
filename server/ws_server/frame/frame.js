// 核心组件。为创建reqest和response的代码，用于发送和回应websocket请求

// --------------------------
class Request {
    constructor (data, connection) {
        this._original_data = data;
        this.connection = connection;
        data = JSON.parse(data);
        this.id = data.id;
        this.params = data.params || {};
        this.data = data.data || {};
    }

    setConnection (connection) {
        this.connection = connection;
        return this;
    }
}

class SimpleResponse {
    constructor (id, connection) {
        this.id = id || 'system';
        this.connection = connection;
        
        this.sendData = {
            status: 200,
        }
    }

    send (data, params={}) {
        let sendData = Object.assign(this.sendData, {
            id: this.id,
            params: params,
            data: data
        });
        this.connection.sendUTF(JSON.stringify(sendData));
    }

    // TODO 暂不清楚哪里插入错误处理
    error (data) {
        let sendData = Object.assign(this.sendData, {
            id: this.id,
            status: 500,
            data: data || {
                msg: 'SomeThing error!'
            }
        });
        this.connection.sendUTF(JSON.stringify(sendData));
    }

    status (statusCode) {
        this.sendData.status = statusCode;
        return this;
    }
}

class Response extends SimpleResponse {
    constructor (request) {
        super(request.id, request.connection)
    }
}

exports.Request =  Request;
exports.SimpleResponse = SimpleResponse;
exports.Response = Response;