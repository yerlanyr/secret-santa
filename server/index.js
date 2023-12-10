const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);

app.use(express.static(path.resolve(__dirname, 'public')));
const rooms = {};
const createNewRoom = (adminName) => ({createDate: new Date(), adminName, userNames: [], generatedIndexes: undefined});
const isTaken = (roomName) => io.sockets.adapter.rooms[roomName] || rooms[roomName] && (new Date().getTime() - rooms[roomName].createDate.getTime()) <= 24 * 60 * 60 * 1000;

io.on('connection', (socket) => {
    const joinRoomEvent = (roomName, userName, fn) => {
        roomName = roomName.trim();
        userName = userName.trim();
        if(!rooms[roomName]) { fn({error: 'No such room'}); return; }
        if(rooms[roomName].generatedIndexes && !rooms[roomName].userNames.includes(userName)) 
        { fn({ error: 'Recipients already were assigned, sorry you are late' }); return; }
        socket.join(roomName, () => {
            if(!rooms[roomName].userNames.includes(userName)){
                rooms[roomName].userNames.push(userName);
                io.in(roomName).emit('set-room', rooms[roomName]);
            }
            fn(rooms[roomName]);
        });
    };

    socket.on('create-room', (roomName, userName, fn) => {
        roomName = roomName.trim();
        userName = userName.trim();
        if(isTaken(roomName)){
            fn({error: 'name has been taken'});
            return;
        }
        rooms[roomName] = createNewRoom(userName);
        joinRoomEvent(roomName, userName, fn);
    });

    socket.on('join-room', joinRoomEvent);
    socket.on('get-room', (roomName, fn) => {
        if(isTaken(roomName))
            fn(rooms[roomName]);
        else
            fn({error: 'There is no such room'});
    });

    socket.on('is-name-taken', (roomName, fn) => {
        fn( isTaken(roomName.trim()) ? 'taken' : 'available');
    });

    socket.on('assign-recipients', (roomName, fn) =>{
        const {generate} = require('./indexes-generator');
        if(rooms[roomName].generatedIndexes) { 
            fn({error: 'Recipients already assigned!'});
            return;
        }
        rooms[roomName].generatedIndexes = generate(rooms[roomName].userNames.length);
        io.in(roomName).emit('set-room', rooms[roomName]);
    });

});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log('Running on port ' + (PORT));
});
