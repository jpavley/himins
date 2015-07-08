/**
 * @fileOverview Client management
 * Creates and maanges lists of clients for a game.
 * Reads from and writes to clients.
 * Broadcasts messages to all clients.
 * @module
 * @requires underscore
 */

 var
  // includes
  _ = require('underscore'),
  format = require('./himins_format');



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
 * Kills any dead clients that can't be written to
 * Returns updated client list
 * @param {string} message
 * @param {Array} clientList 
 * @param return {Array}
*/

var broadcast = function(message, clientList) {
  var
    deadList = [],
    payload = '';

  _.each(clientList, function(client, index, list) {

    if (client.writable) {

      if (client.player) {
        // TODO: Log payload
        payload = format.formatText(e, payload, 2, 78);
        client.write(payload + '\n');
      } else {
        // TODO: Log fact of client without player (could be a test!)       
      }

    } else {

      // TODO: Log fact of dead client
      // client is not writable, kill it
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


