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
    console.log('--Connection--')
    var videoWith = 0,
        videoHeight = 0
    socket.on('message', function (data) {
        // socket.broadcast.emit('message', data);
        console.log(data)
        videoWith = data.width
        videoHeight = data.height
    })
    setTimeout(function () {
        var frame = createFrame()
        console.log('----Send Frame Info')
        socket.broadcast.emit('frame', frame);
    }, 5000)

    function createFrame() {
        var x = 0,
            y = 0,
            width = 50,
            height = 50
        x = videoWith / 2 - width / 2
        y = videoHeight / 2 - height / 2
        var xDirection = 'left'
        var yDirection = 'up'
        setInterval(function () {
            if (x <= 1) {
                xDirection = 'right'
            } else if (x >= videoWith) {
                xDirection = 'left'
            }
            if (xDirection == 'right') {
                x++
            } else {
                x--
            }

            if (y <= 1) {
                yDirection = 'down'
            } else if (y >= videoHeight) {
                yDirection = 'up'
            }
            if (yDirection == 'down') {
                y++
            } else {
                y--
            }

            var frameObj = {
                left: x + 'px',
                top: y + 'px',
                width: width + 'px',
                height: height + 'px'
            }
            socket.broadcast.emit('frame', frameObj)
        }, 30)

    }
})