class Star
{
    constructor()
    { // I place values in the variables
        this.x = random(-windowWidth / 2, windowWidth / 2);
        this.y = random(-windowHeight / 2, windowHeight / 2);
        this.z = random(width / 2);
        this.pz = this.z;
        var starBrightness = random(100);
        this.colour = color(starBrightness, starBrightness, starBrightness)

        this.xPos = 0;
        this.yPos = 0;
        this.released = 10;
        this.hDirection = 0;
        this.vDirection = 0;
        this.shouldRotate = false;
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
            this.y += map(accelerationY, -90, 90, -5, 5);
            this.x += map(accelerationX, -90, 90, 5, -5);
            this.vDirection = map(accelerationY, -90, 90, -1, 1);
            this.hDirection = map(accelerationX, -90, 90, -1, 1);
        }

        if (this.hDirection != 0)
            this.x += this.hDirection;
        if (this.vDirection != 0)
            this.y += this.vDirection;

        if(this.name=="RedDwarfVolumeUp")
          this.z = this.z - speed * 10;
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
        fill(this.colour);
        strokeWeight(0);

        var sx = map(this.x / this.z, 0, 1, 0, windowWidth / 2);
        var sy = map(this.y / this.z, 0, 1, 0, windowHeight / 2);
        var r = map(this.z, 0, windowWidth/2, 80, 0);

        if(!this.name.includes("RedDwarf"))
            ellipse(sx, sy, r, r);
        else
            this.star(sx, sy, r, r*.8, 3); 
        var px = map(this.x / this.pz, 0, 1, 0, windowWidth);
        var py = map(this.y / this.pz, 0, 1, 0, windowHeight);
        this.pz = this.z;
    }
    
    star(x, y, radius1, radius2, npoints) {
        var angle = TWO_PI / npoints;
        var halfAngle = angle/2.0;
        beginShape();
        for (var a = 0; a < TWO_PI; a += angle) {
          var sx = x + cos(a) * radius2;
          var sy = y + sin(a) * radius2;
          vertex(sx, sy);
          sx = x + cos(a+halfAngle) * radius1;
          sy = y + sin(a+halfAngle) * radius1;
          vertex(sx, sy);
        }
        endShape(CLOSE);
      }

}
