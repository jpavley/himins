// # himins_game.js
// Manages a game object from a himins game JSON file.

/*jslint browser: false, continue: true, devel: true, indent: 2, maxerr: 50, newcap : true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: false, white: true
*/

// ## includes
var
  // ### Node modules
  fs = require('fs'),

  // ### 3rd party modules
  _ = require('underscore'),

  // ### Himins modules
  commands = require('./himins_commands'),
  room = require('./himins_room'),
  files = require('./himins_file_utils');


// ## module vars
var
  roomList = [];

//# init(gameObject)
var init = function (gameObject) {
  console.log('*** himins_game.js init(', gameObject.name, ')');

  // load the rooms

  _.each(gameObject.roomFiles, function (e, i, l) {
    files.loadJSON('himins_json/' + e, function (resultObject) {
      room.init(resultObject);
      roomList.push(resultObject);
      console.log('*** a room has loaded: ', resultObject.name);
    });
 });


};
module.exports.init = init;