function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Background(game) {
     this.x = 0;
     this.y = 0;
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

Background.prototype.draw = function (ctx) {
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/background.jpg"), this.x, this.y);
}

function Tree(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/tree.png"), 0, 0, 192, 192, .2, 4, true, false);
    Entity.call(this, game, 800, 330);
}

Tree.prototype = new Entity();
Tree.prototype.constructor = Tree;

Tree.prototype.update = function () {

}

Tree.prototype.draw = function (ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1.5);
    Entity.prototype.draw.call(this);
}

function Guy(game) {
    this.walkingAnimation = new Animation(ASSET_MANAGER.getAsset("./img/guy.png"), 0, 0, 256, 192, .1, 16, true, false);
    this.speed = 100;
    Entity.call(this, game, 400, 600 - 134)
}

Guy.prototype = new Entity();
Guy.prototype.constructor = Guy;

Guy.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 1100) this.x = -130;
    Entity.prototype.update.call(this);
}

Guy.prototype.draw = function(ctx) {
  this.walkingAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .8);
  Entity.prototype.draw.call(this);
}

function Spectre(game) {
    this.runningRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/spectre.png"), 0, 0, 144, 144, .1, 35, true, false);
    this.standingRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/spectre_standing.png"), 0, 0, 148, 125, 1, 1, true, false);
    this.runningLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/spectre_left.png"), 0, 0, 144, 144, .1, 35, true, false);
    this.standingLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/spectre_standing_left.png"), 0, 0, 148, 125, 1, 1, true, false);
    this.running = false;
    this.standing = true;
    this.right = true;
    this.left = false;
    this.speed = 0;
    Entity.call(this, game, 400, 600 - 106);
}

Spectre.prototype = new Entity();
Spectre.prototype.constructor = Spectre;

Spectre.prototype.update = function () {
    if (this.game.moveRight) {
        this.left = false;
        this.right = true;
        this.running = true;
        this.standing = false
        this.speed = 200;
        this.x += this.game.clockTick * this.speed;
    } else if (this.game.moveLeft) {
        this.right = false;
        this.left = true;
        this.running = true;
        this.standing = false
        this.speed = 200;
        this.x -= this.game.clockTick * this.speed;
    } else {
        this.running = false;
        this.standing = true;
        this.speed = 0;
    }
    if (this.x > 1100) {
        this.x = -130;
    } else if (this.x < -130) {
        this.x = 1099
    }
    Entity.prototype.update.call(this);
}

Spectre.prototype.draw = function (ctx) {
    if (this.running && this.right){
        this.runningRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if (this.running && this.left) {
        this.runningLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if (this.right) {
        this.standingRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if (this.left) {
        this.standingLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
}

function Bear(game) {
    this.walkingAnimation = new Animation(ASSET_MANAGER.getAsset("./img/bear.png"), 768, 1536, 256, 256, .10, 10, true, false);
    this.runAnimation = new Animation(ASSET_MANAGER.getAsset("./img/bear1.png"), 0, 0, 256, 256, .10, 10, true, false);
    this.walking = true;
    this.running = false;
    this.right = false;
    this.speed = 100;
    Entity.call(this, game, 400, 600 - 124);
}

Bear.prototype = new Entity();
Bear.prototype.constructor = Bear;

Bear.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x >= 500) {
        this.walking = false;
        this.running = true;
    } else {
        this.walking = true;
        this.running = false;
    }
    if (this.x > 1100) {
        this.x = -130;
    }
}

Bear.prototype.draw = function (ctx) {
    if (this.walking) {
        this.walkingAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .5);
        this.speed = 100;
    } else {
        this.runAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .5);
        this.speed = 200;
    }
}


// function Unicorn(game) {
//     this.animation = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
//     this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 618, 334, 174, 138, 0.02, 40, false, true);
//     this.jumping = false;
//     this.radius = 100;
//     this.ground = 400;
//     Entity.call(this, game, 0, 400);
// }
//
// Unicorn.prototype = new Entity();
// Unicorn.prototype.constructor = Unicorn;
//
// Unicorn.prototype.update = function () {
//     if (this.game.space) this.jumping = true;
//     if (this.jumping) {
//         if (this.jumpAnimation.isDone()) {
//             this.jumpAnimation.elapsedTime = 0;
//             this.jumping = false;
//         }
//         var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
//         var totalHeight = 200;
//
//         if (jumpDistance > 0.5)
//             jumpDistance = 1 - jumpDistance;
//
//         //var height = jumpDistance * 2 * totalHeight;
//         var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
//         this.y = this.ground - height;
//     }
//     Entity.prototype.update.call(this);
// }
//
// Unicorn.prototype.draw = function (ctx) {
//     if (this.jumping) {
//         this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x + 17, this.y - 34);
//     }
//     else {
//         this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
//     }
//     Entity.prototype.draw.call(this);
// }

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

//ASSET_MANAGER.queueDownload("./img/RobotUnicorn.png");
ASSET_MANAGER.queueDownload("./img/background.jpg");
ASSET_MANAGER.queueDownload("./img/guy.png");
ASSET_MANAGER.queueDownload("./img/spectre.png");
ASSET_MANAGER.queueDownload("./img/bear.png");
ASSET_MANAGER.queueDownload("./img/bear1.png");
ASSET_MANAGER.queueDownload("./img/tree.png");
ASSET_MANAGER.queueDownload("./img/spectre_standing.png");
ASSET_MANAGER.queueDownload("./img/spectre_standing_left.png");
ASSET_MANAGER.queueDownload("./img/spectre_left.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    //var bg = new Background(gameEngine);
    //var unicorn = new Unicorn(gameEngine);

    gameEngine.addEntity(new Background(gameEngine, ASSET_MANAGER.getAsset("./img/background.jpg")));
    gameEngine.addEntity(new Tree(gameEngine, ASSET_MANAGER.getAsset("./img/tree.png")));
    gameEngine.addEntity(new Guy(gameEngine, ASSET_MANAGER.getAsset("./img/guy.png")));
    gameEngine.addEntity(new Spectre(gameEngine, ASSET_MANAGER.getAsset("./img/spectre.png")));
    gameEngine.addEntity(new Bear(gameEngine, ASSET_MANAGER.getAsset("./img/bear.png")));
    //gameEngine.addEntity(unicorn);

    gameEngine.init(ctx);
    gameEngine.start();
});
