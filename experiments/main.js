/**
 * Experiment with event based player object
 * @module experiments/main
 */

var events = require('events');
var colors = require('colors');

/**
 * A player is an character controlled by a client (i.e. a human)
 * @class Player
 */

Player.prototype = events.EventEmitter.prototype;

function Player() {

	// properties

	this.name = "noname";
	this.healthPoints = 0;
	events.EventEmitter.call(this);

	/**
	 * Restores player health
	 * @name heal
	 * @function
	 */

	this.heal = function(points) {
		this.healthPoints += points;
		this.emit('healthPointsChanged');
	};

	/**
	 * Reduces player health
	 * @name hurt
	 * @function
	 */

	this.hurt = function(points) {
		this.healthPoints -= points;
		this.emit('healthPointsChanged');		
	};
}

module.exports.Player = Player;

// player handlers

/**
 * Outputs a message about players healthpoints
 */
function displayHealthPoints() {
	console.log("Player %s HP: %d", this.name, this.healthPoints);
}

module.exports.displayHealthPoints = displayHealthPoints;

/**
 * Outputs a message if the player is dead
 */
function checkDead() {
	if(this.healthPoints < 0 ) {
		console.log("Player %s is dead!!!".red.bold, this.name);
	}
}

module.exports.checkDead = checkDead;

/**
 * Outputs a message if the player hits a health related goal
 * @param player
 * @param lowGoal
 * @param highGoal
 */
function checkHealthGoal(player, lowGoal, highGoal) {
	if (player.healthPoints < lowGoal && player.healthPoints >= 0) {
		console.log("Player %s is weak!".yellow.bold, player.name);
	}
	if (player.healthPoints > highGoal) {
		console.log("Player %s is energized!".green.bold, player.name);
	}
}

module.exports.checkHealthGoal = checkHealthGoal;