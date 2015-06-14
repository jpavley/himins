var events = require('events');

// player definition

Player.prototype = events.EventEmitter.prototype;

function Player() {

	// properties

	this.name = "Someone"
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

// player handlers

function displayHealthPoints() {
	console.log("Player %s HP: %d", this.name, this.healthPoints);
}

function checkDead() {
	if(this.healthPoints < 0 ) {
		console.log("Player %s is dead!!!", this.name);
	}
}

function checkHealthGoal(player, lowGoal, highGoal) {
	if (player.healthPoints < lowGoal && player.healthPoints >= 0) {
		console.log("Player %s is weak!", this.name);
	}
	if (player.healthPoints > highGoal) {
		console.log("Player %s is energized!", this.name);
	}
}

// player 1 implementation

var player1 = new Player();
player1.on("healthPointsChanged", displayHealthPoints);
player1.on("healthPointsChanged", checkDead);
player1.on("healthPointsChanged", function() {
	checkHealthGoal(this, 10, 110);
});

// player tests

player1.heal(5);
player1.heal(20);
player1.heal(50);
player1.heal(30);
player1.hurt(40);
player1.heal(50);
player1.hurt(200);

