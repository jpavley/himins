// # himins_player.js
// Manages a player object from a himins player JSON file.

// ## includes
var fs = require('fs');

// ## module vars
var playerObject = {};

//# init()
var init = function () {
	console.log('** himins_player.js init()');
};
module.exports.init = init;

//# loadPlayer(playerFileName)
var loadPlayer = function (playerFileName) {
	//console.log('** himins_player.js playerRoom(%s)', playerFileName);

	fs.readFile(playerFileName, 'utf8', function (err, data) {
		if(err) {
			console.log(err);
		} else {
			playerObject = JSON.parse(data);
			console.log(playerObject);
			init();
		}
	});
};
module.exports.loadPlayer = loadPlayer;

//# getPlayerInventoryNames
// Returns a string with the names of the items in the player inventory
var getPlayerInventoryNames = function () {
	var namesList = [],
		result = '';

	for (var i = playerObject.inventory.length - 1; i >= 0; i--) {
		nameList.push(playerObject.inventory[i].name);
	};

	result = namesList.toString();
	result = result.replace(/,/g, ", ");
	return result;
};
module.exports.getPlayerInventoryNames = getPlayerInventoryNames;

// # getPlayerLocation()
var getPlayerLocation = function () {
	return playerObject.location;
};
module.exports.getPlayerLocation = getPlayerLocation;

// # setPlayerLocation(location)
var setPlayerLocation = function (location) {
	playerObject.location = location;
};
module.exports.setPlayerLocation = setPlayerLocation;

// # getPlayerRoom()
var getPlayerRoom = function () {
	return playerObject.room;
};
module.exports.getPlayerRoom = getPlayerRoom;

// # setPlayerRoom(room)
var setPlayerRoom = function (room) {
	playerObject.room = room;
};
module.exports.setPlayerRoom = setPlayerRoom;

// # getPlayerHealth()
var getPlayerHealth = function () {
	return playerObject.health;
};
module.exports.getPlayerHealth = getPlayerHealth;

// # setPlayerHealth(hitPoints)
var setPlayerHealth = function (hitPoints) {
	playerObject.health = hitPoints;
};
module.exports.getPlayerHealth = getPlayerHealth;

// # main entry point
// For testing purposes you can run this file directly with "node himins_player.js". The test logic expects a file named "himins_player.json" with the defination of a player object!

loadPlayer("himins_player.json");