// # himins_command.js
// Manages the command objects used by himins to control player, room, and game objects.

/*jslint browser: true, continue: true, devel: true, indent: 2, maxerr: 50, newcap : true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: false, white: true
*/

// ## includes
var
  game = require('./himins_game.js'),
  room = require('./himins_room.js'),
  player = require('./himins_player.js'),
  format = require('./himins_format.js');

// ## module vars
var
  commandsList = [];

// # init(starterCommands)
var init = function (starterCommands) {
  //console.log('himins_command.js init(', starterCommands, ')');
  var i;

  if (starterCommands) {
    //commandsList.concat(starterCommands); concat no work!
    for (i = starterCommands.length - 1; i >= 0; i--) {
      commandsList.push(starterCommands[i]);
    }
  }
};
module.exports.init = init;

// # getCommandNames()
// Returns a string of the names of each command.
var getCommandNames = function () {
  var
    resultString = '',
    resultList = [],
    i;

  for (i = commandsList.length - 1; i >= 0; i--) {
    resultList.push('_' + commandsList[i].name + '_');
  }

  resultString = resultList.toString().replace(/,/g, ', ');
  return resultString;
};
module.exports.getCommandNames = getCommandNames;

// # addCommand(commandObject)
// Commmand object = { name, description, action, kind }
var addCommand = function (commandObject) {
  commandsList.push(commandObject);
};
module.exports.addCommand = addCommand;

// # getCommandByName(commandName)
var getCommandByName = function (commandName) {
  var
    result = {},
    i;

  for (i = commandsList.length - 1; i >= 0; i--) {
    if (commandsList[i].name === commandName) {
      result = commandsList[i];
      break;
    }
  }
  return result;
};
module.exports.getCommandByName = getCommandByName;

// # removeCommandByName(commandName)
var removeCommandByName = function (commandName) {
  var i;

  for (i = commandsList.length - 1; i >= 0; i--) {
    if (commandsList[i].name === commandName) {
      commandsList.splice(i, 1); // remove 1 element at index i
      break;
    }
  }
};
module.exports.removeCommandByName = removeCommandByName;

// # removeCommandsByKind(commandKind)
var removeCommandsByKind = function (commandKind) {
  var i;

  for (i = commandsList.length - 1; i >= 0; i--) {
    if (commandsList[i].kind === commandKind) {
      commandsList.splice(i, 1); // remove 1 element at index i
      break;
    }
  }
};
module.exports.removeCommandsByKind = removeCommandsByKind;

// # doGameCommand(cmd, message)
var doGameCommand = function (rl, cmd, message) {
  console.log(format.formatText(message, 60));

  // send a control-c from the terminal
  if (cmd === 'quit') {
    rl.write(null, {ctrl: true, name: 'c'});
  }
};
module.exports.doGameCommand = doGameCommand;


// # doNavigationCommand(cmd, message)
var doNavigationCommand = function (cmd, message) {
  player.setPlayerLocation = cmd;
  room.loadItemCommands(player.getPlayerLocation());

  console.log(format.formatText(message, 60));
};
module.exports.doNavigationCommand = doNavigationCommand;


// # doItemCommand(cmd, message)
var doItemCommand = function (cmd, message) {
};
module.exports.doItemCommand = doItemCommand;

// # getCommandMap()
var getCommandMap = function () {
  var
    result = {},
    i;

  for (i = commandsList.length - 1; i >= 0; i--) {
    result[commandsList[i].name] = commandsList[i].description;
  }

  return result;
};
module.exports.getCommandMap = getCommandMap;

// # getCommandKindFromName(name)
var getCommandKindFromName = function (name) {
  var
    result = '',
    i;
  for (i = commandsList.length - 1; i >= 0; i--) {
    if (commandsList[i].name === name) {
      result = commandsList[i].kind;
      break;
    }
  }

  return result;
};





