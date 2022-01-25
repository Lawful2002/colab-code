const express = require('express');
const socketIO = require('socket.io');
const { createServer } = require('http');

const app = express();
const server = createServer(app);

const io = socketIO(server, {
    cors: {
        origins: ['localhost:8080']
    }
})

io.on('connection', (socket)=>{
    console.log(socket);
    socket.emit('hello', 'hello');
})

server.listen(3000, ()=>{
    console.log("server is running");
})