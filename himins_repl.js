// # himins_repl.js
// Read, evaluate, and print loop

var commands = require('./himins_commands.js'),
	readline = require('readline');


//# processUserInput()
var processUserInput = function () {
	//console.log("** himins_repl.js processUserInput()");

	var rl = readline.createInterface(process.stdin, process.stdout);

	welcome();

	rl.setPrompt('himins> ');
	rl.prompt();

	rl.on('line', function(line) {
		var cmd = line.trim().toLowerCase(),
				message = '';

		message = gameCommandsObject[cmd];
		if (message) {
			commands.doGameCommand(rl, cmd, message);
		}

		message = navigationCommandsObject[cmd];
		if (message) {
			commands.doNavigationCommand(cmd, message);
		}

		message = sectionCommandsObject[cmd];
		if(message) {
			commands.doItemCommand(cmd, message);
		}

		rl.prompt(true);

	});

	rl.on('close', function () {
		process.exit(0);
	});
};
module.exports.processUserInput = processUserInput;
