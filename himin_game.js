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
 * Himin Game Service
 * 
 */

// Private Properties

var guid = 0,
    gameName = "",
    userList = [],
    isStarted = false;

// Constructor

function Game(newGuid, newName) {
    guid = newGuid;
    gameName = newName;
    userList = util.getUserListFromStorage(guid);
    if (userList) {
        isStarted = true;
        User.GameStart();       
    } else {
        isStarted = false;
        console.log("Game failed to load");
    }
};

// Public Methods

Game.prototype.AddUser = function () {
    
};

Game.prototype.RemoveUser = function () {
    
};

Game.prototype.GameStart = function () {
    
};


Game.prototype.GameLoop = function () {
    
};

Game.prototype.GameEnd = function () {
    
};

// Accessors

Game.prototype.GetIsStarted = function () {
    return isStarted;
};

Game.prototype.GetGameName = function () {
    return gameName;
};















