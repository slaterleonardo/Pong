let winnerMessage = document.querySelector("#message");

let canvas = document.querySelector("canvas");
let context = canvas.getContext("2d");
let colorPink = "rgb(255, 0, 255)";
let colorBlack = "rgb(0, 0, 0)";
let refreshRate = 1000 / 144;

let ballHeight = 40;
let ballWidth = 40;

let ballX;
let ballY;
let velocityX;
let velocityY;
let yFlipped;
let xFlipped;

let players = [];

let intervalNumber;

let initiateGame = function () {
    ballX = (canvas.width / 2) - (ballWidth / 2);
    ballY = (canvas.height / 2) - (ballHeight / 2);
    velocityX = Math.round(Math.random()) === 0 ? 5 : -5;
    velocityY = Math.round(Math.random()) === 0 ? 1 : -1;
    yFlipped = false;
    xFlipped = false;

    players.push(players[0] === undefined ? new Player(
        new paddle(0, (canvas.height / 2) - 75, "left"),
        "left"
    ) : players[0]);

    players.push(players[1] === undefined ? new Player(
        new paddle(canvas.width - 15, (canvas.height / 2) - 75, "right"),
        "right"
    ) : players[1]);

    players.forEach((player) => {
        player.resetPosition();
    });

    winnerMessage.innerHTML = "";
    frame();
}

let frame = function () {
    context.fillStyle = colorBlack;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect((canvas.width / 2) - 3, 0, 6, canvas.height);
    context.fillStyle = colorPink;
    context.fillRect(ballX, ballY, ballWidth, ballHeight);

    ballX += (xFlipped ? -velocityX : velocityX);
    ballY += (yFlipped ? -velocityY : velocityY);

    if (ballY > canvas.height - ballHeight || ballY < 0) {
        yFlipped = !yFlipped;
    };

    context.fillStyle = colorBlack;
    players.forEach((player) => {
        player.paddle.draw();
        player.paddle.mover();
        
        if (player.paddle.hasCollided(ballX, ballY)) {
            ballX += (xFlipped ? velocityX : -velocityX);
            xFlipped = !xFlipped;
        }
    });

    if (ballX > canvas.width - ballHeight || ballX < 0) {
        let winner = ballX < 0 ? players[1] : players[0];

        winner.incrementScore();

        clearInterval(intervalNumber);
    };
};

initiateGame();

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            players[1].paddle.up = true;
            break;

        case "ArrowDown":
            players[1].paddle.down = true;
            break;

        case "w":
            players[0].paddle.up = true;
            break;

        case "s":
            players[0].paddle.down = true;
            break;
    }
});

document.addEventListener("keyup", (e) => {
    switch (e.key) {
        case "ArrowUp":
            players[1].paddle.up = false;
            players[1].paddle.handleStop("up");
            break;

        case "ArrowDown":
            players[1].paddle.down = false;
            players[1].paddle.handleStop("down");
            break;

        case "w":
            players[0].paddle.up = false;
            players[0].paddle.handleStop("up");
            break;

        case "s":
            players[0].paddle.down = false;
            players[0].paddle.handleStop("down");
            break;
    }
});

document.querySelector("button").addEventListener("click", async (e) => {
    initiateGame();

    if (intervalNumber) {
        clearInterval(intervalNumber);
    }

    e.target.disabled = true;

    let timer = document.querySelector("#timer");

    timer.innerHTML = 3;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    timer.innerHTML = 2;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    timer.innerHTML = 1;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    timer.innerHTML = "GO!";
    await new Promise((resolve) => setTimeout(resolve, 1000));
    timer.innerHTML = "";

    e.target.disabled = false;

    intervalNumber = setInterval(frame, refreshRate);
});