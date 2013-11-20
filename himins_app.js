// # himins_app.js
// Main entry point to Himins application.

/*jslint browser: false, continue: true, devel: true, indent: 2, maxerr: 50, newcap : true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: false, white: true
*/

// ## includes
var
  // ### Node modules
  net = require('net'),

  // ### 3rd party modules
  _ = require('underscore'),

  // ### Himins modules
  game = require('./himins_js/himins_game'),
  room = require('./himins_js/himins_room'),
  player = require('./himins_js/himins_player'),
  commands = require('./himins_js/himins_commands'),
  repl = require('./himins_js/himins_repl'),
  format = require('./himins_js/himins_format'),
  strutils = require('./himins_js/himins_string_utils'),
  files = require('./himins_js/himins_file_utils');

// ## module vars
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

// # broadcast(message, client, kind)
// broadcast messages to every client but this one
// if a client is discovered to be unresponsive it is removed from the client list
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
          payload = 'Himins reports ' + message;
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

// # himinsServer('connection', function (client))
// handle a client connection and other client events (data, end, error)
himinsServer.on('connection', function (client) {
  var uuid = 0;

  // TODO: If a client tries to connect before the game has loaded it should be rejected!
    
  // give the client a name and add the client to the list of clients
  uuid = _.uniqueId();
  client.name = 'client_' + uuid;
  clientList.push(client);

  files.loadTEXT(titleScreen, function (resultObject) {
    client.write(resultObject);
  });

  // associate a player with this client
  files.loadJSON(defaultPlayerFile, function (resultObject) {
    player.init(resultObject);
    resultObject.name = resultObject.name + uuid;
    client.player = resultObject;

    // each player gets her own potentialy unqie set of commands
    commands.init(client.player.commands);

    // all players can quit (disconnect actually)
    commands.addCommand(client.player.commands, { 
      name: 'quit',
      description: 'Himins reports you have descended to earth. Your progress has not been saved.',
      action: '!QUIT_APP',
      kind: 'app' 
    });

    // add the name of the game as a command
    commands.addCommand(client.player.commands, { 
      name: gameObject.name.toLowerCase(),
      description: gameObject.description,
      action: '!NO_ACTION',
      kind: 'game' }
    );

    // associate the player with the game add any game level commands
    if (gameObject) {
      client.player.game = gameObject;
      client.player.commands = commands.combineCommands(client.player.commands, gameObject.commands);
      client.player.gameName = gameObject.name;
      client.player.roomName = gameObject.startRoom;
      client.player.sectionName = game.getRoomByName(gameObject, gameObject.startRoom).spawnSection;
    }

    repl.writeToClient(client, format.formatText(client, gameObject.welcome, 0, 80));

    broadcast('*' + client.player.name + '* has joined the game', client, 'system');
  });

  // ## client.on('data', function (data))
  // handle incoming client data
  client.on('data', function (data) {
    // log it
    console.log(client.name, ' incoming data:', String(data));
    repl.processUserInput(client, data);
  });
  
  // ## client.on('end', function ())
  // handle client disconnection
  client.on('end', function () {
    // stop updating the user loop associated with this client
    // remove client from the list of clients
    clientList.splice(clientList.indexOf(client), 1);
    // log it
    console.log(client.name + ' disconnected by end');
  });
  
  // ## client.on('error', function (e))
  // handle client error (OMG!)
  client.on('error', function (e) {
    console.log(e);
  });
});

// # clientCount()
var clientCount = function () {
  return clientList.length;
};
module.exports.clientCount = clientCount;

// # getClientList()
var getClientList = function () {
  return clientList;
};
module.exports.getClientList = getClientList;

// # getClientByID(clientID)
var getClientByID = function(clientID) {
  var result = "";

  result = _.find(clientList, function (client) {
    return client.name.toLowerCase() === clientID.toLowerCase();
  });

  return result; 
};
module.exports.getClientByID = getClientByID;

// # main entry point of himins_app
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