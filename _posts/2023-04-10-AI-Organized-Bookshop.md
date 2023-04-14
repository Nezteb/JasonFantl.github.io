---
title: AI Organized Bookshop
# categories: [Simulated Economy]
img_path: /assets/img/posts/BookEmbedding
math: true
image: cover.jpeg
---

## Morivation
There is a fascinating algorithm called Word2Vec. This algorithm represents words as vectors such that "similar" words have nearby vectors. Not only are similar words nearby, but they follow an intuitive structure, the prime example being that `King - Man + Woman = Queen`, mind that the operations are operating on the vector representations of those words.

We will take this algorithm and try to apply it to entire books such that we get the 3D coordinates of that book in our desired bookstore. This should mean that similar books are near each other. We could do operations like taking the average of books, or find the book equal to the difference of two books.

## Brief overview of how it works
Word2Vec relies on the [Distributional Hypothesis](https://en.wikipedia.org/wiki/Distributional_semantics#Distributional_hypothesis), essentially it states that words used in similar contexts are themselves similar. Once we establish this is true (which it is for words), then we can build the machinery that learns these embeddings.

The following is a short description, but do not worry about understanding it right now, we will go over it more slowly in the next section. We build a neural network with a single hidden layer with size equal to the dimension we want to embed into. The input and output layer have as many nodes as there are words (not necessarily equal sizes for when we train on something other than words). We use word-context pairs to train the network to match the words and contexts. The resulting network can embed the words by mapping each word to the values in the hidden layer.

A helpful visual walkthrough can be found [here](https://jalammar.github.io/illustrated-word2vec/). 

And before we continue, keep the following in mind: For this project its relevant that the weights in a network are independent from each other. The classic 2D picture of a neural network is helpful, but can obscure this simple fact. To better show this we rotate the hidden layer in the third dimension, which exposes the fact that the weights are all separate.

![3d Network](network.gif){: .center w="600" }

I also found it helpful to reference other peoples Word2Vec tutorials, such as [this](https://jaketae.github.io/study/word2vec/) or [this](http://mccormickml.com/2016/04/19/word2vec-tutorial-the-skip-gram-model/).

Of course, this algorithm can be applied to more then just words. Someone used this same algorithm to [embed music](https://towardsdatascience.com/using-word2vec-for-music-recommendations-bb9649ac2484). They used the sequence of songs in peoples playlists as the equivalent to the sequence of words in a sentence, but Word2Vec is even more general then that. As long as the Distributional Hypothesis holds, and we have pairs of target values and contexts, then the Word2Vec algorithm can be applied. 

We will understand Word2Vec by playing with it, and along the way we will pick up the theory behind it.

## To begin, a simple example
Lets start with not words, but arbitrary labels that don't necessarily mean anything to us. And to show the generality of this method lets make the embedding values and the context completely different. Now we assume the Distributional Hypothesis is true for this data, then with some label-days pairs we can start training. 

Our initial data will be fairly simple.
```
A Alpha
B Alpha
C Beta
D Beta
```
{: .nolineno file='data.txt'}

What this means is that the values `A` and `B` both have the contet `Alpha`, and similarly `C` and `D` for `Beta`.

We don't know what this data represents (we're in the same boat as the AI for this one), maybe `A` is an event that occurs at a place called `Alpha`, or maybe `A` is a person and `Alpha` is their pets name, we don't know. What we do know is that `A` and `B` have the same context, so by the Distributional Hypothesis they should be similar. We want similar objects to have similar embeddings, in fact here we would hope `A` and `B` get exactly the same embedding since they have exactly the same contexts. Note that `Alpha` and `Beta` are completely distinct, later we will have contexts which overlap. Lets run Word2Vec on this data for two dimensions, and lets watch how to embeddings change throughout training.

![Animated embedding over time](training_small_2out.gif){: .center w="800" }

Huh. Not what we were hoping for. The points with different contexts did separate, but points with the same contexts (like `A` and `B`) should have ended up closer to each other. Lets create more datapoints with either context `Alpha` or `Beta` (again, later contexts will overlap, but not in this example). Now we can get a better idea of their behavior.

![Animated embedding over time](training_large_2out.gif){: .center w="800" }

Now we see whats happening, they are converging to a line. To feel comfortable with this result, lets investigate the nature of neural networks. 

A helpful tool is <https://playground.tensorflow.org/>, which we use below. Here we map the (X, Y) coordinates to a single value. Notice how the output is a plane (think of the X-Y axis as inputs and the heatmap as an output).

![Animated embedding over time](online_example.gif){: .center w="800" }

This must always be the case, which we can see if we represent the network mathematically. We see $$ O = X*w_1 + Y*w_2 $$ where $O$ is the output neuron, $X$ and $Y$ are the input neurons, and $w_1$ and $w_2$ are the weights. This is the equation of a plane. This means for our 2-degree hidden layer (the embeddings), there is an entire line of solutions that will satisfy $O=1$. This explains why the similar values don't need to have nearby embeddings, their are many possible embeddings that correctly map to the same context (which is our heuristic for similarity). 

But this doesn't yet explain why the values of different contexts have distant embeddings. The training process optimizes to both get embeddings close to the values in context, and to distance the embeddings from anything not in the context. Our two context example is the easiest to investigate for this behavior. 

Imagine a snapchat of the training process right at the beginning. There are many points with context `Alpha` all over the plane. A training step effects two pairs of weights, the weights from the input values to the hidden/embedding layer (2D in our case), and the weights from the embedding layer to the contexts. Remember that the weights from the hidden layer to a single value in the context layer creates a plane, so we have one plane for each context value (which are totally separate, remember the 3D network showed the weights are unrelated for each output neuron). Its helpful to imagine two values in your head: The embeddings of each value, color coded with their context, and the planes for each context (mapping the embeddings to a value).



