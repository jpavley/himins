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
 * TEMPLATE Javascript Entity
 * 
 */

var $synthesize = require('synthesis').synthesize;
var hat = require('hat');

require('jsclass');
JS.require('JS.Class');

// class

var SomeThing = new JS.Class({
    initialize: function () {
        this.guid = hat();
    }
});

// mutators

$synthesize(SomeThing, 'guid', 'read');
$synthesize(SomeThing, 'someProp', 'read-write');

exports.User = SomeThing;













