// Create the canvas
var STAGE_WIDTH = 800;
var STAGE_HEIGHT = 600; 

var waterCanvas = document.createElement("canvas");
waterCanvas.style.position="absolute";
var ctxWater = waterCanvas.getContext("2d");
waterCanvas.width = STAGE_WIDTH;
waterCanvas.height = STAGE_HEIGHT;
document.body.appendChild(waterCanvas);

var bgCanvas = document.createElement("canvas");
bgCanvas.style.position="absolute";
var ctxBg = bgCanvas.getContext("2d");
bgCanvas.width = STAGE_WIDTH;
bgCanvas.height = STAGE_HEIGHT;
document.body.appendChild(bgCanvas);

var canvas = document.createElement("canvas");
canvas.style.position="absolute";
var ctx = canvas.getContext("2d");
canvas.width = STAGE_WIDTH;
canvas.height = STAGE_HEIGHT;
document.body.appendChild(canvas);

var backgroundReady = false;
var initialized = false;

var PROJECTILE_WIDTH = 10;
var PROJECTILE_HEIGHT = 5;

var PLAYER_WIDTH = 20;
var PLAYER_HEIGHT = 10;


// Game objects
var playerA = {
	speed: 100, // movement in pixels per second
	health: 3
};

var playerB = {
	speed: 100, // movement in pixels per second
	health: 3
};

var projectiles = [];


// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var reset = function () {
	var startA = getStartPosition(true);
	playerA.x = startA.x;
	playerA.y = startA.y;

	var startB = getStartPosition(false);
	playerB.x = startB.x;
	playerB.y = startB.y;
};



// Update game objects
var update = function (modifier) {

	if (!initialized)  {
		if (backgroundReady) {
			initialized = true;
			reset();
		}
	}
	
	if (38 in keysDown) { // PlayerB holding up
		playerB.y -= playerB.speed * modifier;
	}
	if (40 in keysDown) { // PlayerB holding down
		playerB.y += playerB.speed * modifier;
	}
	if (37 in keysDown) { // PlayerB holding left
		playerB.x -= playerB.speed * modifier;
	}
	if (39 in keysDown) { // PlayerB holding right
		playerB.x += playerB.speed * modifier;
	}


	if (87 in keysDown) { // Player holding W
		playerA.y -= playerA.speed * modifier;
	}
	if (83 in keysDown) { // Player holding S
		playerA.y += playerA.speed * modifier;
	}
	if (65 in keysDown) { // Player holding A
		playerA.x -= playerA.speed * modifier;
	}
	if (68 in keysDown) { // Player holding D
		playerA.x += playerA.speed * modifier;
	}


	if (32 in keysDown) { // Player holding space bar
		fireProjectile(playerA, 1)
	}

	if (13 in keysDown) { // Player holding enter
		fireProjectile(playerB, -1)
	}

	// update projectile position
	var exploded = []
	for (var i=0;i<projectiles.length;i++) {
		var p = projectiles[i];
		p.x += p.speed*modifier*p.direction;

		if (isColliding(p, playerB)) {
			playerB.health -= 1;
			exploded.push(p);
		}
		if (isColliding(p, playerA)) {
			playerA.health -= 1;
			exploded.push(p);
		}

		// Projectile hits dirt
		var prcx = Math.floor(p.x + PROJECTILE_WIDTH  / 2);
		var prcy = Math.floor(p.y + PROJECTILE_HEIGHT / 2);
		
		if (isOnDirt(ctxBg, prcx, prcy))
			exploded.push(p)

		
	}

	for (i=0;i<exploded.length;i++) {
		var index = projectiles.indexOf(exploded[i]);
		projectiles.splice(index, 1)
	}



};

function isColliding(projectile, player) {
	var prcx = projectile.x + PROJECTILE_WIDTH  / 2;
	var prcy = projectile.y + PROJECTILE_HEIGHT / 2;
	return prcx > player.x && prcx < player.x + PLAYER_WIDTH && 
	   	   prcy > player.y && prcy < player.y + PLAYER_HEIGHT
}

function fireProjectile(player, direction) {
	var limit = 750;
	if (!player.lastFired || player.lastFired < Date.now() - limit) {
		player.lastFired = Date.now();

		projectiles.push({
			speed: 110,
			x: player.x + ((PLAYER_WIDTH)*direction) ,
			y: player.y,
			direction: direction
		})	
	}
}

// Draw everything
var render = function () {

	ctx.clearRect(0,0,canvas.width,canvas.height)

	// Draw sub A	
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(playerA.x, playerA.y, PLAYER_WIDTH, PLAYER_HEIGHT)

	// Draw sub B	
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(playerB.x, playerB.y, PLAYER_WIDTH, PLAYER_HEIGHT)

	ctx.fillStyle = "rgb(255, 0, 0)";
	for (var i=0;i<projectiles.length;i++) {
		var p = projectiles[i];
		ctx.fillRect(p.x, p.y, PROJECTILE_WIDTH, PROJECTILE_HEIGHT)
	}


	// Health	
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.font = "35px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText(playerA.health, 32, 10);

	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.font = "35px Helvetica";
	ctx.textAlign = "right";
	ctx.textBaseline = "top";
	ctx.fillText(playerB.health, 760, 10);
    
};

var renderBackground = function() {

	// Draw water
	ctxWater.fillStyle = "rgb(72, 188, 255)";
	ctxWater.fillRect(0, 0, 800, 600); 

	ctxBg.fillStyle = "rgb(0, 0, 0)";
	ctxBg.beginPath();
    
    // board border      
    ctxBg.moveTo(0,50);
    ctxBg.lineTo(0,600);
    ctxBg.lineTo(800,600);

    // shallows      
    ctxBg.lineTo(800,50);
    ctxBg.quadraticCurveTo(600,50,600,100);         

    // the deep
    ctxBg.quadraticCurveTo(600,600,400,600);
    ctxBg.quadraticCurveTo(200,600,200,100);

    // shallows
    ctxBg.quadraticCurveTo(200,50,0,50);
    ctxBg.fill();
    ctxBg.clip();
      
    var img = new Image();
    var imgWidth = 128,
        imgHeight = 128; 
  
    img.src = '/images/trench.jpg';

    img.onload = function () {
      backgroundReady = true;
      for (var i=0; i < Math.floor(bgCanvas.height/imgHeight) +1; i++){
        for (var j=0; j < Math.floor(bgCanvas.width/imgWidth)+1; j++){
          ctxBg.drawImage(img, j*imgWidth, i*imgHeight, imgWidth, imgHeight);
        }
      }
    };   

}

var isOnDirt = function(context, x, y) {
    var color = context.getImageData(x,y,1,1);
    return color.data[3] === 255;
}

var getStartPosition = function(isOnLeftSide) {
	var randomX, randomY;

	while (true) {
		randomX = Math.floor( Math.random() * STAGE_WIDTH  )
		randomY = Math.floor( Math.random() * STAGE_HEIGHT )
		
		if(isOnDirt(ctxBg, randomX, randomY))
			continue;

		if (isOnLeftSide && randomX > STAGE_WIDTH / 2)
			continue;
		if (!isOnLeftSide && randomX < STAGE_WIDTH / 2)
			continue;
		
		return { x: randomX, y: randomY } ;
	}
}


var failure = false;
var mainLoop = function () {
	if (failure) return;
	try {
		var now = Date.now();
		var delta = now - then;

		update(delta / 1000);
		render();

		then = now;
	} catch(error) {
		console.log("failure", error)
		failure = true;
	}
};





renderBackground();
var then = Date.now();
setInterval(mainLoop, 1); 