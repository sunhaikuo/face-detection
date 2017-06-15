// var socket = io();
// socket.on('message', function (data) {
//     console.log('message:' + data)
//     addChatMessage(data);
// });

// function addChatMessage(data) {
//     console.log(data)
//     document.querySelector('p').innerHTML = data
// }

// function input() {
//     var value = document.querySelector('input').value
//     socket.emit('message', value);
// }
var app = new Vue({
    el: '#app',
    data: {
        items: [],
        frame: {}
    }
})

var currentTime = 0;

function loginServer() {
    addLog('正在登录服务器...')
    currentTime = +(new Date())
}

function addLog(str) {
    var date = new Date().Format("hh:mm:ss.S")
    app.items.push({
        date: date,
        msg: str
    })
}

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

var video = document.getElementById('video');
var hls = new Hls();
hls.loadSource('https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8');
hls.attachMedia(video);
hls.on(Hls.Events.MANIFEST_PARSED, function () {
    var video = document.querySelector('video')
    var socket = io({})
    video.play()
    // 登录
    loginServer()
    socket.on('connect', function () {
        var loginTime = +(new Date())
        var diff = loginTime - currentTime
        addLog('登录服务器成功, 耗时:' + diff + 'ms')
        socket.emit('message', {
            width: video.clientWidth,
            height: video.clientHeight
        });
    })

    socket.on('message', function (data) {
        addLog(data)
    })
    socket.on('frame', function (data) {
        // data.display = 'block'
        console.log('----frame', data)
        app.frame = data
    })
})