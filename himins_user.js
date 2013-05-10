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

// Private Properties

var guid = 0,
    userCharacter = {},
    userName = "",
    userPassword = "",
    isOnline = false;

// Constructor

function User() {
    //guid = util.getNewGuid();
};

// Public Methods

// Accessors

User.prototype.GetGuid = function() {
    return guid;
};

User.prototype.SetGuid = function (newGuid) {
    giud = newGuid;
};

User.prototype.GetCharacter = function () {
    return userCharacter;
};

User.prototype.SetCharacter = function (newCharacter) {
    character = newCharacter
};

User.prototype.GetUserName = function () {
    return userName;
};

User.prototype.SetUserName = function (newUserName) {
    userName = newUserName;
};

User.prototype.GetPassword = function () {
    return password;
};

User.prototype.SetPassword = function (newPassword) {
    password = newPassword;
};

User.prototype.GetIsOnline = function () {
    return isOnline;
};

User.prototype.SetIsOnline = function (flag) {
    isOnline = flag;
};















