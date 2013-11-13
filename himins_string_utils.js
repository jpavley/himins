// # himins_string_utils.js
// Adds functionality to Javascript's String object.

/*jslint browser: false, continue: true, devel: true, indent: 2, maxerr: 50, newcap : true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: false, white: true
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

// # init()
var init = function () {
  if (!addedFlag) {
    addStringRepeat();
    addStringUnformattedLength();
    addedFlag = true;
  }
};
module.exports.init = init;
