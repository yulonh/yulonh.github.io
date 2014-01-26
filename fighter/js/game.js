define(function(require, exports, module) {
    var utils = require('./utils/utils');
    var Player = require('./player');
    var Keyboard = require('./keyboard');
    var Stage = createjs.Stage;
    var Shape = createjs.Shape;
    var Bitmap = createjs.Bitmap;
    var Sprite = createjs.Sprite;
    var Ticker = createjs.Ticker;
    var Event = createjs.Event;
    var proxy = createjs.proxy;
    var SpriteSheet = createjs.SpriteSheet;
    //utils.debug = true;

    var sky, grant, player, ground, hill, hill2;
    var GravityAcc = 1;

    var KEYCODE_SPACE = 32;
    var KEYCODE_UP = 38;
    var KEYCODE_LEFT = 37;
    var KEYCODE_RIGHT = 39;
    var KEYCODE_W = 87;
    var KEYCODE_A = 65;
    var KEYCODE_D = 68;
    var KEYCODE_DOWN = 83;
    var KEYCODE_R = 82;
    var KEYCODE_G = 71;
    var KEYCODE_J = 74;
    var KEYCODE_H = 72;
    var KEYCODE_K = 75;
    var KEYCODE_L = 76;
    var KEYCODE_I = 73;
    var KEYCODE_U = 85;
    var KEYCODE_O = 79;
    var KEYCODE_P = 80;
    var KEYCODE_Y = 89;
    var KEYCODE_T = 84;

    var Game = {
        loadResources: function() {
            var basePath = "img/";
            loader = new createjs.LoadQueue(false, basePath);
            loader.on("complete", this.onLoadComplete, this);
            loader.loadManifest([{
                src: "player1.png",
                id: "player1"
            }, {
                src: "player2.png",
                id: "player2"
            }, {
                src: "player3.png",
                id: "player4"
            }, {
                src: "sky.png",
                id: "sky"
            }, {
                src: "ground.png",
                id: "ground"
            }, {
                src: "parallaxHill1.png",
                id: "hill"
            }, {
                src: "parallaxHill2.png",
                id: "hill2"
            }]);
        },
        init: function() {
            //加载资源
            this.loadResources();

            this.w = 800;
            this.h = 400;
            var canvas = utils.createCanvas(this.w, this.h);
            document.body.appendChild(canvas);
            var stage = new Stage(canvas);

            this.stage = stage;
        },
        onLoadComplete: function() {
            sky = new Shape();
            sky.graphics.beginBitmapFill(loader.getResult("sky")).drawRect(0, 0, this.w, this.h);

            var groundImg = loader.getResult("ground");
            ground = new Shape();
            ground.graphics.beginBitmapFill(groundImg).drawRect(0, 0, this.w + groundImg.width, groundImg.height);
            ground.tileW = groundImg.width;
            ground.y = this.h - groundImg.height;
            this.ground = ground;

            hill = new Bitmap(loader.getResult("hill"));
            hill.setTransform(Math.random() * this.w, this.h - hill.image.height * 3 - groundImg.height, 3, 3);

            hill2 = new Bitmap(loader.getResult("hill2"));
            hill2.setTransform(Math.random() * this.w, this.h - hill2.image.height * 3 - groundImg.height, 3, 3);

            player = new Player({
                img: loader.getResult("player1"),
                frameOrAnimation: "idle",
                activeArea: {
                    width: this.w,
                    height: ground.y
                },
                animations: {
                    idle: [37, 42, 'idle'],
                    walk: [45, 51, 'walk'],
                    run: [57, 66, 'idle'],
                    jump: [74, 81, 'idle'],
                    somersault: [105, 110, 'idle'], //翻跟斗
                    highSomersault: [83, 91, 'idle'], //高空翻
                    uppercut: [168, 172, 'idle'], // 勾拳
                    punch: [122, 128, 'idle'], //直拳
                    squat: [44, 44, 'idle'], //蹲下
                    block: [8, 22, 'idle'], //格挡
                    kick: [138, 144, 'idle'], //踢
                    hip: [146, 152, 'idle'], //臀击
                    spinKick: [234, 256, 'idle'], //旋风腿
                    shoryuken: [174, 184, 'idle'], //升龙拳
                    dowKick: [211, 214, 'idle'], //下踢
                    bigMove: [235, 305, 'idle'], //大招
                    shockWave0: [319, 331, 'wave0'], //冲击波
                    shockWave1: [438, 457, 'wave1'], //
                    shockWave2: [493, 509, 'wave2'], //
                    shockWave3: [544, 570, 'wave3'],
                    wave0: [308, 318, 'idle'],
                    wave1: [335, 350, 'idle'],
                    wave2: [357, 365, 'idle'],
                    wave3: [573, 594, 'idle'],
                    hurt: [568, 573, 'idle'],
                    knockdown: [584, 592, 'dizziness'], //击倒
                    dizziness: [564, 567, 'idle'], //眩晕
                    tease: [605, 621, 'idle']
                }
            });
            player.framerate = 10;
            var player1 = new Player({
                img: loader.getResult("player2"),
                frameOrAnimation: "idle",
                activeArea: {
                    width: this.w,
                    height: ground.y
                },
                animations: {
                    idle: [0, 8, 'idle'],
                    walk: [17, 24, 'walk'],
                    //,
                    // run: [37, 44, 'idle'],
                    // jump: [165, 171, 'idle'],
                    // somersault: [105, 110, 'idle'], //翻跟斗
                    // highSomersault: [83, 91, 'idle'], //高空翻
                    // uppercut: [203, 210, 'idle'], // 勾拳
                    // punch: [61, 65, 'idle'], //直拳
                    // squat: [131, 132, 'idle'], //蹲下
                    // block: [178, 180, 'idle'], //格挡
                    // kick: [106, 114, 'idle'], //踢
                    // hip: [140, 156, 'idle'], //臀击
                    // spinKick: [251, 254, 'idle'], //旋风腿
                    // shoryuken: [258, 260, 'idle'], //升龙拳
                    // dowKick: [270, 278, 'idle'], //下踢
                    // bigMove: [345, 351, 'idle'], //大招
                    // shockwave0: [241, 249, 'idle'], //冲击波
                    // shockwave1: [357, 369, 'idle'], //
                    // shockwave2: [370, 386, 'idle'], //
                    // shockwave3: [250, 257, 'idle'],
                    hurt: [300, 305, 'idle'],
                    knockdown: [313, 322, 'dizziness'], //击倒
                    dizziness: [327, 330, 'idle'], //眩晕
                    // tease: [605, 621, 'idle']
                }
            });
            player1.framerate = 6;
            player1.x = 600;
            this.stage.addChild(sky, hill, hill2, ground, player, player1);
            this.player1 = player1;
            this.player = player;
            //
            this.bindEvent();

            Keyboard.addEventListener('keydown', player);
            Keyboard.addEventListener('keyup', player);
        },
        bindEvent: function() {
            var w = this.w,
                h = this.h;

            Ticker.timingMode = Ticker.RAF;
            Ticker.addEventListener('tick', proxy(function(e) {
                //跳跃不作检测
                if ('idle' === this.player.currentAnimation ||
                    'jump' === this.player.currentAnimation ||
                    'highSomersault' === this.player.currentAnimation) {
                    return this.stage.update(e);
                }
                //大招特殊处理
                if ('bigMove' === this.player.currentAnimation) {
                    this.player.direction = this.player1.x - this.player.x > 0 ? 1 : -1;
                    this.player.vx = 1.5;
                }
                var bounds = this.player.getBounds();
                var bounds1 = this.player1.getBounds();
                var hitPt = this.player.localToGlobal(-bounds.x, -7);
                hitPt = this.player1.globalToLocal(hitPt.x, hitPt.y);
                var hit = this.player1.hitTest(hitPt.x, hitPt.y);
                //
                if (hit) {
                    if ('run' === this.player.currentAnimation) {
                        this.player.gotoAndPlay('idle');
                    }
                    if ('bigMove' === this.player.currentAnimation) {
                        this.player.x = this.player1.x + (bounds.x + bounds1.x) * this.player.direction;
                    }
                    this.player.vx = 0;
                }
                if ('walk' === this.player.currentAnimation ||
                    'knockdown' === this.player1.currentAnimation ||
                    'hurt' === this.player1.currentAnimation) {
                    return this.stage.update(e);
                }

                var hurtPoints = [
                    [-bounds.x, -bounds.height],
                    [-bounds.x, -bounds.height + 27],
                    [-bounds.x, -bounds.height + 54],
                    [-bounds.x, -5]
                ];
                var hurtType = ({
                    uppercut: 'hurt',
                    punch: 'hurt',
                    kick: 'hurt',
                    hip: 'hurt',
                    spinKick: 'knockdown',
                    shoryuken: 'knockdown',
                    dowKick: 'knockdown',
                    bigMove: 'knockdown',
                    wave0: 'knockdown',
                    wave1: 'knockdown',
                    wave2: 'knockdown',
                    wave3: 'knockdown'
                })[this.player.currentAnimation];
                if (hurtType) {
                    for (var i = 0; i < 4; i++) {
                        var hurtPt = this.player.localToGlobal(hurtPoints[i][0], hurtPoints[i][1]);
                        hurtPt = this.player1.globalToLocal(hurtPt.x, hurtPt.y);
                        //if (('kick' === this.player.currentAnimation || 'shoryuken' === this.player.currentAnimation) ) {}
                        if (this.player1.hitTest(hurtPt.x, hurtPt.y)) {
                            this.player1.direction = -this.player.direction;
                            this.player1.vx = 'hurt' === hurtType ? -2 : -4;
                            // if ('hurt' === this.player1.currentAnimation || 'knockdown' === this.player1.currentAnimation) {
                            //     this.player1.gotoAndPlay('knockdown');
                            // } else {
                            if (-1 !== this.player.currentAnimation.indexOf('wave')) {
                                this.player1.vx = -10;
                            }
                            this.player1.gotoAndPlay(hurtType);
                            // }
                            break;
                        }
                    };
                }
                return this.stage.update(e);
            }, this));

            player.on('animationend', function(e) {
                //每个动作结束都应该停止移动
                this.vx = 0;
            });

            player.on('keydown', function(e) {
                if (this.currentAnimation === 'walk' || this.currentAnimation === 'idle' || this.currentAnimation === 'run')
                    switch (e.keyCode) {
                        case KEYCODE_LEFT:
                        case KEYCODE_A:
                            this.direction = -1;
                            this.gotoAndPlay('run');
                            break;
                        case KEYCODE_RIGHT:
                        case KEYCODE_D:
                            this.direction = 1;
                            this.gotoAndPlay('run');
                            break;
                        case KEYCODE_W:
                        case KEYCODE_UP:
                            this.gotoAndPlay('jump');
                            this.vx = 8;
                            this.vy = -10;
                            this.y -= 40;
                            break;
                        case KEYCODE_DOWN:
                            this.gotoAndPlay('squat');
                            break;
                        case KEYCODE_R:
                            this.gotoAndPlay('run');
                            break;
                        case KEYCODE_G:
                            this.gotoAndPlay('shoryuken');
                            this.vx = 1;
                            break;
                        case KEYCODE_H:
                            this.gotoAndPlay('punch');
                            break;
                        case KEYCODE_K:
                            this.gotoAndPlay('kick');
                            break;
                        case KEYCODE_L:
                            this.gotoAndPlay('dowKick');
                            break;
                        case KEYCODE_J:
                            this.gotoAndPlay('highSomersault');
                            this.vx = 10;
                            this.vy = -15;
                            this.y -= 40;
                            break;
                        case KEYCODE_Y:
                            this.gotoAndPlay('block');
                            break;
                        case KEYCODE_U:
                            this.gotoAndPlay('hip');
                            break;
                        case KEYCODE_I:
                            this.vx = 1.5;
                            this.gotoAndPlay('spinKick');
                            break;
                        case KEYCODE_O:
                            this.gotoAndPlay('shockWave' + Math.floor(Math.random() * 4));
                            break;
                        case KEYCODE_P:
                            this.vx = 5;
                            this.gotoAndPlay('bigMove');
                            break;
                        case KEYCODE_T:
                            this.vx = 5;
                            this.gotoAndPlay('tease');
                            break;
                    }
            }, player);
        }
    };

    Game.init();

    window.Game = Game;
});