define(function(require, exports, module) {
    var utils = require('./utils/utils');
    //utils.debug = true;
    var img = new Image();
    img.onload = function() {
        var spriteSheet = utils.img2SpriteSheet(img, 40, 40);
        var canvas = spriteSheet.images[0],
            frames = spriteSheet.frames;
        var showImg = new Image();
        showImg.src = canvas.toDataURL("image/png");

        var stage = utils.createCanvas(10000, 10000);
        document.body.appendChild(stage);
        var ctx = stage.getContext('2d');
        var length = frames.length,
            i = 0,
            time1 = 0,
            time2 = 0,
            curFrame,
            totalTime = 0;

        for (var i = 0; i < length; i++) {
            curFrame = frames[i];
            time1 = new Date().getTime();
            ctx.drawImage(canvas, curFrame[0], curFrame[1], curFrame[2], curFrame[3], 0, 0, curFrame[2], curFrame[3]);
            time2 = new Date().getTime();
            totalTime += time2 - time1;
            //console.log('draw time:', time2 - time1);
        };
        console.log('draw time:', totalTime);

        totalTime = 0;
        for (var i = 0; i < length; i++) {
            curFrame = frames[i];
            if (i - 1 >= 0) {
                var lastRect = frames[i - 1];
                ctx.clearRect(0, 0, lastRect[2], lastRect[3]);
            }
            time1 = new Date().getTime();
            ctx.drawImage(showImg, curFrame[0], curFrame[1], curFrame[2], curFrame[3], 0, 0, curFrame[2], curFrame[3]);
            time2 = new Date().getTime();
            totalTime += time2 - time1;
            //console.log('draw time:', time2 - time1);
        };
        console.log('draw time:', totalTime);
        return;
        var lastTime = new Date().getTime(),
            now = 0
            fps = 16,
            interval = 1000 / fps;
            
        requestAnimationFrame(function() {
            now = new Date().getTime();
            if (i < length) {
                if (now - lastTime >= interval) {
                    curFrame = frames[i];
                    if (i - 1 >= 0) {
                        var lastRect = frames[i - 1];
                        // time1 = new Date().getTime();
                        ctx.clearRect(0, 0, lastRect[2], lastRect[3]);
                        // time2 = new Date().getTime();
                        // console.log('clear time:', time2 - time1);
                    }
                    time1 = new Date().getTime();
                    ctx.drawImage(canvas, curFrame[0], curFrame[1], curFrame[2], curFrame[3], 0, 0, curFrame[2], curFrame[3]);
                    time2 = new Date().getTime();
                    console.log('draw time:', time2 - time1);
                    i++;
                    lastTime = now;
                }
                requestAnimationFrame(arguments.callee);
            }
        });
    };
    img.src = "img/player3.png";
});