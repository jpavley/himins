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

// Logging vars

var
  bunyan = require('bunyan'),
  logName = 'himins_game', // TODO: Get filename from config file 
  log = bunyan.createLogger({
      name: logName,
      streams: [{
          type: 'rotating-file',
          path: 'logs/' + logName + '.log',
          period: '1d',
          count: 5
      }],
  });

// Persistance vars

var 
  MongoClient = require('mongodb').MongoClient,
  mongoServerURL = 'mongodb://localhost/'; // TODO: Get server address from config file

// Game vars

var
  gameStarted = false,
  gameDoc = {
    clientList: [],
    playerList: [],
    tickCount: 0
  };

/**
 * Starts or restarts the game
 * If the game is already started does nothing and return false
 * If the game is not started tries to load game from persistence
 * If a saved game doesn't exist, create a new game
 * either way returns true if the game successfully starts
 * @returns {Boolean} game did start
 */

var start = function() {

  var didGameStart = false;

  if (gameStarted) {
    // sorry, you can only call this function once!
    log.error('game already started!');    
  } else {
    log.info('trying to start game');

    // create from scratch or load the game properties from persistence

    MongoClient.connect(mongoServerURL, function(err, db) {

      if (err) {
        log.error('start() could not connect to Himins Mongo Server: %s', mongoServerURL);

      } else {
        log.info('start() connected to Himins Mongo Server: %s', mongoServerURL);

        loadGameVars(db, function() {
          log.info('game started successfully');
          gameStarted = true;
          didGameStart = true;
          db.close();
        });

      }
    });

    // start the world clock ticking
    // get ready to welcome users to the game

  }
  return didGameStart;
};

module.exports.start = start;

/**
 * Load or init game vars
 */

var loadGameVars = function(db, callback) {
  // TODO: if game vars don't exist create them
};
module.exports.loadGameVars = loadGameVars;

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
module.exports.getPlayer = getPlayer;

/**
 * Returns a current or new player for the client
 */

var processUserInput = function(game, client, data) {
  // TODO: updated game world based on user input and persist
};
module.exports.getPlayer = processUserInput;

/**
 * Sends a message to the logger
 */

var logInfo = function(message) {
};
module.exports.getPlayer = logInfo;

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

