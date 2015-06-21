/**
 * Main entry point for himins server
 * @module
*/

var
  
  net = require('net'),

  
  _ = require('underscore'),

  
  game = require('./himins_js/himins_game'),
  room = require('./himins_js/himins_room'),
  player = require('./himins_js/himins_player'),
  commands = require('./himins_js/himins_commands'),
  repl = require('./himins_js/himins_repl'),
  format = require('./himins_js/himins_format'),
  strutils = require('./himins_js/himins_string_utils'),
  files = require('./himins_js/himins_file_utils');


var 
  himinsServer = net.createServer(),

  clientList = [],
  gameObject = {},

  ipAddress = "127.0.0.1",  // TODO: get from environment var
  portNumber = 9000,        // TODO: get from environment var
  maxUsers = 10,            // TODO: get from environment var

  startingGameFile = './himins_json/himins_game.json',
  defaultPlayerFile = './himins_json/himins_player.json',
  titleScreen = './himins_txt/himins_screen_title.txt';

/**
 * Broadcasts messages to client
 * @param {string} message
 * @param {object} client
 * @param {string} kind - Type of client (user or system)
*/

var broadcast = function (message, client, kind) {
  var 
    deadList = [],
    payload = '';

  _.each(clientList, function (e, i, l) {
    if (client !== e) {
      if (e.writable) {
        if (kind === 'user') {
          payload = e.player.name + ' yells to everyone: ' + message;
        } else {
          payload = '_himins_ reports ' + message;
        }
        payload = format.formatText(e, payload, 2, 78);
        repl.writeToClient(e, payload);
      } else {
        // client is not writable, kill it
        deadList.push(e);
        e.destroy();   
      }
    }
  });

  _.each(deadList, function (client, index, deadList) {
    clientList.splice(clientList.indexOf(client), 1);
  });
};
module.exports.broadcast = broadcast;

/** 
  * Handles client connection events
  * @name Connection Handler 
  */
himinsServer.on('connection', function (client) {
  var
    uuid = 0,
    messageText = '';

  // TODO: If a client tries to connect before the game has loaded it should be rejected!

console.log('');
console.log('**** **** **** a client is starting up **** **** ****');
console.log('');
    
  // give the client a name and add the client to the list of clients
  uuid = _.uniqueId();
  client.name = 'client_' + uuid;
  clientList.push(client);

  files.loadTEXT(titleScreen, function (resultObject) {
    client.write(resultObject + '\n');
  });

  // associate a player with this client
  files.loadJSON(defaultPlayerFile, function (resultObject) {
    player.init(resultObject);
    resultObject.name = resultObject.name + uuid;
    resultObject.client = client;
    client.player = resultObject;

    // each player gets her own potentialy unqie set of commands
    commands.init(client.player.commands);

    // add the name of the game as a command
    commands.addCommand(client.player.commands, { 
      name: gameObject.name.toLowerCase(),
      description: gameObject.description,
      parameters: { 
        "dataKey": "descriptionScreenCast",
        "screenKey": "currentScreen"
      },
      action: '!SCREEN_CAST',
      kind: 'game' }
    );

    if (gameObject) {
      console.log('*** initializing player ', client.player.name, 'with game ', gameObject.name);

      // associate the player with the game
      client.player.game = gameObject;
      client.player.gameName = gameObject.name;

      // add game commands to the player's command list
      client.player.commands = commands.combineCommands(client.player.commands, gameObject.commands);

      // Bug: somehow repl.LEFT_INDENT and repl.PARAGRAPH_WIDTH are not set yet! So I'm using the actual values above (2, 78)
      messageText = format.formatText(client, gameObject.welcome, 2, 78);

      // welcome the player to the game
      repl.writeToClient(client, messageText);
    }

    broadcast('*' + client.player.name + '* has joined the game', client, 'system');
  });

  /** 
    * Handles incoming client data
    * @name Data Handler 
    */
  client.on('data', function (data) {
    var inputStr = String(data).trim().toLowerCase();

    // if inputStr is not standard ascii block it
    if(inputStr.isPrintable()) {
      console.log(client.name, ' incoming data:', inputStr); // log it
      repl.processUserInput(client, data);      
    }

  });

  
  /** 
    * Handles client disconnection
    * @name End Handler 
    */
  client.on('end', function () {
    // remove client from the list of clients
    clientList.splice(clientList.indexOf(client), 1);
    // tell the other clients
    broadcast('*' + client.player.name + '* has left the game', client, 'system');
    // log it
    console.log(client.name + ' disconnected by end');
  });

  
  /** 
    * Handles client error (OMG!)
    * @name Error Handler 
    */
  client.on('error', function (e) {
    console.log(e);
  });
});

/**
 * Returns the number of clients connected to the server
 */

var clientCount = function () {
  return clientList.length;
};
module.exports.clientCount = clientCount;

/**
 * Returns the list of clients connected to the server
 */

var getClientList = function () {
  return clientList;
};
module.exports.getClientList = getClientList;

/**
 * Returns a client connected to the server by ID
 */

var getClientByID = function(clientID) {
  var result = "";

  result = _.find(clientList, function (client) {
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
files.loadJSON(startingGameFile, function (resultObject) {
  game.init(resultObject);
  gameObject = resultObject;
  console.log('*** gameObject has loaded: ', gameObject.name);
});

// give a hint to the webmaster
console.log("// Use telnet client to access: telnet " + ipAddress + " " + portNumber);

// start up the server
himinsServer.maxConnections = maxUsers;
himinsServer.listen(portNumber);