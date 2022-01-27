const express = require('express');
const socketIO = require('socket.io');
const { createServer } = require('http');
const {joinRoom} = require("./utils/utils");

const app = express();
const server = createServer(app);

const io = socketIO(server, {
    cors: {
        origins: ['localhost:8080']
    }
})

io.on('connection', (socket)=>{
    let currentRoom = Object.keys(socket.rooms)[0]; //socket.id
    console.log("someone joined");
    socket.on('createRoom', (roomName, callback)=>{
        joinRoom(socket, roomName);
        callback(roomName); // remove this if not needed
    })
})

server.listen(3000, ()=>{
    console.log("server is running");
})