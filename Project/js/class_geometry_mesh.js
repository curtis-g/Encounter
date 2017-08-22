//Constructor
var Mesh = function(x, y, colorFill, colorStroke, thickness, edgeCount, radius, scale)
{
	this.shape = new Shape();		//Shape of the mesh
	this.pos = new Vect(x, y, 0);	//Position of the mesh
	this.colorFill = colorFill;		//Color of the mesh
	this.colorStroke = colorStroke;	//Stroke color of the mesh
	this.thickness = thickness;		//Thickness of the mesh
	this.edgeCount = edgeCount;		//Number of edges on mesh.
	this.radius = radius;			//Radius of mesh.
	this.scale = scale;				//Y-scale of mesh.
}

//Draw mesh
Mesh.prototype.draw = function(ctx)
{
	ctx.save();
	ctx.fillStyle = this.colorFill;
	ctx.strokeStyle = this.colorStroke;
	ctx.lineWidth = this.thickness;
	ctx.translate(this.pos.x, this.pos.y);
	this.shape.draw(ctx);
	ctx.restore();
}

//Returns a copy of this mesh.
Mesh.prototype.get = function()
{
	return new Mesh(
		this.pos.x,
		this.pos.y,
		this.colorFill,
		this.colorStroke,
		this.thickness,
		this.edgeCount,
		this.radius,
		this.scale);
}


//Generate regular polygon mesh
Mesh.prototype.generate = function()
{
	this.shape.generatePolygon(this.edgeCount, this.radius, this.scale);
	this.threshold = this.shape.getAverageEdgeLength() * 1.4;
	this.shape.getArea();
}



//Checks collision based on given x and y position, took idea for comparison from StackOverflow post
Mesh.prototype.checkCollision = function(gx, gy)
{
	//for every abstract triangle based on the mesh center and every shape edge,
    //perform a barycentric comparison with the explicit point. Comparison checks if point is in triangle.
	for(var i = 0; i < this.shape.getVertexCount(); i++)
	{
        var mouseR = new Vect(gx, gy, 0).getSub(this.pos);  //Relative mouse position.
        var pointA = this.shape.getVertex(i);
        var pointB = this.shape.getVertex(
			i + 1 < this.shape.getVertexCount() ?
			i + 1 :
			0);
        
        var crossAB = pointA.getCross(pointB);
        var crossMB = mouseR.getCross(pointB);
        var crossAM = pointA.getCross(mouseR);
        
        var s = crossMB / crossAB;
        var t = crossAM / crossAB;
        
        if(s > 0 && t > 0 && s + t < 1)	//Barycentric comparison for collision
		{
			return i;	//Return index representing collided triangle.
		}
        
	}
	
	//Return -1 if no collision occured.
	return -1;
}

//Recalculates the center of the mesh and repositions the mesh so that the mesh doesn't move.
Mesh.prototype.recalcCenter = function()
{
	var offset = new Vect(0, 0, 0);

	//Calculate the new center of the mesh.
	for(var i = 0; i < this.shape.getVertexCount(); i++)
	{
		offset.add(this.shape.getVertex(i));
	}
	offset.div(this.shape.getVertexCount());
	
	//Move the Mesh center to the new position.
	this.pos.add(offset);

	//Move the geometry so that the mesh doesn't move.
	this.shape.offsetAway(offset);
}

//Collapses the mesh, reducing an edge to a vertex.
//A vertex is selected. That vertex is moved to the center of the line, and the vertex after it is deleted.
//index == index of the point to be deleted.
//Returns true if collapsing occurred.
Mesh.prototype.collapse = function(index)
{
	//Do nothing if the index is less than zero.
	if(index < 0)
	{
		return false;
	}
	
	//Empty and return if the shape is a triangle before shrinking.
	if(this.shape.getVertexCount() < 4)
	{
		this.shape.generatePolygon(0, 0);
		return true;
	}
	
	//Collapse, recalculate area after collapsing, recalculate center to be at center of mesh, and return true.
	this.shape.collapse(index);
	this.shape.crater(this.threshold);
	this.shape.getArea();
	this.recalcCenter();
	return true;
}



//Returns true if the mesh is dead and the area is 0.
Mesh.prototype.getDead = function()
{
	if(this.shape.getArea() == 0)
	{
		return true;
	}
	
	return false;
}
