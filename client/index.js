// 以下是页面脚本，非核心组件，为页面脚本。

function main () {
    // let createRoomSender = new Sender('create_room');
    // createRoomSender.send();

    let roomClosedSender = new Sender('room_closed');
    
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