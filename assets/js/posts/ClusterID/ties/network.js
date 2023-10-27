
let speedOfLight = 10;

class Network {
  constructor() {
    this.nodes = [];
    this.broadcasts = [];
  }

  timestep() {
    // update and remove any broadcasts that have completed
    for (let i = this.broadcasts.length - 1; i >= 0; i--) {
      let broadcast = this.broadcasts[i];
      broadcast.timestep();

      if (broadcast.hasCompleted()) {
        this.broadcasts.splice(i, 1);
        continue;
      }

      // check for any broadcasts that reach a node
      for (let node of this.nodes) {
        let d = dist(broadcast.position.x, broadcast.position.y, node.position.x, node.position.y);
        if (d < broadcast.radius) {
          node.onReceiveClusterPayload(broadcast.payload);
        }
      }
    }

    // update nodes
    for (let node of this.nodes) {
      if (node.timestep) node.timestep(this.nodes);
    }
  }

  createBroadcast(position, range, payload) {
    let broadcast = new Broadcast(position, range, speedOfLight, payload);
    this.broadcasts.push(broadcast);
  }
}

class Broadcast {
  constructor(position, max_radius, speed, payload) {
    this.position = position;
    this.radius = 0;
    this.max_radius = max_radius;
    this.speed = speed;
    this.payload = payload;
  }

  timestep() {
    this.radius += this.speed;
  }

  display() {
    let a = map(this.radius, 0, this.max_radius, 0.1, 0);
    fill(186, 255, 255, a); // Set hue to 100, full saturation and brightness, and alpha mapped from radius
    noStroke();
    ellipse(this.position.x, this.position.y, this.radius * 2);
  }

  hasCompleted() {
    return this.radius > this.max_radius;
  }
}