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
  ellipse(data.ellipse_x, data.ellipse_y, vScale, vScale);
}

function mousePressed() {

    var pixelX = int(mouseX / vScale);
    var pixelY = int(mouseY / vScale);
    let index, r, g, b, temp, ellipse_x, ellipse_y, temp_index;
  
    temp_index = (pixelX - 13 + (pixelY - 13) * video.width) * 4 
  
    for ( var j = -13; j <= 13; j++) {
      
      index = temp_index + j * video.width * 4
      
      for ( var i = -13; i <= 13; i++) {
        index = index + 4
        //index = (pixelX + i + (pixelY + j) * video.width) * 4;

        r = video.pixels[index + 0] + 50;
        g = video.pixels[index + 1];
        b = video.pixels[index + 2];
        
        ellipse_x = (pixelX + i) * vScale; 
        ellipse_y = (pixelY + j) * vScale; 
        
        var data = {
          ellipse_x : ellipse_x,
          ellipse_y : ellipse_y,
          r : r,
          g : g,
          b : b
        }

        socket.emit("mouse", data);
        
        
        fill(r, g, b, 127);
        ellipse(ellipse_x, ellipse_y, vScale, vScale);

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
