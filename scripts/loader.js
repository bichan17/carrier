var app = {}; //global var

//wait until main document is loaded
window.addEventListener("load",function(){
	//start dynamic loading
	Modernizr.load([{
		//load all libraries and scripts
		load: ["scripts/ivank.js","scripts/Box2dWeb-2.1.a.3.min.js", "scripts/main.js", "scripts/player.js","scripts/winch.js", "scripts/ball.js", "scripts/box.js", "scripts/ground.js"],

		//called when all files have finished loading and executing
		complete: function(){
			console.log("all files loaded!");

			//run init
			app.main.init();

		}
	}
	]); //end Modernizer.load
}); //end addEventListener