	,--.  ,--.,--.,--.   ,--.,--.,--.  ,--. ,---. 
	|  '--'  ||  ||   `.'   ||  ||  ,'.|  |'   .-'
	|  .--.  ||  ||  |'.'|  ||  ||  |' '  |`.  `-. 
	|  |  |  ||  ||  |   |  ||  ||  | `   |.-'    |
	`--'  `--'`--'`--'   `--'`--'`--'  `--'`-----' 
				WATCH WHAT YOUR PRAY FOR

Himins
======

Text-based interactive fiction MMORPG using Node.js/MongoDB on the backend and terminal emulation as the client.

Technical Details
-----------------
* Multi-user Node.js TCP server with MongoDB for data services
* To start the game enter the following in a terminal window: node himins_app.js
* To test the game enter the the following in terminal window: telnet 127.0.0.1 9000
* Himins is divided up into a set of services and JSON data templates

Architecture
------------
 ```
                                            +------+
     +-----+                                | Chat
   Items   |                                | Commands          List of Clients
   Puzzles |                                | Repl              +-------
   Doors   |                                | Formatter         |
   Monsters|             list of Rooms      +-+----+            | +-----------+     +-----------+
     +--+--+             -------+             |                 | |           |     |           |
        |                       |             |                 | | Client    <-----+ Player Obj|
        |    +---------------+  |     +-------v---------+       | |           |     |           |
        |    |               |  |     |                 |       | +-----------+     +-----------+
        +----> Room Object   |  |     |  Himins App     |       |
             |               |  |     |  Server         <-------+ +-----------+     +-----------+
             +---------------+  |     |                 |       | |           |     |           |
                                |     +--------^--------+       | | Client    <-----+ Player Obj|
             +---------------+  |              |                | |           |     |           |
             |               |  |              |                | +-----------+     +-----------+
             | Room Object   |  |     +--------+--------+       |
             |               |  |     |                 |       | +-----------+     +-----------+
             +---------------+  +----->  Game Object    |       | |           |     |           |
                                |     |                 |       | | Client    <-----+ Player Obj|
             +---------------+  |     +-----------------+       | |           |     |           |
             |               |  |                               | +-----------+     +-----------+
             | Room Object   |  |                               |
             |               |  |                               +--------
             +---------------+  |
                                |
                          ------+

```

Backstory
----------

The Earth was dead. It was only a matter of time. Our air poisoned. Our water fouled. Our soil corrupted. All 510 million square kilometers were unclean. Humanity was doomed but we did nothing but squabble, bicker, and blame. 

The messenger landed on a Friday evening in the center of town. It flew in on a meteorite that crashed and burned in front of the old elementary school. The noise and fire brought the people out of their homes. The messenger, battered and bruised, crawled out of the wreckage and looked into the collective eyes of the crowd that had gathered around it's smoldering fireball.

"People of Earth," it announced, "I bring you salutations from your friends the Selenites. We have watched you slowly destroy your home world from our bases on the Moon. We have been your hidden neighbors for hundreds of thousands of years. While you evolved from apes on the Earth's surface, we have evolved from arthropods in the interior of our world. After centuries of observing your behavior you should be able to forgive us for not announcing our presence. We were a little worried in 1969 when your ancestors landed on our surface but, except for the occasional probe, you never returned. While we have remained hidden we have not ignored you. We've learned a great deal from your radio, television, and wireless networks. We've even played games with you, masquerading as human in chatrooms and social networks. We've grown to love you. You are dangerous, mostly to yourselves, but you are clever and beautiful."

The messenger paused, catching it's breath and pieces of it's body began to crack and fall off.

"I don't have much time, so please listen carefully. We have outgrown our world, your Moon, and we bequeath it to you. Your world, the Earth, will not support you needs much longer. We urge you to band together and take possession of ours. You'll have to rediscovered the technology to build rockets and transport large quantities of your people. We have confidence that you will live long enough for that."

More pieces of the messenger's body disintegrated.

"My time is done but you can live on. My hive has abandoned the Moon. It is yours now. You need only to find the door, hack the key, and enter. You won't need to bring supplies as we have provided for you every need. But I must warn you. Our world was built for us and not you. And some of our kind remain behind. But we are sure you will have no problem wrestling the Moon away from these traitors."

The messengers head sloughed off its torso.

"This is my end but your new beginning. Oh, just one more thing. You must be very careful not to..."

At this point the messenger's head dried up and blew away in the breeze of the meteorite's flames.

The townspeople thought this messenger a trick, a rickroll, a troll. Later that night news sites reported the same meteorite, the same messenger, with the same message appearing in the center of every town and city across the world.

Hope began to dawn on humanity that night.

The Game
========

Himins is a text-based, multiplayer adventure game with a terminal emulation client. Players log in and participate in exploring the world of Himins, constructing bases, competing for territory and riches, and fighting monstrous Selenites and each other.

Himins takes place on the inside of the Moon. It is a labyrinth of tunnels and rooms on a vast scale. Players create characters, collect tools, weapons, armor, and loot and gain experience. The areas of Himins closest to the surface are protected and great for learning the game. The areas deep within Himins are unregulated and require advanced knowlege of the game. The core of the Moon is the most dangerous of all and a player who reaches the core becomes the master of Himins. The core is one giant game of text-based PVP "King of the Hill."

Game play is realtime with turn-based fighting. All interaction with Himins is accomplished through text commands. The commands are not fully documented and need to be discovered.

Playing the Game
================

A game in Himins is a collection of interconnected rooms. Rooms are divided up into sections. Sections can contain items, puzzles, monsters, and doors.

Commands in Himins are contextual. There is a small set of game-level commands otherwise each room and each section of a room provides its own interface to the  actions available to the player. Actions in Himins are implied by the context in which an object (the target of an action is found). To move from one section to another the player has to enter the name of that section. To add an item to the inventory a player enters the name of that item. To use an item already in inventory a player enters the name of that item. To remove an item from inventory a player would move into a storage section and enter the name of the item. The Himins contextual user interface is intuitive and eliminates typing in combinations of terms to find the right expression that activates a desired action.





