// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

var PROJECTILE_WIDTH = 10;
var PROJECTILE_HEIGHT = 5;

var PLAYER_WIDTH = 20;
var PLAYER_HEIGHT = 10;

// Game objects
var playerA = {
	speed: 100, // movement in pixels per second
	health: 10
};

var playerB = {
	speed: 100, // movement in pixels per second
	health: 10
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

// Reset the game when the player catches a monster
var reset = function () {
	playerA.x = 40;
	playerA.y = 130;

	playerB.x = 740;
	playerB.y = 130;

	// Throw the monster somewhere on the screen randomly
	//monster.x = 32 + (Math.random() * (canvas.width - 64));
	//monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
	
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
	
	// Draw water
	ctx.fillStyle = "rgb(72, 188, 255)";
	ctx.fillRect(0, 0, 800, 600);    

	// Draw sub A	
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.fillRect(playerA.x, playerA.y, PLAYER_WIDTH, PLAYER_HEIGHT)

	// Draw sub B	
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.fillRect(playerB.x, playerB.y, PLAYER_WIDTH, PLAYER_HEIGHT)

	ctx.fillStyle = "rgb(255, 0, 0)";
	for (var i=0;i<projectiles.length;i++) {
		var p = projectiles[i];
		ctx.fillRect(p.x, p.y, PROJECTILE_WIDTH, PROJECTILE_HEIGHT)
	}

	/*
	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}*/

	// Score
	
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "35px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText(playerA.health, 32, 32);

	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "35px Helvetica";
	ctx.textAlign = "right";
	ctx.textBaseline = "top";
	ctx.fillText(playerB.health, 760, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible