var colorPartners = [
	["#1abc9c", "#16a085"],
	["#2ecc71", "#27ae60"],
	["#3498db", "#2980b9"],
	["#9b59b6", "#8e44ad"],
	["#34495e", "#2c3e50"],
	["#f1c40f", "#f39c12"],
	["#e67e22", "#d35400"],
	["#e74c3c", "#c0392b"],
	["#ecf0f1", "#bdc3c7"],
	["#95a5a6", "#7f8c8d"]
]; // http://flatuicolors.com/

var pick = Crafty.math.randomInt(0, colorPartners.length - 1);
document.body.style.backgroundColor = colorPartners[pick][0];
document.getElementById("footer").style.backgroundColor = colorPartners[pick][1];
document.getElementById("stuff").style.borderColor = colorPartners[pick][1];

// hello my name is randomFlatBackground. I set a random flat-UI background because why not?