import io from 'socket.io-client'
import { nanoid } from "nanoid";

class SocketConnectionService {
    socket //client side
    constructor() {}

    createConnection() {
        this.socket = io('http://localhost:3000'); // use env variables
    }

    joinedRoom(roomName){
        console.log(roomName);
    }

    joinRoom() {
        this.socket.emit('joinRoom', nanoid(10), this.joinRoom);
    }

    sendData(data) {
        this.socket.emit('data', data);
    }

}

export default new SocketConnectionService();