var events = require('events');
var colors = require('colors');

// player definition

Player.prototype = events.EventEmitter.prototype;

function Player() {

	// properties

	this.name = "noname";
	this.healthPoints = 0;
	events.EventEmitter.call(this);

	// methods

	this.heal = function(points) {
		this.healthPoints += points;
		this.emit('healthPointsChanged');
	};

	this.hurt = function(points) {
		this.healthPoints -= points;
		this.emit('healthPointsChanged');		
	};
}

module.exports.Player = Player;

// player handlers

function displayHealthPoints() {
	console.log("Player %s HP: %d", this.name, this.healthPoints);
}

module.exports.displayHealthPoints = displayHealthPoints;

function checkDead() {
	if(this.healthPoints < 0 ) {
		console.log("Player %s is dead!!!".red.bold, this.name);
	}
}

module.exports.checkDead = checkDead;

function checkHealthGoal(player, lowGoal, highGoal) {
	if (player.healthPoints < lowGoal && player.healthPoints >= 0) {
		console.log("Player %s is weak!".yellow.bold, player.name);
	}
	if (player.healthPoints > highGoal) {
		console.log("Player %s is energized!".green.bold, player.name);
	}
}

module.exports.checkHealthGoal = checkHealthGoal;