// # himins_repl.js
// Read, evaluate, and print loop

/*jslint browser: false, continue: true, devel: true, indent: 2, maxerr: 50, newcap : true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: false, white: true
*/

// # module includes
var
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
    message = 'hi *there*';

    writeToClient(client, format.formatText(message, 80));

};
module.exports.processUserInput = processUserInput;

