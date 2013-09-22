// himins_app.hs
// Main entry point to Himins
// Use telnet client to access: telnet 127.0.0.1 9000

var net = require('net'),
    parser = require('./himins_parser'),
    user = require('./himins_user'),
    display = require('./himins_client');

var himinsServer = net.createServer(),
    clientList = [],
    ipAddress = "127.0.0.1",
    portNumber = 9000;

himinsServer.on('connection', function (client) {
  
  // do initialization tasks
  var lingo = "en_US"; // todo: get the lingo from the client
  parser.loadClientStrings(lingo); // todo: make sure this is multi-user!
  
  // give the client a name and add the client to the list of clients
  client.name = user.createUser(client.remoteAddress, client.remotePort, lingo);
  //client.name = client.remoteAddress + ':' + client.remotePort;
  clientList.push(client);
  
  // weclome the user
  client.write(display.eraseScreen);
  client.write('Welcome to Himins ' + display.boldRedOn + client.name + display.formatOff + '. May we be of service? \n');
  
  // handle incoming client data
  client.on('data', function (data) {
    // log it
    console.log(client.name + ' incoming data: ' + data);
    // send data to the parser
    var result = parser.processClientData(data);
    // write the response to the client
    client.write(display.cursorUp);
    client.write(result + '\n');
  });
  
  // handle client disconnection
  client.on('end', function () {
    // remove client from the list of clients
    clientList.splice(clientList.indexOf(client), 1);
    // log it
    console.log(client.name + 'disconnected');
  });
  
  // handle client error (OMG!)
  client.on('error', function () {
    // log it
    console.log(e);
  });
});

console.log("// Use telnet client to access: telnet " + ipAddress + " " + portNumber);

// start up the server
himinsServer.listen(portNumber);