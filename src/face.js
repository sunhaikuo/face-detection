// cv.readImage("./examples/files/mona.png", function (err, im) {
//     im.detectObject(cv.FACE_CASCADE, {}, function (err, faces) {
//         for (var i = 0; i < faces.length; i++) {
//             var x = faces[i]
//             im.ellipse(x.x + x.width / 2, x.y + x.height / 2, x.width / 2, x.height / 2);
//         }
//         im.save('./out.jpg');
//     });
// })

const cv = require('opencv');
var d1 = +(new Date())
cv.readImage("./static/img/pic1497600114181.jpg", function (err, im) {
    if (err) throw err;
    if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size');

    im.detectObject(cv.FACE_CASCADE, {}, function (err, faces) {
        if (err) throw err;

        for (var i = 0; i < faces.length; i++) {
            var face = faces[i];
            im.ellipse(face.x + face.width / 2, face.y + face.height / 2, face.width / 2, face.height / 2);
            console.log(face)
        }

        im.save('./face-detection.png');
        d2 = +(new Date())
        console.log('Image saved to ./tmp/face-detection.png' + (d2 - d1));
    });
});