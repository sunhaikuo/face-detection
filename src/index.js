// Setup basic express server
var express = require('express');
var path = require('path')
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3001;
const fs = require('fs-extra')
server.listen(port, function () {
    console.log('Server listening at port %d', port)
    fs.removeSync(path.resolve('./static/img'))
    fs.mkdirs(path.resolve('./static/img'))
    console.log('清理完成!')
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
    socket.on('image', function (data) {
        // console.log('image:' + data)
        var d1 = +(new Date())
        var data = data.split('data:image/jpeg;base64,')
        data = data[1]
        var bitmap = new Buffer(data, 'base64')
        var fileName = './static/img/pic' + (+new Date()) + '.jpg'
        fs.writeFileSync(path.join(fileName), bitmap)
        var d2 = +(new Date())
        // console.log('--耗时:' + (d2 - d1))

        getFace(fileName)
    })


    function getFace(fileName) {
        const cv = require('opencv');
        var d1 = +(new Date())
        cv.readImage(fileName, function (err, im) {
            if (err) throw err;
            if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size');

            im.detectObject(cv.FACE_CASCADE, {}, function (err, faces) {
                if (err) throw err;

                // for (var i = 0; i < faces.length; i++) {
                //     var face = faces[i];
                //     // im.ellipse(face.x + face.width / 2, face.y + face.height / 2, face.width / 2, face.height / 2);
                //     console.log(face)
                // }
                if (faces && faces.length > 0) {
                    var face = faces[0]
                    d2 = +(new Date())
                    var frameObj = {
                        info: {
                            left: face.x + 'px',
                            top: face.y + 'px',
                            width: face.width + 'px',
                            height: face.height + 'px'
                        },
                        isShow: true
                    }
                    console.log('--frameObj:', frameObj, '--time:', (d2 - d1))
                    io.sockets.emit('frame', frameObj)
                } else {
                    var frameObj = {
                        isShow: false,
                        info: {}
                    }
                    io.sockets.emit('frame', frameObj)
                    // console.log(+(new Date()) + '---none---')
                }


                // im.save('./face-detection.png');

                // console.log('Image saved to ./tmp/face-detection.png' + (d2 - d1));
            });
        });
    }
})
