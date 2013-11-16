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

  ipAddress = "127.0.0.1", // TODO: get from environment var
  portNumber = 9000, // TODO: get from environment var

  startingGameFile = './himins_json/himins_game.json',
  defaultPlayerFile = './himins_json/himins_player.json',
  titleScreen = './himins_txt/himins_screen_title.txt';

// # broadcast(message, client, kind)
// broadcast messages to every client but this one
// if a client is discovered to be unresponsive it is removed from the client list
var broadcast = function (message, client, kind) {
    var cleanup = [], i, l, payload;
    
    for (i = 0, l = clientList.length; i < l; i += 1) {
        if (client !== clientList[i]) {
            // client is in the client list
            if (clientList[i].writable) {
                // compose the message
                if (kind === 'user') {
                    // todo: localize "say"
                    payload = client.name + ' yells to everyone: ' + message;
                } else {
                    payload = 'Himins reports ' + message;
                }
                clientList[i].write(payload);
            } else {
                // client is not writable, kill it
                cleanup.push(clientList[i]);
                clientList[i].destroy();
            }
        }
    }
    
    // remove dead clients from client list
    for (i = 0, l = cleanup.length; i < l; i += 1 ) {
      clientList.splice(clientList.indexOf(cleanup[i]), 1);
    }

};
module.exports.broadcast = broadcast;

// # himinsServer('connection', function (client))
// handle a client connection and other client events (data, end, error)
himinsServer.on('connection', function (client) {
  var
    cmdMap = {},
    welcomeMessage = '';
    
  // give the client a name and add the client to the list of clients
  client.name = _.uniqueId('client_');
  clientList.push(client);

    // ## init the commands list and any add app commands
    commands.init([{ 
        name: 'quit',
        description: 'Himins reports you have descended to earth. Your progress has not been saved.',
        action: '!NO_ACTION',
        kind: 'app' 
      }]
    );

  files.loadTEXT(titleScreen, function (resultObject) {
    client.write(resultObject);
  });

  // ## associate a player with this client
  files.loadJSON(defaultPlayerFile, function (resultObject) {
    player.init(resultObject);
    client.player = resultObject;
    welcomeMessage = format.formatText('Welcome to _Himins_ mortal. Your name is _' + client.player.name + '_. You should pray for _help_.', 80);
    repl.writeToClient(client, welcomeMessage.trim());
    client.write('me: ');
  });

  // ## associate a game with this app
  files.loadJSON(startingGameFile, function (resultObject) {
    game.init(resultObject);
    gameObject = resultObject;
    console.log('*** gameObject has loaded: ', gameObject.name);
  });

  // ## client.on('data', function (data))
  // handle incoming client data
  client.on('data', function (data) {
    // log it
    console.log(client.name + ' incoming data: ' + data);
    
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

// ## Add String object extentions
strutils.init();

// ## Give a hint to the webmaster
console.log("// Use telnet client to access: telnet " + ipAddress + " " + portNumber);

// ## Start up the server
himinsServer.maxConnections = 10;
himinsServer.listen(portNumber);