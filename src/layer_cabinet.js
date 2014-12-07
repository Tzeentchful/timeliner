var Settings = require('./settings'),
	LayerUI = require('./ui/layer_view'),
	Theme = require('./theme');

var FONT = 'tfa fa fa-'; //  fa fa-

var font = require('./font.json');
var dp;

function IconButton(size, icon, tooltip) {
	var button = document.createElement('button');
	button.className = FONT;

	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');

	button.appendChild(canvas);

	this.ctx = ctx;
	this.dom = button;
	this.canvas = canvas;

	var me = this;
	this.size = size;
	

	this.setIcon = function(icon) {
		me.icon = icon;

		var dpr = window.devicePixelRatio;
		var height = size;

		var glyph = font.fonts[icon];

		canvas.height = height * dpr;
		canvas.style.height = height + 'px';

		var scale = height / font.unitsPerEm;
		var width = glyph.advanceWidth * scale;

		canvas.width = width * dpr;
		canvas.style.width = width + 'px';

		ctx.fillStyle = Theme.c;
		me.draw();
	};

	this.onClick = function(e) {
		button.addEventListener('click', e);
	};

	button.addEventListener('mouseover', function() {
		ctx.fillStyle = Theme.d;
		me.draw();

		if (tooltip) dp.fire('status', 'button: ' + tooltip);
	});

	button.addEventListener('mousedown', function() {
		ctx.fillStyle = Theme.b;
		me.draw();
	});

	button.addEventListener('mouseup', function() {
		ctx.fillStyle = Theme.d;
		me.draw();
	});

	button.addEventListener('mouseout', function() {
		ctx.fillStyle = Theme.c;
		me.draw();
	});

	if (icon) this.setIcon(icon);
}

IconButton.prototype.draw = function() {

	if (!this.icon) return;

	var ctx = this.ctx;
	ctx.save();


	
	var glyph = font.fonts[this.icon];

	var height = this.size;
	var dpr = window.devicePixelRatio;
	var scale = height / font.unitsPerEm * dpr;
	var path_commands =  glyph.commands.split(' ');

	ctx.clearRect(0, 0, this.canvas.width * dpr, this.canvas.height * dpr);

	ctx.scale(scale, -scale);

	ctx.translate(0, -font.ascender);
	var i = 0, il = path_commands.length;
	
	ctx.beginPath();
	for (; i < il; i++) {
		var cmds = path_commands[i].split(',');
		var params = cmds.slice(1);

		switch (cmds[0]) {
			case 'M':
				ctx.moveTo.apply(ctx, params);
				break;
			case 'L':
				ctx.lineTo.apply(ctx, params);
				break;
			case 'Q':
				ctx.quadraticCurveTo.apply(ctx, params);
				break;
			case 'C':
				ctx.bezierCurveTo.apply(ctx, params);
				break;
			case 'Z':
				ctx.closePath();
				ctx.fill();
				break;
		}
	}
	ctx.restore();
};

