import io from 'socket.io-client'

class SocketConnectionService {
    socket; //client side socket variable
    isConnectedToRoom = false; // is connected to room
    isConnected = false; //server connection
    currentRoom;
    data;
    constructor() {}

    createConnection() {
        this.socket = io('http://localhost:3000'); // use env variables
        this.isConnected = true;
    }

    breakConnection() {
        this.socket.close();
        this.isConnected = false;
    }

    roomAction(roomName){
        console.log(roomName);
    }

    createRoom(roomId) {
        this.socket.emit('createRoom', roomId);
        this.isConnectedToRoom = true;
        this.currentRoom = roomId;
    }

    joinRoom(roomName) {
        this.socket.emit('joinRoom', roomName, this.roomAction);
    }

    sendData(data) {
        this.socket.emit('sendData', data);
    }

    leaveRoom(room){
        this.socket.emit('leaveRoom', room, ()=>{
            console.log("left room");
            this.isConnectedToRoom = false;
        })
    }
}

export default new SocketConnectionService();