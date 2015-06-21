# Hmims Redesign Notes

## Issues with the current design

* The game engine and the game are too deeply intertwined and need to be clearly desperated
* There are several great open source node modules that Himins should use--too much costom code
* There should be an event-based game object with an internal tick that keep the game world in synch
* The game, maps, rooms, players, things, and commands should all be event-based and smarter
* No persistence layer
* No unit tests
* No build system

## Features to keep from the current design

* Json templates used to specify and "program" the game, maps, rooms, players, things, and commands
* The ability to display ASCII art screens
* A great REPL with completion and command history
* Automatically generated docs, well commented code, coding style enforsed by JSHint
* The ability to log app events

## Potential go forward strategy

* Commander to improve how CLI commands are parsed and add more features
  * Flags: inventory -h (returns help) or inventory -b (returns brief list)
  * Parameters: inventory bag (returns the inventory of the bag)
  * Synonyms: inventory, inv, i (all mapped to the same command)

* Color for CLI text appearance (instald of buggy ANSI codes)

* MongoDB (via Mongoose) for persistance
  * The entire game will be come MongoDB based so this a big change but the benefits are huge
  * The Json templates that define and drive the game will easily persist and survive server reboots
  * Each player will have an account with different levels of access on the MongoDB server
  * Admins will because to use the Mongo client to manage users and game elements

* All game objects will be derived from events.EventEmitter.prototype
  * Game state changes will be emitted
  * Game objects will react to game state events with handlers

* Mocha will be used for unit tests and the redesign will be TDD

* The game itself will implement and emit ticks (15 fps) to enable realtime interactions like combat

* Grunt will be used for build automation

* JSDoc instead of Docco will be used to generate documentation

* Bunyan for app event logging

* Telenet-Stream for managing telnet connections 