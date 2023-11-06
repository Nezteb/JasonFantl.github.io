const MAX_ID = 1000;

class Node {
  constructor(x, y, network, i) {
    this.position = createVector(x, y);
    this.size = 10;
    this.speed = 0.1;
    this.velocity = p5.Vector.random2D();
    this.range = 60;

    // TODO: Add object/map of clusters_seen_count and nodes_seen_count
    // TODO: Figure out how to work that into cluster age / priority
    this.network = network;
    this.recentPayloads = [];
    this.maxPayloadMemory = 100; // max number of recent payloads to remember

    this.isLeader = true;
    this.currentClusterID = 10;
    this.currentClusterLifetime = 0;
    this.timeSinceLastPayload = random(2); // used as countdown for leader announcments and follower listening
    this.maxWaitSendTime = 10; // how often to send announcment as leader
    this.maxWaitRecieveTime = 40; // how long to wait for a leader message before becoming a leader
  }

  timestep(nodes) {
    this.move(nodes);
    this.timeSinceLastPayload++;

    if (this.isLeader) {
      if (this.timeSinceLastPayload > this.maxWaitSendTime) {
        this.currentClusterLifetime += 1;
        this.send([this.currentClusterLifetime, this.currentClusterID, int(random(99999))]); // the random number acts as a nonce
        this.timeSinceLastPayload = 0;
      }
    } else {
      // follower
      if (this.timeSinceLastPayload > this.maxWaitRecieveTime) {
        this.isLeader = true;
        this.currentClusterLifetime = 0;
        this.currentClusterID = int(random(MAX_ID));

        this.timeSinceLastPayload = 0;
      }
    }
  }

  // Send a message to the network
  send(payload) {
    // Add the sent payload to recentPayloads
    this.addToRecentPayloads(payload);

    // send
    this.network.createBroadcast(this.position, this.range, payload);
  }

  onReceiveClusterPayload(payload) {
    // Check if the payload has been recently received or sent
    if (this.recentPayloads.includes(payload.toString())) {
      return; // Ignore the message
    }
    this.addToRecentPayloads(payload);

    let incomingClusterLifetime = payload[0];
    let incomingClusterID = payload[1];

    if (
      this.hasEnteredSuperiorCluster(incomingClusterLifetime, incomingClusterID)
    ) {
      this.currentClusterLifetime = incomingClusterLifetime;
      this.currentClusterID = incomingClusterID;
      // if (this.isLeader) {
      this.isLeader = false;
      // }
    }
    if (incomingClusterID != this.currentClusterID) {
      // ignore inferior cluster payloads
      return;
    }

    // tie breaking
    if (this.isLeader) {
      // print("breaking tie")
      this.currentClusterID += int(random(20));
    }

    this.timeSinceLastPayload = 0;
    this.network.createBroadcast(this.position, this.range, payload);
  }

  hasEnteredSuperiorCluster(incomingClusterLifetime, incomingClusterID) {
    if (incomingClusterLifetime > this.currentClusterLifetime) {
      return true;
    }
    if (
      incomingClusterLifetime == this.currentClusterLifetime &&
      incomingClusterID > this.currentClusterID
    ) {
      return true;
    }
    return false;
  }

  addToRecentPayloads(payload) {
    // Add the payload to recentPayloads
    this.recentPayloads.push(payload.toString());

    // Maintain the size of recentPayloads
    if (this.recentPayloads.length > this.maxPayloadMemory) {
      this.recentPayloads.shift(); // Remove the oldest payload
    }
  }

  display() {
    strokeWeight(1);

    stroke(0);
    if (this.isLeader) {
      strokeWeight(3);
    }

    // Color based on groupID for hue, with full saturation and brightness
    fill((this.currentClusterID * 21) % 255, 100, 100);

    ellipse(this.position.x, this.position.y, this.size);
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

  // Boids
  boids(nodes) {
    let force = createVector();

    let separateForce = this.separate(nodes).mult(1);
    let alignForce = this.align(nodes).mult(0.5);
    let cohesionForce = this.cohesion(nodes).mult(0.6);

    let centerForce = this.position.copy().div(-width * 8);
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
