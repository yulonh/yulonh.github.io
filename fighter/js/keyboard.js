define(function(require, exports, module) {
    var EventDispatcher = createjs.EventDispatcher,
        Event = createjs.Event,
        doc = document,
        proxy = createjs.proxy;

    function Keyboard() {
        throw "Keyboard cannot be instantiated.";
    }
    EventDispatcher.initialize(Keyboard);

    Keyboard._addEventListener = Keyboard.addEventListener;

    Keyboard.addEventListener = function() {
        !Keyboard._inited && Keyboard.init();
        return Keyboard._addEventListener.apply(Keyboard, arguments);
    }

    Keyboard.init = function() {
        //键盘事件
        doc.onkeydown = function(e) {
            e = e || window.event;
            var _event = new Event('keydown');
            _event.keyCode = e.keyCode;
            //_event.target = stage;
            Keyboard.dispatchEvent(_event);
        };
        doc.onkeyup = function(e) {
            e = e || window.event;
            var _event = new Event('keyup');
            _event.keyCode = e.keyCode;
            //_event.target = stage;
            Keyboard.dispatchEvent(_event);
        };
    }

    return Keyboard;
});