// # himins_room.js
// Manages a room object from a himins room JSON file.

/*jslint browser: false, continue: true, devel: true, indent: 2, maxerr: 50, newcap : true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: false, white: true
*/

// ## includes
var
  fs = require('fs'),
  commands = require('./himins_commands.js'),
  game = require('./himins_game.js'),
  player = require('./himins_player.js');

// ## module vars
var roomObject = {};

// # getSectionByName(name)
var getSectionByName = function (name) {
  //console.log("*** himins_room.js getSectionByName(%s)", name);
  var result = {}, i;

  for (i = roomObject.sections.length - 1; i >= 0; i--) {
    if (roomObject.sections[i].name === name) {
      result = roomObject.sections[i];
      break;
    }
  }
  return result;
};

// # loadItemCommands(sectionName)
var loadItemCommands = function (sectionName) {
  // console.log('*** himins_room.js loadItemCommands(%s)', sectionName);

  var sectionObject = getSectionByName(sectionName), i;

  // remove old section commands
  commands.removeCommandsByKind('item');

  if (sectionObject.items) {
    // some items in section, load commands
    for (i = sectionObject.items.length - 1; i >= 0; i--) {
      commands.addCommand({ name: sectionObject.items[i].name,
                            description: sectionObject.items[i].description,
                            action: '!ADD_TO_INVENTORY',
                            kind: 'item' });
    }
  }
};

// # loadNavigationCommands()
var loadNavigationCommands = function () {
  var i;
  // remove all navigation commands
  commands.removeCommandsByKind('navigation');

  for (i = roomObject.sections.length - 1; i >= 0; i--) {
    commands.addCommand({ name: roomObject.sections[i].name,
                          description: roomObject.sections[i].description,
                          action: '!SET_LOCATION',
                          kind: 'navigation' });
  }
};

// # welcome()
// called when a player spawns or enters a room
var welcome = function () {
  var commandMap = commands.getCommandMap();

  console.log();
  commands.doGameCommand(null, '', commandMap.look);
  console.log();
};

//# init()
var init = function () {
  console.log('*** (3) himins_room.js init()');

  // player
  player.loadPlayer(roomObject.defaultPlayer, false);
  player.setPlayerLocation(roomObject.spawnSection);


  // commands
  loadItemCommands(player.getPlayerLocation());
  loadNavigationCommands();
};
module.exports.init = init;

//# loadRoom(roomFileName)
var loadRoom = function (roomFileName) {
  console.log('*** (3) himins_room.js loadRoom(%s)', roomFileName);

  fs.readFile(roomFileName, 'utf8', function (err, data) {
    if (err) {
      console.log(err);
    } else {
      roomObject = JSON.parse(data);
      //console.log(roomObject.name);
      init();
      welcome();
      //processUserInput();
    }
  });
};
module.exports.loadRoom = loadRoom;

// # getItemByName(sectionName, itemName)
var getItemByName = function (sectionName, itemName) {
  var
    result = {},
    sectionObject = getSectionByName(sectionName),
    i;

  if (sectionObject) {
    for (i = sectionObject.items.length - 1; i >= 0; i--) {
      if (sectionObject.items[i].name === itemName) {
        result = sectionObject.items[i];
      }
    }
  }
};

// # getRoomDescription()
var getRoomDescription = function () {
  return roomObject.description;
};
module.exports.getRoomDescription = getRoomDescription;

// # getSectionDescription()
var getSectionDescription = function () {
  var
    section = getSectionByName(player.getPlayerLocation()),
    result = section.description;

  return result;
};
module.exports.getSectionDescription = getSectionDescription;


