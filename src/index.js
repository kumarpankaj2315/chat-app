const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage } = require('./utils/message');

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
    socket.emit('message', generateMessage('Hi Welcome to Chat App'));
    socket.broadcast.emit('message', generateMessage('A new user has joined'));

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();
        if (filter.isProfane(message)) {
            return callback('Profane words are not allowed');
        }
        socket.broadcast.emit('message', generateMessage(message));
        callback('Delivered');
    })

    socket.on('sendLocation', (location, callback) => {
        io.emit('location', generateMessage(`https://google.com/maps?q=${location.latitude},${location.longitude}`));
        callback('Location shared');
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left'));
    })
})

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
