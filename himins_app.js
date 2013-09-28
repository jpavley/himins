// himins_app.hs
// Main entry point to Himins
// Use telnet client to access: telnet 127.0.0.1 9000

var net = require('net'),
    parser = require('./himins_parser'),
    user = require('./himins_user'),
    display = require('./himins_client'),
    game = require('./himins_game');

var himinsServer = net.createServer(),
    clientList = [],
    ipAddress = "127.0.0.1",
    portNumber = 9000;

himinsServer.on('connection', function (client) {
  
  // do initialization tasks
  var lingo = "en_US"; // todo: get the lingo from the client
  parser.loadClientStrings(lingo);
  
  // give the client a name and add the client to the list of clients
  client.name = user.createUser(client.remoteAddress, client.remotePort, lingo);
  //client.name = client.remoteAddress + ':' + client.remotePort;
  clientList.push(client);
  
  // weclome the user
  client.write(display.eraseScreen);
  client.write(parser.renderMessageForDisplay(client, 0, lingo) + '\n');
  client.write(display.prompt);
  
  // tell everyone the user is here
  // todo: localise "player" and "ascended"
  broadcast('player ' + display.boldRedOn + client.name + display.formatOff + ' ascended to himins.\n', client, 'system');
  
  // handle incoming client data
  client.on('data', function (data) {
    // log it
    console.log(client.name + ' incoming data: ' + data);
    // send data to the parser
    var result = parser.processClientData(client, data, lingo);
    
  });
  
  // handle client disconnection
  client.on('end', function () {
    // remove client from the list of clients
    clientList.splice(clientList.indexOf(client), 1);
    // log it
    console.log(client.name + 'disconnected by end');
  });
  
  // handle client error (OMG!)
  client.on('error', function (e) {
    console.log(e);
  });
});

// broadcast messages to every client but this one
function broadcast(message, client, kind) {
    var cleanup = [];
    
    for (var i = 0, l = clientList.length; i < l; i += 1) {
        if (client !== clientList[i]) {
            // client is in the client list
            if (clientList[i].writable) {
                // compose the message
                var payload;
                if (kind === 'user') {
                    // todo: localize "say"
                    payload = display.boldRedOn + client.name + display.formatOff + ' says ' + message;
                } else {
                    payload = message;
                }
                // write the message
                clientList[i].write(payload);
                clientList[i].write(display.prompt);
            } else {
                // client is on writable, kill it
                cleanup.push(clientList[i]);
                clientList[i].destory();
            }
        }
    }
    
    // remove dead clients from client list
    for (var i = 0, l = cleanup.length; i < l; i += 1 ) {
        clientList.splice(clientList.indexOf(cleanup[i]), 1);
    }
};


var stopUpdates = function () {
  clearInterval(game.intervalId);
}

// give a hint to the webmaster
console.log("// Use telnet client to access: telnet " + ipAddress + " " + portNumber);

// start up the game loop
game.intervalId = setInterval(game.run, 1000 / game.UPDATES_PER_SECOND);

// start up the server
himinsServer.listen(portNumber);

module.exports.broadcast = broadcast;