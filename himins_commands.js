// # himins_command.js
// Manages the command objects used by himins to control player, room, and game objects.

// ## includes
var game = require('./himins_game.js'),
	room = require('./himins_room.js'),
	player = require('./himins_player.js');

// ## module vars
var commandsList = [];

// # init(starterCommands)
var init = function (starterCommands) {
	//console.log('himins_command.js init(', starterCommands, ')');
	if (starterCommands) {
		//commandsList.concat(starterCommands); concat no work!
		for (var i = starterCommands.length - 1; i >= 0; i--) {
			commandsList.push(starterCommands[i]);
		};
	};
};
module.exports.init = init;

// # getCommandNames()
// Returns a string of the names of each command.
var getCommandNames = function () {
	var resultString = '',
			resultList = [];

	for (var i = commandsList.length - 1; i >= 0; i--) {
		resultList.push('_' + commandsList[i].name + '_');
	};

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
	var result = {};

	for (var i = commandsList.length - 1; i >= 0; i--) {
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

	for (var i = commandsList.length - 1; i >= 0; i--) {
		if (commandsList[i].name === commandName) {
			commandsList.splice(i, 1); // remove 1 element at index i
			break;
		}
	}
};
module.exports.removeCommandByName = removeCommandByName;

// # removeCommandsByKind(commandKind)
var removeCommandsByKind = function (commandKind) {

	for (var i = commandsList.length - 1; i >= 0; i--) {
		if (commandsList[i].kind === commandKind) {
			commandsList.splice(i, 1); // remove 1 element at index i
			break;
		}
	}
};
module.exports.removeCommandsByKind = removeCommandsByKind;


