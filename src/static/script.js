
var app = new Vue({
    el: '#app',
    data: {
        items: [],
        frame: {},
        isShow: false
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
    document.querySelector('.right').scrollTop = document.getElementById('msgWrap').scrollHeight
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
var video = document.querySelector('video')
var socket = io({})
video.play()
// 登录
loginServer()
socket.on('connect', function () {
    var loginTime = +(new Date())
    var diff = loginTime - currentTime
    addLog('登录服务器成功, 耗时:' + diff + 'ms')
    video.currentTime = 15
    socket.emit('message', {
        width: video.clientWidth,
        height: video.clientHeight
    });
})

socket.on('message', function (data) {
    addLog(data)
})
socket.on('frame', function (data) {
    if(data.isShow) {
        var msg = '检测到人脸, x:' + data.info.left + ', y:' + data.info.top + ', width:' + data.info.width + ', height:' + data.info.height
        addLog(msg)
        // console.log('----frame', data)
    }
    app.frame = data.info
    app.isShow = data.isShow
})

getScreen()


function getScreen() {
    var c = document.getElementById("myCanvas")
    var ctx = c.getContext("2d")
    var img = document.getElementById("video")
    ctx.drawImage(img, 0, 0, 500, 300)
    window.requestAnimationFrame(getScreen)
}

setInterval(function () {
    var c = document.getElementById("myCanvas")
    // var ctx = c.getContext("2d")
    // var imgData = ctx.getImageData(10, 10, 50, 50)
    // console.log(imgData)
    var jpg = c.toDataURL('image/jpeg')
    socket.emit('image', jpg)
}, 100)
