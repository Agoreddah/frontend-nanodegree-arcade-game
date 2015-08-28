/*
 * Project: Arcade game
 * Course: Udacity Front-end nanodegree
 * Author: Tomas Chudjak
 * Last modification: 28.8.2015
 * Version: 1.0
 */


'use strict';

// Game variables

// user's starting points
var startingX = 202,
    startingY = 380,
    startingPoints = 0,
    pointsPosition = 575,
    startingHearts = 3,
    heartsImage = 'images/Heart.png',
    heartsPosition = 575;

// bug vars
var bugWidth = 101,
    bugSpeed = 100;

// gameplay dimmensions
var stepX = 101,
    stepY = 83;

// game border dimmensions
var borderTop = 48,
    borderBottom = 380,
    borderLeft = 0,
    borderRight = 404;

// starting lines
var stoneLine1 = 48,
    stoneLine2 = 131,
    stoneLine3 = 214;

// obstacles
var waterArea = -35;

// helper functions
// random multiplier between 1-4
function randomAcceleration() {
    return Math.floor(Math.random() * 4) + 1;
}

// Enemies our player must avoid
var Enemy = function(bugStartingX, bugStartingY, acceleration) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.positionX = bugStartingX;
    this.positionY = bugStartingY;
    this.width = bugWidth;
    this.speed = bugSpeed;
    this.acceleration = acceleration;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if(this.positionX > (borderRight + bugWidth)) {
        this.positionX = -bugWidth;
        this.acceleration = randomAcceleration();
    }
    else {
        this.positionX = this.positionX + ((this.speed * this.acceleration) * dt);
        //this.positionX = this.positionX + 1;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.positionX, this.positionY);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.hearts = startingHearts;
    this.points = startingPoints;
    this.positionX = startingX;
    this.positionY = startingY;
    this.sprite = 'images/char-boy.png';
    this.heart = 'images/Heart.png';
};

// Update Player's position
// Check if
Player.prototype.update = function(x, y) {
    var newStepX = this.positionX + x;
    var newStepY = this.positionY + y;
    if(x === null) {
        // check bottom border
        if(newStepY !== waterArea && newStepY <= borderBottom) {
            this.positionY = newStepY;
        }
        // check if our step will reach water area
        else if(newStepY === waterArea) {
            this.positionY = startingY;
            this.positionX = startingX;
            this.points++;
        }
        else{
            this.positionY = this.positionY;
        }
    }
    else if(y === null) {
        // check left and right border
        if(newStepX >= borderLeft && newStepX <= borderRight) {
            this.positionX = newStepX;
        }
        else {
            this.positionX = this.positionX;
        }
    }
    else {
        this.render();
    }
};

/* render player itself
 * render player's heart
 * render player's points
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.positionX, this.positionY);
    this.renderPoints();
    this.renderHearts();
};

// method to render player's points
Player.prototype.renderPoints = function() {
    ctx.font = "21px Impact";
    ctx.fillStyle = "orange";
    ctx.fillText("points: " +this.points,10,pointsPosition);
};

// method to render player's hearts
Player.prototype.renderHearts = function() {
    var heartPositionX  = -44,
        i = 0;
    for(i; i < this.hearts; i++) {
        heartPositionX = heartPositionX + 54;
        ctx.drawImage(Resources.get(heartsImage), heartPositionX, 40, 44, 75);
    }
};

Player.prototype.handleInput = function(eKeyCode) {
    switch(eKeyCode) {
        case "left":
            player.update(-stepX, null);
            break;
        case "right":
            player.update(stepX, null);
            break;
        case "up":
            player.update(null, -stepY);
            break;
        case "down":
            player.update(null, stepY);
            break;
        default:
            break;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var worm = new Enemy(-bugWidth, stoneLine1, randomAcceleration());
var snail = new Enemy(-bugWidth, stoneLine2, randomAcceleration());
var cockroach = new Enemy(-bugWidth, stoneLine3, randomAcceleration());

var allEnemies = [worm, snail, cockroach];
var player  = new Player();

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
