var textAlpha = 0;
var textAlphaSpeed = 0.01;
var stars = [];
var enemies = [];
var backgroundStars = [];
var centreX, centreY;
var score = 0, lives = 5, gameOver = false;
var redLevel = 0, greenLevel = 0, aquaLevel = 0, pinkLevel = 0, yellowLevel = 0;
var closingBlinds = 0;
var offX = 0, offY = 0;
var screenTouch = false;
setTimeout(spawnFriendlyStar, 2000);
setTimeout(spawnHostileStar, 2000);
var numberOfRedStars = 0;
var impact = 0;


// Shooting a red plant will increase the volume of track 1
// Letting a red incoming wobbly plant hit you will decrese the volume of that track. 
// Same logic applied to all colour plants, but you mst mantain a positive live count or it's game over. 

// Setup our canvas and create our stars
function setup()
{
    for (i = 0; i < 100; i++)
        stars.push(new Star("RegularStar"));

    for (i = 0; i < 100; i++)
        backgroundStars.push(new BackgroundStar());

    centreX = windowWidth / 2;
    centreY = windowHeight / 2;
    var cans = createCanvas(windowWidth, windowHeight);
    cans.style('display', 'block');
    textAlign(CENTER);
}


function drawScene()
{
    if(gameOver==true)
    {
        fill(150, 0, 0);
        rect(-windowWidth, -windowHeight, windowWidth*2, windowHeight*2*closingBlinds);

        if(closingBlinds>1)
        {            
            fill(255);
            stroke(255);
            textSize(80);
            text("Game Over", windowWidth/2, windowHeight/2);
            textSize(25)
            text("Tap screen/mouse to start again",  windowWidth/2, windowHeight/2 + 50);
            fill(150, 0, 0);
            resetLevel();

            if(mouseIsPressed)
                gameOver=false;
        }

        closingBlinds+=0.1;
    }
    else
    {
        speed = .1;
        background(0);

         //update stars 
         for (i = 0; i < backgroundStars.length; i++)
         {
             bgStar = backgroundStars[i];
             bgStar.update();
         }

        translate(centreX, centreY);


                   
        
        //update stars 
        for (i = 0; i < stars.length; i++)
        {
            
            star = stars[i];
            if(star.name.includes("Track"))
            {
                push();
                translate(star.x, star.y);
                if(star.name.includes("VolumeUp"))
                    rotate(frameCount/10);
                else if(star.name.includes("VolumeDown"))
                    rotate(-frameCount/10);

                translate(-star.x, -star.y);
                star.update();
                pop();
            }
            else
            star.update();
        }

        //update enemies
        for (i = 0; i < enemies.length; i++)
        {
            enemy = enemies[i];
           // push();
            //translate(enemy.x, enemy.y);
            //rotate(sin(frameCount*.01));
            //translate(-enemy.x, -enemy.y);
            enemy.update();
           // pop();
            
            if (enemy.x > -100 && enemy.x < 100 &&
                enemy.y > -100 && enemy.y < 100 &&
                enemy.radius>145)
            {
                enemies.splice(i, 1);
                impact = 1;
                lives--;
                if(lives == 0)
                    gameOver = true;              
            }        
        }
        
        if (mouseIsPressed || screenTouch)
        {
            stroke(255, 255, 0);
            strokeWeight(8);
            screenTouch = false;
        }
        else
        {
            stroke(255);
            strokeWeight(4);
        }

        fill(0, 0, 0, 0);

        // set impact shake amount ======================
        impact = impact > 0 ? impact - .05 : 0;
        shake = random(-10, 10) * impact;

        // draw cross-hair ===============================
        ellipse(0 + shake, 0 + shake, 50, 50);
        line(0 + shake, -30 + shake, 0 + shake, -10 + shake);
        line(0 + shake, +30 + shake, 0 + shake, +10 + shake);
        line(-30 + shake, 0 + shake, -10 + shake, 0 + shake);
        line(+30 + shake, 0 + shake, +10 + shake, 0 + shake);
        rect(-100 + shake, -100 + shake, 200, 260);
    
        // draw on-screen text =========================
        strokeWeight(1);
        fill(255);
        stroke(255);
        text("Lives Remaining: " + String(lives), 3 + shake, 60 + shake);
        text("Galactic Latt.: " + String(parseFloat(offX).toFixed(2)), 0 + shake, 75 + shake);
        text("Galactic Long.: " + String(parseFloat(offY).toFixed(2)), 0 + shake, 90 + shake);
        
        strokeWeight(0);
        fill(color(255, 0, 0))
        rect(-80, 140-redLevel*100, 20, 2+redLevel*100);
 
        strokeWeight(0);
        fill(color(0, 255, 0))
        rect(-45, 140-greenLevel*100, 20, 2+greenLevel*100);

        strokeWeight(0);
        fill(color(255, 0, 255))
        rect(-10, 140-pinkLevel*100, 20, 2+pinkLevel*100);

        strokeWeight(0);
        fill(color(255, 255, 0))
        rect(25, 140-yellowLevel*100, 20, 2+yellowLevel*100);

        strokeWeight(0);
        fill(color(0, 255, 255))
        rect(60, 140-aquaLevel*100, 20, 2+aquaLevel*100);
    }   

}

