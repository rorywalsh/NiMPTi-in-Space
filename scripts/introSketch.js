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

function draw()
{
    rotate(.1);
}
