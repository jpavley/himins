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
  mongoServerURL = 'mongodb://127.0.0.1:27017/himinsTest', // TODO: Get server address from config file
  mongoCollection = 'himinsGame'; // TODO: Get server address from config file

// Game vars

var
  gameStarted = false,
  gameName = 'himinsGameRelease_0_1',
  gameKey = { name: gameName },
  gameState = {},
  gameIntervalID = 0,
  gameFPS = 1, // TODO: Get FPS from config file
  gameInitialState = {
    name: gameName,
    clientList: [],
    playerList: [],
    tickCount: 0
  };

/**
 * Starts or restarts the game.
 * If the game is already started does nothing and return false.
 * If the game is not started tries to load game from persistence.
 * If a saved game doesn't exist, create a new game.
 * Either way returns true if the game successfully starts.
 * @returns {Boolean} game did start
 */ 

var start = function() {

  var didGameStart = false;

  if (gameStarted) {
    // sorry, you can only call this function once!
    log.error('game already started!');

  } else {
    log.info('starting game');

    gameStarted = true;
    didGameStart = true;

    gameState = gameInitialState;

    // create from scratch or load the game properties from persistence

    MongoClient.connect(mongoServerURL, function (err, db) {

      if (err) throw err;

      var collection = db.collection(mongoCollection);
      collection.find(gameKey).toArray(function (err, results) {
        if (results.length === 0) {
          collection.insert(gameInitialState, function (err, docs) {
            log.info('inserted gameInitialState into persistence');
            db.close();
          });
        } else {
          gameState = results[0]; // this might need to move to a call back!
          log.info('loaded gameState from persistence');
          db.close();            
        }
      });

    });

    // start the world clock ticking
    run();
    gameIntervalID = setInterval(run, 1000/gameFPS);

  } // end else

  return didGameStart;
};

module.exports.start = start;

/**
 * Stops the game.
 * Writes game state to persistence.
 * @returns {Boolean} game did stop
 */ 

var stop = function() {

  var result = false; // return false if game is not started

  if (gameStarted) {
    result = true;
    clearInterval(gameIntervalID);

    MongoClient.connect(mongoServerURL, function (err, db) {

      if (err) throw err;

      var collection = db.collection(mongoCollection);

      collection.save(gameState, function (err, results) {
        log.info('saved game state into persistence');
        db.close();
      });
    });

  }

  return result;
};

module.exports.stop = stop;

/**
 * Executes the game loop.
 * Called by setInterval based on FPS.
 */ 

var run = function() {
  updateGameState();
  updatePlayers();
  updateClients();
};

module.exports.run = run;

/**
 * Updates the game state
 */ 

var updateGameState = function() {
  log.info('updateGameState');
};

module.exports.updateGameState = updateGameState;

/**
 * Updates the player states
 */ 

var updatePlayers = function() {
  log.info('updatePlayers');
};

module.exports.updatePlayers = updatePlayers;

/**
 * Updates the client states
 */ 

var updateClients = function() {
  log.info('updateClients');
};

module.exports.updateClients = updateClients;


/**
 * Returns the game name
 * @returns {String} game name
 */ 

var getGameName = function() {
  return gameName;
};

module.exports.getGameName = getGameName;
/**
 * Returns the game state object
 * @returns {Object} game state
 */ 

var getGameState = function() {
  return gameState;
};

module.exports.getGameState = getGameState;

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

