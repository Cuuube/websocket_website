const uuidv1 = require('uuid/v1');
const { SimpleResponse } = require('../frame/frame.js');

module.exports = class Room {
    constructor (host) {
        // create id
        this.MAX_MENBER_COUNT = 10;
        this.id = uuidv1();
        this.host = host;
        this.members = new Set();
        this.addMember(host);
    }

    addMember (member) {
        if (this.memberCount() < this.MAX_MENBER_COUNT) {
            this.members.add(member);
            return true;
        } else {
            return false;
        }
    }
    
    removeMember (member) {
        this.members.delete(member);
    }

    memberCount () {
        return this.members.size;
    }

    destory () {
        // TODO 释放全部connection，并给所有connection发消息，房间解散
        this.id = null;
        this.host = null;
        this.boardcast('room_closed', {
            msg: '房间已关闭！'
        })
        this.members.clear();
    }

    boardcast (id, ...params) {
        this.members.forEach((connection) => {
            new SimpleResponse(id, connection).send(...params);
        })
    }
}