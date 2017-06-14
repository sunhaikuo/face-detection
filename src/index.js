// Setup basic express server
var express = require('express');
var path = require('path')
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3001;

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'static')));

// Chatroom

var numUsers = 0;

io.on('connection', function (socket) {
    var addedUser = false;

    // when the client emits 'new message', this listens and executes
    socket.on('message', function (data) {
        socket.broadcast.emit('message', data);
    })

    // setInterval(function () {
    //     socket.broadcast.emit('message', Math.random());
    // }, 5000)

    socket.broadcast.emit('login', 'Success')
})