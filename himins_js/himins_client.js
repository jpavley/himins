/**
 * @fileOverview Client management
 * Creates and maanges lists of clients for a game.
 * Reads from and writes to clients.
 * Broadcasts messages to all clients.
 * @module
 * @requires underscore
 * @requires bunyan
 * @requires himins_format

 */

 var
  // includes
  _ = require('underscore'),
  bunyan = require('bunyan'),
  formatter = require('./himins_format');

var
  // log vars
  logName = 'himmins_client_log', // TODO: Single rotating log file for all of himins moved to game level 
  log = bunyan.createLogger({
      name: logName,
      streams: [{
          type: 'rotating-file',
          path: 'logs/' + logName + '.log',
          period: '1d',
          count: 5
      }],
  });

/**
 * Creates and returns a new empty client list
 * @returns {Array}
*/

var createNewEmptyClientList = function() {
  var result = [];
  return result;
};

module.exports.createNewEmptyClientList = createNewEmptyClientList;

/**
 * Broadcasts messages to all clients
 * Kills any dead clients that can't be written to.
 * Returns updated client list.
 * @param {string} message
 * @param {Array} clientList 
 * @returns {Array}
*/

var broadcast = function(template, context, indent, clientList) {
  var
    deadList = [],
    style = "info",
    message = "";

  _.each(clientList, function(client, index, list) {

    if (client.writable) {
        
        message = formatter.formatText(context, template, indent, client.width, style);
        client.write(message + '\n');

        log.info('client %s broadcast: %s', client.name, message);

        console.log(message);

    } else {

      // TODO: Log fact of dead client
      // client is not writable, kill it
      log.info('client %s is not writable', client.name);
      deadList.push(client);
      client.destroy();

    }
  });

  _.each(deadList, function(client, index, list) {

    //console.log(clientList);
    clientList.splice(clientList.indexOf(client), 1);
  });

  return clientList;
};

module.exports.broadcast = broadcast;


