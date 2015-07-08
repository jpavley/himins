/**
 * @fileOverview Main entry point for himins app
 * @module
 * @requires net
 * @requires underscore
 * @requires ./himins_js/himins_game
 * @requires ./himins_js/himins_room
 * @requires ./himins_js/himins_player
 * @requires ./himins_js/himins_commands
 * @requires ./himins_js/himins_repl
 * @requires ./himins_js/himins_format
 * @requires ./himins_js/himins_string_utils
 * @requires ./himins_js/himins_file_utils
 */

var
  // node/npm modules
  net = require('net'),
  _ = require('underscore'),
  log = require('bunyan'),
  telnet = require('telnet');

var
  // cleint vars
  clientList = [],

  // log vars
  logUuid = _.uniqueId(),
  logName = 'himmins_session_log' + logUuid,
  log = bunyan.createLogger({
      name: logName,
      streams: [{
          path: 'logs/' + logName + '.log',
          level: 'info'
      }],
  }),

  // server config vars
  // TODO: Get from commandLine
  ipAddress = "127.0.0.1",
  portNumber = 99,
  maxUsers = 10,
  gameFile = './himins_json/himins_game.json',
  playerFile = './himins_json/himins_player.json',

  game = game.start();

/**
  * Creates server and handles client communications
  * @name telnet.createServer
  */
telnet.createServer(function (client) {
  var
    uuid = _.uniqueId();

  client.name = 'client_' + uuid;
  clientList.push(client);

  log.info('client %s connected!', client.name);

  client.do.transmit_binary();
  client.do.window_size();

  client.player = game.createPlayer(client);

  client.on('window size', function (e) {
    if(e.command === 'sb') {
      client.width = e.width;
      client.height = e.height;
      log.info('client %s resized window to %d by %d', 
        client.name, client.width, client.height);
    }
  });

  client.on('data', function (b) {
    var inputStr = String(data).trim().toLowerCase();

    // if inputStr is not standard ascii block it
    if (inputStr.isPrintable()) {
      log.info(client.name, ' incoming data:', inputStr);
      game.processUserInput(client, data);
    }
  });

  game.welcome(client);
});

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

/**
  * Main entry point of the himins server app
  * @name Main
  */
console.log('');
console.log('**** **** **** himins is starting up **** **** ****');
console.log('');

// add String object extentions
strutils.init();

// associate a game with this app
files.loadJSON(startingGameFile, function(resultObject) {
  game.init(resultObject);
  gameObject = resultObject;
  console.log('*** gameObject has loaded: ', gameObject.name);
});

// give a hint to the webmaster
console.log('// Use telnet client to access: telnet ' + ipAddress + ' ' + portNumber);

// start up the server
himinsServer.maxConnections = maxUsers;
himinsServer.listen(portNumber);
