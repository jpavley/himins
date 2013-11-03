// # himins_room.js
// Manages a room object from a himins room JSON file.

// ## includes
var fs = require('fs'),
		linewrap = require('linewrap');

// ## module vars
var roomObject = {},
		gameCommandsObject = {},
		navigationCommandsObject = {},
		sectionCommandsObject = {},
		playerLocation = '',
		playerInventory = ['silver obol'];

// ## consts
var BOLD_RED_ESC = '\033[1;31m',
		BOLD_GREEN_ESC = '\033[1;32m',
		UL_BLUE_ESC = '\033[4;34m',
		NORMAL_ESC = '\033[0m',
		NL = '\n';

//# init()
var init = function () {
	//console.log('** himins_room.js init()'');

	// add functionality to String object

	String.prototype.repeat = function (count) {
		return new Array(count + 1).join(this);
	};

	String.prototype.unformattedLength = function () {
		var result = this;
		 // remove underscores, astericks, and seperators!
		result = this.split('_').join('');
		result = this.split('*').join('');
		return result.length;
	};

	// player
	playerLocation = roomObject.spawnSection;

	// map the section commands to display strings
	loadSectionCommands(playerLocation);

	// map the room commands to display strings
	for (var i = roomObject.sections.length - 1; i >= 0; i--) {
		navigationCommandsObject[roomObject.sections[i].name] = roomObject.sections[i].description;
	}

	// map the game commands to display strings
	gameCommandsObject['look'] = roomObject.description;
	gameCommandsObject['where'] = getPlayerDisplayString();
	gameCommandsObject['quit'] = 'Himins reports that you have left the ' + roomObject.name ;
	gameCommandsObject['inventory'] = getPlayerInventory();
	gameCommandsObject['help'] = getCommandList();

};
module.exports.init = init;

// # loadSectionCommands(sectionName)
var loadSectionCommands = function (sectionName) {
	// console.log('*** himins_room.js loadSectionCommands(%s)', sectionName);

	var sectionObject = getSectionByName(sectionName);

	// clear the section commands
	sectionCommandsObject = [];

	if (sectionObject.items) {
		// some items in section, load commands
		for (var i = sectionObject.items.length - 1; i >= 0; i--) {
			sectionCommandsObject[sectionObject.items[i].name] = sectionObject.items[i].description;
			// console.log('*** key: %s, value: %s', sectionObject.items[i].name, sectionObject.items[i].description);
		}
	}
};

var getCommandList = function () {
	var result = '',
			keys = [];

	for(var k in gameCommandsObject) {
		keys.push('_' + k + '_');
	}

	for(var k in navigationCommandsObject) {
		keys.push('_' + k + '_');
	}

	for(var k in sectionCommandsObject) {
		keys.push('_' + k + '_');
	}

	result = keys.toString();
	result = result.replace(/,/g, ", ");
	result = 'Himins reports that the following commands work here: ' + result;
	return result;
}

var getPlayerDisplayString = function () {
	return 'Himins reports that you are in the _' + playerLocation + '_ of the ' + roomObject.name;
};

var getPlayerInventory = function () {
	var result = playerInventory.toString();
	result = result.replace(/,/g, ", ");
	return 'You have the following items: ' + result;
};

//# loadRoom(roomFileName)
var loadRoom = function (roomFileName) {
	//console.log('** himins_room.js loadRoom(%s)', roomFileName);

	fs.readFile(roomFileName, 'utf8', function (err, data) {
		if(err) {
			console.log(err);
		} else {
			roomObject = JSON.parse(data);
			//console.log(roomObject.name);
			init();
			processUserInput();
		}
	});
};
module.exports.loadRoom = loadRoom;

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

// # doGameCommand(cmd, message)
var doGameCommand = function (rl, cmd, message) {
	console.log(formatText(message, 60));

	// send a control-c from the terminal
	if (cmd === 'quit') {
		rl.write(null, {ctrl: true, name: 'c'});
	}	
};

