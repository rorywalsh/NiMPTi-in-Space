var textAlpha = 0;
var textAlphaSpeed = 0.01;
var stars = [];
var triggerStars = [];
var centreX, centreY;
// Setup our canvas and create our stars
function setup() {
    for (i = 0; i < 800; i++) {
        stars.push(new Star());
    }
    centreX = windowWidth / 2;
    centreY = windowHeight / 2;
    var cnvs = createCanvas(windowWidth, windowHeight);
    cnvs.style('display', 'block');
    textAlign(CENTER);
}

// This is the main draw loop for the game
function drawScene() {
    speed = 1;
    background(0);
    translate(centreX, centreY);

    for (i = 0; i < stars.length; i++) {
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
}

// This function calls the main drawing function during gameplay, or the "loading Csound"
// message when the Csound object is loading
function draw() {
    csoundLoaded = true;
    if (csoundLoaded) {
        drawScene();
    } else {
        //basic code to indicate Csound is still loading...
        background(0, 0, 0);
        fill(0, 0, 100, textAlpha);
        text("...LOADING CSOUND...", width / 2, height / 2);
        textAlpha += textAlphaSpeed;
        if (textAlpha > 1 || textAlpha < 0) {
            textAlphaSpeed *= -1;
        }
    }
}

function keyPressed() {
    if (keyCode === CONTROL) {
        stars.push(new Star());
        star = stars[stars.length - 1]
        star.r = 255;
        star.g = 0;
        star.b = 0;
        star.x = 0;
        star.y = 0;

        star.name = "RedDwarf";
    }

    if (keyCode === 32) {
        for (i = 0; i < stars.length; i++) {
            star = stars[i];
            if (star.name == "RedDwarf") {
                print(star.x);
                print(star.y);
                if (star.x > -25 && star.x < 25 && star.y > -25 && star.y < 25)
                    stars.splice(i, 1);
            }
        }
    }
}



function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
