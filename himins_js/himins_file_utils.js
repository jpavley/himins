/**
 * @fileOverview Adds functionality to Javascript's String object
 * @module
 * @requires fs
 */

// ## includes
var
  fs = require('fs');

// # loadJSON(fileName, callBackFunc)
// Loads JSON data from a file into an object.
// Returns the object in the callBack function.
// Returns empty object on failure.
var loadJSON = function(fileName, callBackFunc) {
  console.log('*** himins_file_utils.js loadJSON(%s)', fileName);
  var
    resultObject = {};

  fs.readFile(fileName, 'utf8', function(err, data) {
    if (err) {
      console.log(err);
    } else {
      resultObject = JSON.parse(data);
      callBackFunc(resultObject);
    }
  });
};
module.exports.loadJSON = loadJSON;

// # loadTEXT(fileName, callBackFunc)
// Loads TEXT data from a file into an object.
// Returns the object in the callBack function.
// Returns empty object on failure.
var loadTEXT = function(fileName, callBackFunc) {
  console.log('*** himins_file_utils.js loadTEXT(%s)', fileName);
  var
    resultObject = {};

  fs.readFile(fileName, 'utf8', function(err, data) {
    if (err) {
      console.log(err);
    } else {
      resultObject = data.toString('utf8');
      callBackFunc(resultObject);
    }
  });
};
module.exports.loadTEXT = loadTEXT;
