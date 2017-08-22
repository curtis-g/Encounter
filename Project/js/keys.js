// The myKeys object will be in the global scope

"use strict";

var myKeys = {};

myKeys.KEYBOARD = Object.freeze
({
	//WASD Input
	"KEY_W": 87,
	"KEY_D": 68,
	"KEY_S": 83,
	"KEY_A": 65,
	
	//Other (unused?) Input
	"KEY_LEFT": 37, 
	"KEY_UP": 38, 
	"KEY_RIGHT": 39, 
	"KEY_DOWN": 40,
	"KEY_SPACE": 32,
	"KEY_SHIFT": 16
});

// myKeys.keydown array to keep track of which keys are down
// this is called a "key daemon"
// main.js will "poll" this array every frame
// this works because JS has "sparse arrays" - not every language does
myKeys.keydown = [];

// event listeners
window.addEventListener("keydown",function(e)
{
	//console.log("keydown=" + e.keyCode);
	myKeys.keydown[e.keyCode] = true;
});
	
window.addEventListener("keyup",function(e)
{
	//console.log("keyup=" + e.keyCode);
	myKeys.keydown[e.keyCode] = false;
});