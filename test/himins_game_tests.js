/**
 * @fileOverview Game module tests
 * @module
 * @requires assert
 * @requires ../himins_js/himins_game
 */

var 
  assert = require('assert'),
  gameManager = require('../himins_js/himins_game');

var 
  MongoClient = require('mongodb').MongoClient,
  mongoServerURL = 'mongodb://127.0.0.1:27017/himinsTest', // TODO: Get server address from config file
  mongoCollection = 'himinsGame'; // TODO: Get server address from config file

describe('game manager unit tests', function() {

  var
    gameName = gameManager.getGameName(),
    gameKey = { name: gameName };

  gameManager.start(function(gameState) {
    console.log(gameState); // TODO: Remove

    describe('#start()', function() {

      it('should have a running game state because game was started', function() {
        assert.equal(gameState.isRunning, true);
      });

      it('should have game already started message in the log', function() {
        gameManager.start(function(gameState) {
          // check the log for a game already started message
        });
      });

      it('should contain the initial game state data', function() {
        MongoClient.connect(mongoServerURL, function (err, db) {

          if (err) throw err;

          var collection = db.collection(mongoCollection);

            collection.find(gameKey).toArray(function (err, results) {
              assert.equal(results[0].name, gameName);
              db.close();
            });
        });
      });
    });

    describe('#getGameState()', function() {

      it('should not be null', function() {
        var gameState2 = gameManager.getGameState();
        assert.notEqual(gameState2, null);
      });

      it('should have a name of ' + gameName, function() {
        var gameState3 = gameManager.getGameState();
        assert.equal(gameState3.name, gameName);
      });

      it('should have a clientList', function() {
        var gameState4 = gameManager.getGameState();
        assert.equal(typeof(gameState4.clientList),'object');
      });

      it('should have a playerList', function() {
        var gameState5 = gameManager.getGameState();
        assert.equal(typeof(gameState5.playerList),'object');
      });

      it('should have an isRunning flag', function() {
        var gameState6 = gameManager.getGameState();
        assert.equal(typeof(gameState6.isRunning),'boolean');
      });
    });

    describe('#stop()', function() {
      it('should have a not running game state because game was stopped', function() {
        gameManager.stop(function(stoppedGameState) {
          assert.equal(stoppedGameState.isRunning, false);          
        });
      });
    });

  });

});
