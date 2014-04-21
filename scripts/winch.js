app.winch = (function(){

	var	b2Vec2		= Box2D.Common.Math.b2Vec2,
		b2BodyDef	= Box2D.Dynamics.b2BodyDef,
		b2Body		= Box2D.Dynamics.b2Body,
		b2FixtureDef	= Box2D.Dynamics.b2FixtureDef,
		b2World		= Box2D.Dynamics.b2World,
		b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
		b2PolygonShape	= Box2D.Collision.Shapes.b2PolygonShape,
		b2CircleShape	= Box2D.Collision.Shapes.b2CircleShape,
		b2ContactListener = Box2D.Dynamics.b2ContactListener,
		b2WorldManifold = Box2D.Collision.b2WorldManifold();

	var stage = app.main.stage;
	var world = app.main.world;
	var bodies = app.main.bodies;
	var actors = app.main.actors;



	function Winch(player, numLinks){
		this.player = player;
		this.numLinks = numLinks;
		this.linkWidth = 0.10;
		this.linkHeight = 0.20;
		this.hookRadius = 0.15;
		this.mass = 0;
		this.grabbed = false;
		// this.grabbedBody;
		this.contactListener;
		this.hookJoint;
		this.makeWinch(player, numLinks, this.linkWidth, this.linkHeight, this.hookRadius);

		
	};

	function add(vec1,vec2){

		var sumVec = new b2Vec2(0,0);

		sumVec.x = vec1.x + vec2.x;
		sumVec.y = vec1.y + vec2.y;
		return sumVec;

	}

	Winch.prototype.makeWinch = function(player, numLinks, linkWidth, linkHeight, hookRadius) {
		// body...
		console.log("make Winch!");
		var LinkBitmap = new BitmapData("images/link.png");
		var HookBitmap = new BitmapData("images/hook.png");

		var hook = new b2BodyDef();

		var FixDef	= new b2FixtureDef();	//fixture definition
		FixDef.density = 1;
		FixDef.shape = new b2PolygonShape();

		FixDef.shape.SetAsBox(linkWidth,linkHeight);


		var playerPosVec = player.body.GetPosition();

		var bodyDef = new b2BodyDef();
		bodyDef.type = b2Body.b2_dynamicBody;

		//link creation
		for(var i = 0; i <numLinks; i++){
			console.log("making links");

			bodyDef.position.Set(playerPosVec.x, playerPosVec.y + (linkHeight+2*linkHeight*i)); //set first link pos to player
			var bodyUserData = {
				category: "NonObject",
				type: "Link",
				isFlaggedForDelete: false
			};
			bodyDef.userData = bodyUserData;

			if(i==0){
				var link = world.CreateBody(bodyDef);

				link.CreateFixture(FixDef);

				var revJointDef = makeRevJoint(player.body,link, new b2Vec2(0,player.height), new b2Vec2(0,-linkHeight));
        		world.CreateJoint(revJointDef);

				var linkMass = link.GetMass();

				this.mass += linkMass;

				
				
				bodies.push(link);
				var bm = new Bitmap(LinkBitmap);
				bm.x = bm.y = -100;
				var actor = new Sprite();
				actor.addChild(bm);
				actor.scaleX = linkWidth;
				actor.scaleY = linkHeight;
				stage.addChild(actor);
				actors.push(actor);


			}
			else{

				var newLink = world.CreateBody(bodyDef);
				newLink.CreateFixture(FixDef);
				var revJointDef = makeRevJoint(link,newLink, new b2Vec2(0,linkHeight), new b2Vec2(0, -linkHeight));
        		world.CreateJoint(revJointDef);

				link = newLink;

				this.mass += newLink.GetMass();
				


				bodies.push(newLink);
				var bm = new Bitmap(LinkBitmap);
				bm.x = bm.y = -100;
				var actor = new Sprite();
				actor.addChild(bm);
				actor.scaleX = linkWidth;
				actor.scaleY = linkHeight;
				stage.addChild(actor);
				actors.push(actor);
			}


		}
		//add hook
		var circleShape = new b2CircleShape();
		FixDef.shape = circleShape;
		FixDef.shape.SetRadius(hookRadius);

		var bodyUserData = {
			category: "NonObject",
			type: "Hook",
			isFlaggedForDelete: false
		};

		bodyDef.userData = bodyUserData;

		hook = world.CreateBody(bodyDef);
		hook.CreateFixture(FixDef);
		var revJointDef = makeRevJoint(link,hook, new b2Vec2(0,linkHeight),new b2Vec2(0,0));
        world.CreateJoint(revJointDef);


		this.mass += hook.GetMass();

		this.hookBody = hook;


		bodies.push(hook);
		var bm = new Bitmap(HookBitmap);
		bm.x = bm.y = -100;
		var actor = new Sprite();
		actor.addChild(bm);
		actor.scaleX = actor.scaleY = hookRadius;
		stage.addChild(actor);
		actors.push(actor);


		player.addCargoWeight(this.mass);

		

		

	
		
	};

	function makeRevJoint(bodyA,bodyB,anchorA,anchorB) {
        var revoluteJointDef = new b2RevoluteJointDef();
        revoluteJointDef.localAnchorA.Set(anchorA.x,anchorA.y);
        revoluteJointDef.localAnchorB.Set(anchorB.x,anchorB.y);
        revoluteJointDef.bodyA=bodyA;
        revoluteJointDef.bodyB=bodyB;
        return revoluteJointDef;
    }

	Winch.prototype.grab = function(e, player){
		//grabbing!!
		if(this.grabbed == false){
			console.log("winch grab!");

			this.grabbed = true;

		}

	}
	Winch.prototype.setHookJoint = function(hookJoint){
		this.hookJoint = hookJoint;
	}
	Winch.prototype.release = function(e, player){
		//grabbing!!

		if(this.grabbed == true){
			console.log("Winch relase!");
			
			var hookJoint = this.hookJoint;


			if(hookJoint != null){
				world.DestroyJoint(hookJoint);
			}

			this.grabbed = false;
		}
	}

	return{
		Winch : Winch
	}

})();