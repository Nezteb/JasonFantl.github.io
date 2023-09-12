---
title: Dynamic Decentralized Cluster Identification
categories: [Swarms]
img_path: /assets/img/posts/ClusterID
image: cover.png
math: true
---

## Problem Statement
Today we create a scalable dynamic decentralized cluster identification protocol. An example to explain:

![Color spreading through a network](intro_shrunk.gif){: .center w="500"}

We have a large number of drones (the colored circles) which can communicate with other nearby drones (communication is represented by expanding blue circles). We wish to assign a cluster ID (color) to all the drones in a cluster, a cluster being a connected set of drones (all drones which can communicate with each other, either directly or indirectly through other drones). I think of this like using the paint bucket in photoshop, coloring a single node/droid and watching it spread through the graph/network across the links, repeating with a different color on an uncolored node, and so on, until all nodes are colored.

But we want to avoid using an all-seeing entity such as ourselves, we want the drones to color themselves. 

It must be decentralized, but that's not all. It must be dynamic, meaning it can adapt to clusters that split or join together. We also want it to be scalable, consider potentially having millions of drones. Here are some reasonable constraints for scalability:
* The drones have limited memory, this means no storing the entire topology.
* The communication links have limited capacity, this means we can't have every node flood filling the network all the time.

But anything else is acceptable, as long as nothing scales with the network size. For example, if you want to store the list of all two hops from yourself, that's fine, since it wont grow with the network (assuming networks expand outward rather then getting more dense).

## An Easier Problem

Drones within a cluster must negotiate a cluster ID with all the other drones in their cluster, even the ones they aren't directly connected too. Let's ignore all the other requirements and use this as a simple problem to start with, how can a cluster of drones (not moving) agree on a value when they can only communicate with their neighbors? Give it a try before moving on.

One solution is to have every drone broadcast a random number, then have each drone pass along any received message to its neighbors, as well as storing the message for itself, then stopping when no more messages have been received for a long period of time. At the end of this, everyone will have the same set of numbers (since every message was passed along to everyone in the cluster), which we will call the cluster ID.

![Boids passing information within a cluster](passingOn_shrunk.gif){: .right w="200"}

Here we show each drone picking a random number (its color), and flood filling the network (the blue expanding circle). Below each drone we show the list of received messages. This results in all drones within a cluster sharing the same set of received colors. But this is not a scalable solution, can you see why? Think of millions of drones in a cluster, what goes wrong?

## Scaling

The last solution doesn't scale for two reasons:
* Every drone has to store a number from every other drone, so local memory is required to scale with network size. 
* Every drone will have its message passed over every link, so the link usage is scaling with network size.

Rather then first communicating all the numbers and taking the set, let's use the highest value as the cluster ID. This also allows us to prune incoming values when we receive an ID lower then the highest we have seen so far. When a drone receives a new number, it will either be higher then its current value, in which case it updates its value and passes it on, or the value is lower, in which case it can ignore it. Now a drone only has to store a single value at a time, and the links will quickly stop being used by any small numbers, which are immediately ignored.

![Boids passing information within a cluster](passingOnMax_shrunk.gif){: .right w="200"}

We see here how everyone quickly agrees on a value, and different values for different clusters. This solves the scalability issue, but doesn't meet our requirement for dynamic clusters. Imagine if a cluster follows this process, _then_ splits apart, the two clusters have no way of knowing they need to restart the process.

## Dynamic Clusters

How does a drone know when it has left the cluster or joined a new one? Again, take a moment to consider before moving on.

If the drone that announced the highest number keeps track of that fact, then they can consider themselves the clusters leader drone (this does not account for ties/duplicates, which we will go over later). The leader will periodically send out Keep-Alive messages like `You are in cluster 14`. This is all we need for drones to detect leaving and entering clusters.

When a drone leaves a cluster, they will no longer receive the Keep-Alive signal, which tells them they have left. When a drone hears two conflicting Keep-Alive signals like `You are cluster 14` and `You are cluster 61`, it knows it has combined with a second cluster.

When a drone hears from two conflicting leaders, it will choose the one with the higher numbered cluster ID. This also means the leader from the cluster with a smaller ID must now become a follower.

