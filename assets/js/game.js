let winnerMessage = document.querySelector("#message");

let canvas = document.querySelector("canvas");
let context = canvas.getContext("2d");
let colorBlack = "rgb(0, 0, 0)";
let refreshRate = 1000 / 144;
let paused = true;
let ballColor = document.querySelector("#ballColor").value;

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

let initiateGame = () => {
    ballX = (canvas.width / 2) - (ballWidth / 2);
    ballY = (canvas.height / 2) - (ballHeight / 2);
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

    velocityX = Math.round(Math.random()) === 0 ? 5 : -5;
    velocityY = Math.round(Math.random()) === 0 ? 1 : -1;
}

let frame = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect((canvas.width / 2) - 3, 0, 6, canvas.height);

    context.fillStyle = ballColor;
    context.fillRect(ballX, ballY, ballWidth, ballHeight);
    context.fillStyle = colorBlack;

    if (!paused) {
        ballX += (xFlipped ? -velocityX : velocityX);
        ballY += (yFlipped ? -velocityY : velocityY);
    }

    if (ballY > canvas.height - ballHeight || ballY < 0) {
        yFlipped = !yFlipped;
    };

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

let straightKey = document.querySelector("#straightKey");

straightKey.addEventListener("click", () => {
    paused = true;
})

straightKey.addEventListener("blur", () => {
    paused = false;
})

straightKey.addEventListener("input", (e) => {
    let newKey = e.target.value[e.target.value.length - 1];

    e.target.value = newKey;
    e.target.blur();
});

document.addEventListener("keydown", (e) => {
    if (paused) {
        return
    }

    switch (e.key) {
        case straightKey.value:
            velocityY = 0;
            break;

        case players[0].paddle.upKey:
            players[0].paddle.up = true;
            break;

        case players[0].paddle.downKey:
            players[0].paddle.down = true;
            break;

        case players[1].paddle.upKey:
            players[1].paddle.up = true;
            break;

        case players[1].paddle.downKey:
            players[1].paddle.down = true;
            break;
    }
});

document.addEventListener("keyup", (e) => {
    if (paused) {
        return
    }

    switch (e.key) {
        case straightKey.value:
            velocityY = Math.round(Math.random()) === 0 ? 1 : -1;
            break;

        case players[0].paddle.upKey:
            players[0].paddle.up = false;
            players[0].paddle.handleStop("up");
            break;

        case players[0].paddle.downKey:
            players[0].paddle.down = false;
            players[0].paddle.handleStop("down");
            break;

        case players[1].paddle.upKey:
            players[1].paddle.up = false;
            players[1].paddle.handleStop("up");
            break;

        case players[1].paddle.downKey:
            players[1].paddle.down = false;
            players[1].paddle.handleStop("down");
            break;
    }
});

document.querySelector("#ballColor").addEventListener("change", (e) => {
    ballColor = e.target.value;
    frame();
})

document.querySelector(".optionsToggle").addEventListener("click", () => {
    let options = document.querySelector("#options");
    let visibility = options.style.visibility;

    options.style.visibility = visibility === "hidden" ? "visible" : "hidden";

})

document.querySelector("button").addEventListener("click", async (e) => {
    initiateGame();

    if (intervalNumber) {
        clearInterval(intervalNumber);
    }

    e.target.disabled = true;

    for (let i = 0; i < 3; i++) {
        e.target.innerText = 3 - i;
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    e.target.innerText = "GO!";
    (async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        e.target.innerText = "play!!!!!!!";
    })()

    e.target.disabled = false;
    paused = false;

    intervalNumber = setInterval(frame, refreshRate);
});