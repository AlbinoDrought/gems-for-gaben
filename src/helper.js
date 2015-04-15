Crafty.c('Playspace', {
	tileX: null,
	tileY: null,

	init: function() {
		this.attr({
			w: Game.map.tile.width,
			h: Game.map.tile.height
		})
	},
	
	at: function(x, y) {
		if (x === undefined || y === undefined) {
			return { x: this.x / Game.map.tile.width, y: this.y / Game.map.tile.height };
		} else {
			Globals.gridMap[x][y] = this;
			this.tileX = x;
			this.tileY = y;
			var newX = x * Game.map.tile.width;
			var newY = y * Game.map.tile.height;
			this.attr({ x: newX, y: newY });
			return this;
		}
	},
	
	// sets x and y in tilePos without setting tileX, tileY, map pos
	hackAt: function(x, y) {
		var newX = x * Game.map.tile.width;
		var newY = y * Game.map.tile.height;
		this.attr({ x: newX, y: newY });
		return this;
	},
});

Crafty.c('Selector', {
	init: function() {
		this.requires('2D, Canvas, selector');
		this.bind('GemMouseDown', this.OnMouseDown);
		this.bind('GemMouseUp', this.OnMouseUp);
		this.z = 80088008;
		this.visible = false;
	},
	
	OnMouseUp: function(e) {
		this.visible = false;
	},
	
	OnMouseDown: function(e) {
		if(!Game.isBusy)
		{
			this.visible = true;
			this.x = e.x;
			this.y = e.y;
		}
	},
});

Crafty.c('HotSelector', {
	tileX: 0,
	tileY: 0,

	init: function() {
		this.requires('2D, Canvas, hotselector');
		this.visible = false;
		this.bind('GemMouseDown', this.OnMouseDown);
		this.bind('GemMouseUp', this.OnMouseUp);
		this.z = 69696969;
	},
	
	OnMouseUp: function(e) {
		this.visible = false;
		this.unbind('MouseMove', this.OnMouseMove);
	},
	
	OnMouseDown: function(e) {
		this.x = e.x;
		this.y = e.y;
		this.bind('MouseMove', this.OnMouseMove);
	},
	
	OnMouseMove: function(t) {
		if(t.x == Game.SelectorEnt.x && t.y == Game.SelectorEnt.y)
		{
			this.tileX = null;
			this.tileY = null;
			this.visible = false;
			return;
		}
		if(Game.isBusy)
		{
			return;
		}
		var newX = Game.SelectorEnt.x;
		var newY = Game.SelectorEnt.y;
		var xDif = newX - t.x;
		var yDif = newY - t.y;
		
		if(Math.abs(xDif) > Math.abs(yDif))
		{
			if(xDif > 0)
			{
				newX -= Game.map.tile.width;
			}
			else
			{
				newX += Game.map.tile.width;
			}
		}
		else
		{
			if(yDif < 0)
			{
				newY += Game.map.tile.height;
			}
			else
			{
				newY -= Game.map.tile.height;
			}
		}
		
		this.tileX = newX / Game.map.tile.width;
		this.tileY = newY / Game.map.tile.height;
		this.x = newX;
		this.y = newY;
		this.visible = true;
	},
});

Crafty.c('Gem', {
	gemColor: null,
	isPowerup: false,

	init: function() {
		this.requires('2D, Canvas, Playspace, GemDrag, Tween');
	},
	
	setGemColor: function(color, powerup) {
		this.gemColor = color;
		if(powerup)
		{
			this.isPowerup = true;
			color = color + "p";
		}
		this.requires('gem' + color);
		
		return this;
	},
	
	setPowerup: function(color) {
		this.removeComponent('gem' + color);
		this.requires('gem' + color + 'p');
		this.isPowerup = true;
		
		return this;
	},
	
	killSelf: function() {
		Globals.gridMap[this.tileX][this.tileY] = null;
		this.visible = false;
		this.x = -100;
		this.y = -100;
		this.destroy();
	},
});

Crafty.c('GemDrag', {
	_downPos: null,
	_upPos: null,

	init: function() {
		this.requires('Mouse');
		this.startErUp();
	},
	
	_onDown: function(e) {
		if (e.mouseButton !== Crafty.mouseButtons.LEFT || Game.isBusy)
		{
			return;
		}
		_downPos = Crafty.DOM.translate(e.clientX, e.clientY);
		Crafty.addEvent(this, Crafty.stage.elem, 'mouseup', this._onUp);
		Crafty.trigger("GemMouseDown", {x: this.x, y: this.y, ent: this});
	},
	
	_onUp: function(e) {
		if (e.mouseButton !== Crafty.mouseButtons.LEFT)
		{
			return;
		}
		
		Crafty.removeEvent(this, Crafty.stage.elem, 'mouseup', this._onUp);
		if(_downPos == null)
		{
			return;
		}
		
		Crafty.trigger("GemMouseUp", this);
		_upPos = Crafty.DOM.translate(e.clientX, e.clientY);
		var xDif = _upPos.x - _downPos.x;
		var yDif = _upPos.y - _downPos.y;
		if(xDif == 0 && yDif == 0)
		{
			return;
		}
		
		if(!Game.isBusy && Game.HotSelectorEnt.tileX != null)
		{
			Game.GemMouseUp(this);
		}
		_downPos = null;
	},
	
	_onMove: function() {
		if(Game.SelectorEnt.visible)
		{
			Game.HotSelectorEnt.OnMouseMove(this);
		}
	},
	
	startErUp: function() {
		this.bind('MouseDown', this._onDown);
		this.bind('MouseMove', this._onMove);
	},
});

// http://craftyjs.com/api/Particles.html
particleExplosion = function(xx, yy, spectacularity) {
	var options = {
		maxParticles: 12 + (5 * spectacularity),
		size: 17,
		sizeRandom: 4 + (4 * spectacularity),
		speed: 0.5,
		speedRandom: 1.2,
		// Lifespan in frames
		lifeSpan: 29,
		lifeSpanRandom: 7,
		// Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
		angle: 0,
		angleRandom: 360,
		startColour: [255, 255, 255, 1],
		startColourRandom: [255, 255, 255, 0],
		endColour: [200, 200, 200, 0],
		endColourRandom: [60, 60, 60, 0],
		// Only applies when fastMode is off, specifies how sharp the gradients are drawn
		sharpness: 20,
		sharpnessRandom: 10,
		// Random spread from origin
		spread: 15 + (4 * spectacularity),
		// How many frames should this last
		duration: 10,
		// Will draw squares instead of circle gradients
		fastMode: true,
		gravity: { x: 0, y: 0 },
		// sensible values are 0-3
		jitter: 0
	}

	var particleEmitter = Crafty.e("2D,Delay,Canvas,Particles").attr({x: xx, y: yy});
	particleEmitter.particles(options).bind("ParticleEnd", killSelf); // the particles don't actually go away automatically....
}

killSelf = function() {
	this.delay(killSelf2, 400);
}

killSelf2 = function() {
	this.destroy();
}

updateScore = function(score) {
	document.getElementById("score").innerHTML = parseInt(score) + " (x" + parseInt(Game.combo) + ")<br />Moves left: " + (Globals.movesMax - Game.movesTaken);
}
