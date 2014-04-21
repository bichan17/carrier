app.ground = (function(){

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

	function Ground(){
		this.makeGround();
	};

	Ground.prototype.makeGround = function() {
		console.log("make ground!");
		var bxFixDef	= new b2FixtureDef();	// box  fixture definition
		bxFixDef.shape	= new b2PolygonShape();
		bxFixDef.density = 1;

		var bodyDef = new b2BodyDef();
		bodyDef.type = b2Body.b2_staticBody;

		// create ground
		bxFixDef.shape.SetAsBox(10, 1);
		bodyDef.position.Set(9, stage.stageHeight/100 + 1);
		var bodyUserData = {
			category: "NonObject",
			type: "Ground",
			isFlaggedForDelete: false
		};
		bodyDef.userData = bodyUserData;
		var gBody = world.CreateBody(bodyDef);
		gBody.CreateFixture(bxFixDef);
		
		bxFixDef.shape.SetAsBox(1, 100);

		// left wall
		bodyDef.position.Set(-1, 3);
		var lBody = world.CreateBody(bodyDef);
		lBody.CreateFixture(bxFixDef);

		// right wall
		bodyDef.position.Set(stage.stageWidth/100 + 1, 3);
		var rBody = world.CreateBody(bodyDef);
		rBody.CreateFixture(bxFixDef);
		// this.actor = actor;
		this.gBody = gBody;
		this.lBody = lBody;
		this.rBody = rBody;
	};



	return{
		Ground : Ground
	}

})();