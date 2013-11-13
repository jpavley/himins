// # himins_game.js
// Manages a game object from a himins game JSON file.

/*jslint browser: false, continue: true, devel: true, indent: 2, maxerr: 50, newcap : true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: false, white: true
*/

// ## includes
var
  fs = require('fs'),
  room = require('./himins_room.js'),
  commands = require('./himins_commands.js'),
  strutils = require('./himins_string_utils.js');

// ## module vars
var
  gameObject = {},
  roomObject = {};

//# init()
var init = function () {
  console.log('*** (2) himins_game.js init()');

  // add String object extentions
  strutils.init();

  // init the commands object and add the predefined game commands to it
  commands.init(gameObject.commands);

  // add the name of the game as a command
  commands.addCommand({ name: gameObject.name.toLowerCase(),
      description: gameObject.description,
      action: '!NO_ACTION',
      kind: 'game' }
    );

  // load the starter room and add them to the room list
  room.loadRoom(gameObject.roomFile);
};
module.exports.init = init;

//# loadGame(gameFileName)
var loadGame = function (gameFileName) {
  console.log('*** (1) himins_game.js loadGame(%s)', gameFileName);

  fs.readFile(gameFileName, 'utf8', function (err, data) {
    if (err) {
      console.log(err);
    } else {
      gameObject = JSON.parse(data);
      //console.log(gameObject);
      init();
    }
  });
};
module.exports.loadGame = loadGame;

// # main entry point
// Run this file directly with "node himins_game.js". It expects a file named "himins_game.json" with the defination of the main game object!

loadGame('himins_game.json');