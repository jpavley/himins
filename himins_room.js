// # himins_room.js
// Manages a room object from a himins room JSON file.

// ## includes
var fs = require('fs'),
		commands = require('./himins_commands.js'),
		game = require('./himins_game.js'),
		player = require('./himins_player.js');

// ## module vars
var roomObject = {};

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
		if(err) {
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

// # loadItemCommands(sectionName)
var loadItemCommands = function (sectionName) {
	// console.log('*** himins_room.js loadSectionCommands(%s)', sectionName);

	var sectionObject = getSectionByName(sectionName);

	// remove old section commands
	commands.removeCommandsByKind('item');

	if (sectionObject.items) {
		// some items in section, load commands
		for (var i = sectionObject.items.length - 1; i >= 0; i--) {
			commands.addCommand({ name: sectionObject.items[i].name, 
														description: sectionObject.items[i].description,
														action: '!ADD_TO_INVENTORY',
														kind: 'item' });
		}
	}
};

// # loadNavigationCommands()
var loadNavigationCommands = function () {
	// remove all navigation commands
	commands.removeCommandsByKind('navigation');

	for (var i = roomObject.sections.length - 1; i >= 0; i--) {
		commands.addCommand({ name: roomObject.sections[i].name, 
													description: roomObject.sections[i].description,
													action: '!SET_LOCATION',
													kind: 'navigation' });
	}
};

// # getSectionByName(name)
var getSectionByName = function (name) {
	//console.log("*** himins_room.js getSectionByName(%s)", name);
	var result = {};

	for (var i = roomObject.sections.length - 1; i >= 0; i--) {
		if (roomObject.sections[i].name === name) {
			result = roomObject.sections[i];
			break;
		}
	}
	return result;
};

// # getItemByName(sectionName, itemName)
var getItemByName = function (sectionName, itemName) {
	var result = {},
			sectionObject = getSectionByName(sectionName);

	if (sectionObject) {
		for (var i = sectionObject.items.length - 1; i >= 0; i--) {
			if (sectionObject.items[i].name === itemName) {
				result = sectionObject.items[i];
			}
		}
	}
};

// # welcome()
// called when a player spawns or enters a room
var welcome = function () {
	var commandMap = commands.getCommandMap();

	console.log();
	commands.doGameCommand(null, '', commandMap['look']);
	console.log();
};