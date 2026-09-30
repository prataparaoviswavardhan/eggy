const game = document.getElementById("game");
const player = document.getElementById("player");

const scoreText = document.getElementById("score");
const livesText = document.getElementById("lives");
const levelText = document.getElementById("level");

const message = document.getElementById("message");
const startBtn = document.getElementById("startBtn");


let playerX = 175;

let score = 0;
let lives = 3;
let level = 1;

let items = [];

let gameRunning = false;

let lastSpawn = 0;

let spawnDelay = 900;

let fallSpeed = 2.5;


const keys = {
    left: false,
    right: false
};


/* -------------------------
   KEYBOARD
------------------------- */

document.addEventListener("keydown", (event) => {

    if (
        event.key === "ArrowLeft" ||
        event.key.toLowerCase() === "a"
    ) {
        keys.left = true;
    }


    if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
    ) {
        keys.right = true;
    }

});


document.addEventListener("keyup", (event) => {

    if (
        event.key === "ArrowLeft" ||
        event.key.toLowerCase() === "a"
    ) {
        keys.left = false;
    }


    if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
    ) {
        keys.right = false;
    }

});


/* -------------------------
   START GAME
------------------------- */

function startGame() {

    items.forEach(item => {
        item.element.remove();
    });


    items = [];

    score = 0;

    lives = 3;

    level = 1;

    fallSpeed = 2.5;

    spawnDelay = 900;


    playerX =
        (game.clientWidth - player.offsetWidth) / 2;


    updateHUD();


    player.style.left = playerX + "px";


    message.classList.add("hidden");


    gameRunning = true;


    requestAnimationFrame(gameLoop);
}


/* -------------------------
   HUD
------------------------- */

function updateHUD() {

    scoreText.textContent = score;

    livesText.textContent = lives;

    levelText.textContent = level;
}


/* -------------------------
   CREATE OBJECT
------------------------- */

function spawnItem() {

    const element = document.createElement("div");


    const isScissors =
        Math.random() < 0.25;


    if (isScissors) {

        element.className = "item scissors";

        element.textContent = "✂️";

    } else {

        element.className = "item yarn";

        element.textContent = "🧶";
    }


    const x =
        Math.random() *
        (game.clientWidth - 50);


    element.style.left = x + "px";

    element.style.top = "-60px";


    game.appendChild(element);


    items.push({

        element: element,

        x: x,

        y: -60,

        dangerous: isScissors

    });

}


/* -------------------------
   MOVE PLAYER
------------------------- */

function movePlayer() {

    if (keys.left) {

        playerX -= 6;

    }


    if (keys.right) {

        playerX += 6;

    }


    const maxX =
        game.clientWidth -
        player.offsetWidth;


    if (playerX < 0) {

        playerX = 0;

    }


    if (playerX > maxX) {

        playerX = maxX;

    }


    player.style.left =
        playerX + "px";

}


/* -------------------------
   COLLISION
------------------------- */

function isColliding(item) {

    const playerLeft =
        playerX + 15;

    const playerRight =
        playerX +
        player.offsetWidth -
        15;


    const playerTop =
        game.clientHeight -
        player.offsetHeight -
        10;


    const playerBottom =
        playerTop +
        player.offsetHeight;


    const itemLeft =
        item.x;


    const itemRight =
        item.x + 45;


    const itemTop =
        item.y;


    const itemBottom =
        item.y + 45;


    return (

        playerRight > itemLeft &&

        playerLeft < itemRight &&

        playerBottom > itemTop &&

        playerTop < itemBottom

    );
}


/* -------------------------
   DIFFICULTY
------------------------- */

function increaseDifficulty() {

    level =
        Math.floor(score / 10) + 1;


    fallSpeed =
        2.5 +
        (level - 1) * 0.45;


    spawnDelay =
        Math.max(
            320,
            900 - (level - 1) * 70
        );


    updateHUD();
}


/* -------------------------
   GAME LOOP
------------------------- */

function gameLoop(timestamp) {

    if (!gameRunning) return;


    movePlayer();


    if (
        timestamp - lastSpawn >
        spawnDelay
    ) {

        spawnItem();

        lastSpawn = timestamp;

    }


    items.forEach((item, index) => {

        item.y += fallSpeed;


        item.element.style.top =
            item.y + "px";


        /* COLLISION */

        if (isColliding(item)) {

            if (item.dangerous) {

                lives--;

            } else {

                score++;

            }


            item.element.remove();

            items.splice(index, 1);


            increaseDifficulty();


            if (lives <= 0) {

                endGame();

            }


            return;
        }


        /* OBJECT LEFT SCREEN */

        if (
            item.y >
            game.clientHeight
        ) {

            item.element.remove();

            items.splice(index, 1);

        }

    });


    requestAnimationFrame(gameLoop);
}


/* -------------------------
   GAME OVER
------------------------- */

function endGame() {

    gameRunning = false;


    message.classList.remove("hidden");


    message.querySelector("h2").textContent =
        "💀 CAT ARRESTED";


    message.querySelector("p").textContent =
        `She stole ${score} balls of yarn 😂`;


    startBtn.textContent =
        "TRY AGAIN";
}


/* -------------------------
   BUTTON
------------------------- */

startBtn.addEventListener(
    "click",
    startGame
);
