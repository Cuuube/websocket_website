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
        if (this.connectionRoomIndex.has(connection)) {
            return void 0;
        } else {
            let room = new Room(connection);
            let roomId = room.id;
            this.rooms.set(roomId, room);
            this.connectionRoomIndex.set(connection, room);
            console.log('生成了一个room：' + roomId);
            return room;
        }
        
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
        let result = {
            status: 1,
            msg: ''
        };
        let isHas = this.hasRoom(roomId);
        let room = this.getRoom(roomId);
        if (!isHas) {
            result.msg = roomId + '房间不存在';
            return result;
        }
        if (room.hasMember(member)) {
            result.msg = '您已经在此房间内，不能重复加入！';
            return result;
        }
        if (room.addMember(member)) {
            result.status = 0;
            result.msg = '加入成功';
            this.connectionRoomIndex.set(member, room);
        } else {
            result.msg = '加入失败';
        }
        return result;
    }

    exitRoom (member) {
        return this.removeConnection(member);
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
        let result = {
            status: 0,
            msg: ''
        };
        if (this.connectionRoomIndex.has(connection)) {
            let room = this.connectionRoomIndex.get(connection);
            if (room.host === connection) {
                this.removeRoom(room.id);
                result.msg = '您成功退出房间。因为您是房主，房间自动关闭。';
            } else {
                room.removeMember(connection);
                result.msg = '您已成功退出房间。'
            }
            // 删除connection时，顺便删除该connection在索引中的记录
            this.connectionRoomIndex.delete(connection);
        } else {
            result.msg = '您不在任何房间内，无法退出房间。'
            result.status = 1;
        }
        return result;
    }

    allRoomsId () {
        return Array.from(this.rooms.keys());
    }
}

new RoomController();

module.exports = RoomController;