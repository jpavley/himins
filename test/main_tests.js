/**
 * @fileOverview Tests for experiments/main.js
 * @module
 * @requires assert
 * @requires ../experiments/main
 */

var assert = require('assert');
var main = require('../experiments/main');

// set up a player

describe('event-based player test', function() {

  var player1 = new main.Player(),
  lowGoal = 10,
  highGoal = 110,
  hp1 = 55;
  hp2 = 5;

  before(function() {

    // when healthpoints change display to console
    player1.on('healthPointsChanged', main.displayHealthPoints);

    // when healthpoints change make sure the player is not dead
    player1.on('healthPointsChanged', main.checkDead);

    // when healthpoints changed check the health goal function
    player1.on('healthPointsChanged', function() {
      main.checkHealthGoal(this, lowGoal, highGoal);
    });
  });

  describe('create and configure player', function() {
    it('player should not be null', function() {
      assert.notEqual(player1, null);
    });
    it('player.name should be noname', function() {
      assert.equal(player1.name, 'noname');
    });
    it('player.healthPoints should be 0', function() {
      assert.equal(player1.healthPoints, 0);
    });
  });

  describe('change player health', function() {

    describe('#heal()', function() {

      it('player.healthPoints should be ' + hp1, function() {
        player1.heal(hp1);
        assert.equal(player1.healthPoints, hp1);
      });
    });

    describe('#hurt()', function() {

      it('player.healthPoints should be ' + (hp1 - hp2), function() {
        player1.hurt(hp2);
        assert.equal(player1.healthPoints, (hp1 - hp2));
      });
    });
  });

  describe('trigger player health messages', function() {

    describe('weaken message', function() {

      it('logfile should contain weaken message', function() {
        player1.hurt(41);
        assert.equal(player1.healthPoints, 9);
        assert.equal(1, 0); // TODO: Look for message in logfile
      });
    });

    describe('energized message', function() {

      it('logfile should contain dead message', function() {
        player1.hurt(9);
        assert.equal(player1.healthPoints, 0);
        assert.equal(1, 0); // TODO: Look for message in logfile
      });
    });

    describe('energized message', function() {

      it('logfile should contain energized message', function() {
        player1.heal(highGoal + 1);
        assert.equal(player1.healthPoints, 111);
        assert.equal(1, 0); // TODO: Look for message in logfile
      });
    });

  });
});
