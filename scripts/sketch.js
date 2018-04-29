var textAlpha = 0;
var textAlphaSpeed = 0.01;
var stars = [];
var enemies = [];
var backgroundStars = [];
var centreX, centreY;
var score = 0, lives = 5, gameOver = false, score = 0, enemiesKilled = 0, memoryLevel = 100;
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
var showIntroScreen = true;
var typeIndex = 0;
var introTimer =0;
// Shooting a red plant will increase the volume of track 1
// Letting a red incoming wobbly plant hit you will decrease the volume of that track. 
// Same logic applied to all colour plants, but you mst maintain a positive live count or it's game over. 

// Setup our canvas and create our stars
function setup()
{
    centreX = windowWidth / 2;
    centreY = windowHeight / 2;
    var cans = createCanvas(windowWidth, windowHeight);
    createScene();
    cans.style('display', 'block');
    textAlign(CENTER);
    background(0);
}

function createScene()
{
    for (i = 0; i < 100; i++)
    stars.push(new Star("RegularStar"));

    for (i = 0; i < 100; i++)
    backgroundStars.push(new BackgroundStar());

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
                if(int(offY) > 1 || int(offY) < -1)
                    memoryLevel-=0.5;
                if(int(offX) > 1 || int(offX) < -1)
                    memoryLevel-=0.5;
            }
            drawScene();
    }
    else
    {
        //basic code to indicate Csound is still loading...
        background(0, 0, 0);
        fill(255);
        stroke(255);
        text("...LOADING...", width / 2, height / 2);
    }
}


function drawScene()
{
    if(gameOver==true)
    {
            stroke(0);
            fill(0);
            rect(windowWidth*.4, windowHeight*.66, 500, 200);
            stroke(255);
            fill(255);
            textSize(80);
            text("Game Over", windowWidth/2, windowHeight*.7);
            textSize(25)
            text("Tap screen/mouse to start again",  windowWidth/2, windowHeight*.7 + 50);
            resetLevel();

            if(mouseIsPressed)
            {
                gameOver=false;
                cs.setControlChannel("turnoff", 0); 
                cs.readScore('i"MainInstrument"	0 z');
                createScene();
                memoryLevel = 100;
            }

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
        if(keyIsPressed===true)
            memoryLevel-=0.1;       
        
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
                // if enemy hits player remove from list
                enemies.splice(i, 1);
                impact = 1;
                memoryLevel-=10;
                lives--;          
            }        
        }
        
        if (mouseIsPressed || screenTouch || keyIsDown(32))
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
            strokeWeight(1);
            fill(255);
            stroke(255);
            textAlign(CENTER);
            text("Galactic Latt.: " + String(parseFloat(offX).toFixed(2)), 0 + shake, 75 + shake);
            text("Galactic Long.: " + String(parseFloat(offY).toFixed(2)), 0 + shake, 90 + shake);
            text("Score: " + String(score), 3 + shake, 105 + shake);
            textAlign(RIGHT);
            text("Memory:", -10+shake, 130);

            fill(150, 150, 150, 255);
            strokeWeight(0)
            rect(-10+shake, 120, 70*(getMemoryLevel()/100), 15);
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

function getMemoryLevel()
{
    if(memoryLevel<0)
    {
        gameOver = true;

        for ( i = 0 ; i < enemies.length ; i++)
            enemies.pop(i);
        for ( i = 0 ; i < stars.length ; i++)
            stars.pop(i);

        createScene();

        cs.setControlChannel("turnoff", 1); 
    } 
    return memoryLevel;
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
    setTimeout(spawnHostileStar, map(score, 0, 300, 5000, 0)+random(2000));
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
    cs.readScore('i"Explosion" 0 1');

    if(type == "MusicalStar") 
    {
        stars.splice(index, 1);
        memoryLevel = memoryLevel < 100 ? memoryLevel+7.5 : 100;
    }
    else if(type == "Enemy")
    {
        enemies.splice(index, 1);
    }  

    if(score>36)
    {
        if(score%5 == 0) 
        {
            voice = int(random(1, 5));
            cs.setControlChannel('voice'+String(voice)+'change', random(100));
        }

        if(score%7 == 0) 
        {
            var tempi = [2, 4, 8, 16];
            var tempo = int(random(0, 3));
            var newTempo = tempi[tempo];
            voice = int(random(1, 5));    
            cs.setControlChannel("voice5table", 204);
            if(voice==4)
                newTempo = tempi[tempo]+8;
            cs.setControlChannel('voice'+String(voice)+'freq', newTempo);
        }

        if(score%10 == 0) 
        {
            voice = int(random(1, 5));
            transFactor = random(1, 5);
            if(transFactor<4)
                cs.setControlChannel('transp'+String(voice), random()>.5 ? 12 : -12);
            else
                cs.setControlChannel('transp'+String(voice), random()>.5 ? 7 : -7);
        }


        if(score%8 == 0) 
        {
            voice = int(random(1, 5));
            for(i = 0; i < 5 ; i++)
            {
                if( voice == i )
                    cs.setControlChannel('voice'+String(voice)+'vol', 0);
                else
                    cs.setControlChannel('voice'+String(voice)+'vol', 0.3);
            }

        }   
        
        var toggleTable = random(0, 1);
        if(score%12 == 0)
            cs.setControlChannel("voice1table", toggleTable<.5 ? 99 : 200);    
        else if(score%7 == 0)
            cs.setControlChannel("voice2table", toggleTable<.5 ? 98 : 201);   
        else if(score%14 == 0)
            cs.setControlChannel("voice3table", toggleTable<.5 ? 97 : 202);   
        else if(score%6 == 0)
            cs.setControlChannel("voice4table", toggleTable<.5 ? 95 : 203);   
        else if(score%13 == 0)
            cs.setControlChannel("voice5table", toggleTable<.5 ? 96 : 204);   
    }

    
    if(score == 2)
        cs.setControlChannel("voice1vol", .3);
    else if(score == 6)
        cs.setControlChannel("voice2vol", .3);
    else if(score == 12)
        cs.setControlChannel("voice3vol", .3);
    else if(score == 18)
        cs.setControlChannel("voice4vol", .3);
    else if(score == 24)
        cs.setControlChannel("voice5vol", .3);

    showExplosion = 0;

    score++;
    enemiesKilled++;   
    
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

    if(keyCode == 32)
        mousePressAndSpacebar();
}

function keyReleased()
{
    movedLeft = 0;
    movedRight = 0;
}

function mousePressed()
{
    mousePressAndSpacebar();
}

function mousePressAndSpacebar()
{
    if(gameOver)
    {
        var page = window.open("https://rorywalsh.github.io/NiMPTi-in-Space/NiMPTiInSpace.html", "_self"); 
        page.location.reload();
    }
    
    if(showIntroScreen)
        showIntroScreen = false;

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
