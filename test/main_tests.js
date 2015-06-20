// Tests for experiments/main.js

var assert = require('assert');
var main = require('../experiments/main');

// set up a player

var player1 = new main.Player();
player1.on("healthPointsChanged", main.displayHealthPoints);
player1.on("healthPointsChanged", main.checkDead);
player1.on("healthPointsChanged", function() {
	main.checkHealthGoal(this, 10, 110);
});

describe('create and configure player', function() {
	it('player should not be null', function() {
		assert.notEqual(player1, null);
		assert.equal(player1.name, "noname");
	});
	it('player.name should be noname', function() {
		assert.equal(player1.name, "noname");
	});
	it('player.healthPoints should be 0', function() {
		assert.equal(player1.healthPoints, 0);
	});
});

describe("change player health", function() {
	var randHealthValueRange1to100 = Math.floor(Math.random() * 100) + 1;

	describe("#heal()", function() {
		player1.heal(randHealthValueRange1to100);

		it('player.healthPoints should be ' + randHealthValueRange1to100, function() {
			assert.equal(player1.healthPoints, randHealthValueRange1to100);
		});
	});

	describe("#hurt()", function() {
		player1.hurt(randHealthValueRange1to100);
		it('player.healthPoints should be ' + 0, function() {
			assert.equal(player1.healthPoints, 0);
		});
	});
});



// player1.heal(5);
// player1.heal(20);
// player1.heal(50);
// player1.heal(30);
// player1.hurt(40);
// player1.heal(50);
// player1.hurt(200);