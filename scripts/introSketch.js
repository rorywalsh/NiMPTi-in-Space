var stars = [];
var enemies = [];
var backgroundStars = [];
var centreX, centreY;
var textBox1, textBox2, textBox3;
var button;

// Setup our canvas and create our stars
function setup()
{
    // osc = new p5.Oscillator();
    // osc.setType('sine');
    // osc.start();
    // osc.freq(0);
    // osc.amp(.5);

    textBox1 =  new AnimatedTextBox(-300, -90, 600, 500, 20, "LEFT", color(255, 255, 255, 255), "NiMPTI is an intergalactic garbage collector whose mission is to rid the virtual file space universe of bad programmers. He survives by freeing memory that hasn't been released by host programs...");
    textBox1.startTime = 1;

    textBox2 =  new AnimatedTextBox(-300, 30, 600, 500, 20, "LEFT", color(255, 255, 255, 255), "Not only does the acquired memory keep his ship in orbit, it also powers his on-board radio....");
    textBox2.startTime = 22;

    textBox3 =  new AnimatedTextBox(-300, 130, 600, 500, 20, "LEFT", color(255, 255, 255, 255), "NiMPTi can survive in the most hostile environments in the virtual uni-world, but he can't survive without his choons!");
    textBox3.startTime = 32;

    centreX = windowWidth / 2;
    centreY = windowHeight / 2;
    var cans = createCanvas(windowWidth, windowHeight);
    createScene();
    cans.style('display', 'block');
    textAlign(CENTER);
    background(0);
    button = createButton('Skip Intro - Play');
    button.position(windowWidth*.46, windowHeight*.8);
    button.mousePressed(playGame);
}

function playGame()
{
    window.open("https://rorywalsh.github.io/NiMPTi-in-Space/NiMPTiInSpace.html", "_self"); 
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
    background(0);
    translate(centreX, centreY);
    for (i = 0; i < backgroundStars.length; i++)
    {
        bgStar = backgroundStars[i];
        bgStar.update();
    }

    //update stars 
    for (i = 0; i < stars.length; i++)
    {
        star = stars[i];
        star.update();
    }

    stroke(255);
    fill(255);
    textSize(80);
    text("NiMPTi in Space", 0, -200);

    fill(255);
    textSize(20);
    text("Press WASD to move. Hit spacebar to shoot", 0, windowHeight*.4);

    textBox1.animate();
    textBox2.animate();
    textBox3.animate();


}