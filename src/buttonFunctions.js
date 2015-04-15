btnChangeDifficulty = function() {
	var e = document.getElementById("ddDifficulty");
	Globals.difficulty = parseInt(e.options[e.selectedIndex].value);
	btnRestart();
}

btnRestart = function() {
	Loader.load();
}

btnOptions = function() {
	$("#options").slideToggle("fast");
}

btnToggleSound = function() {
	Globals.soundEnabled = !Globals.soundEnabled;
}

btnToggleParticles = function() {
	Globals.particlesEnabled = !Globals.particlesEnabled;
}

btnChangeFallSpeed = function() {
	var e = document.getElementById("ddFallSpeed");
	Globals.fallSpeed = parseInt(e.options[e.selectedIndex].value);
}

btnToggleGameMode = function() {
	Globals.gameMode = !Globals.gameMode;
}

btnSubmitScore = function() {
	$("#scoreSubmitContainer").slideToggle("fast");
	var score = Game.score;
	var difficulty = Globals.difficulty;
	var gamemode = Globals.gameMode ? 1 : 0;
	var name = document.getElementById("scoreSubmitName").value;

	AjaxHelper.get("submitScore.php", {name: name, score: score, difficulty: difficulty, gamemode: gamemode}, btnSubmitScoreCallback);
}

btnSubmitScoreCallback = function() {
	alert("Your score has been submitted, and is now featured on the leaderboards.");
}