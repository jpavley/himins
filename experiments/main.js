/**
 * @fileOverview Experiment with event based player object
 * @module
 * @requires events
 * @requires colors
 * @requires bunyan
 */

var events = require('events');
var colors = require('colors');
var bunyan = require('bunyan');

var log = bunyan.createLogger({
        name: 'himins_experiment',
        streams: [{
            path: 'himins_experiment.log',
            level: 'info'
        }],
    });

Player.prototype = events.EventEmitter.prototype;

/**
 * @class
 * @classdesc A player is an character controlled by a client (i.e. a human)
 */
function Player() {

    /**
      * The user visible name of the player object, should be unique
      * @type String
      * @default "noname"
      */
    this.name = 'noname';

    /**
      * The amount of health a player has
      * @type Number
      * @default 0
      */
    this.healthPoints = 0;

    /**
      * Message emitted if health points have changed
      * @type String
      * @default "healthPointsChanged"
      * @readonly
      */
    this.healthPointsChanged = 'healthPointsChanged';

    log.info('Instance of player ' + this.name + ' object created');

    events.EventEmitter.call(this);

    /**
     * Restores player health
     * @param {number} points
     * @this Player
     */
    this.heal = function(points) {
        this.healthPoints += points;
        this.emit(this.healthPointsChanged);
    };

    /**
     * Reduces player health
     * @param {number} points
     * @this Player
     */
    this.hurt = function(points) {
        this.healthPoints -= points;
        this.emit(this.healthPointsChanged);
    };
}
module.exports.Player = Player;

/**
 * Outputs a message about players healthpoints
 * @this Player
 * @example
 * player1.on(player1.healthPointsChanged, main.displayHealthPoints);
 */
function displayHealthPoints() {
    //console.log("Player %s HP: %d", this.name, this.healthPoints);
    log.info('Player %s HP: %d', this.name, this.healthPoints);
}
module.exports.displayHealthPoints = displayHealthPoints;

/**
 * Outputs a message if the player is dead.
 * @this Player
 * @example
 * // Attaches checkDead() to healthPointsChanged event
 * player1.on(player1.healthPointsChanged, main.checkDead);
 */
function checkDead() {
    if (this.healthPoints < 0) {
        //console.log("Player %s is dead!!!".red.bold, this.name);
        log.info('Player %s is dead!!!', this.name);
    }
}
module.exports.checkDead = checkDead;

/**
 * Outputs a message if the player hits a health related goal
 * @param {object} player The player object to attach this goal to
 * @param {number} lowGoal lower limit that triggers a message
 * @param {number} highGoal upper limit that triggers a message
 * @example
 * player1.on("healthPointsChanged", function() {
 *    main.checkHealthGoal(this, lowGoal, highGoal);
 * });
 */
function checkHealthGoal(player, lowGoal, highGoal) {
    if (player.healthPoints < lowGoal && player.healthPoints >= 0) {
        //console.log("Player %s is weak!".yellow.bold, player.name);
        log.info('Player %s is weak!', player.name);
    }
    if (player.healthPoints > highGoal) {
        //console.log("Player %s is energized!".green.bold, player.name);
        log.info('Player %s is energized!', player.name);
    }
}
module.exports.checkHealthGoal = checkHealthGoal;
