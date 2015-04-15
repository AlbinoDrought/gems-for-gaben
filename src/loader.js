Loader = {
	// hello I am a loader and I load things
	load: function() {
		initializeGlobals();
		$("#scoreSubmitContainer").slideUp("fast");
		//Crafty.mobile = false;
		Crafty.init(Game.width(), Game.height(), 'game');
		
		Crafty.scene('main', function() {
			Game.start();
		});
		
		// load all sprites into memory, and then load into crafty, and then start the game
		Crafty.scene('loading', function() {
			Crafty.background('#000');
			Crafty.paths({ sprites : "assets/" });
			
			Crafty.audio.add({
				"gmae": [
					"assets/gmae.wav",
					"assets/gmae.mp3",
					"assets/gmae.ogg"
				],
				"gmae2": [
					"assets/gmae2.wav",
					"assets/gmae2.mp3",
					"assets/gmae2.ogg"
				],
				"gmae3": [
					"assets/gmae3.wav",
					"assets/gmae3.mp3",
					"assets/gmae3.ogg"
				],
				"decline": [
					"assets/Decline.wav",
					"assets/Decline.mp3",
					"assets/Decline.ogg"
				]
			});
			
			Crafty.load({
				"sprites": {
					"gems" : ['blue.png', 'green.png', 'purple.png', 'red.png', 'yellow.png', 'white.png'],
					"glossyGems" : ['blueP.png', 'greenP.png', 'purpleP.png', 'redP.png', 'yellowP.png', 'whiteP.png'],
					"other" : ['selector.png', 'hotselector.png', 'star.png']
				}
			}, function() {
				Crafty.sprite(32, 'assets/blue.png', {gem1:[0,0]});
				Crafty.sprite(32, 'assets/red.png', {gem2:[0,0]});
				Crafty.sprite(32, 'assets/green.png', {gem3:[0,0]});
				Crafty.sprite(32, 'assets/purple.png', {gem4:[0,0]});
				Crafty.sprite(32, 'assets/white.png', {gem6:[0,0]});
				Crafty.sprite(32, 'assets/yellow.png', {gem5:[0,0]});
				
				Crafty.sprite(32, 'assets/blueP.png', {gem1p:[0,0]});
				Crafty.sprite(32, 'assets/redP.png', {gem2p:[0,0]});
				Crafty.sprite(32, 'assets/greenP.png', {gem3p:[0,0]});
				Crafty.sprite(32, 'assets/purpleP.png', {gem4p:[0,0]});
				Crafty.sprite(32, 'assets/whiteP.png', {gem6p:[0,0]});
				Crafty.sprite(32, 'assets/yellowP.png', {gem5p:[0,0]});
				
				Crafty.sprite(32, 'assets/selector.png', {selector:[0,0]});
				Crafty.sprite(32, 'assets/hotselector.png', {hotselector:[0,0]});
				Crafty.scene('main'); // goto main when done loading
			});

			
		});
		
		Crafty.scene('loading');
	}
}