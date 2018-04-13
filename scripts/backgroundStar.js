class BackgroundStar
{
    constructor()
    { 
        this.x = random(windowWidth);
        this.y = random(windowHeight);
        this.r = random(10);
        this.refresh = 60*2+int(random(2000));
    }

    update()
    {
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65))
        {
            this.x += .5;
        }

        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68))
        {
            this.x -= .5;
        }

        if (keyIsDown(UP_ARROW) || keyIsDown(87))
        {
            this.y += .5;
        }

        if (keyIsDown(DOWN_ARROW) || keyIsDown(83))
        {
            this.y -= .5;
        }

        if(frameCount % this.refresh== 0)
        {
            this.y = this.y-random(windowHeight/2);
            this.x = this.x-random(windowWidth/2);
        }    

        fill(random(100, 160));
        ellipse(this.x, this.y, this.r, this.r);

    }

}
