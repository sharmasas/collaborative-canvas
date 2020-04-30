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
  var r = video.pixels[data.index + 0];
  var g = video.pixels[data.index + 1];
  var b = video.pixels[data.index + 2];

  // draw pixel filled rectangles 
  fill(r, g, b, 127);
  rect((data.pixelX + data.i) * vScale, (data.pixelY + data.j) * vScale, vScale, vScale);
  
}

function mouseDragged() {


  if (mouseIsPressed == true) {
    
      var pixelX = int(mouseX / vScale);
      var pixelY = int(mouseY / vScale);
    
    
    for ( var i = -10; i <= 10; i++) {
      for ( var j = -10; j <= 10; j++) {

        var index = (pixelX + i + (pixelY + j) * video.width) * 4;

        var r = video.pixels[index + 0];
        var g = video.pixels[index + 1];
        var b = video.pixels[index + 2];

        fill(r, g, b, 127);
        rect((pixelX + i) * vScale, (pixelY + j) * vScale, vScale, vScale);

        var data = {

          i : i,
          j : j,
          pixelX : pixelX,
          pixelY : pixelY, 
          index : index,
          r : r,
          g : g,
          b : b,
          vScale : vScale

        }

        socket.emit("mouse", data);

      }
    }
  } 
}



function draw() {
	video.loadPixels();
  mouseDragged();
  
}
