app.player = (function(){

	var	b2Vec2		= Box2D.Common.Math.b2Vec2,
		b2Transform = Box2D.Common.Math.b2Transform,
		b2Mat22 	= Box2D.Common.Math.b2Mat22,
		b2BodyDef	= Box2D.Dynamics.b2BodyDef,
		b2Body		= Box2D.Dynamics.b2Body,
		b2FixtureDef	= Box2D.Dynamics.b2FixtureDef,
		b2ContactListener = Box2D.Dynamics.b2ContactListener,
		b2World		= Box2D.Dynamics.b2World,
		b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
		b2PolygonShape	= Box2D.Collision.Shapes.b2PolygonShape;
		b2CircleShape	= Box2D.Collision.Shapes.b2CircleShape;

	var stage = app.main.stage;
	var world = app.main.world;
	var bodies = app.main.bodies;
	var actors = app.main.actors;

	var counterGravity;
	var cargoWeight;

	function Player(){
		this.grabbed = false;
		this.width = 1;
		this.height = 0.5;
		

		//this.counterGravity = new b2Vec2(0,0);
		// this.counterGravity = new b2Vec2(world.GetGravity().x, world.GetGravity().y);
		this.cargoMass = 0;
		// this.counterGravity.Multiply((this.body.GetMass() + this.cargoMass) * -1);
		// console.log("player CCGG: " + JSON.stringify(this.counterGravity));
		this.rotateLimit = 0.15;
		this.correctionLimit = 2;
		this.makePlayer(this.width,this.height);
	};

	Player.prototype.makePlayer = function(wth,hgt) {
		console.log("make player!");
		var bxFixDef	= new b2FixtureDef();	// box  fixture definition
		bxFixDef.shape	= new b2PolygonShape();
		bxFixDef.density = 1;

		var bodyDef = new b2BodyDef();
		bodyDef.type = b2Body.b2_dynamicBody;
		var bxBD = new BitmapData("images/heli.png");

		bxFixDef.shape.SetAsBox(wth,hgt);

		var posX = 3;
		var posY = 2.5;

		bodyDef.position.Set(posX,posY);
		var bodyUserData = {
			category: "NonObject",
			type: "Player",
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

		actor.scaleX = wth;
		actor.scaleY = hgt;

		stage.addChild(actor);
		actors.push(actor);
		this.actor = actor;
		this.body = body;

		//make sensor
		var sFixDef	= new b2FixtureDef();	// sensor  fixture definition
		sFixDef.shape	= new b2PolygonShape();

		senWth = wth;
		senHgt = hgt/3;
		
		sFixDef.shape.SetAsBox(senWth,senHgt);
		sFixDef.isSensor = true;

		var sBodyDef = new b2BodyDef();
		sBodyDef.type = b2Body.b2_dynamicBody;
		var sBD = new BitmapData("images/box.jpg");


		// sBodyDef.position.Set(5,5);
		sBodyDef.position.Set(posX, posY - senHgt*4); //set first link pos to player

		var bodyUserData = {
			category: "NonObject",
			type: "PlayerSensor",
			isFlaggedForDelete: false
		};
		sBodyDef.userData = bodyUserData;

		var sensorBody = world.CreateBody(sBodyDef);
		sensorBody.CreateFixture(sFixDef);

		var revJointDef = makeRevJoint(body,sensorBody, new b2Vec2(0,-0.3), new b2Vec2(0,senHgt));
		world.CreateJoint(revJointDef);
		this.addCargoWeight(sensorBody.GetMass());

		bodies.push(sensorBody);

		var bm = new Bitmap(sBD); //bitmap
		bm.x = bm.y = -100;

		var actor = new Sprite();  
		// actor.addChild(bm);

		actor.scaleX = senWth;
		actor.scaleY = senHgt;

		stage.addChild(actor);
		actors.push(actor);
		this.senActor = actor;
		this.senBody = sensorBody;



	};
	function makeRevJoint(bodyA,bodyB,anchorA,anchorB) {
        var revoluteJointDef = new b2RevoluteJointDef();
        revoluteJointDef.localAnchorA.Set(anchorA.x,anchorA.y);
        revoluteJointDef.localAnchorB.Set(anchorB.x,anchorB.y);
        revoluteJointDef.bodyA=bodyA;
        revoluteJointDef.bodyB=bodyB;
        return revoluteJointDef;
    }

	Player.prototype.addCargoWeight = function(cargoM){
		// console.log("cargoM: " + cargoM);

		this.cargoMass += cargoM;

	}


	Player.prototype.changeGrav = function(){

		var counterGravity = new b2Vec2(world.GetGravity().x, world.GetGravity().y);
		counterGravity.Multiply((this.body.GetMass() + this.cargoMass) * -1);


		this.body.ApplyForce(counterGravity, this.body.GetWorldCenter());

		var currentAngle = this.body.GetAngle(); //current angle in rad
		var currentAngleDeg = currentAngle * (180/Math.PI);
		var posX = this.body.GetPosition().x;
		var posY = this.body.GetPosition().y;
		var senPosX = this.senBody.GetPosition().x;
		var senPosY = this.senBody.GetPosition().y;

		var posVec = new b2Vec2(posX,posY);
		var senPosVec = new b2Vec2(senPosX,senPosY);

		var angleMat = new b2Mat22;
		var newTransform = new b2Transform;



		if(currentAngle > this.rotateLimit){
			currentAngle = this.rotateLimit;
			angleMat.Set(currentAngle);
			newTransform.Initialize(posVec,angleMat);



			this.body.SetTransform(newTransform);

			// senTransform.Initialize(senPosVec,angleMat);
			// this.senBody.SetTransform(senTransform);
		}
		else if(currentAngle< -this.rotateLimit){
			currentAngle = -this.rotateLimit;
			angleMat.Set(currentAngle);
			newTransform.Initialize(posVec,angleMat);

			this.body.SetTransform(newTransform);

			// senTransform.Initialize(senPosVec,angleMat);
			// this.senBody.SetTransform(senTransform);

		}

		
		
		if (currentAngleDeg < -this.correctionLimit){
			this.body.ApplyTorque(10);
			// this.senBody.ApplyTorque(10);

		}
		else if( currentAngleDeg > this.correctionLimit){
			this.body.ApplyTorque(-10);
			// this.senBody.ApplyTorque(-10);

		}
		else{
			angleMat.Set(0);
			newTransform.Initialize(posVec, angleMat);


			this.body.SetTransform(newTransform);
			// senTransform.Initialize(senPosVec, angleMat);

		}
		var senAngleMat = new b2Mat22;
		var bodyAngle = this.body.GetAngle(); //current angle in rad
		senAngleMat.Set(bodyAngle);
		var senTransform = new b2Transform;
		senTransform.Initialize(senPosVec, senAngleMat);
		this.senBody.SetTransform(senTransform);



	}


	Player.prototype.moveUp = function(e){
		var up = new b2Vec2(0, -0.5);
		this.body.ApplyImpulse(up, this.body.GetWorldCenter());
	}
	Player.prototype.moveDown = function(e){

		var down = new b2Vec2(0, 0.5);
		this.body.ApplyImpulse(down, this.body.GetWorldCenter());
	}
	Player.prototype.moveLeft = function(e){
		console.log("player left");

		var left = new b2Vec2(-0.5, 0);
		this.body.ApplyImpulse(left, this.body.GetWorldCenter());
		this.body.ApplyTorque(-35);
	}
	Player.prototype.moveRight = function(e){
		console.log("player right");

		var right = new b2Vec2(0.5, 0);
		this.body.ApplyImpulse(right, this.body.GetWorldCenter());

		this.body.ApplyTorque(35);

	}



	return{
		Player : Player
	}

})();