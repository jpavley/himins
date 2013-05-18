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
 * Himin Game Service
 * 
 */

var $synthesize = require('synthesis').synthesize;
var hat = require('hat');

require('jsclass');
JS.require('JS.Class');

var storageService = require('./himins_stor.js');

// class

var Game = new JS.Class({
    
    initialize: function () {
        this.guid = hat();
        var storage = new storageService.Storage();
        this.listUsers = storage.getUsers();
        this.isStarted = false;
        if (this.listUsers) {
            this.isStarted = true;
            this.gameStart();
        } else {
            this.isStarted = false;
            this.gameFail();
        }
    },
    
    addUser: function () {
        
    },
    
    removeUser: function () {
        
    },
    
    gameStart: function () {
        
    },
    
    gameLoop: function () {
        
    },
    
    gameStop: function () {
        
    },
    
    gameFail: function () {
        
    }
    
});

// mutators

$synthesize(Game, 'guid', 'read');
$synthesize(Game, 'listUsers', 'read-write');
$synthesize(Game, 'isStarted', 'read-write');

exports.Game = Game;















