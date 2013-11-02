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
 * Himin Storage Service
 * 
 */

var $synthesize = require('synthesis').synthesize;
var hat = require('hat');
var Class = require('jsclass/src/core').Class;
var mongoose = require('mongoose');

var userService = require('./himins_user.js');

// class

var Storage = new Class({
    initialize: function (userModel) {
              
        // setup the storage system

        this.guid = hat();
        this.userModel = userModel;
        
        // create two default users if needed
        
        this.createUser('gm', 'password');
        this.createUser('admin', 'password');
    },
    
    createUser: function (nameStr, passwordStr) {
      
        // create the user
        var userObject =  new userService.User();
        userObject.setNameUser(nameStr);
        userObject.setPasswordUser(passwordStr);
        userObject.isOnline = false;
        
        // add user to database if not there already
        var userJavascriptObject = {
            name : nameStr,
            password : passwordStr,
            guid : userObject.guid,
            isOnline : userObject.isOnline
        };
        console.log(userJavascriptObject);

        var userJson = JSON.stringify(userJavascriptObject);
        console.log(userJson);
        
        var userDocument = new this.userModel(userJavascriptObject);
        userDocument.save(function (err) {
          if (!err) {
            throw err;
          } else {
            console.log("new user added to user stoarge");;
          }
        });
    }
});

// mutators

$synthesize(Storage, 'guid', 'read');

exports.Storage = Storage;













