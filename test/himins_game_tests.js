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

    it('return should be true because it just started', function() {
      assert.equal(gameManager.start(), true);
    });

    it('return should be false because it was already started', function() {
      assert.equal(gameManager.start(), false);
    });

  });
});
