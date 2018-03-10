const Room = require('./room.js');

class RoomController {
    constructor () {
        this.rooms = new Map();
        this.connectionRoomIndex = new Map();

        RoomController.m_instance = this;
    }

    static instance () {
        return RoomController.m_instance;
    }

    createRoom (connection) {
        let room = new Room(connection);
        let roomId = room.id;
        this.rooms.set(roomId, room);
        this.connectionRoomIndex.set(connection, room);
        console.log('生成了一个room：' + roomId);
        return room;
    }

    hasRoom (roomId) {
        return this.rooms.has(roomId);
    }

    getRoom (roomId) {
        if (this.hasRoom(roomId)) {
            return this.rooms.get(roomId);
        }
    }

    joinRoom (roomId, member) {
        let res = {
            status: false,
            msg: ''
        };
        let isHas = this.hasRoom(roomId);
        let room = this.getRoom(roomId);
        if (!isHas) {
            res.msg = roomId + '房间不存在';
            return res;
        }

        if (room.addMember(member)) {
            res.status = true;
            res.msg = '加入成功';
            this.connectionRoomIndex.set(member, room);
        } else {
            res.msg = '加入失败';
        }
        return res;
    }

    removeRoom (roomId) {
        if (this.hasRoom(roomId)) {
            let room = this.getRoom(roomId);
            // 删除room时，将所有成员踢出。顺便删除该room在索引中的记录
            this.connectionRoomIndex.forEach((roomInMap, key) => {
                if (room.id === roomInMap.id) {
                    this.connectionRoomIndex.delete(key);
                }
            });
            this.rooms.delete(roomId);
            room.destory();

            console.log('删除了一个room：' + roomId);
        }
    }

    removeConnection (connection) {
        if (this.connectionRoomIndex.has(connection)) {
            let room = this.connectionRoomIndex.get(connection);
            if (room.host === connection) {
                this.removeRoom(room.id);
            } else {
                room.removeMember(connection);
            }
            // 删除connection时，顺便删除该connection在索引中的记录
            this.connectionRoomIndex.delete(connection);
        }
    }

    allRoomsId () {
        return this.rooms.keys();
    }
}

new RoomController();

module.exports = RoomController;