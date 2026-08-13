// Original Code from: BUN
// https://www.openprocessing.org/sketch/755877

// connect to the relay server: itself when running locally, otherwise the
// deployed relay's domain (the static site and the relay live on different
// origins now, unlike under Glitch where one server did both jobs)
var socket = io(
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://collaborative-canvas-douj.onrender.com"
);

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
  //createCanvas(windowWidth, windowHeight-140);
  createCanvas(1000,500);
	background(0);
  distance = 10;
  spring = 0.5;
  friction = 0.5;
  
  // changed size from 13 to 10 
  size = 12;
  diff = size/8;
  x = y = ax = ay = a = r = f = 0;

  //refreshSession if new session started/refresh page pressed
  refreshSession();  
}

// //ASK JOSE ABOUT THIS
// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight-140, true);
// }

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
  
  //TODO: figure out how to communicate thickness (related to r and oldR)
  
  oldR += ( data.r - data.oldR ) / distance;
  if(oldR < 1) oldR = 1;
  
  strokeWeight( oldR + diff );
  line( data.x, data.y, data.oldX, data.oldY );

  strokeWeight( oldR );
  line( data.x+diff*2, data.y+diff*2, data.oldX+diff*2, data.oldY+diff*2 );
  line( data.x-diff, data.y-diff, data.oldX-diff, data.oldY-diff );

  //this is a change -> pink color
  stroke(200, 25, 65, 255);
}

function draw() {
  // take out to remove symetry 
  mX = mouseX;
  mY = mouseY;
  oldR = r;
  
  if(mouseIsPressed) {
    
    // don't take out 
    if(!f) {
     f = 1;
     x = mX;
     y = mY;
   }
    
    ax += ( mX - x ) * spring;
    ay += ( mY - y ) * spring;
    ax *= friction;
    ay *= friction;
    a += sqrt( ax*ax + ay*ay ) - a;
    a *= 0.6;
    r = size - a;
    
    for( i = 0; i < distance; ++i ) {
      
      oldX = x;
      oldY = y;
      x += ax / distance;
      y += ay / distance;
      
      oldR += ( r - oldR ) / distance;
      if(oldR < 1) oldR = 1;
      
      strokeWeight( oldR+diff );
      line( x, y, oldX, oldY );
      strokeWeight( oldR );
      
      line( x+diff*2, y+diff*2, oldX+diff*2, oldY+diff*2 );
      line( x-diff, y-diff, oldX-diff, oldY-diff );
      
      // this is a change -> teal color 
			stroke(64, 224, 208);
      
      
        var data = {
        x: x,
        y: y,
        r: r,
        oldX: oldX,
        oldY: oldY,
        oldR: oldR
      };
 
      socket.emit("mouse", data);
    
    } 
    
  } else if(f) {
    ax = ay = f = 0;
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

