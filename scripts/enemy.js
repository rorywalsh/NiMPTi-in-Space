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
            this.x += map(accelerationX, -90, 90, -5, 5);
            this.y += map(accelerationY, -90, 90, -5, 5);
        }

        if(this.radius<150)
        {
            fill(0, 100, 0);
            strokeWeight(0);
            var sx = this.pos / windowWidth;//map(this.pos / windowWidth, 0, 1, 0, windowWidth / 2);
            var sy = this.pos / windowHeight;//map(this.pos / windowHeight, 0, 1, 0, windowHeight / 2);;
            this.radius = exp(this.pos*.1);
            
            ellipse(sx+this.x+sin(this.angle)*10, sy+this.y+cos(this.angle)*10, this.radius, this.radius);
            //var px = map(this.pos / windowWidth, 0, 1, 0, windowWidth);
            //var py = map(this.pos / windowWidth, 0, 1, 0, windowHeight);
            //this.pz = this.z;
            this.pos++;
            this.angle++;
        }

        
    }


}
