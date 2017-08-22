// projectiles.js
"use strict";
// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// define the .projectiles module and immediately invoke it in an IIFE
app.projectiles = (function()
{
	var playerProjectiles = [];						//Array of player shooty projectiles.
	var pPSpeed = 320.0;							//Speed of player projectiles.
	var pPFireRate = .18;							//Firing rate of player projectiles.
	var pPFireRateCounter = 0;						//Counter for firing rate
	var pPLifeTime = 2.0;							//Lifetime
	var pPRadius = 3;								//Radius
	var pPColorFill = "#FF0000";						//Fill color
	var pPColorStroke = "rgba(255, 0, 0, .5)";	//Stroke color
	var pPThickness = 2;							//Thickness
	
	var playerDebris = [];							//Array of player debris projectiles.
	var pDSpeedMin = 5;								//Minimum speed of debris particles
	var pDSpeedRange = 30;							//Maximum speed
	var pDLength = 20;								//Number of projectiles.
	var pDRadius = 4;								//Radius
	var pDColorFill = "rgba(255, 0, 0, .6)";		//Color
	var pDColorStroke = "rgba(170, 170, 255, .4)";	//Stroke
	var pDThickness = 2;							//Thickness
	
	//Initialize
	function init()
	{
		//Player shooty projectiles push loop
		var pPLength = Math.ceil(pPLifeTime / pPFireRate);	//Number of projectiles needed based on fire rate and lifespan. Debris code taken from StackOverflow
		for(var i = 0; i < pPLength; i++)
		{
			playerProjectiles.push(new Projectile(pPSpeed));
		}
		
		//Player debris Projectiles push loop
		for(var i = 0; i < pDLength; i++)
		{
			playerDebris.push(new Projectile(Math.random() * pDSpeedRange + pDSpeedMin));
		}
	}
	
	//Returns the list of player projectiles.
	function getPlayerProjectiles()
	{
		return playerProjectiles;
	}
	
	//Spawns a projectile if fire rate is back to zero.
	function spawnPlayerProjectile(pos, des)
	{
		if(pPFireRateCounter == 0)
		{
			for(var i = 0; i < playerProjectiles.length; i++)
			{
				if(playerProjectiles[i].spawn(
					new Vect(pos.x, pos.y, 0), 
					des,
					pPLifeTime,
					pPRadius,
					pPColorFill,
					pPColorStroke,
					pPThickness,
					0))
				{
					pPFireRateCounter = pPFireRate;	//Reset fire rate.
					return true;
				}
			}
		}
		
		//Return false if a projectile did not spawn.
		return false;
	}
	
	//Draw player projectiles.
	function drawPlayerProjectiles(ctx)
	{
		for(var i = 0; i < playerProjectiles.length; i++)
		{
			playerProjectiles[i].draw(ctx);
		}
	}	
	
	//Move player projectiles.
	function movePlayerProjectiles(dt)
	{
		for(var i = 0; i < playerProjectiles.length; i++)
		{
			playerProjectiles[i].move(dt);
		}
	}
	
	//Counts down the fire rate.
	function tickPlayerFireRate(dt)
	{
		pPFireRateCounter -= dt;
		if(pPFireRateCounter < 0)
		{
			pPFireRateCounter = 0;
		}
	}
	
	//Spawns all player debris simultaneously.
	function spawnPlayerDebris(pos, vel, pDLifeTime)
	{
		for(var i = 0; i < playerDebris.length; i++)
		{
			playerDebris[i].spawn(
				new Vect(pos.xPos, pos.yPos, 0), 
				vel,
				pDLifeTime,
				pDRadius,
				pDColorFill,
				pDColorStroke,
				pDThickness,
				1);
		}
	}
	
	//Draw all player debris.
	function drawPlayerDebris(ctx)
	{
		for(var i = 0; i < playerDebris.length; i++)
		{
			playerDebris[i].draw(ctx);
		}
	}	
	
	
	
	//Reset. Kills all player projectiles.
	function reset()
	{
		for(var i = 0; i < playerProjectiles.length; i++)
		{
			playerProjectiles[i].kill();
		}
	}
	
//Move all player debris.
	function movePlayerDebris(dt)
	{
		for(var i = 0; i < playerDebris.length; i++)
		{
			playerDebris[i].move(dt);
		}
	}
	
	// export a public interface to this module (Why does this need to be same line bracket?)
	return{
		init : init,
		getPlayerProjectiles : getPlayerProjectiles,
		spawnPlayerProjectile : spawnPlayerProjectile,
		drawPlayerProjectiles : drawPlayerProjectiles,
		movePlayerProjectiles : movePlayerProjectiles,
		tickPlayerFireRate : tickPlayerFireRate,
		spawnPlayerDebris : spawnPlayerDebris,
		drawPlayerDebris : drawPlayerDebris,
		movePlayerDebris : movePlayerDebris,
		reset : reset,
	}
}());