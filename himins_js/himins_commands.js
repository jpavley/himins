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
  repl = require('./himins_repl');

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

// # removeCommandByName(commands, commandName)
var removeCommandByName = function (commands, commandName) {
  var updatedCommands = _.reject(commands, function (commandName) {
    return commands.name.toLowerCase() === commandName.toLowerCase();
  });

  commands = updatedCommands;
};
module.exports.removeCommandByName = removeCommandByName;

// # removeCommandsByKind(commands, commandKind)
var removeCommandsByKind = function (commands, commandKind) {
  var updatedCommands = _.reject(commands, function (commandKind) {
    return commands.kind.toLowerCase() === commandKind.toLowerCase();
  });

  commands = updatedCommands;
};
module.exports.removeCommandsByKind = removeCommandsByKind;

// # doCommand(command, client)
var doCommand = function (command, client) {
  console.log('*** himins_commands.js doGameCommand()');

  // display the commands description
  repl.writeToClient(client, format.formatText(command.description, 60));

  // TODO: do any action specified by the command

};
module.exports.doCommand = doCommand;




