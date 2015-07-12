/**
 * @fileOverview Manages the himins game
 * Connects to a the persistence server.
 * Creates the logger.
 * Manages clients and players.
 * Processes user input.
 * Processes game events.
 * Contains the game loop
 * @module
 */

// Persistance

var MongoClient = require('mongodb').MongoClient,
    mongo = new MongoClient(),
    gameObject = {
      clientList: [],
      playerList: [],
      gameYear: 0,
      gameDay: 0,
      gameHour: 0,
      gameMinute: 0
    };

mongo.connect("mongodb://localhost/", function(err, db) { // TODO: Get server address from config file
  var himinsGameDB = db.db('himinsTest'); //TODO: get game db name from config file
  // TODO: load the game objects
});

// Logging

var
  // log vars
  logName = 'himmins_client_log', // TODO: Get filename from config file 
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
 * Starts or restarts the game
 */

var start = function() {
  var result = {};
  return result;
};
module.exports.start = start;

/**
 * Add a client to the game
 */

var addClient = function(game, client) {
  // TODO: if client doesn't already exist add to clientList
};
module.exports.addClient = addClient;

/**
 * Returns a current or new player for the client
 */

var getPlayer = function(game, client) {
  var result = {};
  // TODO: return a player for this client or create one for this client and persist
  return result;
};
module.exports.start = getPlayer;

/**
 * Returns a current or new player for the client
 */

var processUserInput = function(game, client, data) {
  // TODO: updated game world based on user input and persist
};
module.exports.start = processUserInput;

/**
 * Sends a message to the logger
 */

var logInfo = function(message) {
};
module.exports.start = logInfo;

/**
 * Returns the number of clients connected to the server
 */

var clientCount = function() {
  return clientList.length;
};
module.exports.clientCount = clientCount;

/**
 * Returns the list of clients connected to the server
 */

var getClientList = function() {
  return clientList;
};
module.exports.getClientList = getClientList;

/**
 * Returns a client connected to the server by ID
 */

var getClientByID = function(clientID) {
  var result = '';

  result = _.find(clientList, function(client) {
    return client.name.toLowerCase() === clientID.toLowerCase();
  });

  return result;
};
module.exports.getClientByID = getClientByID;

