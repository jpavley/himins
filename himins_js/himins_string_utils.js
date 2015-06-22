/**
 * @fileOverview Adds functionality to Javascript's String 
 * @module
 */


// ## module vars
var addedFlag = false;

// # addStringRepeat()
var addStringRepeat = function () {
  String.prototype.repeat = function (count) {
    var result = [];
    result = result.join(this);
    return result;
    //return new Array(count + 1).join(this);
  };
};

// # addStringUnformattedLength()
// Calcs the length of a string without markdown
var addStringUnformattedLength = function () {
  String.prototype.unformattedLength = function () {
    var result = this;
     // remove underscores, astericks, and seperators!
    result = this.split('_').join('');
    result = this.split('*').join('');
    return result.length;
  };
};

// # isPrintable()
// Returns true if the chars of the string are within the printable ASCII character range
var addIsPrintable = function () {
  String.prototype.isPrintable = function () {
    // test each char to see if it is between space (x20) and ~ (x7E)
    var result = /^[\x20-\x7E]*$/.test(this);
    return result;
  };
};

// # init()
var init = function () {
  if (!addedFlag) {
    addStringRepeat();
    addStringUnformattedLength();
    addIsPrintable();
    addedFlag = true;
  }
};
module.exports.init = init;
