/*
loader.js
variable 'app' is in global scope - i.e. a property of window.
app is the single global object literal - all other functions and properties of 
the game will be properties of app.
*/
"use strict";

// if app exists use the existing copy
// else create a new empty object literal
var app = app || {};

window.onload = function()
{
	console.log("window.onload called");
	
	//Levels module
	app.levels.init();
	app.main.levels = app.levels;
	
	//Projectiles module
	app.projectiles.init();
	app.main.projectiles = app.projectiles;
	
	//Sound module
	app.sound.init();
	app.main.sound = app.sound;
	
	//Main module
	app.main.init();
}

window.onfocus = function()
{
	console.log("focus at " + Date());
	
	cancelAnimationFrame(app.main.animationID);
	
	app.main.paused = false;
	
	app.main.resumeBGAudio();
	
	app.main.update();
}

window.onblur = function()
{
	console.log("blur at " + Date());
	
	app.main.paused = true;
	
	cancelAnimationFrame(app.main.animationID);
	
	app.main.pauseBGAudio();
	
	app.main.update();
}