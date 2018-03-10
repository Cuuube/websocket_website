const RoomController = require('../rooms/room_controller.js');

exports.CreateRoom = class CreateRoom {
    constructor () {
        this.id = 'create_room';
    }
    execute (req, res) {
        let host = req.connection;
        let room = RoomController.instance().createRoom(host);
        res.send({
            msg: 'Room created success!',
            room_id: room.id
        });
    }
}

exports.CloseRoom = class CloseRoom {
    constructor () {
        this.id = 'close_room';
    }
    execute (req, res) {
        let { room_id } = req.data;
        let roomController = RoomController.instance();
        if (roomController.hasRoom(room_id)) {
            let room = roomController.getRoom(room_id);
            if (room.host === req.connection) {
                room.boardcast(this.id, {
                    room_id,
                    msg: '房间主人关闭了房间，所有成员被强制退出。'
                })
                roomController.removeRoom(room.id);
                res.send({
                    status: 0,
                    msg: '房间成功关闭！'
                })
            } else {
                res.error({
                    status: 1,
                    msg: '您不是房间主人，没有权限关闭房间！'
                })
            }
            
        }
    }
}

exports.FindRoom = class FindRoom {
    constructor () {
        this.id = 'find_room';
    }
    execute (req, res) {
        let { room_id } = req.params;
        let result = RoomController.instance().hasRoom(room_id);
        res.send({
            msg: result
        });
    }
}

exports.FindAllRoom = class FindAllRoom {
    constructor () {
        this.id = 'find_all_room';
    }
    execute (req, res) {
        res.send({
            rooms: RoomController.instance().allRoomsId()
        });
    }
}

exports.JoinRoom = class JoinRoom {
    constructor () {
        this.id = 'join_room';
    }
    execute (req, res) {
        let { room_id } = req.data;
        let { status, msg } = RoomController.instance().joinRoom(room_id, req.connection);
        res.send({
            room_id,
            status,
            msg
        });
    }
}

exports.RoomMessage = class RoomMessage {
    constructor () {
        this.id = 'room_message';
    }
    execute (req, res) {
        let { msg, name, room_id } = req.data;
        let roomController = RoomController.instance();
        if (roomController.hasRoom(room_id)) {
            let room = roomController.getRoom(room_id);
            room.boardcast(this.id, {
                room_id,
                msg
            })
        } else {
            res.error({
                status: 1,
                msg: '房间不存在'
            })
        }
    }
}

// exports.JoinRoom = class JoinRoom {
//     constructor () {
//         this.id = 'join_room';
//     }
//     execute (req, res) {
//         const WsServer = require('../ws_app.js');
//         WsServer.boardcast({
//             msg: '服务器来的广播！'
//         });
//     }
// }