// This function calls the main drawing function during gameplay, or the "loading Csound"
// message when the Csound object is loading
function draw()
{
    if (csoundLoaded)
    {

        if (mobileCheck.android)
        {
            offY = map(accelerationY, -90, 90, -5, 5);
            offX = map(accelerationX, -90, 90, -5, 5);
        }
        drawScene();
    }
    else
    {
        //basic code to indicate Csound is still loading...
        background(0, 0, 0);
        fill(0, 0, 100, textAlpha);
        text("...LOADING CSOUND...", width / 2, height / 2);
        textAlpha += textAlphaSpeed;
        if (textAlpha > 1 || textAlpha < 0)
        {
            textAlphaSpeed *= -1;
        }
    }
}

function resetLevel()
{
    numberOfRedStars = 0;
    lives = 5;
    offX = 0;
    offY = 0;

    for (i = 0; i < stars.length; i++)
    {
        star = stars[i];
        star.vDirection = 0;
        star.hDirection = 0;
    }
}

function spawnFriendlyStar()
{
    //use simple weighting to determine colour
    var starType = random(100);
    if(starType<20)
        createStar("RedTrack", color(255, 0, 0));
    else if(starType>=20 && starType<40)
        createStar("GreenTrack", color(0, 255, 0));
    else if(starType>=40 && starType<60)
        createStar("PinkTrack", color(255, 0, 255));
    else if(starType>=60 && starType<80)
        createStar("YellowTrack", color(255, 255, 0));
    else if(starType>=80 && starType<100)
        createStar("AquaTrack", color(0, 255, 255));

    star = stars[stars.length - 1];
    star.x = random(-100, 100);
    star.y = random(-100, 100);
    setTimeout(spawnFriendlyStar, 5000+random(10000));
    
}

function createStar(type, colour)
{
    if(random()<.5)
        stars.push(new Star(type+"VolumeUp"));
    else
        stars.push(new Star(type+"VolumeDown"));

    stars[stars.length - 1].colour = colour;
}

function spawnHostileStar()
{
    enemies.push(new Enemy());
    enemy = enemies[enemies.length - 1];
    enemy.x = random(-300, 300);
    enemy.y = random(-300, 300);
    enemy.bottomColour = color(0, 100, 0);
    enemy.topColour = color(100, 50, 0);
    setTimeout(spawnHostileStar, 5000+random(5000));
}

function keyPressed()
{
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65))
        offX += .01;

    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68))
        offX -= .01;

    if (keyIsDown(UP_ARROW) || keyIsDown(87))
        offY += .01;

    if (keyIsDown(DOWN_ARROW) || keyIsDown(83))
        offY -= .01;

    if (keyCode === 49) {
        cs.setControlChannel("voice1change", random(100));
    } else if (keyCode === 50) {
        cs.setControlChannel("voice2change", random(100));
    } else if (keyCode === 51) {
        cs.setControlChannel("voice3change", random(100));
    } else if (keyCode === 52) {
        cs.setControlChannel("voice4change", random(100));
    } else if (keyCode === 53) {
        cs.setControlChannel("voice5change", random(100));
    } else if (keyCode === 54) {
        cs.setControlChannel("voice1vol", .2);
    } else if (keyCode === 55) {
        cs.setControlChannel("voice2vol", .2);
    } else if (keyCode === 56) {
        cs.setControlChannel("voice3vol", .2);
    } else if (keyCode === 57) {
        cs.setControlChannel("voice4vol", .2);
    } else if (keyCode === 48) {
        cs.setControlChannel("voice5vol", .2);
    }
}


