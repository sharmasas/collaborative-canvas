// variable definition (socket connection and data placeholders)
let socket = io();
let video;
let vScale = 2;

function setup() {
  // socket is listening for two events: new drawing and clear canvas
  socket.on("mouse", newDrawing);
  socket.on("refresh", wipeCanvas);

  // create a refresh button
  var button1 = createButton('refresh');
  //button1.position(0,0);
  button1.mousePressed(refreshSession); 
  
  var button2 = createButton('save');
  //button2.position(0,0);
  button2.mousePressed(saveImage);
  
  // set up canvas: ASK JOSE ABOUT THIS
  //createCanvas(windowWidth, windowHeight-140, noRedraw = "TRUE");
  createCanvas(1000,500);
  pixelDensity(1);
  video = createCapture(VIDEO);
  video.size(width / vScale, height / vScale);
  video.hide();
  background(0);
  noStroke();
  blendMode(BLEND);
  
  
  //refreshSession if new session started/refresh page pressed
  refreshSession();
}

function saveImage() {
  saveCanvas('myImage', 'png');
}

// ASK JOSE ABOUT THIS
// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight-140, noRedraw = "TRUE");
// }

function refreshSession() {
  // refresh function emits data to server to reset canvas
  var refreshdata = {
    bgd: 0
  };
  //
  socket.emit("refresh", refreshdata);
}

function wipeCanvas(refreshdata) {
  // wipe canvas function actually resets the canvas
  background(refreshdata.bgd);
}

function newDrawing(data) {
  
  // assign r, g, b values from camera space 
  var r = (video.pixels[data.index + 0]);
  var g = (video.pixels[data.index + 1]);
  var b = (video.pixels[data.index + 2]);

  // draw pixel filled rectangles 
      if (r > 100 && g < 60 && b < 60) {
        
        fill(255 - r, 255 - g, 255 - b, 200);
        ellipse(data.x * vScale, data.y * vScale, vScale, vScale);
        
      } else if (r < 60 && g < 60 && b > 80) {
        
        fill(255 - r, 255 - g, 255 - b, 200);
        rect(data.x * vScale, data.y * vScale, vScale, vScale);
        
      } else if (r < 50 && g > 50 && b < 50) {
        
        fill(255 - r, 255 - g, 255 - b, 200);
        rect(data.x * vScale, data.y * vScale, vScale, vScale);
        
      } else if (r > 100 && g > 100 && b < 70) {
        
        fill(255 - r, 255- g, 255 - b, 200);
        rect(data.x * vScale, data.y * vScale, vScale, vScale);
        
      } else if (r > 150 && g < 60 && b > 150) {
        
        fill(255 - r, 255 - g, 255 - b, 200);
        rect(data.x * vScale, data.y * vScale, vScale, vScale);
      } 
  
}

function mouseDragged() {

   var index, r, g, b, x, y;
  
    for (var y = 0; y < video.height; y++) {
      for (var x = 0; x < video.width; x++) {
        index = (video.width - x + 1 + (y * video.width)) * 4;
        r = video.pixels[index + 0];
        g = video.pixels[index + 1];
        b = video.pixels[index + 2];
      
      if (r > 100 && g < 60 && b < 60) {
        
        fill(255 - r, 255 - g, 255- b, 200);
        ellipse(x * vScale, y * vScale, vScale, vScale);
        
        
      } else if (r < 60 && g < 60 && b > 80) {
        
        fill(255- r, 255-g, 255-b, 200);
        rect(x * vScale, y * vScale, vScale, vScale);
        
      } else if (r < 50 && g > 50 && b < 50) {
        
        fill(255-r, 255-g, 255-b, 200);
        rect(x * vScale, y * vScale, vScale, vScale);
        
      } else if (r > 100 && g > 100 && b < 70) {
        
        fill(255-r, 255-g, 255-b, 200);
        rect(x * vScale, y * vScale, vScale, vScale);
        
      } else if (r > 150 && g < 60 && b > 150) {
        
        fill(255-r, 255-g, 255-b, 200);
        rect(x * vScale, y * vScale, vScale, vScale);
        
      } 
    }
  }

        var data = {

          x : x,
          y : y,
          index : index,
          r : r,
          g : g,
          b : b,
          vScale : vScale

        }

        socket.emit("mouse", data);
  } 




function draw() {
	video.loadPixels();
  loadPixels();
  mouseDragged();
  
}
