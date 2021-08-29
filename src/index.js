const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage } = require('./utils/message');

const { addUser, removeUser, getUser, getUserInRoom } = require('./utils/users');

const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));

app.get('/message', (req, res) => {
    res.status(200).send('Success');
})

let count = 0;

io.on('connection', (socket) => {
    console.log('New connection created');



    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room });

        if (error) {
            return callback(error);
        }
        socket.join(user.room);
        socket.emit('message', generateMessage('Hi Welcome to Chat App', 'Admin'));
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined`, 'Admin'));
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUserInRoom(user.room)
        })
        callback();

    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();
        if (filter.isProfane(message)) {
            return callback('Profane words are not allowed');
        }
        const user = getUser(socket.id);
        socket.broadcast.to(user.room).emit('message', generateMessage(message, user.username));
        callback('Delivered');
    })

    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('location', generateMessage(`https://google.com/maps?q=${location.latitude},${location.longitude}`, user.username));
        callback('Location shared');
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left!`, 'Admin'));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUserInRoom(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
