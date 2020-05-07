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

  // draw pixel filled rectangles 
  fill(data.r, data.g, data.b + 50, 127);
  ellipse((data.pixelX + data.i) * vScale, (data.pixelY + data.j) * vScale, vScale, vScale);
}

function mousePressed() {

    var pixelX = int(mouseX / vScale);
    var pixelY = int(mouseY / vScale);
   
    for ( var i = -13; i <= 13; i++) {
      for ( var j = -13; j <= 13; j++) {

        var index = (pixelX + i + (pixelY + j) * video.width) * 4;

        var r = video.pixels[index + 0] + 50;
        var g = video.pixels[index + 1];
        var b = video.pixels[index + 2];

        fill(r, g, b, 127);
        ellipse((pixelX + i) * vScale, (pixelY + j) * vScale, vScale, vScale);
        
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



function draw() {
  
   video.loadPixels();
  
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
