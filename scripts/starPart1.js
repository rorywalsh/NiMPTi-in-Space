class Star {
    constructor() { // I place values in the variables
        this.x = random(-windowWidth / 2, windowWidth / 2);
        this.y = random(-windowHeight / 2, windowHeight / 2);
        this.z = random(width / 2);
        this.pz = this.z;
        this.r = random(100);
        this.g = this.r;
        this.b = this.g;
        this.xPos = 0;
        this.yPos = 0;
        this.released = 10;
        this.hDirection = 0;
        this.vDirection = 0;
        this.name = "NormalStar";
    }

    update() {

        if (keyIsDown(LEFT_ARROW)) {
            this.x += 5;
            this.hDirection += .01;
        }

        if (keyIsDown(RIGHT_ARROW)) {
            this.x -= 5;
            this.hDirection -= .01;
        }

        if (keyIsDown(UP_ARROW)) {
            this.y += 5;
            this.vDirection += .01;
        }

        if (keyIsDown(DOWN_ARROW)) {
            this.y -= 5;
            this.vDirection -= .01;
        }

        if (this.hDriection != 0)
            this.x += this.hDirection;
        if (this.vDriection != 0)
            this.y += this.vDirection;

        this.z = this.z - speed;
        if (this.z < 10) {
            this.z = random(windowWidth / 2);
            this.x = random(-windowWidth / 2, windowWidth / 2);
            this.y = random(-windowHeight / 2, windowHeight / 2);
            this.pz = this.z;
        }

        this.show();
    }


    show() {
        fill(this.r, this.g, this.b);
        strokeWeight(0);
        var sx = map(this.x / this.z, 0, 1, 0, windowWidth / 2);
        var sy = map(this.y / this.z, 0, 1, 0, windowHeight / 2);;
        var r = map(this.z, 0, windowWidth / 2, 40, 0);
        ellipse(sx, sy, r, r);
        var px = map(this.x / this.pz, 0, 1, 0, windowWidth);
        var py = map(this.y / this.pz, 0, 1, 0, windowHeight);
        this.pz = this.z;
    }

}
