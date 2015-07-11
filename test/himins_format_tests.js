/**
 * @fileOverview Format module tests
 * @module
 * @requires assert
 * @requires ../himins_js/himins_format
 */

 var 
  assert = require('assert'),
  formatter = require('../himins_js/himins_format');

describe('formatter unit tests', function() {

    describe('#formatText() format test: no format', function() {

      var template1 = "Ogar The Mighty stikes Yeti Carl with Silver Hammer for 234 damage!",
          context1 = {
          },
          indent = 0,
          width = template1.length,
          style = "",
          message = formatter.formatText(context1, template1, indent, width, style);

      //console.log(message);
      //console.log(message.length);

      it('should be not null', function() {
        assert.notEqual(message, null);
      });

      it('should have length of 66', function() {
        assert.equal(message.length, 67);
      });

      it('should be the string: Ogar The Mighty stikes Yeti Carl with Silver Hammer for 234 damage!', function () {
        assert.equal(message, "Ogar The Mighty stikes Yeti Carl with Silver Hammer for 234 damage!");
      }); 

    });

    describe('#formatText() format test: Just subsituation', function() {

      var template1 = "{{player}} stikes {{monster}} with {{weapon}} for {{hitpoints}} damage!",
          context1 = {
            player: "Ogar The Mighty",
            monster: "Yeti Carl",
            weapon: "Silver Hammer",
            hitpoints: 234
          },
          indent = 0,
          width = template1.length,
          style = "",
          message = formatter.formatText(context1, template1, indent, width, style);

      //console.log(message);
      //console.log(message.length);

      it('should be not null', function() {
        assert.notEqual(message, null);
      });

      it('should have length of 66', function() {
        assert.equal(message.length, 67);
      });

      it('should be the string: Ogar The Mighty stikes Yeti Carl with Silver Hammer for 234 damage!', function () {
        assert.equal(message, "Ogar The Mighty stikes Yeti Carl with Silver Hammer for 234 damage!");
      }); 

    });

    describe('#formatText() format test: fully formatted', function() {

      var template1 = "{{player}} stikes {{monster}} with {{weapon}} for {{hitpoints}} damage!",
          context1 = {
            player: "Ogar The Mighty",
            monster: "Yeti Carl",
            weapon: "Silver Hammer",
            hitpoints: 234
          },
          indent = 4,
          width = 30,
          style = "error",
          message = formatter.formatText(context1, template1, indent, width, style);

      //console.log(message);
      //console.log(message.length);

      it('should be not null', function() {
        assert.notEqual(message, null);
      });

      it('should have length of 89', function() {
        assert.equal(message.length, 89);
      });

      it('should be the string: Ogar The Mighty stikes Yeti Carl with Silver Hammer for 234 damage!', function () {
        assert.equal(message, "\u001b[31m    Ogar The Mighty stikes\n    Yeti Carl with Silver\n    Hammer for 234 damage!\u001b[39m");
      }); 

    });

});