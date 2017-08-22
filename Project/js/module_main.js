// This object will be our the "controller" class and will contain references
// to most of the other objects in the game.

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};


app.main =
{
    WIDTH : 480, 				// Canvas width
    HEIGHT : 480,				// Canvas height
    canvas : undefined,			// Canvas
    ctx : undefined,			// Canvas context
   	lastTime : 0, 				// used by calculateDeltaTime() 
	gameState : undefined,		// Game state
	saveImage : undefined,		// Saved image from canvas to be used in results screen.
	mouseDown : false,			// If mouse is down.
	mousePos : undefined,		// Mouse position
	
	//Game state enum
	GAME_STATE: Object.freeze
	({
		MENU : 0,
		GAME : 1,
		RESULT : 2,
	}),
	
	levelNum: 0,			//Index of current level.
	meshes: undefined,		//Meshes for level
	turrets: undefined,		//Turrets for level
	
	paused : false,			//True if currently paused
	animationID : 0,		//ID index of the current frame.
	
	sound : undefined,		//Sound
	
	testPlayer : undefined,	//Player object.
	isPlayerDead : false,	//False if player is dead.
	deathSpan : 2.0,		//Duration that player is dead.
	deathSpanCounter : 0,	//Counter for tracking player death duration.
	
    //Initialization
	init : function()
	{
		//Init log
		console.log("app.main.init() called");
		
		// initiate the canvas
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');
		this.ctx.translate(this.WIDTH / 2, this.HEIGHT / 2);
		
		//link up mouse events
		this.canvas.onmousedown = this.doMousedown.bind(this);
		this.canvas.onmouseup = this.doMouseup.bind(this);
		this.canvas.onmousemove = this.doMousemove.bind(this);
		
		//Mouse position
		this.mousePos = new Vect(0, 0, 0);
		
		//Game State
		this.gameState = this.GAME_STATE.MENU;
		
		//Test objects
		this.testPlayer = new Player(
			0, 
			0,
			3,
			"#00F",
			"#AAF",
			3);
		
		// start the game loop
		this.update();
	},
	
	//Core update
	update : function()
	{
		//LOOP
	 	this.animationID = requestAnimationFrame(this.update.bind(this));
	 	
	 	//Calculate Delta Time of frame
	 	var dt = this.calculateDeltaTime();
		
	 	//UPDATE-DRAW
		switch(this.gameState)
		{
			case this.GAME_STATE.MENU:
				if(!this.paused)
					this.updateMenu(dt);
				this.drawMenu(dt, this.ctx);
				break;
			case this.GAME_STATE.GAME:
				if(!this.paused)
					this.updateGame(dt);
				this.drawGame(dt, this.ctx);
				break;
			case this.GAME_STATE.RESULT:
				if(!this.paused)
					this.updateResult(dt);
				this.drawResult(dt, this.ctx);
				break;
		}

		//Draw HUD
		if(this.paused)
		{
			this.drawPauseScreen(this.ctx);
			return;
		}
		
		
	},
	
	//Update menu state
	updateMenu : function(dt)
	{

	},
	
	//Draw menu state
	drawMenu : function(dt, ctx)
	{
		//Draw background
		ctx.clearRect(-this.WIDTH / 2, -this.HEIGHT / 2, this.WIDTH, this.HEIGHT);
		this.drawBackground(false);
		
		//Text
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		this.fillText(
			"ENCOUNTER",
			0,
			0, 
			"40pt impact",
			"white");
		this.fillText(
			"Click to Continue",
			0,
			50, 
			"20pt courier",
			"white");
	},
	
	//Update game state
	updateGame : function(dt)
	{
		//Projectile firing
		if(this.mouseDown)
		{
			//Shoot and play firing noises.
			if(this.testPlayer.active)
			{
				if(this.projectiles.spawnPlayerProjectile(this.testPlayer.pos, this.mousePos))
				{
					this.sound.playPShootAudio();
				}
			}
		}
		
		this.projectiles.movePlayerProjectiles(dt);							//Move player projectiles.
		this.projectiles.movePlayerDebris(dt);								//Move player debris.
		this.projectiles.tickPlayerFireRate(dt);							//Decrement player debris life.
		
		var playerProjectiles = this.projectiles.getPlayerProjectiles();	//Get player projectiles list.
		
		//For each player projectile.
		for(var i = 0; i < playerProjectiles.length; i++)
		{
			//If projectile is active
			if(playerProjectiles[i].getActive())
			{
				//If projectile is beyond border, kill it.
				if(playerProjectiles[i].pos.getMagnitude() > this.HEIGHT / 2)
				{
					playerProjectiles[i].kill();
				}
				
				//For each mesh in level.
				for(var j = 0; j < this.meshes.length; j++)
				{
					//If mesh collapsed based on projectile position. (If damage from projectile occured)
					if(this.meshes[j].collapse(this.meshes[j].checkCollision(playerProjectiles[i].getPos().x, playerProjectiles[i].getPos().y)))
					{
						playerProjectiles[i].kill();	//Kill the projectile.
						
						//If victory for level, change state to result.
						if(this.checkVictory())
						{
							this.gameState = this.GAME_STATE.RESULT;
						}
					}
				}
			}
		}
		
		//If player is beyond boundary, kill the player.
		if(this.testPlayer.active && this.testPlayer.pos.getMagnitude() > this.HEIGHT / 2)
		{
			this.killPlayer();
		}
		
		//Player collision. If player is active and collides with mesh, kill the player.
		for(var i = 0; i < this.meshes.length; i++)
		{		
			if(this.testPlayer.active && this.meshes[i].checkCollision(this.testPlayer.pos.x, this.testPlayer.pos.y) != -1)
			{
				this.killPlayer();
			}
		}
		
		//Key inputs.
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_W])	//Accel north
		{
			//console.log("MOVE NORTH");
			this.testPlayer.vel.y -= 8 * dt;
		}
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_D])	//Accel east
		{
			//console.log("MOVE EAST");
			this.testPlayer.vel.x += 8 * dt;
		}
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_S])	//Accel south
		{
			//console.log("MOVE SOUTH");
			this.testPlayer.vel.y += 8 * dt;
		}
		if(myKeys.keydown[myKeys.KEYBOARD.KEY_A])	//Accel west
		{
			//console.log("MOVE WEST");
			this.testPlayer.vel.x -= 8 * dt;
		}
		
		//Limit speed and move player
		this.testPlayer.limitSpeed();
		this.testPlayer.move();
		
		//If player is dead, decrement death span.
		if(this.isPlayerDead)
		{
			this.deathSpanCounter -= dt;
			if(this.deathSpanCounter < 0)
			{
				this.deathSpanCounter = 0;
				this.isPlayerDead = false;
				this.loadLevel();
				this.testPlayer.unKill();
			}
		}
	},
	
	//Draw game state
	drawGame : function(dt, ctx)
	{
		//Draw the game
		ctx.clearRect(-this.WIDTH / 2, -this.HEIGHT / 2, this.WIDTH, this.HEIGHT);
		this.drawBackground(false);
		for(var i = 0; i < this.meshes.length; i++)
		{		
			this.meshes[i].draw(this.ctx);
		}
		this.testPlayer.draw(ctx);
		this.projectiles.drawPlayerProjectiles(ctx);
		this.projectiles.drawPlayerDebris(ctx);
		
		//Get data for upcoming result frame.
		if(this.gameState == this.GAME_STATE.RESULT)
		{
			this.saveImage = this.ctx.getImageData(-this.WIDTH / 2, -this.HEIGHT / 2, this.WIDTH * 2, this.HEIGHT * 2);
		}
	},
	
	
	
	//Draw result state
	drawResult : function(dt, ctx)
	{
		ctx.clearRect(-this.WIDTH / 2, -this.HEIGHT / 2, this.WIDTH, this.HEIGHT);
		
		//Display end of level
		ctx.putImageData(this.saveImage, -this.WIDTH / 2, -this.HEIGHT / 2);
		
		//Blackout
		this.drawBackground(true);
		
		//Text
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		this.fillText(
			"Level Complete",
			0,
			0, 
			"40pt courier",
			"white");
		this.fillText(
			"Click to Continue",
			0,
			50, 
			"32pt courier",
			"white");
	},

	//Update result state
	updateResult : function(dt)
	{
		
	},
	
    //Mouse move tracking
	doMousemove : function(e)
	{
		this.mousePos = getMouse(e, this.WIDTH / 2, this.HEIGHT / 2);
	},

	//Mouse down actions.
	doMousedown: function(e)
	{	
		switch(this.gameState)
		{
			//Menu
			case this.GAME_STATE.MENU:
				this.gameState = this.GAME_STATE.GAME;	//Proceed to game
				this.sound.playBGAudio();				//Start bg music
				this.loadLevel();						//Load first level
				break;
				
			//Game
			case this.GAME_STATE.GAME:
				break;
			
			//Results
			case this.GAME_STATE.RESULT:
				this.levelNum++;						//Increment level
				this.gameState = this.GAME_STATE.GAME;	//Continue to game
				this.loadLevel();						//Load next level
				break;
		}
		
		//Increment mouseDown to 1 (true)
		this.mouseDown = true;
	},
	
	//Mouse up actions
	doMouseup: function(e)
	{	
		//Decrement mouseDown to 0 (false)
		this.mouseDown = false;
	},
	
	
	//Kill the player.
	killPlayer: function()
	{
		this.testPlayer.kill();					//Kill player
		this.projectiles.spawnPlayerDebris(		//Spawn debris with player position and velocity
			this.testPlayer.pos,
			this.testPlayer.vel,
			this.deathSpan);
		this.isPlayerDead = true;				//Player is dead
		this.deathSpanCounter = this.deathSpan;	//Set counter for counting
	},
	
	//Check if victorious in level.
	checkVictory : function()
	{
		//If any meshes aren't dead, return false.
		for(var i = 0; i < this.meshes.length; i++)
		{
			if(!this.meshes[i].getDead())
			{
				return false;
			}
		}
		
		//Return true.
		return true;
	},
	
	//Draw background circle.
	drawBackground : function(useTrans)
	{
		this.ctx.save();
		
		var lineWidth = 3;
		
		//Black space
		this.ctx.beginPath();
		this.ctx.arc(
			0,
			0,
			this.HEIGHT / 2 - lineWidth / 2,
			0,
			Math.PI * 2);
		
		//Transparent condition for results screen overlay.
		if(useTrans)
		{
			this.ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
			this.ctx.strokeStyle = "rgba(0, 0, 0, 0.0)";
		}
		else
		{
			this.ctx.fillStyle = "#000";
			this.ctx.strokeStyle = "#CCC";
		}
		this.ctx.lineWidth = 3;
		this.ctx.fill();
		this.ctx.stroke();
		this.ctx.restore();
	},
	
	//Draw pause screen
	drawPauseScreen : function(ctx)
	{
		ctx.save();
		this.drawBackground(false);
		
		ctx.translate(-this.WIDTH / 2, -this.HEIGHT / 2);
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		this.fillText(
			"... PAUSED ...",
			this.WIDTH / 2,
			this.HEIGHT / 2, 
			"40pt courier",
			"white");
		ctx.restore()
	},
	
	//Draw filled text
	fillText : function(string, x, y, css, color)
	{
		this.ctx.save();
		// https://developer.mozilla.org/en-US/docs/Web/CSS/font
		this.ctx.font = css;
		this.ctx.fillStyle = color;
		this.ctx.fillText(string, x, y);
		this.ctx.restore();
	},
	
	//Pause background music
	pauseBGAudio : function()
	{
		this.sound.pauseBGAudio();
	},
	
	//Resume background music
	resumeBGAudio : function()
	{
		if(this.gameState != this.GAME_STATE.MENU)
			this.sound.playBGAudio();
	},
	
	//Calculate delta-time
	calculateDeltaTime : function()
	{
		var now,fps;
		now = (+new Date); //+new date needed to convert from object to primitive
		fps = 1000 / (now - this.lastTime);
		fps = clamp(fps, 12, 60);
		this.lastTime = now; 
		return 1/fps;
	},
	
	//Load the level at the current level index.
	loadLevel : function()
	{
		//If level index is valid
		if(this.levels.check(this.levelNum))
		{
			this.meshes = this.levels.getMeshes(this.levelNum);		//Load meshes
			this.turrets = this.levels.getTurrets(this.levelNum);	//Load turrets
			
			//Generate new meshes
			for(var i = 0; i < this.meshes.length; i++)
			{
				this.meshes[i].generate();
			}
			
			//Player start
			this.testPlayer.pos = this.levels.getStart(this.levelNum);	//Reset position.
			this.testPlayer.vel = new Vect(0, 0, 0);					//Reset velocity.
			
			//Kill projectiles
			this.projectiles.reset();
		}
		else
		{
			this.gameState = this.GAME_STATE.MENU;	//Reset to menu
			this.levelNum = 0;						//Reset level number
			this.sound.stopBGAudio();				//Stop background music
		}
	}
}; // end app.main