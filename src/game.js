Game = {
	
	isBusy: false,
	activeGems: [],
	combo: 0,
	activeFallGemsCount: 0,
	score: 0,
	delayEnt: 0,
	fallColumns: [],
	movesTaken: 0,
	
	map: {
		width: Globals.mapWidth,
		height: Globals.mapHeight,
		tile: {
			width: 36,
			height: 36
		}
	},
	
	SelectorEnt: null,
	HotSelectorEnt: null,
	
	width: function() {
		return this.map.width * this.map.tile.width;
	},
	
	height: function() {
		return this.map.height * this.map.tile.height;
	},
	
	start:  function() {
		Crafty.background('#000');
		Game.isBusy = false;
		Game.combo = 0;
		Game.activeFallGemsCount = 0;
		Game.score = 0;
		Game.activeGems = [];
		Game.fallColumns = [];
		Game.delayEnt = Crafty.e("Delay");
		Game.movesTaken = 0;
		
		updateScore(0);
		
		var difficulty = Globals.difficulty;
		if(difficulty != null)
		{
			difficulty = parseInt(difficulty);
			// max +3, min +0
			Globals.gemHigh = 3 + Math.max(0, Math.min(difficulty, 3));
		}
		
		// initialize board with random gems
		for (var x = 0; x < Game.map.width; x++)
		{
			for (var y = 0; y < Game.map.height; y++)
			{
				var cont = true;
				while(cont)
				{
					var type = Crafty.math.randomInt(Globals.gemLow, Globals.gemHigh);
					if(this.checkMatches(x, y, type).length < 2)
					{ // if there are no matches, this gem is ok
						cont = false;
					}
				}
				
				var makeItAPowerup = Crafty.math.randomInt(1, 20) > 17;
				
				var gem = Crafty.e('Gem').setGemColor(type, makeItAPowerup).at(x, y);
				
				Globals.gridMap[x][y] = gem;
			}
		}
		this.SelectorEnt = Crafty.e('Selector');
		this.HotSelectorEnt = Crafty.e('HotSelector');
	},

	GemMouseUp: function(gem) {
		// hot selector ent is at the wanted position
		// selector ent and gem are at current position
		
		// first, move gem.
		
		// somehow this is getting called with the wrong tile... wat
		if(!Game.isBusy)
		{
			var newX = this.HotSelectorEnt.tileX;
			var newY = this.HotSelectorEnt.tileY;
			this.HotSelectorEnt.tileX = null;
			this.HotSelectorEnt.tileY = null;
			var oldX = gem.tileX;
			var oldY = gem.tileY;
			
			var dist = Crafty.math.distance(oldX, oldY, newX, newY);
			if(dist != 1)
			{
				console.log("something is wonky, skipping swap");
				return;
			}
			
			if(newX == oldX && newY == oldY)
			{
				console.log("attempted same-place swap");
				return;
			}
			
			Game.isBusy = true;
			Game.combo = 0;
			this.swapGemPositions(oldX, oldY, newX, newY);
		}
	},
	
	// called to swap gems
	swapGemPositions: function(x1, y1, x2, y2) {
		var ent1 = Globals.gridMap[x1][y1];
		var ent2 = Globals.gridMap[x2][y2];
		if(ent1 === null || ent2 === null)
		{
			Game.isBusy = false;
			return;
		}
		
		this.activeGems[0] = ent1;
		this.activeGems[1] = ent2;
		
		ent1.tween({x: ent2.x, y: ent2.y}, 200);
		ent2.tween({x: ent1.x, y: ent1.y}, 200).uniqueBind("TweenEnd", this.swapGemPositionsCallback);
	},
	
	// swaps active gems with eachother
	swapGemPositionsCallback: function() { // scope is no longer game, it is gem. must reference game
		console.log(" ");
		console.log("=======callback");
		var ent1 = Game.activeGems[0];
		var ent2 = Game.activeGems[1];
		ent2.unbind("TweenEnd", Game.swapGemPositionsCallback);
		
		var tileX = ent1.tileX;
		var tileY = ent1.tileY;
		Globals.gridMap[ent2.tileX][ent2.tileY] = null;
		Globals.gridMap[tileX][tileY] = null;
		ent1.at(ent2.tileX, ent2.tileY);
		ent2.at(tileX, tileY);
		console.log("ent1: " + ent2.tileX + "," + ent2.tileY);
		console.log("ent2: " + ent2.tileX + "," + ent2.tileY);
		
		var ent1Matches = Game.checkMatches(ent1.tileX, ent1.tileY, ent1.gemColor);
		console.log("ent1 matches: " + ent1Matches.length);
		var ent2Matches = Game.checkMatches(ent2.tileX, ent2.tileY, ent2.gemColor);
		console.log("ent2 matches: " + ent2Matches.length);
		var flag = false;
		
		// determine which columns to fall, do not add to list if it is already in list
		var fallColumns = [];
		if (ent1Matches.length > 1)
		{
			flag = true;
			ent1Matches.push(ent1);
			fallColumns = Game.clearMatches(ent1Matches);
		}
		if (ent2Matches.length > 1)
		{
			flag = true;
			ent2Matches.push(ent2);
			var ent2Fall = Game.clearMatches(ent2Matches);
			for(var i = 0; i < ent2Fall.length; i++)
			{
				if(fallColumns.indexOf(ent2Fall[i]) < 0 || fallColumns.length == 0)
				{
					fallColumns.push(ent2Fall[i]);
				}
			}
		}
		
		if(flag)
		{ // there are matches
			Game.playBreakSound();
			console.log("refall");
			console.log(fallColumns);
			Game.movesTaken++;
			updateScore(Game.score);
			if(Globals.gameMode)
			{
				Game.fallMatches(fallColumns);
			}
			else
			{
				Game.delayEnt.delay(function() { Game.fallMatches(fallColumns); }, Globals.fallSpeed);
			}
		}
		else
		{ // swap failed, tween back and undo -> swapGemFailedCallback
			Crafty.audio.play("decline");
			ent1.tween({x: ent2.x, y: ent2.y}, 200);
			ent2.tween({x: ent1.x, y: ent1.y}, 200).uniqueBind("TweenEnd", Game.swapGemFailedCallback);
		}
	},
	
	// called when a failed swap is finished, sets new gem positions
	swapGemFailedCallback: function() {
		console.log(" ");
		console.log("=======callback (Swap Failed)");
		var ent1 = Game.activeGems[0];
		var ent2 = Game.activeGems[1];
		ent2.unbind("TweenEnd", Game.swapGemFailedCallback);
		
		var tileX = ent1.tileX;
		var tileY = ent1.tileY;
		ent1.at(ent2.tileX, ent2.tileY);
		ent2.at(tileX, tileY);
		
		Game.isBusy = false;
	},
	
	// kills given gems
	clearMatches: function(matches) {
		var fallColumns = [];
		console.log("Cleared");
		console.log(matches);
		for(var i = 0; i < matches.length; i++)
		{
			if(fallColumns.indexOf(matches[i].tileX) < 0)
			{
				fallColumns.push(matches[i].tileX);
			}
			if(Globals.particlesEnabled)
			{
				// capped at 5 so there aren't huge explosions everywhere
				particleExplosion(matches[i].x, matches[i].y, Math.min(matches.length - 2, 5));
			}
			if(matches[i].isPowerup)
			{
				Game.score += 100;
				Game.combo += 3;
				if(Globals.particlesEnabled)
				{
					particleExplosion(matches[i].x, matches[i].y, 10);
				}
			}
			matches[i].killSelf();
			Game.combo += 1/3;
		}
		Game.score += matches.length * (Game.combo);
		updateScore(Game.score);
		return fallColumns;
	},
	
	fallMatches: function(fallColumns) {
		// push down gems in these columns
		if(fallColumns.length > 0)
		{
			Game.activeFallGemsCount = 0;
			for(var i = 0; i < fallColumns.length; i++)
			{
				var x = fallColumns[i];
				var gemNum = 1; // number of newly-generated gems, so they do not stack incorrectly
				var gems = 0;
				// go from bottom to top
				for(var y = Globals.mapHeight - 1; y >= 0; y--)
				{
					var ent = Globals.gridMap[x][y];
					if(ent == null) 
					{ // x,y is empty
						var newGem = Game.getGemToFall(x, y, gemNum);
						if(newGem.tileX == null)
						{ // gem is new, increase gem num
							gemNum++;
						}
						else
						{ // clear newGem's spot on the map
							Globals.gridMap[newGem.tileX][newGem.tileY] = null;
						}
						newGem.tileX = x;
						newGem.tileY = y;
						newGem.tween({x: x * Game.map.tile.width, y: y * Game.map.tile.width}, Globals.fallSpeed + (40 * gems) + (50 * gemNum)).uniqueBind("TweenEnd", Game.gemFallCallback);
						Game.activeFallGemsCount++;
						gems++;
					}
				}
			}
		}
	},
	
	gemFallCallback: function() {
		this.at(this.tileX, this.tileY);
		Game.activeFallGemsCount--;
		//Game.isBusy = true;
		if(Game.activeFallGemsCount == 0)
		{
			Game.gemsFinishedFalling();
		}
	},
	
	gemsFinishedFalling: function() {
		console.log("Finished Falling in");
		// check whole board for any matches
		Game.checkBoard();
		//Game.isBusy = false;
	},
	
	checkBoard: function() {
		//Game.isBusy = true;
		for(var x = 0; x < Globals.mapWidth; x++)
		{
			for(var y = 0; y < Globals.mapHeight; y++)
			{
				var ent = Globals.gridMap[x][y];
				if(ent != null)
				{
					var matches = Game.checkMatches(ent.tileX, ent.tileY, ent.gemColor);
					if(matches.length > 1)
					{
						//add self to matches
						matches.push(ent);
						Game.playBreakSound();
						var fallColumns = Game.clearMatches(matches);
						if(Globals.gameMode)
						{
							Game.fallMatches(fallColumns);
						}
						else
						{
							for(var i = 0; i < fallColumns.length; i++)
							{
								if(Game.fallColumns.indexOf(fallColumns[i]) < 0)
								{
									console.log("pushed");
									Game.fallColumns.push(fallColumns[i]);
								}
							}
							// todo: clear all matches before falling (with delay)
							Game.delayEnt.delay(function() { Game.checkBoard(); }, Globals.fallSpeed * 2);
						}
						return;
					}
				}
			}
		}
		if(Globals.gameMode)
		{
			Game.setGameFree();
		}
		else
		{
			if(Game.fallColumns.length > 0)
			{
				Game.fallMatches(Game.fallColumns);
				Game.fallColumns = [];
				//Game.isBusy = true;
			}
			else
			{
				Game.setGameFree();
			}
		}
		
		
	},
	
	setGameFree: function() {
		if(Globals.movesMax - Game.movesTaken > 0)
		{ // have moves left
			Game.isBusy = false;
		}
		else
		{
			$("#scoreSubmitContainer").slideToggle("fast");
			alert("You are now out of moves. You can submit your score on the bottom of the page");
		}
	},
	
	getGemToFall: function(column, startY, gemNumber) {
		// go up from current position (y--)
		// find gem
		// if go out of map, make gem
		// return gem
		var cont = true;
		var curY = startY;
		while(cont)
		{
			curY--;
			if(curY < 0)
			{
				// make new gem
				var makeItAPowerup = Crafty.math.randomInt(1, 20) > 17;
				return Crafty.e("Gem").setGemColor(Crafty.math.randomInt(Globals.gemLow, Globals.gemHigh), makeItAPowerup).hackAt(column, -gemNumber);
			}
			else if(Globals.gridMap[column][curY] != null)
			{
				var ent = Globals.gridMap[column][curY];
				return ent;
			}
		}
	},
	
	checkMatches: function(curX, curY, gemColor) {
		var matchesX = [];
		var matchesY = [];
		
		matchesX = matchesX.concat(Game.checkMatchesInDir(curX, curY, 1, 0, gemColor));
		matchesY = matchesY.concat(Game.checkMatchesInDir(curX, curY, 0, 1, gemColor));
		matchesX = matchesX.concat(Game.checkMatchesInDir(curX, curY, -1, 0, gemColor));
		matchesY = matchesY.concat(Game.checkMatchesInDir(curX, curY, 0, -1, gemColor));
		
		var matches = [];
		// each direction much match at least 2 total (= 3 in a row)
		// split x and y so you cannot have corner-like shape
		if(matchesX.length > 1)
		{
			matches = matches.concat(matchesX);
		}
		if(matchesY.length > 1)
		{
			matches = matches.concat(matchesY);
		}
		
		return matches;
	},
	
	checkMatchesInDir: function(x, y, xDir, yDir, color) {
		var cont = true;
		var matches = [];
		var curX = x;
		var curY = y;
		
		while(cont)
		{
			curX += xDir;
			curY += yDir;
			
			if(curX < 0 || curY < 0 || curX >= Globals.mapWidth || curY >= Globals.mapHeight || 
			Globals.gridMap[curX][curY] == null || 
			Globals.gridMap[curX][curY].gemColor != color)
			{
				// no match or edge or no tile, stop
				cont = false;
			}
			else
			{
				// match found, continue
				matches.push(Globals.gridMap[curX][curY]);
			}
		}
		
		return matches;
	},
	
	playBreakSound: function() {
		//Crafty.audio.play("gmae");
		if(Globals.soundEnabled)
		{
			if(Game.combo < 5)
			{
				Crafty.audio.play("gmae", 1, 0.5);
			}
			else if(Game.combo < 10)
			{
				Crafty.audio.play("gmae2", 1, 0.7);
			}
			else
			{
				Crafty.audio.play("gmae3");
			}
		}
	},
}