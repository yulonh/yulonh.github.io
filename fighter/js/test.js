define(function(require, exports, module) {
    require('bbengine/utils/compensation');

    var win = window,
        doc = document;
        
    var last = new Date().getTime();

    requestAnimationFrame(function() {
        var cur = new Date().getTime();
        console.log(cur - last);
        last = cur;

        requestAnimationFrame(arguments.callee);
    });

    console = {
        log: function() {
            var l = arguments.length;
            for (var i = 0; i < l; i++) {
                doc.getElementById('console').innerHTML = '<div>' + arguments[i] + '</div>';
            };
        }
    };

    var bg = document.getElementById('bg');
    var main = document.getElementById('main');

    var bgCtx = bg.getContext('2d');
    var mainCtx = main.getContext('2d');

    var Game = {
        img2Canvas: function(img) {
            if (!img || !img.width || !img.height) {
                throw 'error in method img2Canvas,may be the image is not loaded complete!';
            }
            var canvas = doc.createElement('canvas'),
                width = img.width,
                height = img.height;
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(img, 0, 0);
            return canvas;
        },
        performanceTest1: function() {

        },
        performanceTest: function() {
            var hill1 = this.hill1,
                imgCanvas = this.img2Canvas(this.hill1),
                n = 100;
            var imgCtx = imgCanvas.getContext('2d'),
                w = hill1.width,
                h = hill1.height;

            var imgData = imgCtx.getImageData(0, 0, w, h);

            var time0 = new Date().getTime();
            for (var i = 0; i < n; i++) {
                bgCtx.drawImage(hill1, 0, 0);
            };

            var time1 = new Date().getTime();
            console.log('draw image :', time1 - time0);

            for (var i = 0; i < n; i++) {
                bgCtx.drawImage(imgCanvas, 0, 0);
            };

            var time2 = new Date().getTime();
            console.log('draw canvas :', time2 - time1);

            for (var i = 0; i < n; i++) {
                imgCtx.getImageData(0, 0, w, h);
            };
            var time3 = new Date().getTime();
            console.log('getImageData :', time3 - time2);

            for (var i = 0; i < n; i++) {
                bgCtx.putImageData(imgData, 0, 0);
            };
            var time4 = new Date().getTime();
            console.log('putImageData :', time4 - time2);
        },
        onLoad: function(imgs) {
            var sky = imgs.sky;
            var ground = imgs.ground;
            var hill = imgs.hill;
            var hill1 = imgs.hill1;
            var player = imgs.player;
            this.hill1 = hill1;
            // var skyHeight = bg.height - ground.height;
            // bgCtx.drawImage(sky, 0, 0, sky.width, sky.height, 0, 0, bg.width, skyHeight);
            // var hillX = ((bg.width - hill.width) * Math.random()) | 0;
            // var hill1X = ((bg.width - hill1.width) * Math.random()) | 0;
            // bgCtx.drawImage(hill, 0, 0, hill.width, hill.height, hillX, skyHeight - hill.height * 3, hill.width * 2, hill.height * 3);
            // bgCtx.drawImage(hill1, 0, 0, hill1.width, hill1.height, hill1X, skyHeight - hill1.height * 3, hill1.width * 2, hill1.height * 3);
            // bgCtx.drawImage(ground, 0, 0, ground.width, ground.height, 0, skyHeight, bg.width, ground.height);
            // //
            // mainCtx.drawImage(player, 0, 0, 50, 65, 0, skyHeight - player.height, 50, 65);

            //
            this.performanceTest(hill1);
        },
        init: function() {
            this.loadImg([{
                src: "img/sky.png",
                id: "sky"
            }, {
                src: "img/ground.png",
                id: "ground"
            }, {
                src: "img/parallaxHill1.png",
                id: "hill"
            }, {
                src: "img/parallaxHill2.png",
                id: "hill1"
            }], this.onLoad, this);
        },
        loadImg: function(imgs, callback, context) {
            if (!imgs || imgs.length === 0) {
                return;
            }
            var _loadedImg = {},
                _left = imgs.length,
                l = imgs.length,
                img;
            for (var i = 0; i < l; i++) {
                img = imgs[i];
                var imgNode = new Image();
                imgNode.onload = _onImgLoad;
                imgNode.id = img.id;
                imgNode.src = img.src;
            };

            function _onImgLoad() {
                _loadedImg[this.id] = this;
                _left--;
                0 === _left && callback && callback.call(context, _loadedImg);
            }

            function _onErr() {
                _left--;
                0 === _left && callback && callback.call(context, _loadedImg);
            }

        }
    };
    Game.init();

    return Game;
});