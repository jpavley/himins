// # himins_command.js
// Manages the command objects used by himins to control player, room, and game objects.

/*jslint browser: false, continue: true, devel: true, indent: 2, maxerr: 50, newcap : true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: false, white: true
*/

// ## includes
var
  // ### Node modules

  // ### 3rd party modules
  _ = require('underscore'),

  // ### Himins modules
  format = require('./himins_format'),
  repl = require('./himins_repl'),
  player = require('./himins_player');

// ## module vars

// # init(starterCommands)
var init = function (commands) {
  console.log('*** himins_command.js init()');
};
module.exports.init = init;

// # getCommandNames(commands)
// Returns a string of the names of each command.
var getCommandNames = function (commands) {
  var
    resultString = '',
    resultList = [];

  _.each(commands, function (e, i, l) {
    resultList.push('_' + e.name + '_');
  });

  resultString = resultList.toString().replace(/,/g, ', ');
  return resultString;
};
module.exports.getCommandNames = getCommandNames;

// # addCommand(commands, commandObject)
// Commmand object = { name, description, action, kind }
var addCommand = function (commands, commandObject) {
  //console.log('*** himins_commands.js addCommand(', commands, commandObject, ')');
  commands.push(commandObject);
};
module.exports.addCommand = addCommand;

var combineCommands = function (myCommands, yourCommands) {
  var ourCommands = _.union(myCommands, yourCommands);
  return ourCommands;
};
module.exports.combineCommands = combineCommands;

// # getCommandByName(commands, commandName)
var getCommandByName = function (commands, commandName) {
  var result = _.find(commands, function (command) {
    return command.name.toLowerCase() === commandName.toLowerCase();
  });

  return result;
};
module.exports.getCommandByName = getCommandByName;

// # removeCommandsByKind(commands, commandKind)
var removeCommandsByKind = function (commands, commandKind) {
  //console.log('*** himins_commands.js removeCommandsByKind(', commands, commandKind, ')');
  var updatedCommands = _.reject(commands, function (commandObject) {
    return commandObject.kind.toLowerCase() === commandKind.toLowerCase();
  });

  return updatedCommands;
};
module.exports.removeCommandsByKind = removeCommandsByKind;

// # doAction(client, commandObject)
var doAction = function (client, commandObject) {
  var
    action = commandObject.action;

  if (action === '!NO_ACTION') {
    return;
  }
  switch (action) {
    case  '!NO_ACTION':
      // nothing to do!
    break;

    case '!QUIT_APP':
      client.end();
    break;

    case '!GO_NORTH':
    case '!GO_SOUTH':
    case '!GO_EAST':
    case '!GO_WEST':
    case '!GO_SOUTHEAST':
    case '!GO_SOUTHWEST':
    case '!GO_NORTHEAST':
    case '!GO_NORTHWEST':
    case '!GO_CENTER':
      player.moveToSection(client.player, action);
    break;

    case '!GO_ROOM':
      player.moveToRoom(client.player, commandObject);
    break;

   default:
      console.log('*** missing case for action in himins_commands.js doAction: ', action);
      break;
  }
};
module.exports.doAction = doAction;




