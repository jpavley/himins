/**
 * @fileOverview Client module tests
 * @module
 * @requires assert
 * @requires ../himins_js/himins_client
 */

var 
  assert = require('assert'),
  clientManager = require('../himins_js/himins_client');

describe('client manager unit tests', function() {

  describe('#createNewEmptyClientList()', function() {

    var
      testClientList1 = clientManager.createNewEmptyClientList();

    it('client list should not be null', function() {
      assert.notEqual(testClientList1, null);
    });

    it('client list should type of Array', function() {
      assert.equal(testClientList1.constructor, Array);
    });

    it('client list should be empty', function() {
      assert.equal(testClientList1.length, 0);
    });

  });

  describe('#broadcast()', function() {

    var
      testClientList2 = clientManager.createNewEmptyClientList(),
      result;

    testClientList2.push({
      name: 'testClient1', 
      writable: true,
      destroy: function () {},
      write: function() { }
    });

    testClientList2.push({
      name: 'testClient2', 
      writable: false,
      destroy: function () {},
      write: function() { }
  });

    result = clientManager.broadcast('hello', testClientList2);

    it('result client list should not be null', function() {
      assert.notEqual(result, null);
    });

    it('result client list should type of Array', function() {
      assert.equal(result.constructor, Array);
    });

    it('result client list should have one member', function() {
      assert.equal(result.length, 1);
    });

    it('result client list member name should testClient1', function() {
      assert.equal(result[0].name, 'testClient1');
    });

  });

});



