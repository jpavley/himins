/**
 * @fileOverview Adds functionality to Javascript's String
 * @module
 */


// module vars
var addedFlag = false;

/**
  * Extends String.prototype with function to repeat a string
  * @param {Number} count the number of times to repeat the string
  */

var addStringRepeat = function() {
  String.prototype.repeat = function(count) {
    var input = '' + this, // force 'this' to be a string
        result = '';

    // over optimitized for loop
    for (var i = count - 1; i >= 0; i--) {
      result += input;
    }

    return result;
  };
};

// # addStringUnformattedLength()
// Calcs the length of a string without markdown
var addStringUnformattedLength = function() {
  String.prototype.unformattedLength = function() {
    var input = '' + this, // force 'this' to be a string
        result = '';
     // remove underscores and astericks!
    result = input.split('_').join('');
    result = result.split('*').join('');
    return result.length;
  };
};

// # isPrintable()
// Returns true if the chars of the string are within the printable ASCII character range
var addIsPrintable = function() {
  String.prototype.isPrintable = function() {
    var input = '' + this, // force 'this' to be a string
    result = '';
    // test each char to see if it is between space (x20) and ~ (x7E)
    result = /^[\x20-\x7E]*$/.test(input);
    return result;
  };
};

// # init()
var init = function() {
  if (!addedFlag) {
    addStringRepeat();
    addStringUnformattedLength();
    addIsPrintable();
    addedFlag = true;
  }
};
module.exports.init = init;
