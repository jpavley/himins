	,--.  ,--.,--.,--.   ,--.,--.,--.  ,--. ,---. 
	|  '--'  ||  ||   `.'   ||  ||  ,'.|  |'   .-'
	|  .--.  ||  ||  |'.'|  ||  ||  |' '  |`.  `-. 
	|  |  |  ||  ||  |   |  ||  ||  | `   |.-'    |
	`--'  `--'`--'`--'   `--'`--'`--'  `--'`-----' 
				Modern Node.js MUD Server

# Himins

* Multi-user dungeon telnet server written in JavaScript using Node.JS, MongoDB, JSON, and some excellent NPM libraries
* Works with just about any termlinal appplication
* Provides realtime, multi-user, text-based game play
* Games (including world, player, npcs, rooms, events, commands, and items) all defined in declaritive JSON

# Developer's Guide

* Clone or fork the source form GitHub
* In the himins directory execute "npm install" to get all the modules
* For command line usage use nmp to globally install mongodb, jshint, mocha, js doc and grunt
* Follow MongoDB's instructions for setting and running MongoDB with mongod
* Setup, build, and test himins with the Grunt file
* Read the developer's part of the Wiki on GitHub

# Dungeon Master's Guide

* Review the world, player, npcs, rooms, events, commands, and items JSON templates
* Read the dungeon master's part of the Wiki on GitHub
* Design, implement, and test your game!

# Player's Guide

* You'll need to know how the use a terminal, a telenet client, and how to connect to a game server
* How a game works is really up to the dungeon master but here is general approach based on the defualt feature set of the himins server:
  * Read the text the game provides you carefully looking for nouns, tasks, and puzzles
  * You can't break the game by experimenting so experiment and try different combinations of words and commands
  * Typical game level commands: look, inventory, wait, again, about, info, help, undo, pray, sleep, wakeup, listen, curse, sing
  * Movement commands are usually abbreviated as n, ne, nw, s, se, sw, e, w
  * Additional movement commands include up, down, in, out, jump
  * If you meet something that might be able to talk, like a person, animal, spirit, or an espcially smart tree try to communicate with it using talk to [name], ask [name] about [object], give [object] to [name], show [object] to [name]
  * In combat games you can usually attack [name], kill [name], hit [name], cast [spell] on [name]
  * If you find something try commands like these: examine [object], take [object], drop [object], open [object], put [object] in [object], put [object] on [object], push [object], pull [object], turn [object], feel [object], equip [object], wear [object], remove [object]
  * Even more actions you can do with things:   eat, drink, fill, smell, listen to, break, burn, look under, unlock [object] with [object], climb, wave, turn on, dig in, enter, search



