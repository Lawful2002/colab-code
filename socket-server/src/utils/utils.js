export function joinRoom (socket, newRoom) {
    let prevRoom = Object.keys(socket.rooms)[1];
    socket.leave(prevRoom);
    socket.join(newRoom);
    socket.emit('roomJoined', newRoom);
}