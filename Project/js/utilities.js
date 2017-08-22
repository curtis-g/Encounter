// All of these functions are in the global scope
		
"use strict";

// returns mouse position in local coordinate system of element
function getMouse(e, xOff, yOff)
{
	var mouse = new Vect(
		e.pageX - e.target.offsetLeft - xOff,
		e.pageY - e.target.offsetTop - yOff,
		0);
	return mouse;
}

function getRandom(min, max) //code/idea taken from CS25210 lecture slides
{
  	return Math.random() * (max - min) + min;
}


function makeColor(red, green, blue, alpha)
{
	var color='rgba('+red+','+green+','+blue+', '+alpha+')';
	return color;
}

// Function Name: getRandomColor()
// returns a random color of alpha 1.0
//idea taken from a StackOverflow post
// http://paulirish.com/2009/random-hex-color-code-snippets/
function getRandomColor()
{
	var red = Math.round(Math.random()*200+55);
	var green = Math.round(Math.random()*200+55);
	var blue=Math.round(Math.random()*200+55);
	var color='rgb('+red+','+green+','+blue+')';
	// OR	if you want to change alpha
	// var color='rgba('+red+','+green+','+blue+',0.50)'; // 0.50
	return color;
}

function getRandomUnitVector()
{
	var x = getRandom(-1,1);
	var y = getRandom(-1,1);
	var length = Math.sqrt(x*x + y*y); //code adapted from w3cSchools and StackOverflow
	if(length == 0){ // very unlikely
		x=1; // point right
		y=0;
		length = 1;
	} else{
		x /= length;
		y /= length;
	}
	
	return {x:x, y:y};
}

function simplePreload(imageArray)
{
	// loads images all at once
	for (var i = 0; i < imageArray.length; i++) {
		var img = new Image();
		img.src = imageArray[i];
	}
}

function loadImagesWithCallback(sources, callback)
{
	var imageObjects = [];
	var numImages = sources.length;
	var numLoadedImages = 0;
	
	for (var i = 0; i < numImages; i++)
	{
		imageObjects[i] = new Image();
		imageObjects[i].onload = function()
		{
			numLoadedImages++;
			console.log("loaded image at '" + this.src + "'")
			if(numLoadedImages >= numImages)
			{
				callback(imageObjects); // send the images back
			}
		};
	  
		imageObjects[i].src = sources[i];
	}
}

//returns a value that is constrained between min and max (inclusive) (code taken from StackOverflow)
function clamp(val, min, max)
{
	return Math.max(min, Math.min(max, val));
}

// This gives Array a randomElement() method
Array.prototype.randomElement = function()
{
	return this[Math.floor(Math.random() * this.length)]; //math.random taken from CS25210 lecture slides
}


