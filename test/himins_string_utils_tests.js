/**
 * @fileOverview String Utilities module tests
 * @module
 * @requires assert
 * @requires ../himins_js/himins_string_utils
 */

var 
  assert = require('assert'),
  strTools = require('../himins_js/himins_string_utils');

describe('string utilities unit tests', function() {

  var testString1 = 'cat ',
      testString1a = 'cat cat cat ',
      testString2 = 'the *black* _little_ cat',
      testString2a = 'the black little cat',
      testString3 = 'A printable string ~',
      testString3a = 'An unprintable string ©';

  strTools.init();

  describe('#strTools.init()', function() {

    it('The String.repeat should exist', function() {
      assert.equal(typeof('str'.repeat), typeof(Function));
    });

    it('The String.unformattedLength should exist', function() {
      assert.equal(typeof('str'.unformattedLength), typeof(Function));
    });
    
    it('The String.isPrintable should exist', function() {
      assert.equal(typeof('str'.isPrintable), typeof(Function));
    });
  });


  describe('#String.repeat()', function() {

    it('the word cat should be repeated 3 times', function() {
      var resultString = testString1.repeat(3);
      assert.equal(resultString, "cat cat cat ");
    });

    it('the word cat should be repeated 1 times', function() {
      var resultString = testString1.repeat(1);
      assert.equal(resultString, "cat ");
    });
  });

  describe('#String.unformattedLength()', function() {

    it('the length should the same as the unformated string', function() {
      var resultLength = testString2.unformattedLength(),
          compareLength = testString2a.length;
      assert.equal(resultLength, compareLength);
    });
  });

  describe('#String.isPrintable()', function() {

    it('the printable string should return true', function() {
      var resultTest = testString3.isPrintable();
      assert.equal(resultTest, true);
    });

    it('the unprintable string should return false', function() {
      var resultTest = testString3a.isPrintable();
      assert.equal(resultTest, false);
    });
  });
});
