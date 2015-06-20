// Tests for experiments/main.js

var assert = require('assert');
var main = require('../experiments/main');

// set up a player

describe('event-based player test', function() {

	var player1 = new main.Player(),
	lowGoal = 10,
	highGoal = 110,
	randHealthValueRange1to100 = Math.floor(Math.random() * 100) + 1;


	before(function() {

		// when healthpoints change display to console
		player1.on("healthPointsChanged", main.displayHealthPoints);

		// when healthpoints change make sure the player is not dead
		player1.on("healthPointsChanged", main.checkDead);

		// when healthpoints changed check the health goal function
		player1.on("healthPointsChanged", function() {
			main.checkHealthGoal(this, lowGoal, highGoal);
		});
	});

	describe('create and configure player', function() {
		it('player should not be null', function() {
			assert.notEqual(player1, null);
		});
		it('player.name should be noname', function() {
			assert.equal(player1.name, "noname");
		});
		it('player.healthPoints should be 0', function() {
			assert.equal(player1.healthPoints, 0);
		});
	});

	describe("change player health", function() {

		describe("#heal()", function() {

			it('player.healthPoints should be ' + randHealthValueRange1to100, function() {
				player1.heal(randHealthValueRange1to100);
				assert.equal(player1.healthPoints, randHealthValueRange1to100);
			});
		});

		describe("#hurt()", function() {

			it('player.healthPoints should be ' + 0, function() {
				player1.hurt(randHealthValueRange1to100);
				assert.equal(player1.healthPoints, 0);
			});
		});
	});
});
