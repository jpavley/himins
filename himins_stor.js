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

require('jsclass');
JS.require('JS.Class');

var userService = require('./himins_user.js');

// class

var Storage = new JS.Class({
    initialize: function () {
        this.guid = hat();
        this.users = [];
        this.users.push(this.createUser('gm', 'password'));
        this.users.push(this.createUser('admin', 'password'));
    },
    
    createUser: function (name, password) {
        var resultUser =  new userService.User();
        resultUser.setNameUser(name);
        resultUser.setPasswordUser(password);
        return resultUser;
    }
});

// mutators

$synthesize(Storage, 'guid', 'read');
$synthesize(Storage, 'users', 'read-write');

exports.Storage = Storage;













