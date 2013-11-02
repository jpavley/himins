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

var $synthesize = require('synthesis').synthesize;
var hat = require('hat');
var Class = require('jsclass/src/core').Class;

// class

var User = new Class({
    initialize: function () {
        this.guid = hat();
        this.isOnline = false;
    }
});

// mutators

$synthesize(User, 'guid', 'read');
$synthesize(User, 'guidCharacter', 'read-write');

$synthesize(User, 'nameUser', 'read-write');
$synthesize(User, 'passwordUser', 'read-write');
$synthesize(User, 'isOnline', 'read-write');

$synthesize(User, 'client', 'read-write');

exports.User = User;












