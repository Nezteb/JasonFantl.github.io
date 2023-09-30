const MAX_ID = 100;

class Node {
  constructor(x, y, network, i) {
    this.position = createVector(x, y);
    this.size = 10;
    this.speed = 0.1;
    this.velocity = p5.Vector.random2D();
    this.range = 60;

    this.network = network;
    this.recentPayloads = [];
    this.maxPayloadMemory = 100; // max number of recent payloads to remember

    this.leader = true;
    this.groupID = i;
    this.timeSinceLastPayload = random(30); // used as countdown for leader announcments and follower listening
    this.maxWaitSendTime = 10; // how often to send announcment as leader
    this.maxWaitRecieveTime = 40; // how long to wait for a leader message before becoming a leader
  }

  // Send a message to the network
  send(payload) {
    // overwrtie payload
    this.network.createBroadcast(this.position, this.range, payload);

    // Add the sent payload to recentPayloads
    this.addToRecentPayloads(payload);
  }

  // Receive a message from a broadcast
  receive(payload) {
    // Check if the payload has been recently received or sent
    if (this.recentPayloads.includes(payload.toString())) {
      return; // Ignore the message
    }

    let frame_sent = payload[0];
    let new_groupID = payload[1];

    // check if this is a leader announcment from a lesser leader
    if (new_groupID < this.groupID) {
      return; // Ignore the message
    }

    this.addToRecentPayloads(payload);

    // update new leader if this one os greator
    if (new_groupID > this.groupID) {
      this.groupID = new_groupID;
      this.leader = false; // this will not do anything if already a follower
    }

    this.timeSinceLastPayload = 0;
    this.network.createBroadcast(this.position, this.range, payload);
  }

  addToRecentPayloads(payload) {
    // Add the payload to recentPayloads
    this.recentPayloads.push(payload.toString());

    // Maintain the size of recentPayloads
    if (this.recentPayloads.length > this.maxPayloadMemory) {
      this.recentPayloads.shift(); // Remove the oldest payload
    }
  }

  // Incorporate Boids movement
  move(nodes) {
    let moveVec = this.boids(nodes);
    moveVec.sub(this.velocity.copy().mult(0.01));
    this.velocity.add(moveVec);
    this.position.add(this.velocity);

    if (this.velocity.mag() > 4) {
      this.velocity.setMag(4);
    }
    // Keep the node within canvas boundaries
    // this.position.x = constrain(this.position.x, 0, width);
    // this.position.y = constrain(this.position.y, 0, height);
  }

  timestep(nodes) {
    this.move(nodes);
    this.timeSinceLastPayload++;

    if (this.leader) {
      for (var i in nodes) {
        let node = nodes[i];
        if (node == this) {
          continue;
        }
        if (node.leader) {
          if (node.groupID == this.groupID) {
            this.groupID = int(random(MAX_ID));
            break;
          }
        }
      }

      if (this.timeSinceLastPayload > this.maxWaitSendTime) {
        this.send([frameCount, this.groupID]);
        this.timeSinceLastPayload = 0;
      }
    } else {
      // follower
      if (this.timeSinceLastPayload > this.maxWaitRecieveTime) {
        this.leader = true;
        this.groupID = int(random(MAX_ID));

        this.timeSinceLastPayload = 0;
      }
    }
  }

  display() {
    strokeWeight(1);

    stroke(0);
    if (this.leader) {
      strokeWeight(3);
    }

    // Color based on groupID for hue, with full saturation and brightness
    fill((this.groupID * 21) % 255, 100, 100);

    ellipse(this.position.x, this.position.y, this.size);
  }

  // Boids
  boids(nodes) {
    let force = createVector();

    let separateForce = this.separate(nodes).mult(1);
    let alignForce = this.align(nodes).mult(0.5);
    let cohesionForce = this.cohesion(nodes).mult(0.6);

    let centerForce = this.position.copy().div(-width*8);
    force.add(centerForce);

    force.add(separateForce);
    force.add(alignForce);
    force.add(cohesionForce);

    return force;
  }

  separate(nodes) {
    let desiredSeparation = 15;
    let sum = createVector();
    let count = 0;

    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i] == this) {
        continue;
      }
      let distance = p5.Vector.dist(this.position, nodes[i].position);
      if (distance < desiredSeparation) {
        let diff = p5.Vector.sub(this.position, nodes[i].position);
        diff.normalize();
        // diff.div(distance);
        sum.add(diff);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
    }

    return sum;
  }

  align(nodes) {
    let neighborDist = 30;
    let sum = createVector();
    let count = 0;

    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i] == this) {
        continue;
      }
      let distance = p5.Vector.dist(this.position, nodes[i].position);
      if (distance < neighborDist) {
        sum.add(nodes[i].velocity.copy().normalize());
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
    }

    return sum;
  }

  cohesion(nodes) {
    let neighborDist = 70;
    let sum = createVector();
    let count = 0;

    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i] == this) {
        continue;
      }
      let distance = p5.Vector.dist(this.position, nodes[i].position);
      if (distance < neighborDist) {
        sum.add(nodes[i].position);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      return p5.Vector.sub(sum, this.position).mult(0.001);
    } else {
      return createVector();
    }
  }
}
