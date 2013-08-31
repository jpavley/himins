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

var $synthesize = require('synthesis').synthesize;
var hat = require('hat');
var Class = require('jsclass/src/core').Class;

// class

var Character = new Class({
    initialize: function () {
        this.guid = hat();
    },
    
    recordEvent: function (event) {
        if(!this.history) {
            this.history = [];
        }
        this.history.push(event);
    }
});

// mutators

$synthesize(Character, 'guid', 'read'); // globaly unique ID -- everthing has one of thes
$synthesize(Character, 'guidOwner', 'read-write'); // the guid of the user who owns this character

$synthesize(Character, 'nameChar', 'read-write'); // the name of this character
$synthesize(Character, 'history', 'read-write'); // list of important things this character has done:born, died, won, lost

$synthesize(Character, 'pointsExperience', 'read-write'); // earned by doing important things, improves stats
$synthesize(Character, 'pointsHealth', 'read-write'); // 0 = death, buffs can help or hurt health
$synthesize(Character, 'pointsLuck', 'read-write'); // based on slotted gloves, improves chances for winning fights, finding items
$synthesize(Character, 'pointsHit', 'read-write'); // based on slotted weapons, ammo, buffs
$synthesize(Character, 'pointsArmor', 'read-write'); // based on slotted clothing, condition of clothing
$synthesize(Character, 'pointsVision', 'read-write'); // based on slotted googles, improves visual acquity
$synthesize(Character, 'pointsReaction', 'read-write'); // based on slotted boots, improves response time in fights

$synthesize(Character, 'locationX', 'read-write'); // Himins is a 3D labyrith
$synthesize(Character, 'locationY', 'read-write');
$synthesize(Character, 'locationZ', 'read-write');

$synthesize(Character, 'isDead', 'read-write'); // heath = 0
$synthesize(Character, 'isSleeping', 'read-write'); // stunned or healing state

$synthesize(Character, 'slotHat', 'read-write'); // armor, improves armor points
$synthesize(Character, 'slotGoogles', 'read-write'); // armor, improves vision points
$synthesize(Character, 'slotCoat', 'read-write'); // armor, improves armor points
$synthesize(Character, 'slotGloves', 'read-write'); // armor, improves luck
$synthesize(Character, 'slotPants', 'read-write'); // armor, improves armor points
$synthesize(Character, 'slotBoots', 'read-write'); // armor, improves reaction points
$synthesize(Character, 'slotPack', 'read-write'); // container for inventory of items
$synthesize(Character, 'slotMelee', 'read-write'); // weapon, improves hit points
$synthesize(Character, 'slotRanged', 'read-write'); // weapon, improves hit point

exports.Character = Character;













