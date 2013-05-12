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

var hat = require('hat');

// Constructor

exports.User = (function () {
    
    // Private Static Properties
    
    var version = "1.0";
    
    // Private Properties

    this.guid = 0;
    this.someOtherProp = {};

    // Public API
    
    konstructor = function () {
        this.guid = hat();
    };
    
    konstructor.prototype = {
                
        // Public Methods
        
        getVersion: function () {
            return version;
        },
        
        getGuid: function () {
            return this.guid;
        },
        
        getSomeOtherProp: function () {
            return this.someOtherProp;
        },
        
        setSomeOtherProp: function (obj) {
            this.someOtherProp = obj;
        }       
    };
    
    return konstructor;
    
})();