// # doNavigationCommand(cmd, message)
var doNavigationCommand = function (cmd, message) {
	playerLocation = cmd;
	gameCommandsObject['where'] = getPlayerDisplayString();

	// check if section contains items
	loadSectionCommands(playerLocation);

	// update list of commands displayed by help
	gameCommandsObject['help'] = getCommandList();

	console.log(formatText(message, 60));
};

// # doItemCommand(cmd, message)
var doItemCommand = function (cmd, message) {
	
};

// # welcome()
var welcome = function () {
	console.log();
	console.log(formatText('Welcome to the ' + roomObject.name));
	console.log(formatText('-'.repeat( 'Welcome to the '.length + roomObject.name.unformattedLength())));
	console.log(formatText(roomObject.description, 80));
	console.log();

	if (playerLocation) {
		var message = navigationCommandsObject[playerLocation];
		doNavigationCommand(playerLocation, message);
	};
};

//# processUserInput()
var processUserInput = function () {
	//console.log("** himins_room.js processUserInput()");

	var readline = require('readline'),
			rl = readline.createInterface(process.stdin, process.stdout);

	welcome();

	rl.setPrompt('himins> ');
	rl.prompt();

	rl.on('line', function(line) {
		var cmd = line.trim().toLowerCase(),
				message = '';

		message = gameCommandsObject[cmd];
		if (message) {
			doGameCommand(rl, cmd, message);
		}

		message = navigationCommandsObject[cmd];
		if (message) {
			doNavigationCommand(cmd, message);
		}

		message = sectionCommandsObject[cmd];
		if(message) {
			doItemCommand(cmd, message);
		}

		rl.prompt(true);

	});

	rl.on('close', function () {
		process.exit(0);
	});
};
module.exports.processUserInput = processUserInput;

// # formatText(text, columnWidth)
// Transforms text (with basic markdown syntax into ASCII TTY) 
// and wraps it to fit column specified by columnWidth.
// Words between underscores (_word_) are formatted as bold red.
// Words between astericks (*word*) are for underline blue.
// Words that start with an exclamation point (!WORD) are treated as function identifiers
var formatText = function (text, columnWidth) {
	var result = text;

	result = resolveFunctions(text);
	result = renderFormatCodes(result);
	var wrap = linewrap(2, 78, {skipScheme: 'ansi-color'});
	result = wrap(result);

	return result;
};

var renderFormatCodes = function (text) {
	var result = text;

	result = result.replace(/ _/g, ' ' + BOLD_RED_ESC);
	result = result.replace(/_ /g, NORMAL_ESC + ' ');
	result = result.replace(/_,/g, NORMAL_ESC + ',');
	result = result.replace(/_\./g, NORMAL_ESC + '.');
	result = result.replace(/_;/g, NORMAL_ESC + ';');
	result = result.replace(/_:/g, NORMAL_ESC + ':');
	result = result.replace(/_-/g, NORMAL_ESC + '-');
	result = result.replace(/_$/g, NORMAL_ESC); // match _ at EOL

	result = result.replace(/ \*/g, ' ' + BOLD_GREEN_ESC);
	result = result.replace(/\* /g, NORMAL_ESC + ' ');
	result = result.replace(/\*,/g, NORMAL_ESC + ',');
	result = result.replace(/\*\./g, NORMAL_ESC + '.');
	result = result.replace(/\*;/g, NORMAL_ESC + ';');
	result = result.replace(/\*:/g, NORMAL_ESC + ':');
	result = result.replace(/\*-/g, NORMAL_ESC + '-');
	result = result.replace(/\*$/g, NORMAL_ESC); // match * at EOL

	return result;
};

var resolveFunctions = function (text) {
	var result = text;

	result = result.replace(/!PLAYER_LOCATION/g, playerLocation);

	return result;
};


// # main entry point
// For testing purposes you can run this file directly with "node himins_room.js". The test logic expects a file named "himins_room_1.json" with the defination of a room object!

loadRoom("himins_room_1.json");
