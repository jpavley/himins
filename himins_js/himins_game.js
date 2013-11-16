// # himins_game.js
// Manages a game object from a himins game JSON file.

/*jslint browser: false, continue: true, devel: true, indent: 2, maxerr: 50, newcap : true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: false, white: true
*/

// ## includes
var
  fs = require('fs'),
  commands = require('./himins_commands.js');

//# init(gameObject)
var init = function (gameObject) {
  console.log('*** himins_game.js init(', gameObject.name, ')');

  // add the name of the game as a command
  commands.addCommand({ name: gameObject.name.toLowerCase(),
      description: gameObject.description,
      action: '!NO_ACTION',
      kind: 'game' }
    );
};
module.exports.init = init;