// websocket 请求的框架
// 核心组件。

// ws控制者。每次页面加载需要连接此对象，并且调用ready函数。
class WSConstroller {
    constructor () {
        this.readyFunction = (self) => { };
        this.station = new Map();
        this.ws = new WebSocket('ws://0.0.0.0:3456', 'echo-protocol');
        
        this.ws.onmessage = (res) => {
            res = JSON.parse(res.data);

            let { id, data, status } = res;
            if (this.station.has(id)) {
                let cb = this.station.get(id);
                if (status < 400 ) {
                    cb['successCb'](data);
                } else {
                    cb['errorCb'](data);
                }
            }
        }
        this.ws.onopen = () => {
            this.readyFunction();
        }

        WSConstroller.m_instance = this;
    }

    static instance () {
        return WSConstroller.m_instance;
    }

    register (id, callback) {
        if (!callback instanceof Object) {
            throw new Error('Callback invalid!');
        }
        this.station.set(id, callback);
    }

    unregister (id) {
        if (this.station.has(id)) {
            this.station.delete(id);
        }
    }

    ready(callback) {
        this.readyFunction = callback;
    }
}

class Sender {
    constructor (id) {
        this.id = id;
        this.wsController = WSConstroller.instance();
        this.cb = { 
            successCb: () => {},
            errorCb: () => {},
        };
    }

    _toRegister () {
        this.wsController.register(this.id, this.cb);
    }

    load (callback) {
        this.cb['successCb'] = callback;
        this._toRegister();
    }

    error (callback) {
        this.cb['errorCb'] = callback;
        this._toRegister();
    }

    set onload (callback) {
        this.load(callback);
    }

    set onerror (callback) {
        this.error(callback);
    }

    send (data, params) {
        let send_data = {
            id: this.id,
            params: params,
            data: data
        }
        this.wsController.ws.send(JSON.stringify(send_data));
    }
}
