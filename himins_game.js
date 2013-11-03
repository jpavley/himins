// # himins_game.js
// Manages a game object from a himins game JSON file.

// ## includes
var fs = require('fs'),
	room = require('./himins_room.js'),
	commands = require('./himins_commands.js');

// ## module vars
var gameObject = {}, 
	roomObject = {};

//# init()
var init = function () {
	//console.log('** himins_game.js init()');

	// init the commands object and add the predefined game commands to it
	commands.init(gameObject.commands);

	// add the name of the game as a command
	commands.addCommand({ name: gameObject.name.toLowerCase(), 
			description: gameObject.description,
			action: '!NO_ACTION',
			kind: 'game' }
		);

	// load the starter room and add them to the room list
	room.loadRoom(gameObject.roomFile, true);
};
module.exports.init = init;

//# loadGame(gameFileName, testMode)
var loadGame = function (gameFileName, testMode) {
	//console.log('** himins_game.js loadGame(%s)', gameFileName);

	fs.readFile(gameFileName, 'utf8', function (err, data) {
		if(err) {
			console.log(err);
		} else {
			gameObject = JSON.parse(data);
			//console.log(gameObject);
			init();
			if (testMode) {
				moduleTests();
			};
		}
	});
};
module.exports.loadGame = loadGame;

// # tests()
var moduleTests = function () {
	console.log('*** himins_game.js test mode start ***')
	console.log('command names: ' + commands.getCommandNames());
	commands.addCommand({ name: 'test', 
		description: 'this is a test',
		action: '!NO_ACTION',
		kind: 'test' }
	);
	console.log('*** added command test ***')
	console.log('command names: ' + commands.getCommandNames());
	console.log('*** get a command by name (test) ***')
	console.log(commands.getCommandByName('test'));
	commands.removeCommandByName('test');
	console.log('*** removed command test ***')
	console.log('command names: ' + commands.getCommandNames());
	console.log(gameObject.name);
	console.log(gameObject.description);
	console.log('*** himins_game.js test mode end ***');
};

// # main entry point
// For testing purposes you can run this file directly with "node himins_game.js". The test logic expects a file named "himins_game.json" with the defination of a game object!

loadGame('himins_game.json', true);