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

## How it works
Word2Vec relies on the [Distributional Hypothesis](https://en.wikipedia.org/wiki/Distributional_semantics#Distributional_hypothesis), essentially it states that words used in similar contexts are themselves similar. Once we establish this is true (which it is for words), then we can build the machinary that learns these embeddings.

The following is a short description, but do not worry about understanding it right now, we will go over it more slowly in the next section. We build a neural network with a single hidden layer with size equal to the dimension we want to embed into. The input and output layer have as many nodes as there are words (not necessarily equal sizes for non-words). We use word-context pairs to train the network to match the words and contexts. The resulting network can embed the words by mapping each word to the values in the hidden layer.

A helpful visual walkthrough can be found [here](https://jalammar.github.io/illustrated-word2vec/). 

Of course, this algorithm can be applied to more then just words. Someone used this same algorithm to [embed music](https://towardsdatascience.com/using-word2vec-for-music-recommendations-bb9649ac2484). They used the sequence of songs in peoples playlists as the equivalent to the sequence of words in a sentence. But Word2Vec is even more general then that. As long as the Distributional Hypothesis holds, and we have pairs of target values and contexts, then the Word2Vec algorithm can be applied.

## To begin, a simple example
Lets start with not words, but arbitrary labels that don't necessarily mean anything to us. And to show the generality of this method, lets use something else for the context, like days of the week. Now we assume the Distributional Hypothesis is true for this data, then with some label-days pairs we can start training. 

Our initial data will be fairly simple.
```
A monday,tuesday,wednesday
B monday,tuesday,wednesday
C monday,tuesday,wednesday
D thursday,friday
E thursday,friday
F thursday,friday
G saturday,sunday
H saturday,sunday
I saturday,sunday
```
{: .nolineno file='data.txt'}

We don't know what this data represents (we're in the same boat as the AI for this one), maybe `A` is an event that occurs on `monday`, `tuesday   `, and `wednesday`, or maybe `A` is a person and these are their favorite days, we don't know. What we do know is that `A`, `B`, and `C` all have the same context, so by the Distributional Hypothesis they should have similar embedding (exactly the same really, since the contexts are exactly the same). And we see below what happens to these embeddings over the course of training.

![Animated embedding over time](animated.gif){: .center w="800" }

We see that the embeddings converge to three points. If you reference the legend you will see that `A`, `B`, and `C` do indeed all embed as the (nearly) same vector, while the other letters converge to their own distinct points.

But now, how exactly are we doing this training?

We use a neural network with one hidden layer. The classic 2D picture of a neural network is helpful, but for this project its important to realize that the weights in a network are all independent of each other. To better show this we rotate the hidden layer in the third dimension, which exposes the fact that the weights are all separate.

![3d Network](network.gif){: .center w="600" }

I found it helpful to reference other peoples Word2Vec tutorials, such as [this](https://jaketae.github.io/study/word2vec/) or [this](http://mccormickml.com/2016/04/19/word2vec-tutorial-the-skip-gram-model/).

