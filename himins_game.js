// # himins_game.js
// Manages a game object from a himins game JSON file.

// ## includes
var fs = require('fs');

// ## module vars
var gameObject = {};

//# init()
var init = function () {
//console.log('** himins_game.js init()');

// tests
// console.log(getCommandNames());
// addCommand({ name: 'test', 
// 	description: 'this is a test',
// 	action: '!NO_ACTION',
// 	kind: 'test' }
// );
// console.log(getCommandNames());
// console.log(getCommandByName('test'));
// removeCommandByName('test');
// console.log(getCommandNames());

};
module.exports.init = init;

//# loadGame(gameFileName)
var loadGame = function (gameFileName) {
	//console.log('** himins_game.js loadGame(%s)', gameFileName);

	fs.readFile(gameFileName, 'utf8', function (err, data) {
		if(err) {
			console.log(err);
		} else {
			gameObject = JSON.parse(data);
			//console.log(gameObject);
			init();
		}
	});
};
module.exports.loadGame = loadGame;

// # getCommandNames()
// Returns a string of the names of each commend.
var getCommandNames = function () {
	var resultString = '',
			resultList = [];

	for (var i = gameObject.commands.length - 1; i >= 0; i--) {
		resultList.push('_' + gameObject.commands[i].name + '_');
	};

	resultString = resultList.toString().replace(/,/g, ', ');
	return resultString;
};

// # addCommand(commandObject)
// Commmand object = { name, description, action, kind }
var addCommand = function (commandObject) {
	gameObject.commands.push(commandObject);
};

// # getCommandByName(commandName)
var getCommandByName = function (commandName) {
	var result = {};

	for (var i = gameObject.commands.length - 1; i >= 0; i--) {
		if (gameObject.commands[i].name === commandName) {
			result = gameObject.commands[i];
			break;
		}
	}
	return result;
};

// # removeCommandByName(commandName)
var removeCommandByName = function (commandName) {

	for (var i = gameObject.commands.length - 1; i >= 0; i--) {
		if (gameObject.commands[i].name === commandName) {
			gameObject.commands.splice(i, 1); // remove 1 element at index i
			break;
		}
	}
};

// # main entry point
// For testing purposes you can run this file directly with "node himins_game.js". The test logic expects a file named "himins_game.json" with the defination of a game object!

loadGame('himins_game.json');