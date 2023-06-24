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
