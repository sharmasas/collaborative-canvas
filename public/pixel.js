// variable definition (socket connection and data placeholders)
// connect to the relay server: itself when running locally, otherwise the
// deployed relay's domain (the static site and the relay live on different
// origins now, unlike under Glitch where one server did both jobs)
let socket = io(
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://collaborative-canvas-douj.onrender.com"
);
let video;
let vScale = 2;
let brushHeight = 15;
let brushWidth = 15;

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

// save image function
function saveImage() {
  saveCanvas('myImage', 'png');
}

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
  // draw pixel filled rectangles (ellipse_x and ellipse_y now predefined)
  fill(data.r, data.g, data.b + 50, 170);
  ellipse(data.ellipse_x, data.ellipse_y, vScale, vScale);
}


function draw() {
   video.loadPixels();
}

function mousePressed() {

    // webcam hasn't produced a frame yet — bail out rather than reading
    // undefined pixel data (which becomes NaN, then null over the wire,
    // and trips p5's "expected Number" warning in fill())
    if (!video.pixels || video.pixels.length === 0) return;

    // defining variables outside loop
    var pixelX = int(mouseX / vScale);
    var pixelY = int(mouseY / vScale);
    let index, r, g, b, temp, ellipse_x, ellipse_y, temp_index;
  
    // precalculating index not related to counters i and j 
    temp_index = (pixelX - brushWidth + (pixelY - brushHeight) * video.width) * 4; 
  
    for ( var j = -brushWidth; j <= brushWidth; j++) {
      
      // updating counter based on j
      index = temp_index + j * video.width * 4;
      
      for ( var i = -brushHeight; i <= brushHeight; i++) {
        
        index = index + 4;
        //index = (pixelX + i + (pixelY + j) * video.width) * 4;

        r = video.pixels[index + 0] + 50;
        g = video.pixels[index + 1];
        b = video.pixels[index + 2];
        
        // precalculating variables that go into ellipse function
        ellipse_x = (pixelX + i) * vScale; 
        ellipse_y = (pixelY + j) * vScale; 
        
        // transmit data prior to rendering it on screen
        var data = {
          ellipse_x : ellipse_x,
          ellipse_y : ellipse_y,
          r : r,
          g : g,
          b : b
        }

        socket.emit("mouse", data);
        
        fill(r, g, b, 170);
        ellipse(ellipse_x, ellipse_y, vScale, vScale);

    }
  } 
}

/* DROPDOWN, used website as reference: https://www.w3schools.com/howto/howto_js_dropdown.asp */
/*toggle dropdown*/
function dropdownToggle() {
  document.getElementById("ProjectDropdown").classList.toggle("show");
}

/* close dropdown if user clicks outside*/
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