function LayerCabinet(layers, dispatcher) {
	dp = dispatcher;
	var div = document.createElement('div');

	var top = document.createElement('div');
	top.style.cssText = 'margin: 0px; top: 0; left: 0; height: ' + Settings.MARKER_TRACK_HEIGHT + 'px';
	// top.style.textAlign = 'right';

	/*

	var play_button = document.createElement('button');
	// play_button.textContent = 'play';
	play_button.className = FONT + 'play';

	var icon = new IconButton();
	play_button.appendChild(icon.dom);
	icon.draw();
	
	var playing = false;
	play_button.addEventListener('click', function(e) {
		e.preventDefault();
		dispatcher.fire('controls.toggle_play');
		// if (!playing) dispatcher.fire('controls.play');
		// else  dispatcher.fire('controls.pause');
	});

	var stop_button = document.createElement('button');
	// stop_button.textContent = 'stop';
	stop_button.className = FONT + 'stop';
	
	stop_button.addEventListener('click', function() {
		dispatcher.fire('controls.stop');
	});

	var undo_button = document.createElement('button');
	// undo_button.textContent = 'undo';
	undo_button.className = FONT + 'undo';
	undo_button.addEventListener('click', function() {
		dispatcher.fire('controls.undo');
	});

	var redo_button = document.createElement('button');
	// redo_button.textContent = 'redo';
	redo_button.className = FONT + 'repeat';
	redo_button.addEventListener('click', function() {
		dispatcher.fire('controls.redo');
	});

*/
	var play_button = new IconButton(16, 'play', 'play');
	play_button.onClick(function(e) {
		e.preventDefault();
		dispatcher.fire('controls.toggle_play');
	});

	var stop_button = new IconButton(16, 'stop', 'stop');
	stop_button.onClick(function(e) {
		dispatcher.fire('controls.stop');
	});

	var undo_button = new IconButton(16, 'undo', 'undo');
	undo_button.onClick(function() {
		dispatcher.fire('controls.undo');
	});

	var redo_button = new IconButton(16, 'repeat', 'redo');
	redo_button.onClick(function() {
		dispatcher.fire('controls.redo');
	});

	/*
	// Hide or show
	var hide_button = document.createElement('button');
	hide_button.className = FONT + 'eye';
	hide_button.className = FONT + 'eye-slash';
	top.appendChild(hide_button);
	
	// New
	var tmp_button = document.createElement('button');
	tmp_button.className = FONT + 'file';
	top.appendChild(tmp_button);

	// Open
	var tmp_button = document.createElement('button');
	tmp_button.className = FONT + 'folder-open';
	top.appendChild(tmp_button);

	// Save
	var tmp_button = document.createElement('button');
	tmp_button.className = FONT + 'save';
	top.appendChild(tmp_button);

	// Download JSON
	var tmp_button = document.createElement('button');
	tmp_button.className = FONT + 'download';
	top.appendChild(tmp_button);

	// upload json?
	var tmp_button = document.createElement('button');
	tmp_button.className = FONT + 'upload';
	top.appendChild(tmp_button);

	// Add
	var tmp_button = document.createElement('button');
	tmp_button.className = FONT + 'plus';
	top.appendChild(tmp_button);

	// Remove
	var tmp_button = document.createElement('button');
	tmp_button.className = FONT + 'minus';
	top.appendChild(tmp_button);

	// Load from remote server?
	var tmp_button = document.createElement('button');
	tmp_button.className = FONT + 'cloud-download';
	top.appendChild(tmp_button);

	// Save to remote server
	var tmp_button = document.createElement('button');
	tmp_button.className = FONT + 'cloud-upload';
	top.appendChild(tmp_button);

	// Set animation properties
	var tmp_button = document.createElement('button');
	tmp_button.className = FONT + 'edit';
	top.appendChild(tmp_button);

	var tmp_button = document.createElement('button');
	tmp_button.className = FONT + 'inbox';
	top.appendChild(tmp_button);

	var tmp_button = document.createElement('button');
	tmp_button.className = FONT + 'gear';
	top.appendChild(tmp_button);

	var tmp_button = document.createElement('button');
	tmp_button.className = FONT + 'trash';
	top.appendChild(tmp_button);

	// Show List
	var tmp_button = document.createElement('button');
	tmp_button.className = FONT + 'list';
	top.appendChild(tmp_button);

	// Remove
	var tmp_button = document.createElement('button');
	tmp_button.className = FONT + 'remove';
	top.appendChild(tmp_button);

	*/

	var range = document.createElement('input');
	range.type = "range";
	range.min = 1;
	range.value = Settings.time_scale;
	range.max = 600;
	range.step = 1;
	

	var dd = 0;
	range.addEventListener('mousedown', function() {
		dd = 1;
	});

	range.addEventListener('mouseup', function() {
		dd = 0;
		changeRange();
	});

	range.addEventListener('mousemove', function() {
		if (!dd) return;
		changeRange();
	});

	div.appendChild(top);


	
	top.appendChild(undo_button.dom);
	top.appendChild(redo_button.dom);
	top.appendChild(document.createElement('br'));

	
	top.appendChild(play_button.dom);
	top.appendChild(stop_button.dom);
	top.appendChild(range);


	// range.addEventListener('change', changeRange);

	function changeRange() {
		// var v = range.max - range.value;
		var v = range.value;
		dispatcher.fire('update.scale', v);
	}		

	var layer_uis = [];
	this.layers = layer_uis;

	this.setControlStatus = function(v) {
		playing = v;
		if (playing) {
			// play_button.textContent = 'pause';
			// play_button.className = FONT + 'pause';

			play_button.setIcon('pause');
		}
		else {
			// play_button.textContent = 'play';
			// play_button.className = FONT + 'play';
			play_button.setIcon('play');
		}
	};

	this.setState = function(state) {
		layers = state;
		console.log(layer_uis.length, layers);
		var i, layer;
		for (i = 0; i < layers.length; i++) {
			layer = layers[i];

			if (!layer_uis[i]) {
				// new
				var layer_ui = new LayerUI(layer, dispatcher);
				div.appendChild(layer_ui.dom);
				layer_uis.push(layer_ui);
			}

			layer_uis[i].setState(layer);
		}
		// TODO if more uis than layers, remove! / hide
	};

	function repaint(s) {
		var i;

		s = s || 0;
		for (i = 0; i < layer_uis.length; i++) {
			layer_uis[i].setState(layers[i]);
			layer_uis[i].repaint(s);
		}

	}

	this.repaint = repaint;
	this.setState(layers);

	this.dom = div;
}

module.exports = LayerCabinet;