function mousePressed()
{
    if(gameOver)
        gameOver = false;

    cs.readScore('i"Fire" 0 1')

    for (i = 0; i < stars.length; i++)
    {
        star = stars[i];
        if (star.name.includes("Track"))
        {
            if (star.x > -10 && star.x < 10 &&
                star.y > -10 && star.y < 10)
            {
                if(star.name.includes("VolumeUp"))
                {
                    if(star.name.includes("Red"))
                    {
                        if(keyIsDown(32))
                            cs.setControlChannel("voice1change", random(100));
                        else
                        {
                            redLevel = constrain(redLevel+=0.05, 0, .5);
                            cs.setControlChannel("voice1vol", redLevel);
                        }
                        
                    }
                    else if(star.name.includes("Green"))
                    {
                        if(keyIsDown(32))
                           cs.setControlChannel("voice2change", random(100));
                        else
                        {
                            greenLevel = constrain(greenLevel+=0.05, 0, .5);
                            cs.setControlChannel("voice2vol", greenLevel);
                        }
                    }
                    else if(star.name.includes("Yellow"))
                    {
                        if(keyIsDown(32))
                            cs.setControlChannel("voice3change", random(100));
                        else
                        {
                            yellowLevel = constrain(yellowLevel+=0.05, 0, .5);
                            cs.setControlChannel("voice3vol", yellowLevel);
                        }
                    }
                    else if(star.name.includes("Aqua"))
                    {
                        if(keyIsDown(32))
                            cs.setControlChannel("voice4change", random(100));
                        else
                        {
                            aquaLevel = constrain(aquaLevel+=0.05, 0, .5);
                            cs.setControlChannel("voice4vol", aquaLevel);
                        }
                    }
                    else if(star.name.includes("Pink"))
                    {
                        if(keyIsDown(32))
                            cs.setControlChannel("voice5change", random(100));
                        else
                        {
                            pinkLevel = constrain(pinkLevel+=0.05, 0, .5);
                            cs.setControlChannel("voice5vol", pinkLevel);
                        }
                    }
                    //trigger drum pattern change each time you turn up the volume
                    cs.setControlChannel("triggerChange", random(100));
                }
                else if(star.name.includes("VolumeDown"))
                {
                    if(star.name.includes("Red"))
                    {
                        redLevel = constrain(redLevel-=0.05, 0, .5);
                        cs.setControlChannel("voice1vol", redLevel);
                    }
                    else if(star.name.includes("Green"))
                    {
                        greenLevel = constrain(greenLevel-=0.05, 0, .5);
                        cs.setControlChannel("voice2vol", greenLevel);
                    }
                    else if(star.name.includes("Yellow"))
                    {
                        yellowLevel = constrain(yellowLevel-=0.05, 0, .5);
                        cs.setControlChannel("voice3vol", yellowLevel);
                    }
                    else if(star.name.includes("Aqua"))
                    {
                        aquaLevel = constrain(aquaLevel-=0.05, 0, .5);
                        cs.setControlChannel("voice4vol", aquaLevel);
                    }
                    else if(star.name.includes("Pink"))
                    {
                        pinkLevel = constrain(pinkLevel-=0.05, 0, .5);
                        cs.setControlChannel("voice5vol", pinkLevel);
                    }
                }

                //stars.splice(i, 1);
                setTimeout(destroyStar, 250, i, "MusicalStar");
            }

        }
    }
    for( i = 0 ; i < enemies.length ; i++)
    {
        enemy = enemies[i];
        if (enemy.x > -20 && enemy.x < 20 &&
            enemy.y > -20 && enemy.y < 20)
            {  
                //stars.splice(i, 1);
                setTimeout(destroyStar, 250, i, "Enemy");                
            }
    }
}

function destroyStar(index, type)
{
    cs.readScore('i"Explosion" 0 1')
    if(type == "MusicalStar") 
        stars.splice(index, 1);
    else if(type == "Enemy")
    {
        enemies.splice(index, 1);
        cs.setControlChannel('shuffleAll', random(100));
    }
}

function touchStart() 
{
  screenTouch = true;
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
}
