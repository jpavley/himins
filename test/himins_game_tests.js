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

  gameManager.start();

  describe('#start()', function() {

    it('return should be false because it was already started', function() {
      assert.equal(gameManager.start(), false);
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

  describe('#stop()', function() {

    it('return should be true because it stopped the game', function() {
      assert.equal(gameManager.stop(), true);
    });

  });


  describe('#getGameState()', function() {

    var gameState;

    gameManager.start();
    gameState = gameManager.getGameState();

    //console.log(gameState);

    it('should not be null', function() {
      assert.notEqual(gameState, null);
    });

    it('should have a name of ' + gameName, function() {
      assert.equal(gameState.name, gameName);
    });
  });

});
