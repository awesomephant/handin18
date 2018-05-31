---
layout: post
title:  "Process: Newspaper Clippings"
date:   2018-05-15 21:09:29 +0100
---

The idea here was to take a single result of my research into machine learning and creating a self-contained outcome around it. I also needed a way to build and use a neural network in a limited amount of time and computational recources. The idea to highlight AI-powered automation in journalism does this:

- The training data and outcomes are text-based, which meant I could realistically train a reasonably good model within a few hours.
- With the machine generating the copy, I could focus on the execution - typography, paper stocks, printing processes.
- The notion of automated journalism speaks to a lot of more general concerns about machine learning algorithms. There is of course the potential of human journalists loosing their jobs (a very real potential, despite publishers saying otherwise). There's also the idea of machines *posing as humans* - even the neural network I trained became uncannily good at recreating a human tone of voice. But beyond that, the idea of machines writing our news stories (and another set of machines controlling who sees them on their newsfeed) and thus shaping the way we see the world is troubling.   

## Generating the Headlines

<p class='full'>
<video src='/handin18/assets/ml/cmd.mp4' autoplay loop playsinline muted></video>
Command-line view showing a model being trained on New York Times headlines. The models used in the outcome were trained for 6 to 12 hours.
</p>
I trained a 3-layer deep recurrant neural network in Tensorflow based on [this paper](). Recurrant networks are normally used to predict time series - stock prices, sales numbers, or any other metric that changes over time. [paper] show that you can model a sentence in a very similar way: A series of words (or letters) that have to appear in a specific sequence for the sentence to have meaning.

![Tensorflow Runs](/handin18/assets/ml/chart.png)
Graph showing 5 successive training runs of the model.

To generate convincing headlines, I needed a lot of real example headlines. This is known as a training set. The New York Times has a public API that gives you programmatic access to metadata on every article published since 1980. I put together a training set containing every headline published since December 2010 - about 300.000 headlines. I chose 2010 as the starting point to make sure the network would pick up on recent political developments, which would make the outcomes more relevant. After the network was trained, I generated around 20 pages of new headlines.

## Printing

<p class="full">
<img src="/handin18/assets/ml/letterpress-5.jpg" alt="Metal type spelling This question is for testing wether you are human"/>
Letterpress testing
</p>

<p class="full">
<img src="/handin18/assets/ml/forme.jpg" alt="Forme"/>
Letterpress forme ready to be printed
</p>

<p class="full">
<img src="/handin18/assets/ml/press.jpg" alt="Forme"/>
Three text blocks on the bed of the press, ready to print. 
</p>


The decision to print these outcomes letterpress effectively turns the network's outcomes back to their original form. I chose a light stock (Southbank Book White 115g) to create the impression of newsprint (I considered actual newsprint, but dismissed it because it deteriorates quickly and would stand up to repeated handling). I printed the first 6 headlines Vandercook galley press. The final four are printed on a Stephenson Blake power press, which required significantly more setup (the type has to be permanently mounted into the press) but produces much crisper results.

<p class="full">
<img src="/handin18/assets/ml/prints.jpg" alt="Forme"/>
All ten prints laid out before cropping
</p>

The finished prints were tightly cropped to give the impression they had been cut out of a larger sheet. Some prints were designed with additional rules or copy designed to be cut through the middle to strengthen that impression.

![Portfolio 1](/handin18/assets/ml/portfolio.jpg)
Initial version of the folder. The prints are held in place by small slots cut into the paper.

The clippings are presented in a printed portfolio (contstructed out of Colourplan Pale Gray) to give the idea of a loose collection and to encourage the view to handle them.

![Portfolio 1](/handin18/assets/ml/portfolio-2.jpg)
Final version of the folder

## Website

![Portfolio 1](/handin18/assets/ml/clippings-site.png)

Finally, I built a website that contains more details about the technique used to generate the news clippings and allows the viewer to create more news clippings using that technique. When I was making the prints I designed the typography and layouts myself, referencing real examples from the New York Times. On the website, the layouts are created by a randomised algorithm:

```pseudocode
When the "Generate Clipping" button is pressed do the following:
    Pick a headline, byline, location, and body copy at random
    Pick a paper colour between #fefefe and #a9a9a9 at random 
    Pick a random number of columns between 1 and 3
    For each headline, byline, location etc. :
        Pick a typeface out of a given set
        Set the type size within a given range
    Finally, "crop" the clipping by a random amount
```

This algorithm allows for tens of thousands of possible variations, making it unlikely any viewer will ever see the same clipping twice.

The final website is available at [maxkoehler.com/clippings-site](http://www.maxkoehler.com/clippings-site/), sourcecode [here](https://github.com/awesomephant/clippings-site)