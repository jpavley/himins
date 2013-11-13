// himins_app.hs
// Main entry point to Himins
// Use telnet client to access: telnet 127.0.0.1 9000

/*jslint browser: false, continue: true, devel: true, indent: 2, maxerr: 50, newcap : true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: false, white: true
*/

var 
  net = require('net'),
  game = require('./himins_game');

var 
  himinsServer = net.createServer(),
  clientList = [],
  ipAddress = "127.0.0.1",
  portNumber = 9000,
  count = 0,
  startingGameFile = 'himins_game.json';

// # writeToClient(message, client);
var writeToClient = function (message, client) {
  if (client.writable) {
    client.write(message + '\n');
  } else {
    console.log('cleint not writable');
    console.log('*** himins_app.js writeToClient(%s, %s)', message, client);
  }
};
module.exports.writeToClient = writeToClient;

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
    
  // give the client a name and add the client to the list of clients
  client.name = 'mortal' + count++;
  clientList.push(client);
  
  // weclome the user
  client.write(client.name + ': ' + '> ');
  
  // tell everyone the user is here
  broadcast('Hello ', client, 'system');
  
  // ## start the game with the default map
  game.loadGame(startingGameFile);

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

// # setClientName(oldID, newID)
var setClientName = function (oldID, newID) {
  var i;

  for (i = 0; i < clientList.length; i++) {
    if (clientList[i].name.toLowerCase() === oldID.toLowerCase()) {
      clientList[i].name = newID.toLowerCase();
      break;
    }
  }
};
module.exports.setClientName = setClientName;

// # getClientByID(clientID)
var getClientByID = function(clientID) {
  var result = "", i;

  for (i = 0; i < clientList.length; i++) {
    if (clientList[i].name.toLowerCase() === clientID.toLowerCase()) {
      result = clientList[i];
      break;
    }
  } 
  return result; 
};
module.exports.getClientByID = getClientByID;


// # main entry point of himins_app

// give a hint to the webmaster
console.log("// Use telnet client to access: telnet " + ipAddress + " " + portNumber);

// start up the server
himinsServer.listen(portNumber);