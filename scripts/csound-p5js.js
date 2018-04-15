/** Csound p5.js Example
 *  Based on code posted by Steven Yi <stevenyi@gmail.com> to the Csound mailing list.
 *  Modified by RW, 2018
 *
 *  Description: Simple JS file that creates a CsoundObj
 *  object and compiles and instance of Csound. This object is global
 *  and can be accessed from the sketch.js file
 */

// Signals when csound is loaded and used from sketch.js file
var csoundLoaded = false;
var cs;

// Called when Csound WASM completes loading
function onRuntimeInitialized()
{
    cs = new CsoundObj();
    
    //use this code to load a .csd file and have Csound compile and start it
    var fileManger = new FileManager(['csd'], console.log);
    fileManger.fileUploadFromServer("NiMPTi65.csd", function(){
      cs.compileCSD("NiMPTi65.csd");
      cs.start();
      cs.setControlChannel("drumVol", 1);
      cs.setControlChannel("voice1vol", 0.2);
      cs.setControlChannel("voice2vol", 0);  
      cs.setControlChannel("voice3vol", 0);  
      cs.setControlChannel("voice4vol", 0); 
      cs.setControlChannel("voice5vol", 0);  
      cs.setControlChannel("voice1table", 1);
      cs.setControlChannel("voice2table", 1);
      cs.setControlChannel("voice3table", 1);
      cs.setControlChannel("voice4table", 1);
      cs.setControlChannel("voice5table", 1);
      cs.setControlChannel("voice1bit", 8);  
      cs.setControlChannel("voice2bit", 8);  
      cs.setControlChannel("voice3bit", 8);  
      cs.setControlChannel("voice4bit", 8);  
      cs.setControlChannel("voice5bit", 8);  
      cs.setControlChannel("voice1fold", 10);
      cs.setControlChannel("voice2fold", 10);
      cs.setControlChannel("voice3fold", 10);
      cs.setControlChannel("voice4fold", 10);
      cs.setControlChannel("voice5fold", 10);
      cs.audioContext.resume();
    });
    
    csoundLoaded = true;

}

function load_script(src, async)
{
    var script = document.createElement('script');
    script.src = src;
    script.async = async;
    document.head.appendChild(script);
}

// Initialize Module before WASM loads
Module = {};
Module['wasmBinaryFile'] = 'wasm/libcsound.wasm';
Module['print'] = console.log;
Module['printErr'] = console.log;
Module['onRuntimeInitialized'] = onRuntimeInitialized;

if(typeof WebAssembly !== undefined)
{
  console.log("Using WASM Csound...");
  load_script("scripts/FileManager.js", false);
  load_script("wasm/libcsound.js", false);
  load_script("wasm/FileList.js", false);
  load_script("wasm/CsoundObj.js", false);
}
