# Himins TODO

## Current State of the project as of 14Jul2015

* My focus is on the 3 core components
  * Chat service, persistence service, and game service
  * These are the 3 services divided into 2 servers that need to up and running in an MVP state in order for the game platform to function
* To make it easy I'm using MongoDB as the persistence service/server
  * So basically that's done :)
* The chat service is based on the Telnet module with help from Mustache, Linewrap, and Colors. The chat server runs the chat service and the game service
* The game service is what I'm working on now
  * The game service lights up MongoDB and logging
  * Manages clients, users, and players
  * And handles game and user events
  * MVP for the game service is to get every thing up and running and allow users to chat with each other in an empty world with world time ticking along

## What's left to do

* Command line interpreter (REPL)
  * I'd like himins users to enjoy a rich command line user inexperience with all the convenience tools that a modern shell provides
  * Examples include history of commands, completion, spelling check, helps system

* Config file
  * Many assumptions for the services and servers should be moved to and read from a config file
  * Look for the TODO comments in each source file
* Authentication
  * In himins a user connects with a client to “own” a player. Players are shared resources not owned by a single user (as in a traditional MUD)
  * I still need user accounts and a way for users to login and out but mostly to coordinate sharing, calculating karma, handing privileges
* Deployment and running forever
  * I'm planning to deploy in the Google cloud but there is nothing specific to the Google cloud
  * himins should work fine anywhere a telnet port can be configured
* Loading/Reloading a persistent game
  * All himins objects are defined in JSON
  * Just need to handle load, save, and update (in realtime)
* Command language and parser
  * The himins game server should handle the basic MUD user commands (n, s, e, w, look, get, inventory, drop, talk, etc...)
  * The himins game server should handle basic chat commands (say, tell, block, invite, etc...)
  * The himins game server should handle the basic MOO user command (create, destroy, script, ...)
* Game objects and schema
  * Himins is a game like Minecraft or a MOO where the users create a shared environment out of "building blocks" (but which more roleplaying and less visual stimulation)
  * Building blocks include mobiles (players/monsters/animals), landscapes, decor, mazes, weather, and quests
    * Mobiles are basically objects that can move an be possessed
    * Landscapes are the objects that fill space
* Responsive Design
  * Ability to respond to client window size events intelligently
  
