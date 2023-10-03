let dots = [];

let progressBarSpeed = 0.05;
let progressBarIncrement = 10;

let foodLoc;
let foodCount = 30;
let moveSpeed = 3;

class Dot {
    constructor(x, y) {
        this.home = createVector(x, y);
        this.pos = createVector(x, y);
        this.progress = random(10);
        this.progressBarWidth = random(2, 50);
        this.state = 0;
        this.hasFood = false;
    }

    draw() {
        if (this.progress > this.progressBarWidth) {
            this.progress = this.progressBarWidth;
        }

        // Draw dot
        noStroke();
        fill(200, 100, 100);
        ellipse(this.pos.x, this.pos.y, 10, 10);

        if (this.hasFood) {
            fill(100, 200, 100);
            ellipse(this.pos.x, this.pos.y, 5, 5);
        }
        // Draw progress bar background
        strokeWeight(1);
        stroke(0);
        fill(0, 0, 0, 0);
        rect(
            this.pos.x - this.progressBarWidth / 2,
            this.pos.y - 12,
            this.progressBarWidth,
            5
        );

        // Draw progress bar
        fill(0, 0, 200);
        strokeWeight(0);

        rect(
            this.pos.x - this.progressBarWidth / 2,
            this.pos.y - 12,
            map(this.progress, 0, this.progressBarWidth, 0, this.progressBarWidth),
            5
        );

        // Move dot when progress is full
        if (this.progress >= this.progressBarWidth) {
            this.state = 1;
            this.progress = 0;
        }

        // Update dot's position
        if (this.state == 1) {
            this.pos.add(foodLoc.copy().sub(this.pos).setMag(moveSpeed));
            if (this.pos.x >= foodLoc.x) {
                this.state = 2;
                if (foodCount > 0 && random(20) < foodCount) {
                    this.hasFood = true;
                    foodCount--;
                }
            }
        }
        if (this.state == 2) {
            this.pos.add(this.home.copy().sub(this.pos).setMag(moveSpeed));
            if (this.pos.x <= this.home.x) {
                this.pos.x = this.home.x;

                if (this.hasFood) {
                    for (let i = 0; i < dots.length; i++) {
                        if (dots[i].state != 0) {
                            continue;
                        }
                        dots[i].progress += progressBarIncrement;
                    }
                }
                this.hasFood = false;
                this.state = 0;

            }
        }

        // Decrease progress bar
        if (this.progress > 0) {
            this.progress -= progressBarSpeed;
        }
        if (this.progress < 0) {
            this.progress = 0;
        }
    }

    increaseProgress() {
        // Increase progress when called
        this.progress += progressBarIncrement;
    }
}

function setup() {
    let canvas = createCanvas(400, 400); // specify WEBGL for 3D graphics
    canvas.parent('p5-canvas-container');

    randomSeed(1);

    noStroke();
    for (let y = 40; y < height; y += 25) {
        let dot = new Dot(width / 4, y);
        dots.push(dot);
    }

    foodLoc = createVector((width * 3) / 4, height / 2);

}

let output = ""

function draw() {
    background(255);

    fill(100, 200, 100);
    ellipse(foodLoc.x, foodLoc.y, foodCount);
    for (let i = 0; i < dots.length; i++) {
        dots[i].draw();
    }


    if (frameCount % 90 == 0) {
        let explore = true;
        for (let i = 0; i < dots.length; i++) {
            let dot = dots[i];
            if (dot.progress != 0 || dot.state != 0) {
                explore = false;
                console.log(dot.progress, dot.state);
                break;
            }
        }
        if (explore) {
            dots[int(random(dots.length))].progress = 999;
        }
    }
}

function mouseClicked() {

    if (mouseX < 0 || mouseX > width) {
        return;
    }
    if (mouseY < 0 || mouseY > height) {
        return;
    }
    let finished = false;
    for (let i = 0; i < dots.length; i++) {
        let dot = dots[i];

        if (dot.pos.dist(createVector(mouseX, mouseY)) < 20) {
            dot.increaseProgress();
            finished = true;
            break; // Exit the loop after updating one progress bar
        }
    }

    if (!finished) {
        foodCount += 5;
    }
}
