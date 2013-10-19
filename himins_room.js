// # himins_room.js
// ## Represents a room in a zone in the game world.
// Rooms generally have entrances and exits, items, puzzels, and mobs.

var user = require('./himins_user'),
    display = require('./himins_client');
    
var roomFileName = "",
    discriptions = [],
    hotSpots = [],
    items = [],
    puzzels = [];

// #init()
    
