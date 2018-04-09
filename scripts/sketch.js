var textAlpha = 0;
var textAlphaSpeed = 0.01;
var stars = [];
var triggerStars = [];
var centreX, centreY;
var score = 0;
var offX = 0, offY = 0;
var screenTouch = false;
var timer = setInterval(spawnRedDwarf, 2500);;

// Setup our canvas and create our stars
function setup()
{
    for (i = 0; i < 800; i++)
    {
        stars.push(new Star());
    }

    centreX = windowWidth / 2;
    centreY = windowHeight / 2;
    var cnvs = createCanvas(windowWidth, windowHeight);
    cnvs.style('display', 'block');
    textAlign(CENTER);
}

// This is the main draw loop for the game
function drawScene()
{
    speed = .1;
    background(0);
    translate(centreX, centreY);

    if (mobileCheck.android)
        rotate(PI / 2);

    //move stars around
    for (i = 0; i < stars.length; i++)
    {
        stars[i].update();
    }

    // draw crosshair ===============================
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
    ellipse(0, 0, 50, 50);
    line(0, -30, 0, -10);
    line(0, +30, 0, +10);
    line(-30, 0, -10, 0);
    line(+30, 0, +10, 0);

    // draw on-screen text =========================
    strokeWeight(1)
    fill(255)
    stroke(255)
    text("Score: " + String(score), 3, 60);
    text("OffX: " + String(parseFloat(offX).toFixed(2)), 3, 75);
    text("OffY: " + String(parseFloat(offY).toFixed(2)), 3, 90);
}

// This function calls the main drawing function during gameplay, or the "loading Csound"
// message when the Csound object is loading
function draw()
{
    if (mobileCheck.android)
    {
        offY = map(accelerationY, -90, 90, -5, 5);
        offX = map(accelerationX, -90, 90, -5, 5);
    }

    csoundLoaded = true;
    if (csoundLoaded)
    {
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

function spawnRedDwarf()
{
    stars.push(new Star());
    star = stars[stars.length - 1];
    star.r = 255;
    star.g = 0;
    star.b = 0;
    star.name = "RedDwarf";
    clearInterval(timer);
    setInterval(spawnRedDwarf, 10000 + random(10000));
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
