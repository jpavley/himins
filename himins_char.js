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
    
    // Private Static Properties
    
    var version = "1.0";
    
    // Private Properties

    this.guid = ''; // globaly unique ID -- everthing has one of these
    this.ownerGuid = ''; // the guid of the user who owns this character
    this.charName = undefined; // the name of this character
    this.history = []; // list of important things this character has done:born, died, won, lost
    
    this.experiencePoints = 0; // earned by doing important things, improves stats
    this.healthPoints = 0; // 0 = death, buffs can help or hurt health
    this.luckPoints = 0; // based on slotted gloves, improves chances for winning fights, finding items
    this.hitPoints = 0; // based on slotted weapons, ammo, buffs
    this.armorPoints = 0; // based on slotted clothing, condition of clothing
    this.visionPoints = 0; // based on slotted googles, improves visual acquity
    this.reactionPoints = 0; // based on slotted boots, improves response time in fights
    
    this.locationX = 0; // Himins is a 3D labyrith
    this.locationY = 0; 
    this.locationZ = 0;
    
    this.isDead = true; // heath = 0
    this.isSleeping = false; // stunned or healing state
    
    this.slotHat = undefined; // armor, improves armor points
    this.slotGoogles = undefined; // armor, improves vision points
    this.slotCoat = undefined; // armor, improves armor points
    this.slotGloves = undefined; // armor, improves luck
    this.slotPants = undefined; // armor, improves armor points
    this.slotBoots = undefined; // armor, improves reaction points
    this.slotPack = undefined; // container for inventory of items
    this.slotMelee = undefined; // weapon, improves hit points
    this.slotRanged = undefined; // weapon, improves hit points
    
    this.buffs = []; // list of active buffs: powerups, diseases, etc...

    // Public API
    
    konstructor = function () {
        this.guid = hat();
    };
    
    konstructor.prototype = {
        version: "1.0",
        
        getVersion: function () {
            return version;
        },
        
        getGuid: function () {
            return this.guid;
        },
        
        getOwnerGuid: function () {
            return this.ownerGuid;
        },

        setOwnerGuid: function (n) {
            this.ownerGuid = n;
        },   
       
        getCharName: function () {
            return this.ownerGuid;
        },

        setCharName: function (s) {
            this.charname = s;
        },
         
        getHistory: function () {
            return this.history;
        },

        addEventToHistory: function (o) {
            this.history.push(o);
        },
         
        getExperiencePoints: function () {
            return this.experiencePoints;
        },

        setExperiencePoints: function (n) {
            this.experiencePoints = n;
        },
         
    };
    
    return konstructor;
    
})();













