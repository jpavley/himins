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
 * Himins Character Service
 * 
 */

var hat = require('hat');

// Constructor

exports.User = (function () {
    
    // Private Properties

    var guid = 0,
        userGuid = 0,
        charName = undefined,
        history = [],
        experiencePoints = 0,
        health = 0,
        energy = 0,
        luck = 0,
        hitPoints = 0,
        armorPoints = 0,
        locationX = 0,
        locationY = 0,
        locationZ = 0,
        isDead = true,
        isSleeping = false,
        slotHat = undefined,
        slotGoogles = undefined,
        slotCoat = undefined,
        slotGloves = undefined,
        slotPants = undefined,
        slotBoots = undefined,
        slotPack = undefined,
        slotMelee = undefined,
        slotRanged = undefined,
        buffs = [];
        
        

    // Public API
    
    konstructor = function () {
        guid = hat();
    };
    
    konstructor.prototype = {
        version: "1.0",
        
        getGuid: function () {
            return guid;
        },
        
        getSomeOtherProp: function () {
            return someOtherProp;
        },
        
        setSomeOtherProp: function (obj) {
            someOtherProp = obj;
        }       
    };
    
    return konstructor;
    
})();













