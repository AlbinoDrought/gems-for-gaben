Globals = {
	// this stuff is all changeable. don't change it
	gemLow: 1,
	gemHigh: 3,
	mapHeight: 12,
	mapWidth: 12,
	particlesEnabled: true,
	soundEnabled: true,
	gridMap: new Array(),
	difficulty: 2,
	fallSpeed: 200,
	gameMode: false,
	movesMax: 30
}

initializeGlobals = function() {
	Globals.gridMap = new Array(Globals.mapWidth);
	for(var x = 0; x < Globals.mapWidth; x++)
	{
		Globals.gridMap[x] = new Array(Globals.mapHeight);
	}
}