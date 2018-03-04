// 以下是页面脚本，非核心组件，为页面脚本。

function main () {

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
    let ws = new WSConstroller();
    ws.ready(main);
};