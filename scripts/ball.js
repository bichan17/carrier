app.ball = (function(){

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

	function Ball(position,radius){
		// this.color = aColor;
		// this.cylinders = aCylinders;
		this.pos = position;
		this.rad = radius;
		this.makeBall(this.pos,this.rad);



	};

	Ball.prototype.makeBall = function(position, radius) {
		// body...
		console.log("make ball!");

		var blFixDef	= new b2FixtureDef();	// ball fixture definition
		blFixDef.shape	= new b2CircleShape();
		blFixDef.density = 0.3;

		var bodyDef = new b2BodyDef();
		var blBD = new BitmapData("images/bigball.png");
		
		bodyDef.type = b2Body.b2_dynamicBody;
		blFixDef.shape.SetRadius(radius);

		bodyDef.position.Set(position);
		var bodyUserData = {
			category: "Object",
			type: "Ball",
			isFlaggedForDelete: false
		};
		bodyDef.userData = bodyUserData;


		var body = world.CreateBody(bodyDef);
		body.CreateFixture(blFixDef);
		bodies.push(body);

		var bm = new Bitmap(blBD);
		bm.x = bm.y = -100;
		var actor = new Sprite();
		actor.addChild(bm);
		actor.scaleX = actor.scaleY = radius;

		// actor.addEventListener(MouseEvent.MOUSE_MOVE, this.jump);	
		stage.addChild(actor);
		actors.push(actor);
		this.actor = actor;
		this.body = body;
	};

	Ball.prototype.jump = function(e){
		var up = new b2Vec2(0, -5);
		var a = e.currentTarget;	// current actor
		var i = actors.indexOf(a);
		//  cursor might be over ball bitmap, but not over a real ball
		if(i>=25 && Math.sqrt(a.mouseX*a.mouseX + a.mouseY*a.mouseY) > 100) return;
		bodies[i].ApplyImpulse(up, bodies[i].GetWorldCenter());
	}

	return{
		Ball : Ball
	}

})();