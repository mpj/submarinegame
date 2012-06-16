// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);


// Game objects
var playerA = {
	speed: 256 // movement in pixels per second
};

var playerB = {
	speed: 256 // movement in pixels per second
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
	playerA.x = 10;
	playerA.y = 20;

	playerB.x = 770;
	playerB.y = 20;

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

	// draw projectiles
	for (var i=0;i<projectiles.length;i++) {
		var p = projectiles[i];
		p.x += p.speed*modifier*p.direction;
	}

	// Are they touching?
	/*
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		reset();
	}*/
};

function fireProjectile(player, direction) {
	if (!player.lastFired || player.lastFired < Date.now() - 500) {
		player.lastFired = Date.now();

		projectiles.push({
			speed: 110,
			x: player.x,
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
	ctx.fillRect(playerA.x, playerA.y, 20,8)

	// Draw sub B	
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.fillRect(playerB.x, playerB.y, 20,8)

	ctx.fillStyle = "rgb(255, 0, 0)";
	for (var i=0;i<projectiles.length;i++) {
		var p = projectiles[i];
		ctx.fillRect(p.x, p.y, 8,4)
	}

	/*
	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}*/

	// Score
	/*
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: ", 32, 32);*/
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