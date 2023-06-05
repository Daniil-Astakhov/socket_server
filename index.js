const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const app = express();
const route = require('./route');
const { addUsers, findeUser, getRoomUsers, removeUser } = require('./users');


app.use(cors({ origin: "*" }));
app.use(route);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
});

io.on('connection', (socket) => {
    socket.on('join', ({ name, room }) => {

        socket.join(room);

        const { user, isExist } =  addUsers({ name, room } );
        const userMessage = isExist ? `${user.name}, here you go again` : `${user.name} has join`;
        
        socket.emit('message', {
            data: { user: { name: "Admin" }, message: `Hey my love ${user.name}` }
        });
        socket.broadcast.to(user.room).emit('message', { 
            data: { user: { name: "Admin" }, message: userMessage }
        })

        io.to(user.room).emit('joinRoom', { data: { users: getRoomUsers(user.room) } })
    });
    socket.on('sendMessage', ({message, params  }) => {
        const user = findeUser(params);

        if(user) {
            io.to(user.room).emit('message', { data: { user, message } })
        }
    })   

    socket.on('leaveRoom', ({ params  }) => {
        const user = removeUser(params);

        if(user) {
            const { room, name } = user;
            io.to(room).emit('message', { data: { user: { name: "Admin" }, message: `${name} has leave room` } });

            io.to(room).emit('leaveRoom', { data: { user: getRoomUsers(room) } })
        }
    }) 

    io.on('disconnect', () => {
        console.log('Disconnect')
    })
});

server.listen(5000, () => {
    console.log('NICE!')
});