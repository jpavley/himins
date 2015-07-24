# Himins TODO

## Current State of the project as of 23Jul2015

* 2 of the 3 core components are MVP
  * Persistence service and game service are _done_ (i.e., very barebones but operational)
* Working on the chat service
  * Based on the Telnet module with help from Mustache, Linewrap, and Colors. 
  * The chat server runs the chat service and the game service
  * The MVP chat service will allow players to chat
* Authentication
  * In himins a user connects with a client to “own” a player. Players are shared resources not owned by a single user (as in a traditional MUD)
  * I still need user accounts and a way for users to login and out but mostly to coordinate sharing, calculating karma, handing privileges

## What's left to do

* Command line interpreter (REPL)
  * I'd like himins users to enjoy a rich command line user inexperience with all the convenience tools that a modern shell provides
  * Examples include history of commands, completion, spelling check, helps system
* Config file
  * Many assumptions for the services and servers should be moved to and read from a config file
  * Look for the TODO comments in each source file
* Deployment and running forever
  * I'm planning to deploy in the Google cloud but there is nothing specific to the Google cloud
  * himins should work fine anywhere a telnet port can be configured
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
  
