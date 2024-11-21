// Mäng on tehtud Phaser library'ga ja kood on aluseks tehtud GitHub Copilotiga ning asju ise muudetud vastavalt vajadusele

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let platforms;
let cursors;
let spacebar;
let wad;
let score = 0;
let scoreText;

function preload() {
    this.load.image('sky', 'assetid/sky.png');
    this.load.image('platform', 'assetid/platform.png');
    this.load.image('cat', 'assetid/cat.png');
    this.load.image('ground', 'assetid/ground.png')  
}

function create() {
    const background = this.add.image(0, 0, 'sky').setOrigin(0, 0);
    background.displayWidth = this.sys.game.config.width;
    background.displayHeight = this.sys.game.config.height;

    platforms = this.physics.add.staticGroup();

    // Create platforms
    for (let i = 0; i < 6; i++) {
        let x, y, platform, overlap;
        do {
            x = Phaser.Math.Between(0, 400);
            y = Phaser.Math.Between(400, 700);
            platform = platforms.create(x, y, 'platform').setScale(0.2).refreshBody();
            platform.body.setSize(platform.displayWidth * 0.2, platform.displayHeight * 0.2);
            platform.body.setOffset((platform.displayWidth - platform.body.width) / 2, (platform.displayHeight - platform.body.height) / 2);

            // Check for overlap with existing platforms
            overlap = this.physics.overlap(platform, platforms);
            if (overlap) {
                platform.destroy(); // Destroy the platform if it overlaps
            }
        } while (overlap);
    }

    for (let i = 0; i < 6; i++) {
        let x, y, platform, overlap;
        do {
            x = Phaser.Math.Between(0, 400);
            y = Phaser.Math.Between(100, 400);
            platform = platforms.create(x, y, 'platform').setScale(0.2).refreshBody();
            platform.body.setSize(platform.displayWidth * 0.2, platform.displayHeight * 0.2);
            platform.body.setOffset((platform.displayWidth - platform.body.width) / 2, (platform.displayHeight - platform.body.height) / 2);

            // Check for overlap with existing platforms
            overlap = this.physics.overlap(platform, platforms);
            if (overlap) {
                platform.destroy(); // Destroy the platform if it overlaps
            }
        } while (overlap);
    }

    const bottomGround = platforms.create(400, this.sys.game.config.height, 'ground').setScale(1.5, 0.2).refreshBody();
    bottomGround.y -= bottomGround.displayHeight / 2; // Adjust position to be at the bottom

    player = this.physics.add.sprite(200, bottomGround.y - 40, 'cat');
    player.setScale(0.1); // Scale down the cat sprite
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, platforms, (player, platform) => {
        // Exclude bottom ground from custom collision logic
        if (platform === bottomGround) {
            return;
        }
        checkCollision(player, platform);
    });

    wad = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });
    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}

function checkCollision(player, platform) {  
    if (player.body.bottom < platform.body.bottom) {
        // Enable collision if the player is above the platform
        platform.body.checkCollision.up = true;
        platform.body.checkCollision.down = true;
        platform.body.checkCollision.right = true;
        platform.body.checkCollision.left = true;
    } else {
        // Disable collision if the player is below the platform
        platform.body.checkCollision.up = false;
        platform.body.checkCollision.down = false;
        platform.body.checkCollision.right = false;
        platform.body.checkCollision.left = false;
    }
}

function resetGame() {
    this.scene.restart();
}

function update() {
    if (wad.left.isDown) {
        player.setVelocityX(-160);
    } else if (wad.right.isDown) {
        player.setVelocityX(160);
    }
    else {
    player.setVelocityX(0);
    }

    if ((wad.up.isDown || spacebar.isDown) && player.body.touching.down) {
        player.setVelocityY(-450);
    }


    platforms.children.iterate(function (platform, bottomGround) {
        if (platform !== bottomGround) {
            checkCollision(player, platform);
        }
    });

    this.physics.overlap(player, platforms, function (player, platform) {
        touchingPlatform = true;
        // Lõhu platform 1.2 sec peale overlappi
        this.time.delayedCall(1200, () => {
            platform.destroy();
        });
    }, null, this);

    // Reset touchingPlatform flag if player is not touching any platform
    if (!this.physics.overlap(player, platforms)) {
        touchingPlatform = false;
    }

    if (player.y <= 40) {
        score += 1;
        document.getElementById('score').innerText = score;
        resetGame.call(this);
    }
}
