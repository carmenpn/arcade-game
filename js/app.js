"use strict"

// Lives
const hearts = document.querySelectorAll(".hearts img");

// Pop-up window if you lose/win
const losePopUp = document.querySelector("#lose"),
      winPopUp  = document.getElementById("win"),
      popUp     = document.getElementsByClassName("pop-up");

// Restart button
const restartButton = document.querySelector(".restart-button img");

// Pop-up buttons
const closePopUp = document.querySelectorAll(".close-button img"),
      button     = document.querySelector("button");

// Number of collisions
var collision = 0;

// Score points
var scorePoints = document.getElementById("count-score");

// Generating random position X/Y and speed for enemies
const positionX = [-50, -300, -450, -600, -800, -1000, -1200],
      positionY = [65, 145, 230],
      speed = [40, 50, 70, 90, 110, 130, 120, 140, 150, 180];

// Generating random position X/Y and speed for star
const starX = [20, 120, 220, 325, 425],
      starY = [140, 225, 300];

// =========
// CHARACTER
// =========

var Character = function(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
};

Character.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// =========
// ENEMY
// =========

// Enemies our player must avoid
function Enemy (x, y, w, h) {
    Character.call(this, x, y, w, h);
    this.speed  = speed[Math.floor(Math.random() * speed.length)];
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position and speed
Enemy.prototype.update = function(dt) {
    if (this.x >= 505) {
        this.x = -600;
    } else {
        this.x += dt * this.speed;
    }
    // Check collision
    // Collision code from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    if (this.x < player.x + player.width &&
        this.x + this.width > player.x &&
        this.y < player.y + player.height &&
        this.height + this.y > player.y) {
        player.x = 200;
        player.y = 400;
        collision++;
        // Make hearts dissappear according to number of collisions
        hearts.item(0).style.visibility = "hidden";
        if (collision === 2) {
            hearts.item(1).style.visibility = "hidden";
        }
        if (collision === 3) {
            hearts.item(2).style.visibility = "hidden";
            losePopUp.style.display = "block";
            star.reset();
            player.reset();
            this.reset();
        }
    }
};

// Reset enemies and display all hearts
Enemy.prototype.reset = function() {
    collision   = 0;
    this.x      = positionX[Math.floor(Math.random() * positionX.length)];
    this.y      = positionY[Math.floor(Math.random() * positionY.length)];
    this.speed  = speed[Math.floor(Math.random() * speed.length)];
    for (let i = 0; i < hearts.length; i++) {
        hearts.item(i).style.visibility = "visible";
    }
};

// =========
// PLAYER
// =========

function Player (x, y, w, h) {
    Character.call(this, x, y, w, h);
    this.score = 0;
    this.sprite = 'images/char-pink-girl.png';
};

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

// Update function for Player
Player.prototype.update = function() {
    // Display "Win" Pop-up if the player has 100 points
    if (this.score === 100) {
        winPopUp.style.display = "block";
        star.reset();
        this.reset();
        allEnemies.forEach(function(enemy) {
            enemy.reset();
        });
    }
};

// Handle keyboard input from user
Player.prototype.handleInput = function(e) {
    switch(e) {
        case "up":
            this.y -= 81.5;
            if (this.y < 0) {
                this.y = 400;
                this.x = 200;
            }
            starCollision();
            break;
        case "left":
            this.x -= 100;
            if (this.x < 0) {
                this.x = 0;
            }
            starCollision();
            break;
        case "right":
            this.x += 100;
            if (this.x > 400) {
                this.x = 400;
            }
            starCollision();
            break;
        case "down":
            this.y += 81.5;
            if (this.y > 400) {
                this.y = 400;
            }
            starCollision();
            break;
    }
};

// Reset player at the end of the game
Player.prototype.reset = function() {
    this.x = 200;
    this.y = 400;
    this.score = 0;
    scorePoints.textContent = this.score;
};

// =========
// STAR
// =========

function Star (x, y, w, h) {
    Character.call(this, x, y, w, h);
    this.sprite = 'images/star.png';
};

Star.prototype = Object.create(Character.prototype);
Star.prototype.constructor = Star;

// Reset star position and score points
Star.prototype.reset = function() {
    this.x = starX[Math.floor(Math.random() * starX.length)];
    this.y = starY[Math.floor(Math.random() * starY.length)];
};

// =================
// DECLARE VARIABLES
// =================

// Place the player object in a variable called player
var player = new Player(200, 400, 50, 70);

// Declare the star variable
var star = new Star(starX[Math.floor(Math.random() * starX.length)], starY[Math.floor(Math.random() * starY.length)], 5, 5);

// Place all enemy objects in an array called allEnemies
var allEnemies = [new Enemy(positionX[Math.floor(Math.random() * positionX.length)], positionY[Math.floor(Math.random() * positionY.length)], 80, 60),
                  new Enemy(positionX[Math.floor(Math.random() * positionX.length)], positionY[Math.floor(Math.random() * positionY.length)], 80, 60), 
                  new Enemy(positionX[Math.floor(Math.random() * positionX.length)], positionY[Math.floor(Math.random() * positionY.length)], 80, 60),
                  new Enemy(positionX[Math.floor(Math.random() * positionX.length)], positionY[Math.floor(Math.random() * positionY.length)], 80, 60), 
                  new Enemy(positionX[Math.floor(Math.random() * positionX.length)], positionY[Math.floor(Math.random() * positionY.length)], 80, 60),
                  new Enemy(positionX[Math.floor(Math.random() * positionX.length)], positionY[Math.floor(Math.random() * positionY.length)], 80, 60),
                  new Enemy(positionX[Math.floor(Math.random() * positionX.length)], positionY[Math.floor(Math.random() * positionY.length)], 80, 60),
                  new Enemy(positionX[Math.floor(Math.random() * positionX.length)], positionY[Math.floor(Math.random() * positionY.length)], 80, 60),
                  new Enemy(positionX[Math.floor(Math.random() * positionX.length)], positionY[Math.floor(Math.random() * positionY.length)], 80, 60),
                  new Enemy(positionX[Math.floor(Math.random() * positionX.length)], positionY[Math.floor(Math.random() * positionY.length)], 80, 60)];

// =================
// EVENT LISTENERS
// =================

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Reset button
restartButton.addEventListener("click", function() {
    reset();
});

// Restart game - if you lose or win
for (let i = 0; i < closePopUp.length; i++) {
    closePopUp[i].addEventListener("click", function() {
        for (let i = 0; i < popUp.length; i++) {
            popUp[i].style.display = "none";
        }
        reset();
    });
}

// Try again button from the the Lose Modal
button.addEventListener("click", function() {
    for (let i = 0; i < popUp.length; i++) {
        popUp[i].style.display = "none";
    }
    reset();
});

// Reset function
function reset() {
    player.reset();
    star.reset();
    allEnemies.forEach(function(enemy) {
        enemy.reset();
    });
}

// Increase score if player reaches star and change star position
function starCollision() {
    if (star.x < player.x + player.width &&
        star.x + star.width > player.x &&
        star.y < player.y + player.height &&
        star.height + star.y > player.y) {
        console.log(star.x + " " + star.y);
        star.x = starX[Math.floor(Math.random() * starX.length)];
        star.y = starY[Math.floor(Math.random() * starY.length)];
        player.score += 10;
        scorePoints.textContent = player.score;
    }
}