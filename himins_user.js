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

    var guid = 0,
        userCharacter = {},
        userName = "",
        userPassword = "",
        isOnline = false;

    // Public API
    
    konstructor = function () {
        guid = hat();
    };
    
    konstructor.prototype = {
        version: "1.0",
        
        getGuid: function () {
            return guid;
        },
        
        getCharacter: function () {
            return userCharacter;
        },
        
        setCharacter: function (obj) {
            userCharacter = obj;
        },
        
        getUserName: function () {
            return userName;
        },
        
        setUserName: function (str) {
            userName = str;
        },
        
        getPassword: function () {
            return password;
        },
        
        setPassword: function (str) {
            password = str;
        },
        
        getIsOnline: function () {
            return isOnline;
        },
        
        setIsOnline: function (flg) {
            isOnline = flg;
        }
    };
    
    return konstructor;
    
})();













