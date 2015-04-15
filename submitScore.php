<?php
	$name = htmlspecialchars($_GET["name"]);
	$score = htmlspecialchars($_GET["score"]);
	$difficulty = htmlspecialchars($_GET["difficulty"]);
	$gamemode = htmlspecialchars($_GET["gamemode"]);
	
	$db = new PDO('mysql:dbname=GemsForGaben;host=127.0.0.1;charset=utf8', 'GemsForGaben', 'PraiseGaben');
	$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
	$query = $db->prepare('INSERT INTO Highscore (sName, sScore, sDifficulty, sGameMode) VALUES (:name, :score, :difficulty, :gamemode)');
	$query->execute(
		array(
			name => $name,
			score => $score,
			difficulty => $difficulty,
			gamemode => $gamemode
		)
	);
?>