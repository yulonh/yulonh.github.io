define(function(require, exports, module) {
	var Stage = createjs.Stage,
		SpriteSheet = createjs.SpriteSheet,
		Sprite = createjs.Sprite,
		Ticker = createjs.Ticker;

	var utils = require('./utils/utils');
	var $ = require('../bootstrap/js/bootstrap');
	var jqueryUI = require('../jquery-ui/js/jquery-ui-1.10.3.custom.min');
	var editor = {
		canvasWrap: $('#canvas_wrap'),
		animWrap: $('#anim_accordion'),
		sprites: {},
		collapseTemplate: $('#anim_template').html(),
		init: function() {
			utils.loadImg([{
				src: "img/player3.png",
				id: "player"
			}, {
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
			this.bindEvent();
		},
		format: function(str, data) {
			if (typeof str === 'string') {
				return str.replace(/\${(\w+)}/g, function(word, key, i, str) {
					return data[key];
				});
			}
		},
		createCollapse: function(title, parent) {
			var uid = 'collapse_' + new Date().getTime();
			var collapseHTML = this.format(this.collapseTemplate, {
				title: title || '',
				parent: parent || '',
				id: uid
			});
			var collapse = $(collapseHTML);
			jqueryUI(collapse.find('input[name="speed"]')[0]).spinner({
				max: 100,
				min: 1,
				create: function(e, ui) {
					$(e.target).val(1);
				},
				spin: $.proxy(function(e, ui) {
					this.updatePreview();
				}, this)
			});

			collapse.find('select[name="next"]').change($.proxy(function(e) {
				this.updatePreview();
			}, this));

			return collapse;
		},
		getSelectedFrameIndex: function() {
			var selectedIndexArray = [];
			$('#canvas_wrap .ui-selected').each(function() {
				selectedIndexArray.push($(this).attr('data-i'));
			});
			return selectedIndexArray;
		},
		getEditingAnimPanel: function() {
			return this.animWrap.find('.panel-collapse.in').parent();
		},
		bindEvent: function() {
			//帧频率
			jqueryUI('#global_speed').spinner({
				max: 100,
				min: 1,
				create: function(e, ui) {
					$(e.target).val(1);
				},
				spin: $.proxy(function() {
					this.updatePreview();
				}, this)
			});
			//帧选择
			jqueryUI('#canvas_wrap').selectable({
				start: function(event, ui) {},
				selecting: function(event, ui) {
					$(ui).addClass('btn-primary');
				},
				selected: function(event, ui) {
					$(ui).addClass('active');
				},
				stop: $.proxy(function(e) {
					var selectedArray = [];
					$(".ui-selected", e.target).each(function() {
						selectedArray.push($(this).attr('data-i'));
					});
					this.updatePreview(selectedArray);
				}, this)
			});

			//添加动画
			$('#add_anim').click($.proxy(function(e) {
				e.preventDefault();
				var animName = $('#anim_name').val().trim();
				if (!animName) {
					return;
				}

				if (this.spriteSheetData.animations[animName]) {
					return;
				}
				this.spriteSheetData.animations[animName] = {};
				var collapse = this.createCollapse(animName, 'anim_accordion');
				this.animWrap.append(collapse);
				this.updateAnimSelect();

				this.spriteSheetData.animations[animName] = {
					frames: [],
					next: collapse.find('selct[name="next"]').val(),
					speed: collapse.find('input[name="speed"]').val()
				};

				this.createPreview(animName, collapse.find('.preview-wrap canvas')[0]);

			}, this));
		},
		updateAnimSelect: function() {
			var options = [];
			for (var anim in this.spriteSheetData.animations) {
				if (this.spriteSheetData.animations.hasOwnProperty(anim)) {
					options.push('<option>' + anim + '</option>');
				}
			};
			$('select[name="next"]').html(options.join('\n'));
		},
		updatePreview: function() {
			var editingPanel = this.getEditingAnimPanel(),
				frames = this.getSelectedFrameIndex();

			if (0 === editingPanel.length) {
				return;
			}

			var animName = editingPanel.find('input[name="name"]').val().trim()
			var sprite = this.sprites[animName];

			if (!sprite) {
				return;
			}

			if ( !! frames) {
				this.spriteSheetData.animations[animName].frames = frames;
			}

			var speed = editingPanel.find('input[name="speed"]').val(),
				next = editingPanel.find('select[name="next"]').val(),
				framerate = $('#global_speed').val();

			this.spriteSheetData.animations[animName].speed = speed;
			this.spriteSheetData.animations[animName].next = next;
			sprite.framerate = framerate;

			sprite.spriteSheet = new SpriteSheet(this.spriteSheetData);
			sprite.gotoAndPlay(animName);
		},
		createPreview: function(animName, canvas) {
			var stage = new Stage(canvas);
			var spriteSheet = new SpriteSheet(this.spriteSheetData);
			var sprite = new Sprite(spriteSheet, animName);
			sprite.x = 50;
			sprite.y = 200;
			sprite.framerate = $('#global_speed').val();
			this.sprites[animName] = sprite;
			stage.addChild(sprite);
			Ticker.addEventListener('tick', stage);
		},
		onLoad: function(imgs) {
			//return;
			this.spriteSheetData = utils.img2SpriteSheet(imgs.player, function(i, rect, rawCanvas) {
				var one = utils.createCanvas(rect[2], rect[3]);
				var oneCtx = one.getContext('2d');
				oneCtx.drawImage(rawCanvas, rect[0], rect[1], rect[2], rect[3], 0, 0, rect[2], rect[3]);
				$(one).addClass('ui-selectee').attr('data-i', i);
				this.canvasWrap.append(one);
			}, {
				minWidth: 40,
				minHeight: 40,
				context: this
			});

			this.spriteSheetData.animations = {};
		}
	};

	return editor;
});