---
title: Molecule Inspired Simulations
categories: []
img_path: /assets/img/posts/Molecules
math: true
image: cover.png
---

### Forces
This begins with the [Fyenman Lectures](https://www.feynmanlectures.caltech.edu/), which I _highly_ recommend. The very first lecture begins with atoms and how they interact with each other, showing us how water works at the molecular level.

Let's create a simulation inspired by the water molecules. We will create grossly over-simplified "molecules", which will interact at the local level, anf hopefully produce large scale behavior.

To begin, we need a force equation that models how one molecule interacts with another. It should produce properties such that when one molecule is too close to another molecule, it gets repelled, and when it's too far, it gets attracted. There are many equations that would do this, I think $\frac{1}{x^{2}}(1-\frac{1}{8x^{2}}))$ looks nice. 

![Force Graph](forceGraph.png){: .center w="400" }

Now we take a "molecule", and update its velocity and position based on this force equation every frame. Below we see the result of the force equation (green for attracted, red for repelled) of a stuck molecule acting on a free-moving molecule. Then we simulate multiple molecules interacting with each other. And then we add walls and make it colorful.

<div class="row align-items-center">
<div class="col-md-4">
![Force Graph](forceGraph.gif){: .center w="200" h="200"}
</div>
<div class="col-md-4">
![3 molecules](3molecules.gif){: .center w="400" h="400"}
</div>
<div class="col-md-4">
![4 molecules](4molecules.gif){: .center h="400" w="400" .img-border}
</div>
</div>

These "molecules" are dramatically simple, unable to capture much of the complexity seen in real molecules, but we will see macro behavior that almost looks to imitate the properties of water. 

### Temperature and Cohesion

Let's then try a hundred molecules together, and control their temperature. This means we increase or decrease each molecules velocity, which is the definition of temperature. When the screen flashes red, the temperature increases, and when it flashes blue, the temperature decreases. We also add gravity that can be turned on and off.

<div class="row align-items-center">
<div class="col-md-6">
![temperature controlled molecules](temperatureMolecules.gif){: .center w="400" .img-border }
</div>
<div class="col-md-6">
![gravity molecules](gravity.gif){: .center w="400" .img-border }
</div>
</div>

In the first animation we see the temperature increase and decrease. When the temperature is high, we see the molecules bouncing around separately in the box, and when the temperature is low, they group together. This almost looks like gas and water. When we turn the temperature really low, we see a crystalline structure, which is what we would also see in frozen water. But our model is too simple, the molecules don't "lock" into place like true water molecules do. Our "molecules" can freely rotate around each other, meaning they maintain their fluid like properties.

In the second animation, we slow the particles down, turn on gravity, turn it off, and finally on again when it gets close to the floor. With gravity, we see behavior similar to water cohesion. When the drop of "water" is sitting on the ground being being acted on by gravity, we see a bludge around the sides, but it doesn't spread out or break. And again, when gravity turns on as the drop hangs just above the floor, it falls and bulges out, then recovers.

### Buoyancy

Let's create large objects made out of molecules, we'll call them "cells". These cells will be rigid, using the forces acting on each of its individual molecules to calculate its linear force and rotational force. We can control the mass of the molecules that make up the cell, making it heavier or lighter. 

By constructing hollow objects and varying their mass, we can see a buoyancy-like force appear.

<div class="row align-items-center">
<div class="col-md-4">
![circle in water](circle.gif){: .center w="400" h="400" }
</div>
<div class="col-md-4">
![box in water](box.gif){: .center w="400" h="400" }
</div>
<div class="col-md-4">
![sunk box in water](sunk.gif){: .center w="400" h="400" }
</div>
</div>

![floating box in water](floating.gif){: .right h="400" }

We see when a cells molecules are lighter, or just a little heavier then other molecules, the cell floats. But when the mass becomes too large, it sinks. We verify with the floating box that even heavy molecules can create a floating cell. This tells us this behavior is in part from the hollow space, not just the weight of molecules (if it were just the weight, a cell made of heavier molecules would always sink). But there is a point where the weight overtakes the force created by the hollow space.

We find an interesting behavior with the sunken box with its side is flat against the floor. Even when the sunken box is made lighter, it stays sunken and refuses to float up. You can actually find this behavior in your bathtub. Take a very flat/smooth object, and push it against the bottom of the tub. The object sits there, failing to float up for longer then you might expect. Although, eventually it does float back up. This is because buoyancy comes from water pushing at the bottom edges of the object (think through why, find the weight up to the surface on the left and right side of the edge). Without the water underneath, the water molecules at the edge can't translate their downward force into an upward force. The object in your tub isn't perfectly flat, so eventually enough water gets underneath to start pushing it up.

