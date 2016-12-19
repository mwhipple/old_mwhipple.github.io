---
title: Programming Interviews-Work Down
post_img:
  src: apple-pie.jpg
  title: Use the imaginary mix
tags:
  - interviews
---

It can be hard enough to program with a co-worker looking over your
shoulder, but replace that co-worker with an interviewer and swap out
that computer for a dry-erase marker and whiteboard and it may
feel like the kind of nightmare where you suuddenly realize you're in
your underwear...and time's running out!

Regardless of possible criticisms, participating in that type
of coding interview is somewhat a rite of passage for
programmers and is standard practice for a lot of companies.
The topic came up briefly in conversation last week while I
was at the (very nice) Datadog Summit where another engineer was
lamenting that he felt disadvantaged during coding interviews because
he was most comfortable in C and ~40 minutes goes by pretty quickly
when you have to worry about low level details like memory management.
Though I can't disagree with possible C pains, it left me thinking about
associated advice I've had bouncing around my
head (and a tweet I just saw about supposedly horrible Google
interviews gave me the extra nudge).

<!--more-->

The simplified version of the advice is to tackle programming
interview questions from the top down. The combination of the question
asked and the biases of the interviewer generally lead to some of the
code being particularly valuable to cover and so you don't want to get
lost implementing all the supporting noise. To phrase it more
accurately: write to the proper level of abstraction for the presented
question. If you're asked some kind of question that involves
knapsack-y dynamic programming then focus on the core algorithm first
and pretend whatever supporting functions you may need are already
available to be called. Approach the work in a way
that allows you to cut to the core of the question being
asked as quickly as possible so it can be handled without rushing,
then work your way down and start to implement some of those imaginary
functions. That should not only help remove some of the time crunch
but it also provides the 
incredibly valuable option of _not having to actually do things_. If
you've solved the heart of the problem well, then the interviewer may give
you a pass on some of the other stuff, may selectively choose other
bits, or may just ask for a verbal description rather than the far
more time consuming whiteboarding. 
If the question is on a lower level
of abstraction (like implementing data structures) then there's far
less room to use imaginary placeholder functions and there's more
likely to be focus on the nitty gritty details...but it's still worth
deferring any grunt work that's going to siphon off your time (and
the worst that can happen is you just have to do it later).

Sooner or later I'll discipline myself to write code that way normally
instead of bouncing all over the place (which doesn't play out too
well on a whiteboard with messy handwriting).
The above approach has had very good
results for me in the past when I've been organized enough to do it
...call an imaginary object while describing its behavior and
save 5 minutes here and there....possibly leave enough time to be
given another programming puzzle. :sunglasses:
