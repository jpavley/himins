// # himins_room.js
// ## Represents a room in a zone in the game world.
// Rooms generally have entrances and exits, items, puzzels, and mobs.

var user = require('./himins_user'),
    display = require('./himins_client').
    fs = require('fs');
    
var roomFileName = "",
		roomObject = {}
    discriptions = [],
    hotSpots = [],
    items = [],
    puzzels = [];

// #init()
var init = function (roomFileName) {
	var data = fs.readFileSync(roomFileName);
	roomObject = JSON.parse(data);
	consol.log(roomObject);
};
module.exports.init = init;