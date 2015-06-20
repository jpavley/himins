// tests/experiments/main.js

var assert = require('assert');
var main = require('../experiments/main');

var player1 = new main.Player();

player1.on("healthPointsChanged", main.displayHealthPoints);
player1.on("healthPointsChanged", main.checkDead);
player1.on("healthPointsChanged", function() {
	main.checkHealthGoal(this, 10, 110);
});

// player tests

player1.heal(5);
player1.heal(20);
player1.heal(50);
player1.heal(30);
player1.hurt(40);
player1.heal(50);
player1.hurt(200);