// 核心组件。为创建reqest和response的代码，用于发送和回应websocket请求

// --------------------------
exports.Request =  class Request {
    constructor (data) {
        this._original_data = data;
        data = JSON.parse(data);
        this.id = data.id;
        this.params = data.params;
        this.data = data.data;
    }
}
exports.Response = class Response {
    constructor (id, connection) {
        this.id = id;
        this.connection = connection;
        
        this.sendData = {
            status: 200,
        }
    }

    send (data, params) {
        let sendData = Object.assign(this.sendData, {
            id: this.id,
            params: params,
            data: data
        });
        this.connection.sendUTF(JSON.stringify(sendData));
    }

    // TODO 暂不清楚哪里插入错误处理
    sendError () {
        let sendData = Object.assign(this.sendData, {
            id: this.id,
            status: 500,
            data: {
                msg: 'SomeThing error!'
            }
        });
        this.connection.sendUTF(JSON.stringify(sendData));
    }
}

