---
title: When to Use ReactiveX
post_img:
  src: rx-giveaway.jpg
  title: Subscribe to under your seat!
tags:
  - rx
  - design
---

_Reactive_ is one of the software industry buzzwords of the moment, and
[ReactiveX (rx)](http://reactivex.io/) is one of the principal,
cross-platform implementations of what it means to be reactive.

After spending a little over a year using rx at times and at other
times deciding rx isn't worth using, I now (hopefully) have a pretty
firm handle on when (and when not) to introduce rx into a piece of
code.
<!--more-->

#### Thrashing About

I first started using rx a little over a year ago and my initial significant
introduction was the kind of workflow that could be given as a case
study for concurrency approaches: poll a queue (SQS) and process each
message with a combination of calls to remote systems and databases.
There was no need to synchronize anything anywhere, and the varying
return times for the assorted calls begged for some kind
of concurrent flow abstraction and since rx was already present in the
project, it was a natural first choice.

Since then, however, I've often reached for rx only to decide
that it didn't provide enough value to justify the additional
complexity. Further, upon revisiting some of the code written during
that initial dive, my head promptly exploded. In most other cases
the logic was either surrounded by blocking code which didn't align
with and robbed value from the rx style, or the concurrency behavior
that rx provided wasn't powerful enough out of
the box to make it an appealing alternative (more below).

#### Epiphany

My initial exposure to rx was within the context of existing
codebases, but my true appreciation of it came with greenfield
code. When beginning work on a repository layer for a new application
I wanted to use asynchronous calls to the DB (this is a JVM app so I'm
also using [Hystrix](https://github.com/Netflix/Hystrix) for
bulkheading).

One of the big issues with using async calls in
otherwise synchronous code, however, is that too often the logic hits
a gate of synchronization where a subsequent line of code is expecting
a resolved value and therefore blocks...often immediately after
receiving whatever kind of handle to asynchronous data is
provided. This can lead to systems where asynchrony is too contained,
or worse yet where blocking and unblocking code are intermingled in a
way where there's the complexity and sense of benefit (and coolness) of using
asynchronous code but enough gates of synchronization to make any win
illusory (but the additional complexity is guaranteed...along with
the likelihood of some bonus context churn on the system).

To get the async coolness without throwing away its value at the first
bit of domain code I therefore wanted to introduce an abstraction that
would remove any code from relying on resolved data so blocking
could be avoided or deferred as long as possible (in
this case the output is JSON which cannot be simply streamed while
remaining well-formed, so I'll block to serialize for now).
I did *not* want to introduce asynchronous
code everywhere: I wanted to define all of the interfaces of the
system in a way that were completion agnostic. The implementations
of specific methods could be either blocking or non-blocking and the
calling code should behave accordingly rather than coercing return
values into how it sees its world. After quickly evaluating a couple
options I realized that is *exactly what rx is for*.

As discussed in detail on the
[Introduction](http://reactivex.io/intro.html) documentation page,
ReactiveX represents an API that is effectively a push-y `Iterable`.
Specifically:

> ReactiveX is not biased toward some particular source of concurrency
> or asynchronicity. Observables can be implemented using
> thread-pools, event loops, non-blocking I/O, actors (such as from
> Akka), or whatever implementation suits your needs, your style, or
> your expertise. Client code treats all of its interactions with
> Observables as asynchronous, whether your underlying implementation
> is blocking or non-blocking and however you choose to implement it.

Treating all interactions as asynchronous is the assumption-free
option; to avoid implication that line could be inverted to be similar
to  "Client code does not treat any of its interactions with
Observables as synchronous...". The role of rx as principally an
implementation-neutral API was one of those details that, for me, got
washed away over the course of practical use. The quote above also
reinforces the idea that rx is _not a concurrency library_. I hadn't
lost sight of that detail but now its importance in terms of rx
serving as a generalized abstraction rather than a specific solution
is apposite.

#### Conclusion

rx is a great option for an API to handle data without assuming synchrony. It is well
supported, has a good catalog of functionality, and is implementation agnostic.
It provides a composable representation of the pipeline through which
data will pass that is far more readable than using callbacks, and
includes the appropriate error handling facilities to deal with issues
and/or unreliable data within that pipeline.

It is a strong choice to define internal contracts in a way that allows
a system to consistently maximize the value of (potentially) asynchronous
or concurrent code. However...that value is only likely to be realized if the
adoption is wholesale. It is unlikely to provide value as a library
that is used selectively within a project, and can mostly serve as an
invitation to future headaches due to higher complexity and
increased cognitive overhead.

It could be useful for smaller pieces in a larger application,
particularly if other libraries that support rx are in the mix, but most
likely a dedicated concurrency framework would provide more help in
terms of control and design (if familiarity with rx exists then it
could provide a useful abstraction layer on top of that).
