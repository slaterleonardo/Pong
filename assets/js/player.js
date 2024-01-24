class Player {
	constructor(paddle, side, score = 0) {
        this.score = score;
        this.side = side;
        this.paddle = paddle;
        this.message = document.querySelector(this.side === "left" ? "#playerOne" : "#playerTwo");

        this.name = this.side === "left" ? "Player One" : "Player Two";

        this.nameListener(this.side === "left" ? "#playerOneName" : "#playerTwoName");
    }
    
    incrementScore = async () => {
        this.score++;
        this.message.innerHTML = `${this.name}: ${this.score} ++`;

        await new Promise((resolve) => setTimeout(resolve, 1000));

        this.message.innerHTML = `${this.name}: ${this.score}`;
    }

    nameListener = (tag) => {
        document.querySelector(tag).addEventListener("change", (e) => {
            this.name = e.target.value;
            this.message.innerHTML = `${this.name}: ${this.score}`;
        });
    }

    resetPosition = () => {
        this.paddle.y = (canvas.height / 2) - 75;
    }
}