app.box = (function(){

	var	b2Vec2		= Box2D.Common.Math.b2Vec2,
		b2BodyDef	= Box2D.Dynamics.b2BodyDef,
		b2Body		= Box2D.Dynamics.b2Body,
		b2FixtureDef	= Box2D.Dynamics.b2FixtureDef,
		b2World		= Box2D.Dynamics.b2World,
		b2PolygonShape	= Box2D.Collision.Shapes.b2PolygonShape;
		b2CircleShape	= Box2D.Collision.Shapes.b2CircleShape;

	var stage = app.main.stage;
	var world = app.main.world;
	var bodies = app.main.bodies;
	var actors = app.main.actors;

	function Box(position, width, height){
		// this.color = aColor;
		// this.cylinders = aCylinders;
		this.position = position;
		this.width = width;
		this.height = height;
		this.makeBox(this.position,this.width,this.height);



	};

	Box.prototype.makeBox = function(position, width, height) {
		console.log("make box!");
		var bxFixDef	= new b2FixtureDef();	// box  fixture definition
		bxFixDef.shape	= new b2PolygonShape();
		bxFixDef.density = 0.3;

		bxFixDef.shape.SetAsBox(width, height);

		var bodyDef = new b2BodyDef();
		bodyDef.type = b2Body.b2_dynamicBody;
		var bxBD = new BitmapData("images/box.jpg");

		

		bodyDef.position.Set(position);
		var bodyUserData = {
			category: "Object",
			type: "Box",
			isFlaggedForDelete: false
		};
		bodyDef.userData = bodyUserData;

		var body = world.CreateBody(bodyDef);
		body.CreateFixture(bxFixDef);
		bodies.push(body);

		var bm = new Bitmap(bxBD); //bitmap
		bm.x = bm.y = -100;

		var actor = new Sprite();  
		actor.addChild(bm);

		actor.scaleX = width;
		actor.scaleY = height;

		// actor.addEventListener(MouseEvent.MOUSE_MOVE, this.jump);
		stage.addChild(actor);
		actors.push(actor);
		this.actor = actor;
		this.body = body;
	};

	Box.prototype.jump = function(e){
		var up = new b2Vec2(0, -5);
		var a = e.currentTarget;	// current actor
		var i = actors.indexOf(a);
		//  cursor might be over Box bitmap, but not over a real Box
		if(i>=25 && Math.sqrt(a.mouseX*a.mouseX + a.mouseY*a.mouseY) > 100) return;
		bodies[i].ApplyImpulse(up, bodies[i].GetWorldCenter());
	}

	return{
		Box : Box
	}

})();