let winnerMessage = document.querySelector("#message");
let playerOneMessage = document.querySelector("#playerOne");
let playerTwoMessage = document.querySelector("#playerTwo");

let canvas = document.querySelector("canvas");
let context = canvas.getContext("2d");
let colorPink = "rgb(255, 0, 255)";
let colorBlack = "rgb(0, 0, 0)";
let refreshRate = 1000 / 144;

let ballHeight = 100;
let ballWidth = 100;

let ballX;
let ballY;
let velocityX;
let velocityY;
let yFlipped;
let xFlipped;
let leftPaddle;
let rightPaddle;

let playerOneScore = 0;
let playerTwoScore = 0;

let intervalNumber;

class paddle {
    constructor(x, y, side, width = 15, height = 150) {
        this.x = x;
        this.y = y;
        this.side = side;
        this.width = width;
        this.height = height;
        this.accelerator = 1;

        this.up = false;
        this.down = false;
    }

    draw() {
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    mover() {
        if (this.up) {
            this.moveUp();
        }

        if (this.down) {
            this.moveDown();
        }
    }

    moveUp() {
        this.y -= this.accelerator;
        this.accelerator = this.accelerator < 2.5 ? this.accelerator + 0.1 : this.accelerator;

        if (this.y < 0) {
            this.y = 0
        }
    }

    moveDown() {
        this.y += this.accelerator;
        this.accelerator = this.accelerator < 2.5 ? this.accelerator + 0.1 : this.accelerator;

        if (this.y > canvas.height - this.height) {
            this.y = canvas.height - this.height
        }
    }

    hasCollided(x, y) {
        if (y >= this.y - ballHeight && y <= this.y + this.height) {
            switch (this.side) {
                case "left":
                    return (x < this.x + this.width);
                case "right":
                    return (x > this.x - ballWidth);
            }
        }
    }

    async handleStop(direction) {
        for (let i = 0; i < ((this.accelerator - 1) / 0.03); i++) {
            this.accelerator -= 0.03;

            switch (direction) {
                case "up":
                    this.y -= this.accelerator < 2.5 ? this.accelerator : 2.5;

                    if (this.y < 0) {
                        this.y = 0;
                    };
                    break;

                case "down":
                    this.y += this.accelerator < 2.5 ? this.accelerator : 2.5;

                    if (this.y > canvas.height - this.height) {
                        this.y = canvas.height - this.height;
                    };
                    break;
            }

            await new Promise((resolve) => setTimeout(resolve, refreshRate));
        }

        this.accelerator = 1;
    }
}

let initiateGame = function () {
    ballX = (canvas.width / 2) - (ballWidth / 2);
    ballY = (canvas.height / 2) - (ballHeight / 2);
    velocityX = Math.round(Math.random()) === 0 ? 5 : -5;
    velocityY = Math.round(Math.random()) === 0 ? 1 : -1;
    yFlipped = false;
    xFlipped = false;
    leftPaddle = new paddle(0, (canvas.height / 2) - 75, "left");
    rightPaddle = new paddle(canvas.width - 15, (canvas.height / 2) - 75, "right");
    playerOneScore = 0;
    playerTwoScore = 0;

    winnerMessage.innerHTML = "";
    playerOneMessage.innerHTML = `Player One: ${playerOneScore}`;
    playerTwoMessage.innerHTML = `Player Two: ${playerTwoScore}`;
    frame();
}

let incrementPlayerOneScore = function () {
    playerOneScore++;
    playerOneMessage.innerHTML = `Player One: ${playerOneScore}`;
}

let incrementPlayerTwoScore = function () {
    playerTwoScore++;
    playerTwoMessage.innerHTML = `Player Two: ${playerTwoScore}`;
}

let frame = function () {
    context.fillStyle = colorBlack
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect((canvas.width / 2) - 2, 0, 6, canvas.height)

    leftPaddle.draw();
    rightPaddle.draw();

    leftPaddle.mover();
    rightPaddle.mover();

    context.fillStyle = colorPink;
    context.fillRect(ballX, ballY, ballWidth, ballHeight);

    ballX += (xFlipped ? -velocityX : velocityX);
    ballY += (yFlipped ? -velocityY : velocityY);

    if (ballY > canvas.height - ballHeight || ballY < 0) {
        yFlipped = !yFlipped;
    }

    if (leftPaddle.hasCollided(ballX, ballY)) {
        incrementPlayerOneScore();
        xFlipped = !xFlipped;
    }

    if (rightPaddle.hasCollided(ballX, ballY)) {
        incrementPlayerTwoScore();
        xFlipped = !xFlipped;
    }

    if (ballX > canvas.width - ballHeight || ballX < 0) {
        let winner = ballX < 0 ? "Player Two" : "Player One!";
        winnerMessage.innerHTML = `Winner: ${winner}`;

        clearInterval(intervalNumber);
    }
};

initiateGame();

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            rightPaddle.up = true;
            break;

        case "ArrowDown":
            rightPaddle.down = true;
            break;

        case "w":
            leftPaddle.up = true;
            break;

        case "s":
            leftPaddle.down = true;
            break;
    }
});

document.addEventListener("keyup", (e) => {
    switch (e.key) {
        case "ArrowUp":
            rightPaddle.up = false;
            rightPaddle.handleStop("up");
            break;

        case "ArrowDown":
            rightPaddle.down = false;
            rightPaddle.handleStop("down");
            break;

        case "w":
            leftPaddle.up = false;
            leftPaddle.handleStop("up");
            break;

        case "s":
            leftPaddle.down = false;
            leftPaddle.handleStop("down");
            break;
    }
});

document.addEventListener("keypress", (e) => {
    if (e.key !== " ") {
        return
    }

    initiateGame();

    if (intervalNumber) {
        clearInterval(intervalNumber);
    }

    intervalNumber = setInterval(frame, refreshRate);
});

frame()