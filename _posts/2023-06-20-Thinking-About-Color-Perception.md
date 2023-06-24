---
title: Thinking About Color Perception
categories: []
img_path: /assets/img/posts/Color
image: cover.png
math: true
---

Where is brown on the color spectrum? It seems the rainbow left a color out. Why is that?

Light has a single variable, frequency. If you only looked at a single photon at a time then the only possible colors you could see would be the below. These are what we see for photons between 380 and 780 nanometers.

![pure light](colors.png){: .center w="500"}

If this makes up all the possible colors of light, then where are the other colors such as brown?

Eyeballs have photoreceptors that produce electrical signals when photons hit them. That signal is sent to the brain and experienced as color. We have [~4.5 million cones](https://www.ncbi.nlm.nih.gov/books/NBK10848) (the photoreceptors responsible for color vision) per eye, and many more rods (photoreceptors for low light environment), so we get an entire image of vision rather then just a single point. Humans have three types of cones which we call L (long wavelengths), M (medium wavelengths), and S (short wavelengths). Let's look at how the M cone works.

### One Cone

The stimulus response distribution for an M cone over photons from 380nm to 780nm is seen below.

![M cone](M.png){: .center w="500"}

We see a strong response for green light and very little response for blue or red light. If you had only a single cone, the world would be greyscale. In fact, the Bottlenose Dolphin [has only a single cone type](https://pubmed.ncbi.nlm.nih.gov/9682867/), so they do perceive the world in greyscale.

But it's not just single photons. We can have any combination of photons, which can be represented as a density function over the frequency spectrum, known as a spectral power distribution. We can calculate the stimulus response by multiplying the spectral power distribution by the stimulus response distribution, then integrating over the result (all this means is we are adding up all the stimulus responses by each individual photon).

Here we see different spectrum distributions (top graph), followed by the stimulus response distribution of the M cone (middle), and the multiplication of the two, as well as the integral of that function represented by the size of the circle (bottom).

![Animated photon combinations](animatedCone.gif){: .center w="400"}

One consequence of this reduction of the spectral power distribution is that completely different combinations of light can look the same to an observer. For example, the M cone will output the same response for a small amount of green light as it will for a large amount of red light. Any combinations of light that are perceived as the same are called [metamers](https://en.wikipedia.org/wiki/Metamerism_(color)).

> Is there a way to find all the metamers for a given stimulus response over a stimulus response distribution? The space of spectral power distributions is [infinite dimensional](https://en.wikipedia.org/wiki/Hilbert_space) (each point along the x axis is a variable), so it is not easy to explore. Although difficult to imagine, metamers are the sets of all spectral power distributions distance $d$ away from the stimulus response distribution in function space using the integral inner product.
{: .prompt-tip }

### Two Cones

Let's add a second cone type with a different stimulus response distribution. For example, dogs have two cones, so what we understand here will help us better empathize with our good friends.

The two cones act exactly like the single cone, expect now our brain will receive use two stimulus values to represent a color. Let's color code the two stimulus distributions so we can easily keep track of them (we color code each cone with the color of light which causes the strongest stimulus).

![Animated photon combinations](2animatedCones.gif){: .center w="400"}

But we notice that the "red" and "green" stimulus values often look the same, even for all the different spectral power distributions. A good question to ask is whether all possible combinations of stimulus values are possible? For example, does there exist a spectral power distribution that results in stimulus values of 1.0 for the "red" cone and 0.0 for the "green" cone? And similarly 0.0 for the "red" cone and 1.0 for the "green" cone? If so, we could use those two spectral power distributions as basis vectors to build all possible perceptible colors. Let's see what I mean.

We can pretty easily select some frequencies that either activate just the "red" cone or the "green" cone. Let's call these frequencies $R$ and $G$.

![basis 2 cone vectors](RGVecs.png){: .center w="400"}

A photon at frequency $R$ would create the stimulus values $(1, 0)$, and at $G$ we get $(0, 1)$, where $(a, b)$ represents the stimulus values with $a$ being the stimulus of the "red" cone and $b$ the "green" cone.

And now we can build any perceivable color we want using only photons at frequencies $R$ and $G$. For example, if we want to send the stimulus value $(7, 2)$ to the dogs brain, then we send 7 photons at frequency $R$ and 2 photons at $G$. Since each photon only stimulates a single cone at a time, we can easily control the value. If we instead picked photons at different frequencies, it would be harder to construct a specific color. Let's see what I mean.

![weird basis 2 cone vectors](MNVecs.png){: .center w="400"}

A photon at frequency $M$ would result in stimulus values $(2, 1.2)$, and at $N$ in  $(0.3, 1.7)$. What combination of photons do we use to send $(7, 2)$ now? By solving the system of equations $m (2, 1.2) + n (0.3, 1.7) = (7, 2)$ for $m$ and $n$, we find our answer. Since this combination of $M$ and $N$ result in the same stimulus value as our previous combination of $R$ and $G$, then these two possible combinations are metamers of each other. But, if you actual solve this system, you find $n$ is negative. We can't send a negative number of photons, which means it's actually impossible for two basis frequencies $M$ and $N$ to be combined in sny way such that you get the stimulus of $(7, 2)$.

The basis colors we choose can be one limiting factor, but so can the stimulus distributions. We can imagine a situation in which most colors can't be created, such as when two stimulus distributions exactly overlap. In that case, no frequency could give us a stimulus value with one of the cones as zero and the other as non-zero. We need a tool to determine which stimulus values are possible given some stimulus distributions, and a new representation of the perceivable color space can help us with that.

We draw the shape traced out by sweeping through all possible frequencies with the stimulus values as coordinates.

![2D color phase space](2dPhaseSpace.gif){: .center w="400"}

You might notice that our values $R$ and $G$ picked from before happen to lie exactly on the red and green axis, which makes sense since we picked those values such that they could act as basis vectors. 

In order to investigate the limitations imposed by stimulus distributions, let's take two simple stimulus distributions and watch what happens when we bring them closer and farther from overlapping, as well as changing the width of overlap.

![2D color phase space of moving stimulus distribution](animatedPhaseSpace.gif){: .center w="400"}

As expected, when the two stimulus distributions overlap exactly, the possible stimulus values collapse into a single line, which is equivalent to going back to a single cone type. Interestingly, we see when the distributions _almost_ completely overlap, or have different widths, the range or perceivable colors is severely restricted, but not a straight one-dimensional line. This tells us it's possible to have two cone types and still be mostly color blind. In order to have the full range of color experience, we need multiple cone types, each with it's own distinct stimulus zone in the spectrum.
