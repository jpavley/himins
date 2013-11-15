// # himins_player.js
// Manages a player object from a himins player JSON file.

/*jslint browser: false, continue: true, devel: true, indent: 2, maxerr: 50, newcap : true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: false, white: true
*/

// ## includes
var
  fs = require('fs'),
  commands = require('./himins_commands.js');

// ## module vars
var playerObject = {};

//# init()
var init = function () {
  console.log('*** (5) himins_player.js init()');

  commands.addCommand({ name: playerObject.name,
                        description: playerObject.description,
                        action: '!NO_ACTION',
                        kind: 'player' });

};
module.exports.init = init;

//# loadPlayer(playerFileName)
var loadPlayer = function (playerFileName) {
  console.log('*** (4) himins_player.js playerRoom(%s)', playerFileName);

  fs.readFile(playerFileName, 'utf8', function (err, data) {
    if (err) {
      console.log(err);
    } else {
      playerObject = JSON.parse(data);
      //console.log(playerObject);
      init();
    }
    return playerObject;
  });
};
module.exports.loadPlayer = loadPlayer;

//# getPlayerInventoryNames
// Returns a string with the names of the items in the player inventory
var getPlayerInventoryNames = function () {
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

// # getPlayerLocation()
var getPlayerLocation = function () {
  return playerObject.location;
};
module.exports.getPlayerLocation = getPlayerLocation;

// # setPlayerLocation(location)
var setPlayerLocation = function (location) {
  playerObject.location = location;
};
module.exports.setPlayerLocation = setPlayerLocation;

// # getPlayerRoom()
var getPlayerRoom = function () {
  return playerObject.room;
};
module.exports.getPlayerRoom = getPlayerRoom;

// # setPlayerRoom(room)
var setPlayerRoom = function (room) {
  playerObject.room = room;
};
module.exports.setPlayerRoom = setPlayerRoom;

// # getPlayerHealth()
var getPlayerHealth = function () {
  return playerObject.health;
};
module.exports.getPlayerHealth = getPlayerHealth;

// # setPlayerHealth(hitPoints)
var setPlayerHealth = function (hitPoints) {
  playerObject.health = hitPoints;
};
module.exports.getPlayerHealth = getPlayerHealth;

// # getPlayerName()
var getPlayerName = function () {
  return playerObject.name;
};
module.exports.getPlayerName = getPlayerName;

// # setPlayerName(name)
var setPlayerName = function (name) {
  // remove the player command with the old name...
  commands.removeCommandByName(playerObject.name);

  // update the name of the player
  playerObject.name = name;

  // ...add a player command with new name
  commands.addCommand({ name: playerObject.name,
                        description: playerObject.description,
                        action: '!NO_ACTION',
                        kind: 'player' });

};
module.exports.setPlayerName = setPlayerName;