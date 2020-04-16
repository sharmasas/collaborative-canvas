var socket = io();
let x, y, px, py;

function setup() {
  createCanvas(500, 500);
  background(0);
  colorMode(HSB);

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

function mouseDragged() {
  console.log(
    "Sending: " + mouseX + "," + mouseY + "," + pmouseX + "," + pmouseY
  );

  var data = {
    x: x,
    y: y,
    px: px,
    py: py
  };

  socket.emit("mouse", data);
}

function draw() {
  stroke(frameCount % 360, 75, 100);
  strokeWeight(3);

  x = mouseX;
  y = mouseY;
  px = pmouseX;
  py = pmouseY;

  if (mouseIsPressed) {
    line(x, y, px, py);
    line(width - x, y, width - px, py);
    line(x, height - y, px, height - py);
    line(width - x, height - y, width - px, height - py);
  }
}
