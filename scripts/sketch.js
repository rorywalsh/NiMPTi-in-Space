var textAlpha = 0;
var textAlphaSpeed = 0.01;
var stars = [];
var enemies = [];
var centreX, centreY;
var score = 0, lives = 5, gameOver = false;
var closingBlinds = 0;
var offX = 0, offY = 0;
var screenTouch = false;
setTimeout(spawnRedDwarf, 2000);
setTimeout(spawnEnemy, 2000);
var numberOfRedStars = 0;
var impact = 0;


// Setup our canvas and create our stars
function setup()
{
    for (i = 0; i < 800; i++)
    {
        stars.push(new Star());
    }

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
            fill(255)
            stroke(255)
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
        translate(centreX, centreY);


        //move stars around ===========================
        for (i = 0; i < stars.length; i++)
        {
            stars[i].update();
        }

        //move enemies around ==========================
        for (i = 0; i < enemies.length; i++)
        {
            enemy = enemies[i];
            enemy.update();
            if (enemy.x > -100 && enemy.x < 100 &&
                enemy.y > -100 && enemy.y < 100 &&
                enemy.radius>145)
            {
                print("Hit");
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
        rect(-100 + shake, -100 + shake, 200, 300);
    
        // draw on-screen text =========================
        strokeWeight(1);
        fill(255);
        stroke(255);
        text("Score: " + String(score), 3 + shake, 60 + shake);
        text("Galactic Latt.: " + String(parseFloat(offX).toFixed(2)), 0 + shake, 75 + shake);
        text("Galactic Long.: " + String(parseFloat(offY).toFixed(2)), 0 + shake, 90 + shake);
        text("Red Dwarf Count: " + String(numberOfRedStars), 0 + shake, 105 + shake);
        text("Lives Remaining: " + String(lives), 0 + shake, 120 + shake);
    }   

}

// This function calls the main drawing function during gameplay, or the "loading Csound"
// message when the Csound object is loading
function draw()
{
    csoundLoaded = true;
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

function spawnRedDwarf()
{
    stars.push(new Star());
    star = stars[stars.length - 1];
    star.r = 255;
    star.g = 0;
    star.b = 0;
    star.name = "RedDwarf";
    star.x = random(-100, 100);
    star.y = random(-100, 100);
    setTimeout(spawnRedDwarf, 5000+random(10000));
    numberOfRedStars++;
}

function spawnEnemy()
{
    enemies.push(new Enemy());
    enemy = enemies[enemies.length - 1];
    enemy.x = random(-100, 100);
    enemy.y = random(-100, 100);
    setTimeout(spawnEnemy, 5000+random(10000));
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
}

function mousePressed()
{
    if(gameOver)
        gameOver = false;

    for (i = 0; i < stars.length; i++)
    {
        star = stars[i];
        if (star.name == "RedDwarf")
        {
            if (star.x > -5 && star.x < 5 &&
                star.y > -5 && star.y < 5)
            {
                score++;
                stars.splice(i, 1);
                numberOfRedStars--;
            }

        }
    }
}


function touchStart() {
  screenTouch = true;
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
}
