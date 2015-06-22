// # himins_repl.js // Read, evaluate, and print loop

/*jslint browser: false, continue: true, devel: true, indent: 2, maxerr: 50, newcap : true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: false, white: true
*/

/**
 * @fileOverview Read, evaluate, and print loop
 * @module
 * @requires underscore
 * @requires ./himins_js/himins_commands
 * @requires ./himins_js/himins_format
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
  //console.log('himins_repl.js writeToClient(', client.name, message, ')');

  if (client && client.writable) {
    client.write(message + '\n');
  } else {
    console.log('client not writable');
    console.log('*** himins_app.js writeToClient(%s, %s)', message, client);
  }
};
module.exports.writeToClient = writeToClient;

// #screenCast(client, dataKey, screenKey)
var screenCast = function (client, dataKey, screenKey) {
  //console.log('himins_repl.js screenCast(', client.name, dataKey, screenKey, ')');

  var
    screenList = client.player.game[dataKey],
    currentScreen = client.player.game[screenKey],
    pageInfo = '',
    pageNumber = currentScreen + 1;

    if (currentScreen < screenList.length) {
      client.player.game.casting = true;
    } else {
      client.player.game.casting = false;
    }

    if(client.player.game.casting) {
      writeToClient(client, format.BOLD_RED_ESC + '%~~~~~~~*~~~~~~~~~*~~~~~~~~~*~~~~~~~~~*~~~~~~~~~*~~~~~~~~~*~~~~~~~~~*~~~~~~~~~%' + format.NORMAL_ESC);
      writeToClient(client, format.formatText(client, screenList[currentScreen], LEFT_INDENT, PARAGRAPH_WIDTH));
      writeToClient(client, format.BOLD_RED_ESC + '%~~~~~~~*~~~~~~~~~*~~~~~~~~~*~~~~~~~~~*~~~~~~~~~*~~~~~~~~~*~~~~~~~~~*~~~~~~~~~%' + format.NORMAL_ESC);

      pageInfo = '[' + pageNumber + ' of ' + screenList.length + ']';

      if (currentScreen + 1 < screenList.length) {
        writeToClient(client, format.formatText(client, 'Press *return* to continue ' + pageInfo, LEFT_INDENT, PARAGRAPH_WIDTH));
        client.player.game[screenKey] = currentScreen + 1;
      } else {
        writeToClient(client, format.formatText(client, pageInfo, LEFT_INDENT, PARAGRAPH_WIDTH));
        writeToClient(client, ''); // blankline
        writeToClient(client, format.formatText(client, 'You should pray for !COMMAND_NAMES.', LEFT_INDENT, PARAGRAPH_WIDTH)); 
        client.player.game[screenKey] = 0;
        client.player.game.casting = false;  
      }
    }
};
module.exports.screenCast = screenCast;

//# processUserInput(client, data)
var processUserInput = function (client, data) {
  //console.log('*** himins_repl.js processUserInput(', client.name, ', ', data, ')');

  var 
    input = String(data).trim().toLowerCase(),
    commandObject = {};

  if (client.player.game.casting){
    screenCast(client, "descriptionScreenCast", "currentScreen");
  } else {
    commandObject = _.find(client.player.commands, function (cmd) {
      return cmd.name.toLowerCase() === input;
    });

    if (commandObject) {
      writeToClient(client, format.formatText(client, commandObject.description, LEFT_INDENT, PARAGRAPH_WIDTH));
      commands.doAction(client, commandObject);
    } else {
       writeToClient(client, format.formatText(client, '_himins_ is sorry to report that *' + input+ '* is not available at this time', LEFT_INDENT, PARAGRAPH_WIDTH));    
    }
  }

};
module.exports.processUserInput = processUserInput;

