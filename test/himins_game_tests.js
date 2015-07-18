/**
 * @fileOverview Game module tests
 * @module
 * @requires assert
 * @requires ../himins_js/himins_game
 */

var 
  assert = require('assert'),
  gameManager = require('../himins_js/himins_game');

describe('game manager unit tests', function() {

  describe('#start()', function() {

    var
      gameID = gameManager.start();

    // it('game id should not be null', function() {
    //   assert.equal(gameID, null);
    // });

    // it('game id should type of Number', function() {
    //   assert.equal(typeof gameID, Number);
    // });

  });
});
