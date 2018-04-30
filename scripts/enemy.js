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
        this.offX = 0;
        this.offY = 0;
        this.angle = random(.5);
        this.exitTrajectory = 2+random(20);
        this.keyDown = false;
        this.speedIncrease = 1;
    }

    update()
    {
        this.z = this.z - this.speed;

        if (keyIsDown(LEFT_ARROW) || keyIsDown(65))
        {
            this.x += 5*this.speedIncrease;
            this.hDirection += .01;
        }

        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68))
        {
            this.x -= 5*this.speedIncrease;
            this.hDirection -= .01;
        }

        if (keyIsDown(UP_ARROW) || keyIsDown(87))
        {
            this.y += 5*this.speedIncrease;
            this.vDirection += .01;
        }

        if (keyIsDown(DOWN_ARROW) || keyIsDown(83))
        {
            this.y -= 5*this.speedIncrease;
            this.vDirection -= .01;
        }
        
        if (mobileCheck.android)
        {
            //this.offY = map(accelerationY, -90, 90, -150, 150);
            //this.offX = map(accelerationX, -90, 90, -150, 150);
            this.x -= map(accelerationX, -90, 90, -250, 250);
            this.y -= map(accelerationY, -90, 90, -250, 250);
        }

        if(this.keyDown)
            this.speedIncrease++;


        strokeWeight(0);

        if(this.radius<150)
        {
            this.x = this.x + this.pos / windowWidth +sin(this.angle)*20*(this.radius/150);//map(this.pos / windowWidth, 0, 1, 0, windowWidth / 2);
            this.y = this.y + this.pos / windowHeight +cos(this.angle)*20*(this.radius/150);//map(this.pos / windowHeight, 0, 1, 0, windowHeight / 2);;
            this.radius = exp(this.pos*.1); 
        }
        else
        {
            this.x += (this.x<0 ? -10 : 10);
            this.y += (this.y<0 ? -this.exitTrajectory : this.exitTrajectory);
            this.radius+=2;
        }   
                          

        fill(this.topColour);
        arc(this.x, this.y, this.radius*.5, this.radius*.5, -PI, 0); 
        fill(this.bottomColour);
        ellipse(this.x, this.y+this.radius*.1, this.radius, this.radius*.5);
        fill()

        this.pos+=.25;
        this.angle+=(this.radius+1)/150;      
    }
}

function keyPressed()
{
    this.keyDown = true;
}

function keyReleased() 
{
    this.keyDown = false;
    this.speedIncrease = 0;
}
