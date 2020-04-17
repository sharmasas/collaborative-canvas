var socket = io();

var num = 1000;
var vx = new Array(num);
var vy = new Array(num);
var x = new Array(num);
var y = new Array(num);
var ax = new Array(num);
var ay = new Array(num);

var force = 10.0;
var radius = 1 ; 
var speed = 0.90;

function setup() {
  createCanvas(1200,800);
  noStroke(); 
  fill(0);
  ellipseMode(RADIUS);
  background(0);
  blendMode(ADD);

  for(var i =0; i< num; i++){
    x[i] = random(width);
    y[i] = random(height);
    vx[i] = 0;
    vy[i] = 0;
    ax[i] = 0;
    ay[i] = 0;
  }

  // connect client to local server at port 3000
  //socket = io.connect('http://localhost:3000');
  socket.on("mouse", newDrawing);
}

function newDrawing(data) {
  stroke(frameCount % 360, 75, 100);
  strokeWeight(3);
  line(data.x, data.y, data.px, data.py);
  line(width - data.x, data.y, width - data.px, data.py);
  line(data.x, height - data.y, data.px, height - data.py);
  line(width - data.x, height - data.y, width - data.px, height - data.py);
}

// function mouseDragged() {
//   console.log(
//     "Sending: " + mouseX + "," + mouseY + "," + pmouseX + "," + pmouseY
//   );

//   var data = {
//     x: x,
//     y: y,
//     px: px,
//     py: py
//   };

//   socket.emit("mouse", data);
// }

function draw() {
  fill(0,0,0);
  rect(0,0,width,height);
  
  for(var i=0; i<num; i++){
    var distance = dist(mouseX, mouseY, x[i], y[i]); 
   
    if(distance > 1){ 
      
      ax[i] = force * (mouseX - x[i]) / (distance * distance); 
      ay[i] = force * (mouseY - y[i]) / (distance * distance);
    }
    vx[i] += ax[i]; 
    vy[i] += ay[i]; 
    
    vx[i] = vx[i]*speed;
    vy[i] = vy[i]*speed;
    
    x[i] += vx[i];  
    y[i] += vy[i];  
    
    //var sokudo = dist(0,0,vx[i],vy[i]); 
    var r = map( 5, 0, 5, 0, 255); 
    var g = map( 20, 0, 5, 64, 255);
    var b = map( 30, 0, 5, 128, 255);
    fill(r, g, b, 32);
    ellipse(x[i],y[i],radius,radius);
  }
}
