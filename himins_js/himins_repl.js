// # himins_repl.js
// Read, evaluate, and print loop

/*jslint browser: false, continue: true, devel: true, indent: 2, maxerr: 50, newcap : true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: false, white: true
*/

var
  commands = require('./himins_commands.js'),
  readline = require('readline');


//# processUserInput()
var processUserInput = function () {
  //console.log("** himins_repl.js processUserInput()");

  var
    rl = readline.createInterface(process.stdin, process.stdout);

  rl.setPrompt('himins> ');
  rl.prompt();

  rl.on('line', function (line) {
    var
      cmd = line.trim().toLowerCase(),
      cmdMap = commands.getCommandMap(),
      cmdKind = commands.getCommandKindFromName(cmd),
      message = cmdMap[cmd];

    if (message && cmdKind === 'game') {
      commands.doGameCommand(rl, cmd, message);

    } else if (message && cmdKind === 'navigation') {
      commands.doNavigationCommand(cmd, message);

    } else if (message && cmdKind === 'item') {
      commands.doItemCommand(cmd, message);
    }

    rl.prompt(true);

  });

  rl.on('close', function () {
    process.exit(0);
  });
};
module.exports.processUserInput = processUserInput;
