/**
 * @fileOverview Main entry point for himins app
 * Starts up the Telnet server.
 * Handles client connection events.
 * Starts up the game.
 * Associates a client with a player profile.
 * Runs forever.
 * @module
 * @requires net
 * @requires underscore
 * @requires telnet
 * @requires ./himins_js/himins_game
 * @requires ./himins_js/himins_client
 */

var
  // node/npm modules
  net = require('net'),
  _ = require('underscore'),
  telnet = require('telnet'),
  gameManager = require('./himins_js/himins_game'),
  clientManager = require('./himins_js/himins_client'),
  strTools = require('./himins_js/himins_string_utils');

var

  // server config vars
  // TODO: Get from config file
  ipAddress = "127.0.0.1",
  portNumber = 23,
  maxUsers = 10,

  // TODO: Start new game or restart old game?
  game = gameManager.start();

  strTools.init();

/**
  * Creates server and handles client communications
  * @name telnet.createServer
  */

telnet.createServer(function (client) {

  // all this code called everytime a client connects

  var
    uuid = _.uniqueId(),
    clientMessage = '',
    windowMessage = '',
    inputStr = '';

  client.himins_id = uuid;

  client.do.transmit_binary();
  client.do.window_size();

  gameManager.addClient(client);
  clientMessage = 'client ' + uuid + ' connected!';
  gameManager.logInfo(clientMessage);
  client.player = gameManager.getPlayer(game, client);

  /**
  * Handle client window size events
  * @name client.on(window size)
  */

  client.on('window size', function (e) {
    if(e.command === 'sb') {
      client.width = e.width;
      client.height = e.height;
      windowMessage = 'client ' + uuid + ' resized window to ' + client.width + ' by ' + client.height;
      gameManager.logInfo(windowMessage);
    }
  });

  /**
  * Handle client data events
  * @name client.on(data)
  */

  client.on('data', function (b) {
    inputStr = String(b).trim().toLowerCase();

    // if inputStr is not standard ascii block it
    if (inputStr.isPrintable()) {
      gameManager.logInfo('client ' + uuid + ' incoming data:' + inputStr);
      gameManager.processUserInput(client, inputStr);
    }
  });

  client.write('Welcome to the himins server... Login or sign up: ');
}).listen(portNumber);

/**
  * Main entry point of the himins server app
  * @name Main
  */
console.log('');
console.log('**** **** **** himins is starting up **** **** ****');
console.log('');

// give a hint to the webmaster
console.log('// Use telnet client to access: telnet ' + ipAddress + ' ' + portNumber);

