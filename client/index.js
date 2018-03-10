// 以下是页面脚本，非核心组件，为页面脚本。

function main () {
    console.log('页面加载完毕！');
    const dom = (selector) => document.querySelector(selector);

    const roomCloseLink = link('room_closed');

    const createRoomLink = link('create_room', (data) => {
        console.log(data);
        dom('#room-id-input').value = data.room_id;
    });
    dom('#create-room').addEventListener('click', (e) => {
        createRoomLink.send();
        
    })

    const showRoomsLink = link('show_rooms');
    dom('#show-rooms').addEventListener('click', (e) => {
        showRoomsLink.send();
    })

    const joinRoomLink = link('join_room');
    dom('#join-room').addEventListener('click', (e) => {
        joinRoomLink.send({
            room_id: dom('#room-id-input').value
        });
    })

    const sendMessage = link('room_message');
    dom('#send').addEventListener('click', (e) => {
        sendMessage.send({
            room_id: dom('#room-id-input').value,
            msg: dom('#message-input').value,
        });
    })

    const closeRoomLink = link('close_room', (data) => {
        console.log(data);
        dom('#room-id-input').value = '';
    });
    dom('#close-room').addEventListener('click', (e) => {
        closeRoomLink.send({
            room_id: dom('#room-id-input').value,
        });
    })

    const exitRoomLink = link('exit_room');
    dom('#exit-room').addEventListener('click', (e) => {
        exitRoomLink.send();
    })

    // let roomClosedSender = new Sender('room_closed');
    
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