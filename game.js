//Tutorial prompt.
alert("Instructions: Use the arrow keys to move, pick up apples to score points and get faster, but avoid the spikey guy! You can leave the screen to reappar on the other side, and every 5 apples an extra life powerup will drop. Have fun!")

//audio clip taken from freesound.org and licensed under creative commons 
const walkingSound = new Audio('walking.wav');
//song taken from https://freemusicarchive.org/music/Derek_Clegg/the-best-of-number-3/cest-la-vie and licensed under Attribution-NonCommercial-ShareAlike 4.0 International License. 
const bgMusic = new Audio('Derek Clegg - Cest La Vie.mp3');
bgMusic.play();
bgMusic.loop =true;
bgMusic.playbackRate = 2;

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var resetCount = 0;
var bonus = 1;
var lifeLooper = 0;
var lives = 1;
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// gargler image
var garglerReady = false;
var garglerImage = new Image();
garglerImage.onload = function () {
	garglerReady = true;
};
garglerImage.src = "images/gargler.png";

// Apple image
var appleReady = false;
var appleImage = new Image();
appleImage.onload = function () {
	appleReady = true;
};
appleImage.src = "images/apple.png";

//Enemy image
var enemyReady = false;
var enemyImage = new Image();
enemyImage.onload = function () {
	enemyReady = true;
};
enemyImage.src = "images/enemy.png";

//oneUp image
var oneUpReady = false;
var oneUpImage = new Image();
oneUpImage.onload = function () {
	oneUpReady = true;
};
oneUpImage.src = "images/life.png";

// Game objects
var gargler = {
	speed: 256 // movement in pixels per second
};
var apples = {};
var applesEaten = 0;
var enemies = {};
enemies.x = 32 + (Math.random() * (canvas.width - 64));
enemies.y = 32 + (Math.random() * (canvas.height - 64));
var oneUp = {};

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
	walkingSound.play();
	walkingSound.loop =true;
	walkingSound.playbackRate = 2;
	bgMusic.play();
	bgMusic.loop =true;
	bgMusic.playbackRate = 1;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
	walkingSound.pause();
}, false);

// Reset the game when the player eats a apple
var reset = function () {
	if (resetCount == 0) {
		gargler.x = canvas.width / 2;
		gargler.y = canvas.height / 2;
		resetCount++;
	}
	// Throw the apple somewhere on the screen randomly
	apples.x = 32 + (Math.random() * (canvas.width - 64));
	apples.y = 32 + (Math.random() * (canvas.height - 64));
	enemies.x = 32 + (Math.random() * (canvas.width - 64));
	enemies.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		gargler.y -= gargler.speed * modifier * bonus;
		enemyMovement();
	}
	if (40 in keysDown) { // Player holding down
		gargler.y += gargler.speed * modifier  * bonus;
		enemyMovement();
	}
	if (37 in keysDown) { // Player holding left
		gargler.x -= gargler.speed * modifier * bonus;
		enemyMovement();
	}
	if (39 in keysDown) { // Player holding right
		gargler.x += gargler.speed * modifier * bonus;
		enemyMovement();
	}

	// Are they touching an apple?
	if (
		gargler.x <= (apples.x + 32)
		&& apples.x <= (gargler.x + 32)
		&& gargler.y <= (apples.y + 32)
		&& apples.y <= (gargler.y + 32)
	) {
		++applesEaten;
		bonus = bonus * 1.1;
		if (bonus > 5) {
			bonus = 5;
		}
		//Creates a bonus life powerup after eating 5 apples.
		lifeLooper++;
		if (lifeLooper == 5) {
			oneUp.x = 32 + (Math.random() * (canvas.width - 64));
			oneUp.y = 32 + (Math.random() * (canvas.height - 64));
			lifeLooper = 0;
		}
		
		reset();
	}
	
	//Are they touching an extra life?
	if (
		gargler.x <= (oneUp.x + 28)
		&& oneUp.x <= (gargler.x + 28)
		&& gargler.y <= (oneUp.y + 28)
		&& oneUp.y <= (gargler.y + 28)
	) {
		lives++;
		oneUp.x = 1000;
		oneUp.y = 1000;
	}
	
	//Are they touching an enemy?
	if (
		gargler.x <= (enemies.x + 28)
		&& enemies.x <= (gargler.x + 28)
		&& gargler.y <= (enemies.y + 28)
		&& enemies.y <= (gargler.y + 28)
	) {
		//Game over and life system.
		if (lives == 1) {
			alert("You lose!\nYour highscore was: " + applesEaten);
			applesEaten = 0;
			bonus = 1;
			reset();
			delete keysDown[37];
			delete keysDown[38];
			delete keysDown[39];
			delete keysDown[40];
			lifeLooper = 0;
		}
		else {
			lives--;
			reset();
		}
		gargler.x = canvas.width/2;
		gargler.y = canvas.height/2;

	}
	//This lets the gargler reappar on the opposite side when leaving the screen region.
	if (gargler.x < 0) {
		gargler.x = canvas.width;
	}
	if (gargler.x > canvas.width) {
		gargler.x = 0;
	}
	if (gargler.y > canvas.height) {
		gargler.y = 0;
	}
	if (gargler.y < 0) {
		gargler.y = canvas.height;
	}
				
};
//This lets the enemy chase the Gargler, and get faster as he does, to keep thing interesting.
var enemyMovement = function() {
	if (gargler.x > enemies.x) {
		enemies.x = enemies.x * (1 + (0.01*bonus));
	}
	if (gargler.x < enemies.x) {
		enemies.x = enemies.x * (1 - (0.01*bonus))
	}
	if (gargler.y > enemies.y) {
		enemies.y = enemies.y * (1 + (0.01*bonus));
	}
	if (gargler.y < enemies.y) {
		enemies.y = enemies.y * (1 - (0.01*bonus))
	}
}

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (garglerReady) {
		ctx.drawImage(garglerImage, gargler.x, gargler.y);
	}

	if (appleReady) {
		ctx.drawImage(appleImage, apples.x, apples.y);
	}
	if (enemyReady) {
		ctx.drawImage(enemyImage, enemies.x, enemies.y);
	}
	if (oneUpReady) {
		ctx.drawImage(oneUpImage, oneUp.x, oneUp.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Apples eaten: " + applesEaten + "\n Lives: " + lives, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};
// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();