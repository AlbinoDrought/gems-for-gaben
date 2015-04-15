<html>
	<head>
		<title>Leaderboards</title>
		<link rel="stylesheet" type="text/css" href="leaderboards.css">
	</head>
	
	<body>
		<div class="datagrid" style="width: 500px; margin: auto;">
			<table>
				<thead>
					<th>Name</th><th>Score</th>
				</thead>
				<?php
					$difficulty = htmlspecialchars($_GET["difficulty"]);
					$pdo = new PDO('mysql:dbname=GemsForGaben;host=127.0.0.1', 'GemsForGaben', 'PraiseGaben');
					
					$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
					try 
					{
						$query = "SELECT sName, sScore FROM Highscore WHERE sDifficulty = :diff ORDER BY sScore DESC";
						$result = $pdo->prepare($query);
						$result->bindParam(':diff', $difficulty);
						$result->execute();
						while ($row = $result->fetch()) 
						{
							echo '<tr><td>';
							echo $row['sName'];
							echo '</td><td>';
							echo $row['sScore'];
							echo '</td></tr>';
						}

						$db_connection = null;
					} catch (PDOException $e) {
						echo $e->getMessage();
					}
				?>
			</table>
		</div>
		<div style="width: 500px; margin: auto;">
			Difficulty Level:<br />
			<a href="leaderboards.php?difficulty=0">Baby Mode</a><br />
			<a href="leaderboards.php?difficulty=1">Simple</a><br />
			<a href="leaderboards.php?difficulty=2">Trying</a><br />
			<a href="leaderboards.php?difficulty=3">Formidable</a><br /><br />
			<a href="index.html">Go back to the game</a>
		</div>