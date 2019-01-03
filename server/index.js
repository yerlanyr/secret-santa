const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);

app.use(express.static(path.resolve(__dirname, 'public')));
// web sockets.
const userNames = {};
io.on('connection', (socket) => {
    console.log('connect', socket.id);
    
    const joinRoomEvent = (roomName, userName, fno) => {
        socket.join(roomName, () => {
            io.in(roomName).clients((error, clientIds) => {
                if(error) throw error;
                const clients =  clientIds.map(id => ({id, userName: userNames[id]}));
                fno(clients);
                io.in(roomName).emit('set-participants', clients);
            });
        });
    };

    const createRoomEvent = (roomName, userName, fn) => {
        userNames[socket.id] = userName;
        console.log(socket.id)
        if(io.sockets.adapter.rooms[roomName]){
            throw new Error('name has been taken');
        }
        joinRoomEvent(roomName, userName, fn);
    };

    socket.on('create-room', createRoomEvent);
    socket.on('join-room', (roomName, userName, fn) => {
        userNames[socket.id] = userName;
        joinRoomEvent(roomName, userName, fn);
    });
    socket.on('is-name-taken', (name, fn) => {
        if(!io.sockets.adapter.rooms[name]){
            fn('available');
        } else {
            fn('taken');
        }
    });
    socket.on('disconnect', (whateverReason) => {
        // remove from users name list.
        console.log('disconnect', socket.id);
        delete userNames[socket.id];
    });
    socket.on('assign-recipients', (roomName, fn) =>{
        // take clients from the room.
        io.in(roomName).clients((error, clients) => {
            if(error) throw error;
            const arr = clients;
            const n = clients.length;
            const {generate} = require('./indexes-generator');
            const generatedIndexes = generate(n);
            for(var i=0;i<n;i++){
                io.in(clients[i]).emit('assign-recipient', userNames[clients[generatedIndexes[i]]]);
            }
        });
    });
});

const PORT = 3000 || process.env.PORT;
http.listen(PORT, () => {
    console.log('Running on port ' + (PORT));
});
