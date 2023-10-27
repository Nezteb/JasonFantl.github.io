let network;
let numNodes = 250;

function setup() {
  let canvas = createCanvas(400, 400); // specify WEBGL for 3D graphics
  canvas.parent('p5-canvas-container');
  frameRate(30);
  colorMode(HSB);

  network = new Network();

  // Populate network with nodes
  for (let i = 0; i < numNodes; i++) {
    let x = random(width);
    let y = random(height);
    let node = new Node(x, y, network, i);
    network.nodes.push(node);
  }
}

function draw() {
  background(0, 0, 255);
  translate(width / 2, height / 2);
  scale(0.25);
  // Update the network
  network.timestep();

  // Display broadcasts
  for (let broadcast of network.broadcasts) {
    broadcast.display();
  }

  // Display nodes
  for (let node of network.nodes) {
    node.display();
  }
}

function mousePressed() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    return;
  }

  network.broadcasts = [];

  for (let node of network.nodes) {
    node.isLeader = true;
    node.currentClusterID = 10;
    node.currentClusterLifetime = 0;
    node.timeSinceLastPayload = random(10);
  }

}
