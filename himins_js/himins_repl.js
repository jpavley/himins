// # himins_repl.js
// Read, evaluate, and print loop

/*jslint browser: false, continue: true, devel: true, indent: 2, maxerr: 50, newcap : true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: false, white: true
*/

// ## module includes
var
  // ### 3rd party modules
  _ = require('underscore'),

  // ### himins modules
  commands = require('./himins_commands'),
  format = require('./himins_format');

// # writeToClient(client, message);
var writeToClient = function (client, message) {

  if (client && client.writable) {
    client.write(message + '\n');
  } else {
    console.log('client not writable');
    console.log('*** himins_app.js writeToClient(%s, %s)', message, client);
  }
};
module.exports.writeToClient = writeToClient;

//# processUserInput(client, data)
var processUserInput = function (client, data) {
  //console.log('*** himins_repl.js processUserInput());
  var 
    input = String(data).trim().toLowerCase(),
    command = {},
    action = '!NO_ACTION';

    //console.log(client.player.commands);

    command = _.find(client.player.commands, function (cmd) {
      return cmd.name.toLowerCase() === input;
    });

    if (command) {
      writeToClient(client, format.formatText(client, command.description, 2, 78));
      commands.doAction(client, command.action);
    } else {
       writeToClient(client, format.formatText(client, 'Himins is sorry to report that *' + input+ '* is not available at this time', 2, 78));    
    }

};
module.exports.processUserInput = processUserInput;

