class AnimatedTextBox
{
    constructor(x, y, textWidth, textHeight, fontSize, align, colour, str)
    { 
        this.frameCount = 0;
        this.x = x;
        this.y = y;
        this.textWidth = textWidth;
        this.textHeight = textHeight;
        this.fontSize = fontSize;
        this.align = align;
        this.colour = color;
        this.text = str;
        this.alpha = 0;
        this.charIndex = 0;
        this.fadeOut = false;
        this.startTime = 0;
        this.secondsPassed = 0;
        this.osc = new p5.Oscillator();
        this.osc.setType('sine');
        this.osc.start();
        this.osc.freq(0);
        this.osc.amp(0);
    }

    animate()
    {

      if(millis()/1000 > this.startTime)
      {
        if(this.frameCount%3==0)
          this.charIndex = (this.charIndex < this.text.length ? this.charIndex+1 : this.text.length);

        if(this.charIndex<=this.text.length)
        { 
          fill(0,0,0,0);
          rect(this.x-10, this.y-10, this.textWidth+20, this.textHeight+20);
          if(this.align === 'LEFT')
            textAlign(LEFT);
          else
            textAlign(CENTER);
          fill(255);
          textSize(this.fontSize);
          this.subString = this.text.substring(0, this.charIndex);
          text(this.subString, this.x, this.y, this.textWidth, this.textHeight);

          if(this.osc)
          {
            if(this.charIndex<this.text.length)
            {
              this.osc.amp(.05);
              this.osc.freq(random(100, 800));
            }
            else
              this.osc.amp(0);
            }
        }
      }
      this.frameCount++; 
    }

   
}
