define(function(require, exports, module) {
    var utils = require('./utils/utils');
    var Event = createjs.Event;
    var EventDispatcher = createjs.EventDispatcher;
    var proxy = createjs.proxy;
    var GravityAcc = 1;

    function Player(option) {
        if (!option.img) {
            throw 'the img attribute of option must be set!';
        }
        var spriteSheetData = utils.img2SpriteSheet(option.img, function() {}, {
            minWidth: 30,
            minHeight: 30
        });

        spriteSheetData.animations = option.animations || spriteSheetData.animations;

        this.spriteSheet = new createjs.SpriteSheet(spriteSheetData);

        this.initialize(option);

        option.debug && document.body.appendChild(spriteSheetData.images[0]);
    }

    var P = Player.prototype = new createjs.Sprite();
    EventDispatcher.initialize(P);


    P.spriteInitialize = P.initialize;

    P.initialize = function(option) {
        this.spriteInitialize(this.spriteSheet, option.frameOrAnimation);
        this.on('tick', this.tick);
        this.vx = 0;
        this.vy = 0;
        this.direction = 1;
        this.x = 100;
        this.activeArea = option.activeArea;
        this.groundY = option.groundY || 300;
        this.mouseEnabled = true;
    };

    P.tick = function(event) {
        //
        var stage = this.getStage();
        var bounds = this.getBounds(),
            w = this.activeArea.width,
            h = this.activeArea.height,
            x, y;
        //边界限制
        if (this.x + bounds.x < 0)　 {
            this.x = -bounds.x;
        }

        if (this.x - bounds.x > w) {
            this.x = w + bounds.x;
        }
        if (this.y < h) { //在空中
            this.vy += GravityAcc;
        }
        if (this.y > h) {
            this.vy = 0;
            this.y = h;
        }
        //计算速度
        // 速度递减
        this.vx *= 0.95;
        if ('run' === this.currentAnimation) {
            this.vx = 2;
        }
        if (-1 !== this.currentAnimation.indexOf('wave')) {
            this.vx = 10;
        }
        //计算位置
        x = (this.x || 0) + this.vx * this.direction;
        y = this.y + this.vy;

        this.setTransform(x, y, this.direction, 1);
    };

    P._gotoAndPlay = P.gotoAndPlay;
    P.gotoAndPlay = function() {
        if (arguments[0] === this.currentAnimation) {
            return;
        }
        this._gotoAndPlay.apply(this, arguments);
    };

    P.handleEvent = function(e) {
        if (!this.dispatchEvent(e)) {

        }
    };

    return Player;
});