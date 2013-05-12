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
 * Himin User Service
 * 
 */

var hat = require('hat');

// Constructor

exports.User = (function () {
    
    // Private Properties
    
    this.guid = 0;
    this.characterGuid = 0;
    this.userName = '';
    this.userPassword = '';
    this.isOnline = false;

    // Public API
    
    konstructor = function () {
        this.guid = hat();
    };
    
    konstructor.prototype = {
        version: "1.0",
        
        getGuid: function () {
            return this.guid;
        },
        
        getCharacterGuid: function () {
            return this.characterGuid;
        },
        
        setCharacterGuid: function (n) {
            this.characterGuid = n;
        },
        
        getUserName: function () {
            return this.userName;
        },
        
        setUserName: function (str) {
            this.userName = str;
        },
        
        getPassword: function () {
            return this.password;
        },
        
        setPassword: function (str) {
            this.password = str;
        },
        
        getIsOnline: function () {
            return this.isOnline;
        },
        
        setIsOnline: function (flg) {
            this.isOnline = flg;
        }
    };
    
    return konstructor;
    
})();













