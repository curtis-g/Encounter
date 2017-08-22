// sound.js
"use strict";
// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// define the sound module and immediately invoke it in an IIFE
app.sound = (function()
{
	console.log("sound.js module loaded");
	var bgAudio = undefined;		//Background audio
	var pShootAudio = undefined;	//Audio for player firing
	var tShootAudio = undefined;	//Audio for turret firing
	
	//Init
	function init()
	{
		bgAudio = document.querySelector("#bgAudio");
		bgAudio.volume=0.25;
		
		pShootAudio = document.querySelector("#pShootAudio");
		pShootAudio.volume = 0.3;
		tShootAudio = document.querySelector("#tShootAudio");
		tShootAudio.volume = 0.3;
	}
	
	//Play background audio.
	function playBGAudio()
	{
		bgAudio.play();
	}
	
	//Stop and reset background audio.
	function stopBGAudio()
	{
		bgAudio.pause();
		bgAudio.currentTime = 0;
	}
	
	//Pause pause background audio.
	function pauseBGAudio()
	{
		bgAudio.pause();
	}
	
	//Play Player shooting sfx.
	function playPShootAudio()
	{
		pShootAudio.pause();
		pShootAudio.currentTime = 0;
		pShootAudio.play();
	}

	//Play Turret shooting sfx.
	function playTShootAudio()
	{
		tShootAudio.pause();
		tShootAudio.currentTime = 0;
		tShootAudio.play();
	}
	
	// export a public interface to this modules
	return{
		init : init,
		playBGAudio : playBGAudio,
		stopBGAudio : stopBGAudio,
		pauseBGAudio : pauseBGAudio,
		playPShootAudio : playPShootAudio,
		playTShootAudio : playTShootAudio,
	}
}());