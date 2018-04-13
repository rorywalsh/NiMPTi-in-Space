class Enemy
{
    constructor()
    { // I place values in the variables
        this.x = random(-windowWidth / 2, windowWidth / 2);
        this.y = random(-windowHeight / 2, windowHeight / 2);
        this.z = random(width / 2);
        this.pz = this.z;
        this.speed = 10;
        this.pos = 0;
        this.radius = 0;
        this.angle = random(.5);
    }

    update()
    {
        this.z = this.z - this.speed;

        if (keyIsDown(LEFT_ARROW) || keyIsDown(65))
        {
            this.x += 5;
            this.hDirection += .01;
        }

        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68))
        {
            this.x -= 5;
            this.hDirection -= .01;
        }

        if (keyIsDown(UP_ARROW) || keyIsDown(87))
        {
            this.y += 5;
            this.vDirection += .01;
        }

        if (keyIsDown(DOWN_ARROW) || keyIsDown(83))
        {
            this.y -= 5;
            this.vDirection -= .01;
        }
        
        if (mobileCheck.android)
        {
            this.x += map(accelerationX, -90, 90, -25, 25);
            this.y += map(accelerationY, -90, 90, -25, 25);
        }

        if(this.radius<150)
        {
            fill(this.colour);
            strokeWeight(0);
            this.x = this.x + this.pos / windowWidth +sin(this.angle)*20*(this.radius/150);//map(this.pos / windowWidth, 0, 1, 0, windowWidth / 2);
            this.y = this.y + this.pos / windowHeight +cos(this.angle)*20*(this.radius/150);//map(this.pos / windowHeight, 0, 1, 0, windowHeight / 2);;
            this.radius = exp(this.pos*.1);            
            this.star(this.x, this.y, this.radius*.6, this.radius, 3.75);
            this.pos+=.25;
            this.angle+=(this.radius+1)/50;
        }
        else
        {
            this.x = -10000;
            this.y = -10000;
        }        
    }

    star(x, y, radius1, radius2, npoints) 
    {
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
