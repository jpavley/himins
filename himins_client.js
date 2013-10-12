// himins_client.js
// Library of variables and functions to control telnet client display

// Use the variables below with the client.write() function to format text,
// move the cursor, and control the screen

var boldRedOn = "\033[1;31m",
    boldGreenOn = "\033[1;32m",
    formatOff = "\033[0m",
    eraseScreen = "\033[2J",
    cursorUp = "\033[1A",
    cursorLeftThreeSpaces = "\033[3D",
    reverseVideo = "\033[7m",
    lineWrapOn = "\033[?7hc";
    
module.exports.boldRedOn = boldRedOn;
module.exports.boldGreenOn = boldGreenOn;
module.exports.formatOff = formatOff;
module.exports.eraseScreen = eraseScreen;
module.exports.cursorUp = cursorUp;
module.exports.cursorLeftThreeSpaces = cursorLeftThreeSpaces;
module.exports.reverseVideo = reverseVideo;
module.exports.lineWrapOn = lineWrapOn;


var prompt = ">> ",
    askPrompt = "? ";
    
module.exports.prompt = prompt;
module.exports.askPrompt = askPrompt;