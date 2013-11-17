// # himins_player.js
// Manages a player object from a himins player JSON file.

/*jslint browser: false, continue: true, devel: true, indent: 2, maxerr: 50, newcap : true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: false, white: true
*/

// ## includes
var
  fs = require('fs'),
  commands = require('./himins_commands.js');

// ## module vars

//# init(playerObject)
var init = function (playerObject) {
  console.log('*** himins_player.js init(', playerObject.name, ')');
};
module.exports.init = init;

//# getPlayerInventoryNames(playerObject)
// Returns a string with the names of the items in the player inventory
var getPlayerInventoryNames = function (playerObject) {
  var
    namesList = [],
    result = '',
    i;

  for (i = playerObject.inventory.length - 1; i >= 0; i--) {
    namesList.push(playerObject.inventory[i].name);
  }

  result = namesList.toString();
  result = result.replace(/,/g, ", ");
  return result;
};
module.exports.getPlayerInventoryNames = getPlayerInventoryNames;