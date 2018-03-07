// 以下是页面脚本，非核心组件，为页面脚本。

function main () {

    let _boardcast = new Sender('boardcast');
    _boardcast.onload = (data) => {
        console.log(data);
    }
    _boardcast.send({msg: 'go'})

    // 一次完整的发请求的调用
    let helloSender = new Sender('hello');
    helloSender.onload = (data) => {
        console.log(data);
    }
    helloSender.onerror = (error) => {
        console.error(error);
    }
    helloSender.send({
        msg: 'hello world!'
    }, {
        header: 'hahahah'
    });
    // end

    let pingSender = new Sender('ping');
    pingSender.onload = (data) => {
        console.log(data);
    }
    pingSender.onerror = (error) => {
        console.error(error);
    }
    pingSender.send({
        msg: 'ping'
    });
}

window.onload = () => {
    let ws = new WSConstroller(2000);
    // 可以用这种方法，也可以createWs赋予生成完毕的回调
    // ws.onready = main;
    // 必须调用一次createWs函数以启动
    ws.createWs(main);
    // 重连的callback
    ws.online = () => {
        console.log('已经断线重连！');
    };
    // 掉线的callback
    ws.offline = () => {
        console.log('Opps, 掉线了！');
    }
};