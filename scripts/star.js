class Star
{
    constructor()
    { // I place values in the variables
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

    update()
    {

        if (keyIsDown(LEFT_ARROW) || keyIsDown(65))
        {
            this.x += 1;
            this.hDirection += .01;
        }

        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68))
        {
            this.x -= 1;
            this.hDirection -= .01;
        }

        if (keyIsDown(UP_ARROW) || keyIsDown(87))
        {
            this.y += 1;
            this.vDirection += .01;
        }

        if (keyIsDown(DOWN_ARROW) || keyIsDown(83))
        {
            this.y -= 1;
            this.vDirection -= .01;
        }

        if (mobileCheck.android)
        {
            this.y += map(accelerationY, -90, 90, -10, 10);
            this.x += map(accelerationX, -90, 90, 10, -10);
            this.vDirection = map(accelerationY, -90, 90, -1, 1);
            this.hDirection = map(accelerationX, -90, 90, -1, 1);
        }

        // if (this.hDriection != 0)
        //     this.x += this.hDirection;
        // if (this.vDriection != 0)
        //     this.y += this.vDirection;

        if(name=="RedDwarf")
          this.z = this.z - speed * 20;
        else {
          this.z = this.z - speed;
        }
        if (this.z < 10)
        {
            this.z = random(windowWidth / 2);
            this.x = random(-windowWidth / 2, windowWidth / 2);
            this.y = random(-windowHeight / 2, windowHeight / 2);
            this.pz = this.z;
        }

        this.show();
    }


    show()
    {
        fill(this.r, this.g, this.b);
        strokeWeight(0);
        var sx = map(this.x / this.z, 0, 1, 0, windowWidth / 2);
        var sy = map(this.y / this.z, 0, 1, 0, windowHeight / 2);;
        var r = map(this.z, 0, windowWidth/2, 80, 0);
        ellipse(sx, sy, r, r);
        var px = map(this.x / this.pz, 0, 1, 0, windowWidth);
        var py = map(this.y / this.pz, 0, 1, 0, windowHeight);
        this.pz = this.z;
    }

}