When leaving a cluster, a drone will assume it is on its own and elect itself the leader of its own cluster. If a drone left the old cluster with other drones, then all the drones in this new splinter cluster will temporarily elect themselves leaders, but only for a moment. Each new leader will announce their cluster ID, and then all but one drone will become a follower since only one drone picked the highest ID.

![Boids as a cluster separating and reforming](seperate_together_shrunk.gif){: .center h="500" }

Here we started with a cluster of 4 drones which have a cluster ID represented as red. The cluster splits, causing the two left drones to stop hearing broadcasts from the red cluster leader (leaders are indicated with a bold outline). The two separated drones now elect themselves leaders and broadcast their new cluster ID. One of the new leaders hears the others larger cluster ID and joins that cluster, in this case the blue cluster. This process repeats at a larger scale when the two clusters rejoin.

After speeding up the process and letting it run in a less controlled environment, we get the following.

![Boids running the protocol in real time](final_shrunk.gif){: .center h="500" }

And the pseudo code being run on each drone is below. It doesn't include logic to ignore messages that have already been seen, which needs to be added so you don't get cycles of broadcasts (which likely looks like adding a nonce to each message and a queue of recently seen nonces to ignore).

```go
onceASecond():
    if isLeader:
        broadcastClusterID()
    else:
        if noReceivesInLongTime():
            isLeader = true
            currentClusterID = randomNumber()

onReceiveClusterID(incomingClusterID):
    if incomingClusterID > currentClusterID:
        currentClusterID = incomingClusterID
        if isLeader:
            isLeader = false
    if incomingClusterID == currentClusterID:
        broadcastClusterID()
```
{: .lineno file='Protocol Pseudo Code'}

## Remaining Issues

There are a number of issues left to resolve in this protocol.

#### Ties

Drones randomly pick a cluster ID, which means two drones could possibly pick the same random cluster ID. This would prevent clusters from choosing a new cluster ID when they split (although only if each new cluster has one of the duplicate leaders). 

There are at least two potential solutions to this. The first is to pre-assign every drone a unique ID, which can then be used in replacement of picking a random cluster ID every time. Although, this [could violate](https://en.wikipedia.org/wiki/IPv4_address_exhaustion) the scalability requirement. The second solution is to have leaders listen for messages they didn't send out (which they can already look for if using a nonce and queue to track previously seen messages), and upon recognizing there are duplicate leaders, pick a new random cluster ID. A slight optimization is to have the new random cluster ID be larger, which means one of the two previous leaders will be the next leader, which avoids having the entire cluster re-elect a new leader (but make sure to do an entire re-election if both leaders tied with the largest possible cluster ID). 

#### Missed messages

The user must specify how long is "too long" for a drone to wait for a Keep-Alive message. 

If they specify a short threshold, then you may get unstable clusters due to the natural delays introduced in real-world networks. And while unlikely, if a node is traveling quickly in the same direction that a Keep-Alive message is propagating through the network, it may take longer then usual to receive messages (a sort of doppler effect), which causes the Keep-Alive signal to arrive at longer intervals.

If they specify a long threshold, then a drone may actually leave the cluster for a time, miss some messages, and rejoin without realizing they were disconnected. One way to fix this is to have drones periodically check if their neighbor has the same recent history as themselves, looking back at least the amount of time a drone can leave the cluster unaware for.

#### Collision avoidance

When a drone is broadcasting, it is sending out radio signals at a specified frequency, which the other drones know to listen on. When two drones broadcast at the same time, their signals will collide with each other, causing the messages to get corrupted. Many wireless networks solve this by using [Carrier-sense Multiple Access with Collision Avoidance](https://en.wikipedia.org/wiki/Carrier-sense_multiple_access_with_collision_avoidance) (CSMA C/A). This is a nice solution to the collision issue, but only solves the problem for nodes within a short distance of each other. We still face the Hidden Node Problem, which is when two drones which are out of range with each other broadcast to a drone in the center of the two, causing the message to collide only at the central drone. In order to solve this, some wireless networks use [Request to Send/Clear to Send]() (RTS/CTS), but this is for sending a message to a central drone, not broadcasting. As of writing this, I have not found a solution, and so if you, the reader, know of any such protocols or have any ideas, please reach out. It would be great to have a protocol such that drones can coordinate broadcasting in a MANET over the same frequency without collisions and with a relatively low latency. A sort of decentralized space/time scheduler in a dynamic network.
