// Original Code from: BUN
// https://www.openprocessing.org/sketch/755877

var socket = io();

function setup() {
  createCanvas(1000,430);
	background(0);
  distance = 10;
  spring = 0.5;
  friction = 0.5;
  size = 20;
  diff = size/8;
  x = y = ax = ay = a = r = f = 0;

  // connect client to local server at port 3000
  //socket = io.connect('http://localhost:3000');
  socket.on("mouse", newDrawing);
  socket.on("refresh", wipeCanvas);

  // create a refresh button
  var button1 = createButton('refresh session');
  //button1.position(0,0);
  button1.mousePressed(refreshSession); 
  
  var button2 = createButton('save image');
  //button2.position(0,0);
  button2.mousePressed(saveImage);
}

function saveImage() {
  saveCanvas('myImage', 'jpg');
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
  
  strokeWeight( oldR+diff );
  line( x, y, oldX, oldY );

  strokeWeight( oldR );
  line( x+diff*2, y+diff*2, oldX+diff*2, oldY+diff*2 );
  line( x-diff, y-diff, oldX-diff, oldY-diff );

  stroke(255);
  
  //line(data.x, data.y, data.px, data.py);
  //line(width - data.x, data.y, width - data.px, data.py);
  //line(data.x, height - data.y, data.px, height - data.py);
  //line(width - data.x, height - data.y, width - data.px, height - data.py);
}

function draw() {
  // take out to remove symetry 
  mX = mouseX;
  mY = mouseY;
  px = pmouseX;
  py = pmouseY;
	
  oldR = r;
  if(mouseIsPressed) {
		
		// following 4 lines added for symetry (take out for no symetry)
		//line(x, y, px, py);
    //line(width - x, y, width - px, py);
    //line(x, height - y, px, height - py);
    //line(width - x, height - y, width - px, height - py);
    
    
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
    
      
      // code that draws
      strokeWeight( oldR+diff );
      line( x, y, oldX, oldY );
      
      strokeWeight( oldR );
      line( x+diff*2, y+diff*2, oldX+diff*2, oldY+diff*2 );
      line( x-diff, y-diff, oldX-diff, oldY-diff );
      
			stroke(255);
    }
  } else if(f) {
    ax = ay = f = 0;
  }
}



