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
let playerTouchingBottom = true;
//let high_score = parseInt(getCookie('high_score'), 10) || 0;
let platvormid = 8;
const highScore = getCookie('high_score');
    if (highScore) {
        document.getElementById('high_score').innerText = highScore; // Näitab high scorei
    }
// document.addEventListener('DOMContentLoaded', () => {
//     highScore = getCookie('high_score') ? parseInt(getCookie('high_score')) : 0;
//     document.getElementById('high_score').innerText = highScore;

//     document.getElementById('clear-high_score').addEventListener('click', () => {
//         clearHighScore();
//     });
// });


function preload() {
    this.load.image('sky', 'assetid/sky.png');
    this.load.image('platform', 'assetid/platform.png');
    this.load.image('cat', 'assetid/cat.png');
    this.load.image('ground', 'assetid/ground.png');
    console.log('Cookie content:', document.cookie);
    console.log('High score from cookie:', getCookie('high_score')); 
}
 // Loo mängu keskkond
function create() {
    const background = this.add.image(0, 0, 'sky').setOrigin(0, 0);
    background.displayWidth = this.sys.game.config.width;
    background.displayHeight = this.sys.game.config.height;

    platforms = this.physics.add.staticGroup();

    // Kui skoor on üle 3 ja üle 10, siis muutub mäng raskemaks, sest vähem platvorme tekib
    if (score > 3) {
        platvormid = 6;
    }

    if (score > 10) {
        platvormid = 5;
    }
    // Loo platvormid
    for (let i = 0; i < platvormid; i++) {
        let x, y, platform, overlap;
        do {
            x = Phaser.Math.Between(0, 400);
            y = Phaser.Math.Between(400, 700); // Vhaemikus Y(400, 700) ehk alumised platvormid
            platform = platforms.create(x, y, 'platform').setScale(0.2).refreshBody();
            platform.body.setSize(platform.displayWidth * 0.2, platform.displayHeight * 0.2);
            platform.body.setOffset((platform.displayWidth - platform.body.width) / 2, (platform.displayHeight - platform.body.height) / 2);

            // Otsi kattuvust
            overlap = this.physics.overlap(platform, platforms);
            if (overlap) {
                platform.destroy(); // Hävita platvorm, kui genereerib kattuvusega
            }
        } while (overlap);
    }

    for (let i = 0; i < 6; i++) {
        let x, y, platform, overlap;
        do {
            x = Phaser.Math.Between(0, 400);
            y = Phaser.Math.Between(100, 400); // Vahemikus Y(100, 400) ehk ülemused platvormid
            platform = platforms.create(x, y, 'platform').setScale(0.2).refreshBody();
            platform.body.setSize(platform.displayWidth * 0.2, platform.displayHeight * 0.2);
            platform.body.setOffset((platform.displayWidth - platform.body.width) / 2, (platform.displayHeight - platform.body.height) / 2);

            // Otsi kattuvust
            overlap = this.physics.overlap(platform, platforms);
            if (overlap) {
                platform.destroy(); // Hävita platvorm, kui genereerib kattuvusega
            }
        } while (overlap);
    }

    const bottomGround = platforms.create(400, this.sys.game.config.height, 'ground').setScale(1.5, 0.2).refreshBody();
    bottomGround.y -= bottomGround.displayHeight / 2; 

    // Loo player
    player = this.physics.add.sprite(200, bottomGround.y - 40, 'cat');
    player.setScale(0.1); // Muuda player suurusele 0.1
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, platforms, (player, platform) => {
        // Alumine põhi ei ole osa platvormi collider loogikast
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
        // Lülita hitboxid sisse, kui player on kõrgemal platvormist
        platform.body.checkCollision.up = true;
        platform.body.checkCollision.down = true;
        platform.body.checkCollision.right = true;
        platform.body.checkCollision.left = true;
    } else {
        // Lülita hitboxid välja
        platform.body.checkCollision.up = false;
        platform.body.checkCollision.down = false;
        platform.body.checkCollision.right = false;
        platform.body.checkCollision.left = false;
    }
}

// Restart funktsioon
function resetGame() {
    playerTouchingBottom = true;
    this.scene.restart();
}

// Salvesta high score'i väärtus cookiesse
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Võta high score'i väärtus cookiest
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Funktsioon, et clearida cookie ja high score nupuga
//function clearHighScore() {
//    setCookie('high_score', '', -1);
//    high_score = 0;
//    document.getElementById('high_score').innerText = high_score;
//}

// Funkstioon mängu erinevate olude kontrollimiseks
function update() {
    // Kui toimuvad keypressid
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

    // Kui mängija ei puudu platvormi, siis on touchingPlatform lipp false
    if (!this.physics.overlap(player, platforms)) {
        touchingPlatform = false;
    }

    // +1 score, kui mängija puudub tippu
    if (player.y <= 40) {
        score += 1;
        document.getElementById('score').innerText = score;
        resetGame.call(this);
    }

    if (player.y <= 700 && player.body.touching.down) {
        playerTouchingBottom = false;
    }

    // Fail, kui mängija kukub alla peale esimese platvormi puutumist ja seab uue high score'i, kui score oli kõrgem<
    if (player.y >= 710 && !playerTouchingBottom && player.body.touching.down) {
        if (score > high_score) {
            high_score = score;
            document.getElementById('high_score').innerText = high_score;
            setCookie('high_score', high_score, 365);
        }
        document.getElementById('score').innerText = score;
        window.location.href = `finish.html?score=${score}`; 
    }
}
