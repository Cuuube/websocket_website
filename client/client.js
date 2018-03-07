// websocket 请求的框架
// 核心组件。

// ws控制者。每次页面加载需要连接此对象，并且调用ready函数。
class WSConstroller {
    constructor (delay) {
        this.wsURI = 'ws://0.0.0.0:3456';
        this.delay = delay || 2000;
        this.station = new Map();

        this.m_status = 'offline';
        this.onready = (self) => { };
        this.online = (self) => { };
        this.offline = (self) => { };

        WSConstroller.m_instance = this;
    }

    static instance () {
        return WSConstroller.m_instance;
    }

    // 生成ws对象。必须调用一次。
    createWs (readyCb) {
        readyCb ? (this.onready = readyCb) : null;

        this.ws = new WebSocket(this.wsURI, 'echo-protocol');
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
            this.status = 'online';
        }
        this.ws.onclose = () => {
            this.status = 'offline';
            // 断线重连
            setTimeout(() => {
                this.createWs();
            }, this.delay);
        }
        return this;
    }

    // 注册一个观察者
    register (id, callback) {
        if (!callback instanceof Object) {
            throw new Error('Callback invalid!');
        }
        this.station.set(id, callback);
    }

    // 解绑一个观察者
    unregister (id) {
        if (this.station.has(id)) {
            this.station.delete(id);
        }
    }

    // 设置状态。内部使用。
    set status (status) {
        if (status !== this.m_status) {
            switch (status) {
                case 'online':
                this.m_status = status;
                    if (this.onready) {
                        this.onready();
                        this.onready = null;
                    } else {
                        this.online();
                    }
                    break;
                case 'offline':
                    this.m_status = status;
                    this.offline();
                    break;
                default:
            }
        }
    }
}

// 消息发送与接收者
class Sender {
    constructor (id) {
        this.id = id;
        this.wsController = WSConstroller.instance();
        this.cb = { 
            successCb: () => {},
            errorCb: () => {},
        };
    }

    // 把自己注册到被观察者中
    _toRegister () {
        this.wsController.register(this.id, this.cb);
    }

    // 接收到消息的回调
    load (callback) {
        this.cb['successCb'] = callback;
        this._toRegister();
    }

    // 接收到消息的回调（发生错误的情况）
    error (callback) {
        this.cb['errorCb'] = callback;
        this._toRegister();
    }

    // 接收到消息的回调，另一种写法
    set onload (callback) {
        this.load(callback);
    }

    // 接收到消息的回调（发生错误的情况），另一种写法
    set onerror (callback) {
        this.error(callback);
    }

    // 给服务器发送请求
    send (data, params) {
        let send_data = {
            id: this.id,
            params: params,
            data: data
        }
        this.wsController.ws.send(JSON.stringify(send_data));
    }
}
