this.guid = ''; // globaly unique ID -- everthing has one of these
this.ownerGuid = ''; // the guid of the user who owns this character
this.charName = undefined; // the name of this character
this.history = []; // list of important things this character has done:born, died, won, lost

this.experiencePoints = 0; // earned by doing important things, improves stats
this.healthPoints = 0; // 0 = death, buffs can help or hurt health
this.luckPoints = 0; // based on slotted gloves, improves chances for winning fights, finding items
this.hitPoints = 0; // based on slotted weapons, ammo, buffs
this.armorPoints = 0; // based on slotted clothing, condition of clothing
this.visionPoints = 0; // based on slotted googles, improves visual acquity
this.reactionPoints = 0; // based on slotted boots, improves response time in fights

this.locationX = 0; // Himins is a 3D labyrith
this.locationY = 0; 
this.locationZ = 0;

this.isDead = true; // heath = 0
this.isSleeping = false; // stunned or healing state

this.slotHat = undefined; // armor, improves armor points
this.slotGoogles = undefined; // armor, improves vision points
this.slotCoat = undefined; // armor, improves armor points
this.slotGloves = undefined; // armor, improves luck
this.slotPants = undefined; // armor, improves armor points
this.slotBoots = undefined; // armor, improves reaction points
this.slotPack = undefined; // container for inventory of items
this.slotMelee = undefined; // weapon, improves hit points
this.slotRanged = undefined; // weapon, improves hit points
