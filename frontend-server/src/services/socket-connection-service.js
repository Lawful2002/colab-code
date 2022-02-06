import io from 'socket.io-client'
import { nanoid } from "nanoid";

class SocketConnectionService {
    socket; //client side socket variable
    isConnected = false; // is connected to room
    currentRoom;
    constructor() {}

    createConnection() {
        this.socket = io('http://localhost:3000'); // use env variables
    }

    breakConnection

    joinedRoom(roomName){
        console.log(roomName);
    }

    joinRoom() {
        const roomId = nanoid(10);
        this.socket.emit('joinRoom', roomId, this.joinRoom);
        this.isConnected = true;
        this.currentRoom = roomId;
    }

    sendData(data) {
        this.socket.emit('data', data);
    }

    leaveRoom(room){
        this.socket.emit('leaveRoom', room, ()=>{
            console.log("left room");
            this.isConnected = false;
        })
    }

}

export default new SocketConnectionService();