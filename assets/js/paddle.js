class paddle {
    constructor(x, y, side, width = 15, height = 150) {
        this.x = x;
        this.y = y;
        this.side = side;
        this.width = width;
        this.height = height;
        this.accelerator = 0.1;

        this.fill = colorBlack;
        this.stroke = colorBlack;

        this.upKey = this.side === "left" ? "w" : "ArrowUp";
        this.downKey = this.side === "left" ? "s" : "ArrowDown";

        this.up = false;
        this.down = false;

        this.fillListener(this.side === "left" ? "#playerOneFill" : "#playerTwoFill");
        this.strokeListener(this.side === "left" ? "#playerOneStroke" : "#playerTwoStroke");
        this.upKeyListener(this.side === "left" ? "#playerOneUpKey" : "#playerTwoUpKey");
        this.downKeyListener(this.side === "left" ? "#playerOneDownKey" : "#playerTwoDownKey");
    }

    draw = () => {
        context.fillStyle = this.fill;
        context.strokeStyle = this.stroke;
        context.fillRect(this.x, this.y, this.width, this.height);
        context.strokeRect(this.x, this.y, this.width, this.height);
        context.fillStyle = colorBlack;
        context.strokeStyle = colorBlack;
    }

    mover = () => {
        if (this.up) {
            this.moveUp();
        }

        if (this.down) {
            this.moveDown();
        }
    }

    moveUp = () => {
        this.y -= this.accelerator;
        this.accelerator = this.accelerator < 1 ? this.accelerator + 0.05 : this.accelerator;

        if (this.y < 0) {
            this.y = 0
        }
    }

    moveDown = () => {
        this.y += this.accelerator;
        this.accelerator = this.accelerator < 1 ? this.accelerator + 0.1 : this.accelerator;

        if (this.y > canvas.height - this.height) {
            this.y = canvas.height - this.height
        }
    }

    hasCollided = (x, y) => {
        if (y + ballHeight > this.y && y < this.y + this.height) {
            switch (this.side) {
                case "left":
                    return (x < this.x + this.width);
                case "right":
                    return (x > this.x - ballWidth);
            }
        }

        return false;
    }

    fillListener = (tag) => {
        let input = document.querySelector(tag)

        input.addEventListener("click", () => {
            paused = true;
        })

        input.addEventListener("blur", () => {
            paused = false;
        })

        input.addEventListener("change", (e) => {
            this.fill = e.target.value;
            this.draw();
        });
    }

    strokeListener = (tag) => {
        let input = document.querySelector(tag)

        input.addEventListener("click", () => {
            paused = true;
        })

        input.addEventListener("blur", () => {
            paused = false;
        })

        input.addEventListener("change", (e) => {
            this.stroke = e.target.value;
            this.draw();
        });
    }

    upKeyListener = (tag) => {
        let input = document.querySelector(tag)

        input.addEventListener("click", () => {
            paused = true;
        })

        input.addEventListener("blur", (e) => {
            paused = false;
        })

        input.addEventListener("input", (e) => {
            let newKey = e.target.value[e.target.value.length-1];

            e.target.value = newKey;
            this.upKey = newKey;

            e.target.blur();
        });
    }

    downKeyListener = (tag) => {
        let input = document.querySelector(tag)

        input.addEventListener("click", () => {
            paused = true;
        })

        input.addEventListener("blur", () => {
            paused = false;
        })

        input.addEventListener("input", (e) => {
            let newKey = e.target.value[e.target.value.length-1];

            e.target.value = newKey;
            this.downKey = newKey;

            e.target.blur();
        });
    }

    handleStop = async (direction) => {
        for (let i = 0; i < ((this.accelerator) / 0.02); i++) {
            this.accelerator -= 0.02;

            switch (direction) {
                case "up":
                    this.y -= this.accelerator < 1 ? this.accelerator : 1;

                    if (this.y < 0) {
                        this.y = 0;
                    };
                    break;

                case "down":
                    this.y += this.accelerator < 1 ? this.accelerator : 1;

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