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

// ## module constants
var
  LEFT_INDENT = 2,
  PARAGRAPH_WIDTH = 78;

// # writeToClient(client, message);
var writeToClient = function (client, message) {
  console.log('himins_repl.js writeToClient(', client.name, message, ')');

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
  //console.log('*** himins_repl.js processUserInput(', client.name, ', ', data, ')');

  var 
    input = String(data).trim().toLowerCase(),
    commandObject = {};

    commandObject = _.find(client.player.commands, function (cmd) {
      return cmd.name.toLowerCase() === input;
    });

    if (commandObject) {
      writeToClient(client, format.formatText(client, commandObject.description, LEFT_INDENT, PARAGRAPH_WIDTH));
      commands.doAction(client, commandObject);
    } else {
       writeToClient(client, format.formatText(client, '_himins_ is sorry to report that *' + input+ '* is not available at this time', LEFT_INDENT, PARAGRAPH_WIDTH));    
    }

};
module.exports.processUserInput = processUserInput;

