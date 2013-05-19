// Copyright (c) 2013 John Franklin Pavley
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to 
// deal in the Software without restriction, including without limitation the 
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
// sell copies of the Software, and to permit persons to whom the Software is 
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in 
// all copies or substantial portions of the Software.

/*
 * Himin Chat Service
 * use telnet client to access: telnet 127.0.0.1 9000
 * 
 */

var net = require('net');
var gameService = require('./himins_game.js');
var screenService = require('./himins_scrn.js');

var chatServer = net.createServer(),
    clientList = [],
    userName,
    userMode = 'loggedout';

chatServer.on('connection', function(client) {
    
    var screen = new screenService.Screen();
    var titleScreen = screen.screenWithKey('title');    
    client.write(titleScreen);
    
    // give the client a name and add it to the client list
    client.name = client.remoteAddress + ':' + client.remotePort;
    clientList.push(client);
    
    // ask user to login
    loginUser(client);

    // greet the new client
    greetUser(client);
    
    // client is sending a message
    client.on('data', function(data) {
        if (userMode === 'loggedout') {
            // TODO: echo the characters typed...
        } else {
            broadcast(data, client, 'user');
            // log it
            console.log(client.name + ' says ' + data);
        }
    });
    
    // client is disconnecting
    client.on('end', function() {
        broadcast(client.name + ' quit\n', client, 'system');
        clientList.splice(clientList.indexOf(client), 1);
        // log it
        console.log(client.name + ' quit');
    });
    
    // OMG!
    client.on('error', function () {
        console.log(e);
    });
    
    function loginUser(client) {
        if (userMode === 'loggedout') {
            // TODO: Figure out how to authenticate a user!
            //client.write('Username (or \'forgot it\'): ');
            //client.write('Password (or \'forgot it\'): ');            
        }
        userMode = 'loggedin';
    };
    
    function greetUser(client) {
        client.write('Greetings player ' + client.name + '!' + 'Type \"start\" when ready\n');
        // let other clients know this client has joined
        broadcast('player ' +client.name + ' joined\n', client, 'system');
        // log it
        console.log(client.name + ' joined');
    };
    
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
                        payload = client.name + ' says ' + message;
                    } else {
                        payload = message;
                    }
                    // write the message
                    clientList[i].write(payload);
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
    
});

chatServer.listen(9000);