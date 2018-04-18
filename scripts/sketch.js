var textAlpha = 0;
var textAlphaSpeed = 0.01;
var stars = [];
var enemies = [];
var backgroundStars = [];
var centreX, centreY;
var score = 0, lives = 5, gameOver = false, score = 0, enemiesKilled = 0;
var trackOne = 0, trackTwo = 0, trackThree = 0, trackFour = 0, trackFive = 0;
var closingBlinds = 0;
var offX = 0, offY = 0;
var screenTouch = false;
setTimeout(spawnFriendlyStar, 2000);
setTimeout(spawnHostileStar, 2000);
var numberOfRedStars = 0;
var impact = 0;
var showExplosion = 100;
var movedLeft = 0, movedRight = 0;

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

//===========================================================================================
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

function drawScene()
{
    if(gameOver==true)
    {
        fill(0, 0, 0, 100);
        //rect(-windowWidth, -windowHeight, windowWidth*2, windowHeight*2*closingBlinds);

        if(closingBlinds>1)
        {            
            fill(255);
            stroke(255);
            textSize(80);
            text("Game Over", windowWidth/2, windowHeight/2);
            textSize(25)
            text("Tap screen/mouse to start again",  windowWidth/2, windowHeight/2 + 50);
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

        // update enemies
        for (i = 0; i < enemies.length; i++)
        {
            enemy = enemies[i];
            enemy.update();
            
            if (enemy.x > -100 && enemy.x < 100 &&
                enemy.y > -100 && enemy.y < 100 &&
                enemy.radius>145)
            {
                // if enemy moves in front of player
                // remove it from list
                enemies.splice(i, 1);
                impact = 1;
                lives--;
                if(lives == 0)
                    gameOver = true;              
            }        
        }
        
        if (mouseIsPressed || screenTouch)
        {
            stroke(100, 100, 100);
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
        push();
            angleMode(DEGREES);
            translate(0,0);
            if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) 
            {
                rotate(constrain(movedLeft, -4, 0));
                movedLeft+=-.1;
            }
                
               
            if (keyIsDown(RIGHT_ARROW) || keyIsDown(68))
            {
                rotate(constrain(movedRight, 0, 4));
                movedRight+=.1;
            }
              
                
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
            text("Score: " + String(score), 3 + shake, 105 + shake);
            translate(0,0)
            angleMode(RADIANS);
        pop();

        if(showExplosion<50)
        {
            value = 1-exp(showExplosion/50);
            if(showExplosion%2 == 0)
                fill(255, 255, 255);
            else
                fill(0, 0, 0);

            push();
                translate(0, 0);            
                rotate(frameCount);
                explosion(0-value*20, 0-value*20, value*30, value*10, 6);
                explosion(0-value*20+random(-4, 4), 0-value*20+random(-4, 4), value*20, 5, 6);
                explosion(0-value*20+random(-2, 2), 0-value*20+random(-2, 2), value*20, 10, 6);
                explosion(0-value*20+random(-2, 2), 0-value*20+random(-2, 2), value*20, 10, 6);
                translate(0,0);
            pop();
            showExplosion+=5;
        }
    }   

}

function explosion(x, y, radius1, radius2, npoints) 
{
    var angle = TWO_PI / npoints;
    var halfAngle = angle/2.0;
    beginShape();
    for (var a = 0; a < TWO_PI; a += angle) 
    {
      var sx = x + cos(a) * radius2;
      var sy = y + sin(a) * radius2;
      vertex(sx, sy);
      sx = x + cos(a+halfAngle) * radius1;
      sy = y + sin(a+halfAngle) * radius1;
      vertex(sx, sy);
    }
    endShape(CLOSE);
}
//===========================================================================================
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
//===========================================================================================
// timed methods.
//===========================================================================================
function spawnFriendlyStar()
{
    //use simple weighting to determine colour
    var starType = random(100);
    if(starType<20)
        createStar("TrackOne", color(209, 206, 165));
    else if(starType>=20 && starType<40)
        createStar("TrackTwo", color(198, 172, 69));
    else if(starType>=40 && starType<60)
        createStar("TrackThree", color(144, 158, 46));
    else if(starType>=60 && starType<80)
        createStar("TrackFour", color(104, 142, 147));
    else if(starType>=80 && starType<100)
        createStar("TrackFive", color(124, 191, 190));

    star = stars[stars.length - 1];
    star.x = random(-100, 100);
    star.y = random(-100, 100);
    setTimeout(spawnFriendlyStar, 5000+random(2000));    
}

function spawnHostileStar()
{
    enemies.push(new Enemy());
    enemy = enemies[enemies.length - 1];
    enemy.x = random(-300, 300);
    enemy.y = random(-300, 300);
    enemy.bottomColour = color(72, 112, 85);
    enemy.topColour = color(154, 137, 86);
    setTimeout(spawnHostileStar, map(score, 0, 100, 5000, 0)+random(2000));
}

function createStar(type, colour)
{
    if(random()<.5)
        stars.push(new Star(type+"VolumeUp"));
    else
        stars.push(new Star(type+"VolumeDown"));

    stars[stars.length - 1].colour = colour;
}

function destroyStar(index, type)
{
    cs.readScore('i"Explosion" 0 1')
    if(type == "MusicalStar") 
    {
        stars.splice(index, 1);
        score++;
    }
    else if(type == "Enemy")
    {
        enemies.splice(index, 1);
        
        if(score>36)
        {
            if(enemiesKilled%5 == 0) 
            {
                voice = int(random(1, 5));
                cs.setControlChannel('voice'+String(voice)+'change', random(100));
                print("Changing " +'voice'+String(voice)+'change');
            }

            if(enemiesKilled%15 == 0) 
            {
                voice = int(random(1, 5));
                cs.setControlChannel('transp'+String(voice), random()>.5 ? 12 : -12);
            }
        }
        
        enemiesKilled++;    
        score++;
    }

    if(score == 2)
        cs.setControlChannel("voice1vol", .2);
    if(score == 6)
        cs.setControlChannel("voice2vol", .2);
    if(score == 12)
        cs.setControlChannel("voice3vol", .2);
    if(score == 18)
        cs.setControlChannel("voice4vol", .2);
    if(score == 24)
        cs.setControlChannel("voice5vol", .2);

    showExplosion = 0;
}

//===========================================================================================
//  Input methods
//===========================================================================================
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

function keyReleased()
{
    movedLeft = 0;
    moveRight = 0;
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
                if((score+1)%10 == 0)
                    cs.setControlChannel("drumChange", random(100));
                setTimeout(destroyStar, 250, i, "MusicalStar");
            }

        }
    }
    for( i = 0 ; i < enemies.length ; i++)
    {
        enemy = enemies[i];
        if (enemy.x+enemy.radius > -20 && enemy.x-enemy.radius < 20 &&
            enemy.y+enemy.radius > -20 && enemy.y-enemy.radius < 20)
            {  
                setTimeout(destroyStar, 250, i, "Enemy");                
            }
    }
}


function touchStart() 
{
  screenTouch = true;
}

//==================================================================================

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
}
