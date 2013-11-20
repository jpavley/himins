// # himins_player.js
// Manages a player object from a himins player JSON file.

/*jslint browser: false, continue: true, devel: true, indent: 2, maxerr: 50, newcap : true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: false, white: true
*/

// ## includes
var
  // ### 3rd party modules
  _ = require('underscore'),

  // ### Himins modules
  commands = require('./himins_commands.js');

// ## module vars

//# init(playerObject)
var init = function (playerObject) {
  console.log('*** himins_player.js init(', playerObject.name, ')');

  // if the player has any starter items in her inventory add their names as commands
   _.each(playerObject.inventory, function (e, i, l) {
    commands.addCommand(playerObject.commands, { 
      name: e.name,
      description: e.description,
      action: e.action,
      kind: e.kind 
    });
  });
};
module.exports.init = init;

//# getInventoryNames(playerObject)
// Returns a string with the names of the items in the player inventory
var getInventoryNames = function (playerObject) {
  var
    resultString = '',
    resultList = [];

  _.each(playerObject.inventory, function (e, i, l) {
    resultList.push('_' + e.name + '_');
  });

  resultString = resultList.toString().replace(/,/g, ', ');
  return resultString;
};
module.exports.getInventoryNames = getInventoryNames;