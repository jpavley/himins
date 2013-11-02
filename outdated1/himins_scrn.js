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
 * Himin Scrn Service
 * 
 */

var $synthesize = require('synthesis').synthesize;
var hat = require('hat');
var Class = require('jsclass/src/core').Class;

var fs = require('fs');

// class

var Screen = new Class({
    initialize: function () {
        this.guid = hat();
        this.listScreens = {'title': 'screen_title.txt'};
    },
    
    screenWithKey: function (key) {
        var screenFile = this.listScreens[key];
        var result = [];
        if(screenFile) {
            var filePath = './screens/' + screenFile;
            var fileOptions = ['String','r'];
            var buffer = fs.readFileSync(filePath, fileOptions);
            result = buffer.toString('utf8');
        } else {
            // throw something!
           console.log('no file found for key: ' + key);
        }
        return result;
    }
});

// mutators

$synthesize(Screen, 'guid', 'read');
$synthesize(Screen, 'listScreens', 'read-write');

exports.Screen = Screen;

