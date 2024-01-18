class paddle {
    constructor(x, y, side, width = 15, height = 150) {
        this.x = x;
        this.y = y;
        this.side = side;
        this.width = width;
        this.height = height;
        this.accelerator = 0.1;

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
        this.accelerator = this.accelerator < 1 ? this.accelerator + 0.05 : this.accelerator;

        if (this.y < 0) {
            this.y = 0
        }
    }

    moveDown() {
        this.y += this.accelerator;
        this.accelerator = this.accelerator < 1 ? this.accelerator + 0.1 : this.accelerator;

        if (this.y > canvas.height - this.height) {
            this.y = canvas.height - this.height
        }
    }

    hasCollided(x, y) {
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

    async handleStop(direction) {
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