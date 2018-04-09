var textAlpha = 0;
var textAlphaSpeed = 0.01;
var stars = [];
var triggerStars = [];
var centreX, centreY, mobileDevice=false;


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
    var timer = setInterval(spawnRedDwarf, 2500);
}

// This is the main draw loop for the game
function drawScene()
{
    speed = .1;
    background(0);
    fill(255);
    translate(centreX, centreY);

    //if(mobileCheck.android)
    //{
      //fill(0, 255, 0);
      textSize(16);
      text(accelerationX, 100, 30);
      ellipse(map(accelerationX, -90, 90, -450, 450),
              map(accelerationY, -90, 90, -450, 450), 25, 25);
      //this.y += map(accelerationY, -90, 90, -5, 5);
    //}

    for (i = 0; i < stars.length; i++)
    {
        stars[i].update();
    }

    // draw crosshair
    stroke(255);
    strokeWeight(4);
    fill(0, 0, 0, 0);
    ellipse(0, 0, 50, 50);
    line(0, -30, 0, -10);
    line(0, +30, 0, +10);
    line(-30, 0, -10, 0);
    line(+30, 0, +10, 0);

    //missle

}

// This function calls the main drawing function during gameplay, or the "loading Csound"
// message when the Csound object is loading
function draw()
{
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
    if (keyCode === CONTROL)
    {

    }

    if (keyCode === 32)
    {
      for (i = 0; i < stars.length; i++)
      {
          star = stars[i];
          if (star.name == "RedDwarf")
          {
              if (star.x > -5 && star.x < 5
                  && star.y > -5 && star.y < 5)
                  stars.splice(i, 1);
          }
      }
    }
}

function mousePressed(){
  for (i = 0; i < stars.length; i++)
  {
      star = stars[i];
      if (star.name == "RedDwarf")
      {
          if (star.x > -5 && star.x < 5
              && star.y > -5 && star.y < 5)
              stars.splice(i, 1);
      }
  }
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
}
