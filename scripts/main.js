app.main = (function(){

	var	b2Vec2		= Box2D.Common.Math.b2Vec2,
		b2BodyDef	= Box2D.Dynamics.b2BodyDef,
		b2Body		= Box2D.Dynamics.b2Body,
		b2FixtureDef	= Box2D.Dynamics.b2FixtureDef,
		b2World		= Box2D.Dynamics.b2World,
		b2ContactListener = Box2D.Dynamics.b2ContactListener,
		b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
		b2PolygonShape	= Box2D.Collision.Shapes.b2PolygonShape;
		b2CircleShape	= Box2D.Collision.Shapes.b2CircleShape;

	var world = new b2World(new b2Vec2(0, 10),  true);
	var bodies = [];	// instances of b2Body (from Box2D)
	var actors = [];	// instances of Bitmap (from IvanK)
	var up;

	var keys = [];
	var butt;

	var stage = new Stage("c");
	var player;
	var winch;
	var blocks = 0; //number of boxes and balls on screen



	function init (){
			
		

		
		// background
		var bg = new Bitmap( new BitmapData("images/bg.jpg") );
		bg.scaleX = bg.scaleY = stage.stageHeight/512;
		stage.addChild(bg);

		up = new b2Vec2(0, -5);
		
		// I decided that 1 meter = 100 pixels


		var hw = 0.5;	// "half width"
		var hh = 0.5;	// "half height"
		

		// randPos = Math.random()*7, -5 + Math.random()*5;
		// var randPos = new b2Vec2(1,2.67);
		randPos = 10;


		var ground = new app.ground.Ground();
		var ball = app.ball;
		ball1 = new ball.Ball(randPos, hh);
		blocks += 1;

		var box = app.box;
		box1 = new box.Box(randPos, hw, hh);
		blocks += 1;


		player = new app.player.Player();
		winch = new app.winch.Winch(player, 7);
		stage.addEventListener(Event.ENTER_FRAME, onEF);
		stage.addEventListener(KeyboardEvent.KEY_DOWN, onKD);
		stage.addEventListener(KeyboardEvent.KEY_UP, onKU);
		var w_manifold = new Box2D.Collision.b2WorldManifold();
		var listener = new b2ContactListener();
		var points = new b2Vec2;
		var num;

		listener.BeginContact = function(contact) {
			// num = contact.GetManifold().m_pointCount;
			contact.GetWorldManifold(w_manifold);
		 	// points = w_manifold.m_points;
			b1 = contact.GetFixtureA().GetBody();
			b2 = contact.GetFixtureB().GetBody();
			b1Data = b1.GetUserData();
			b2Data = b2.GetUserData();


			if(b1Data.type == 'PlayerSensor' && b2Data.category == 'Object'){
			   		console.log("PlayerSensor vs Object");
			   		

			   		// player.destroyObj(b2);
			   		b2Data.isFlaggedForDelete = true;

		   	}

			if(b2Data.type == 'PlayerSensor' && b1Data.category == 'Object'){
			   		console.log("PlayerSensor vs Object!!!");
			   		
			   		// player.destroyObj(b1);
			   		b1Data.isFlaggedForDelete = true;

 
			}


			if(b1Data.type == 'Hook' && b2Data.category == 'Object'){

				if(winch.grabbed == true){
			   		var hookJointDef = makeRevJoint(b1,b2,new b2Vec2(0,0),new b2Vec2(0,0));

        			var hookJoint = world.CreateJoint(hookJointDef);
        			winch.setHookJoint(hookJoint);
					// player.addCargoWeight(b1.GetMass());
				}

		    }
			if(b2Data.type == 'Hook' && b1Data.category == 'Object'){

				if(winch.grabbed == true){
			   		var hookJointDef = makeRevJoint(b1,b2,new b2Vec2(0,0),new b2Vec2(0,0));

        			var hookJoint = world.CreateJoint(hookJointDef);
        			winch.setHookJoint(hookJoint);
					// player.addCargoWeight(b1.GetMass());
				}

		    }

		}
		world.SetContactListener(listener);

		


	}


		
	function onEF(e) 
	{
		player.changeGrav();

		if(keys[37] == true) player.moveLeft(e);
		if(keys[38] == true) player.moveUp(e);
		if(keys[39] == true) player.moveRight(e);
		if(keys[40] == true) player.moveDown(e);

		
		world.Step(1 / 60,  3,  3);
		sweepDeadBodies();

		if(blocks < 3){
			// var randPos = new b2Vec2(Math.random()*7,-5 + Math.random()*5);

			if(Math.random() < 0.5){
				var box = app.box;
				boxz = new box.Box(10, 0.5, 0.5);
				blocks += 1;
			}
			else{
				var ball = app.ball;
				ballz = new ball.Ball(10, 0.5);
				blocks += 1;
			}
			
		}
		
		world.ClearForces();
		
		
		for(var i=0; i<actors.length; i++)
		{
			var body  = bodies[i];
			// console.log(bodies[i]);
			var actor = actors[i];
			
			var p = body.GetPosition();
			actor.x = p.x *100;	// updating actor
			actor.y = p.y *100;
			actor.rotation = body.GetAngle()*180/Math.PI;

			
		}
	}
	
	function sweepDeadBodies(){
		// var body = world.GetBodyList();
		// console.log("first body: " + body.GetUserData().type);

		for (var i = 0; i < bodies.length; i++) {
			var body = bodies[i];
			var actor = actors[i];
			var data = body.GetUserData();
			if(data != null){
				if(data.isFlaggedForDelete){
					bodies.splice(i, 1);
					actors.splice(i, 1);
					stage.removeChild(actor);
					world.DestroyBody(body);
					blocks -= 1;
					body.SetUserData(null);
					body = null;
				}
			}
		};

		
	}

	function onKD (e)
	{ 
		console.log(e.keyCode);
		keys[e.keyCode] = true;
		if(e.keyCode == 32) winch.grab(e, player);
		// console.log("winch hookJoint: " + winch.hookJoint);

	}

	function onKU (e)
	{
		keys[e.keyCode] = false;
		if(e.keyCode == 32) winch.release(e, player);
		// console.log("winch hookJoint: " + winch.hookJoint);


	}

	function makeRevJoint(bodyA,bodyB,anchorA,anchorB) {
        var revoluteJointDef = new b2RevoluteJointDef();
        revoluteJointDef.localAnchorA.Set(anchorA.x,anchorA.y);
        revoluteJointDef.localAnchorB.Set(anchorB.x,anchorB.y);
        revoluteJointDef.bodyA=bodyA;
        revoluteJointDef.bodyB=bodyB;
        return revoluteJointDef;
    }



	//Public interface
	return{

		init : init,
		stage : stage,
		world : world,
		bodies : bodies,
		actors : actors,
		onKD : onKD,
		onKU : onKU
	}
})();