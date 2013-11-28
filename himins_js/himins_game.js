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
  files = require('./himins_file_utils'),
  repl = require('./himins_repl'),
  format = require('./himins_format'),
  player = require('./himins_player'),
  game = require('./himins_game');

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
      gameObject.rooms.push(resultObject);
    });

  });
};
module.exports.init = init;

var getRoomByName = function (gameObject, roomName) {

  var result = _.find(gameObject.rooms, function (room) {
    return room.name.toLowerCase() === roomName.toLowerCase();
  });

  return result;
};
module.exports.getRoomByName = getRoomByName;

// # start(playerObject)
var start = function (playerObject) {
  var
    roomObject = {},
    sectionObject = {},
    gameObject = {},
    artFileURI = '';

  // add commands that only make sense once the game is started

  commands.addCommand(playerObject.commands, { 
    name: 'look',
    description: "!SECTION_DESCRIPTION",
    action: '!NO_ACTION',
    kind: 'game' }
  );

  commands.addCommand(playerObject.commands, { 
    name: 'where',
    description: '_himins_ reports that you are in the _!PLAYER_LOCATION_ of the *!ROOM_NAME*',
    action: '!NO_ACTION',
    kind: 'game' }
  );

  //TODO: refactor to player.moveToRoom()

  // set the location of the player
  gameObject = playerObject.game;
  playerObject.roomName = gameObject.startRoom;
  roomObject = game.getRoomByName(gameObject, gameObject.startRoom);
  playerObject.sectionName = roomObject.spawnSection;

  artFileURI = './himins_txt/' + roomObject.artFileName;

  files.loadTEXT(artFileURI, function (resultObject) {
    playerObject.client.write(resultObject + '\n');

    // do the spawn stuff based on player's location
    player.enterRoom(playerObject, roomObject);
    sectionObject = room.getSectionByName(roomObject, playerObject.sectionName);
    player.enterSection(playerObject, sectionObject);
  });
};
module.exports.start = start;

