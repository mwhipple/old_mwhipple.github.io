---
title: Inheriting Transitive Dependencies
post_img:
  src: broken-golfball-stream.jpg
  title: Fixing upstream issues
tags:
 - design
---
Using already existing libraries of code is an easy way to avoid
reinventing wheels and seize an associated jump-start to a finished
product. It can also result in a highway to assorted types of hell as
various incompatibilities manifest which can result in recondite
errors or maintenance obstacles. Often these issues may be
disconnected from the specific benefits the library is providing, at
which point the pain associated with a library may outweigh its value.

If you've spent time with a project that pulls in transitive
dependencies then you've almost certainly wasted some time diagnosing
issues where modules require different definitions
of something or other, and because of that things are blowing up or
upgrades are blocked...or maybe you've worked on projects where these
kinds of issues are avoided by never touching the defined dependencies
(maybe jumping through hoops to ensure that those aging
referenced versions remain available). A lot of these issues can be addressed if
transitive dependencies are treated like OOP inheritance.

<!--more-->

Managed dependencies is something I've been thinking a lot about
recently...I haven't been losing sleep over it but I've found myself
more often conflicted about defining dependencies for some of the
things I've been working on. When one of my coworkers shared this blog
post about [code reuse](http://blog.jessitron.com/2017/02/reuse.html)
the resulting conversation led me to some clearer thoughts on the
subject by stealing some guidelines used for inheritance in
object-oriented programming.

#### Keep it Shallow
Inheritance trees that are more than a few levels deep are a
questionable design: they can be difficult to understand, test, or
change. There's the principle that inheritance should be designed for
or else avoided
(intentional design covered specifically by
[Effective Java](https://www.amazon.com/Effective-Java-2nd-Joshua-Bloch/dp/0321356683), Item #17),
too deep of inheritance is a likely sign that this has not been upheld
or the design may have initially been too complicated.

Transitive dependencies suffer similar issues: every dependency that
pulls in other dependencies introduces lurking cognitive
overhead and complexity. As the number increases so does the
likelihood that there will be conflicts buried on some lower level. By
depending on a library that makes use of other libraries (and so on)
you are now tying your project to all of those other projects; likely not
just in their present state but also future updates which could
introduce new and exciting conflicts in your dependency graph.

Keeping your dependency graph shallow minimizes the chances for future
breaking changes and helps keep the paths through that graph simple
enough that they can be untangled while still understanding what's
going on in your application. If you have repeated experiences where
a dependency breaks and as you're fixing it your thought is "I wonder
what this is used for?", then it is a likely sign of dependencies that
are too deep.

#### IS-A not HAS-A

A common mnemonic for designing object oriented software is *IS-A*
vs. *HAS-A*. IS-A indicates something that is a fundamental
characteristic of the object being defined: an essential part of its
single responsibility which should be modeled with inheritance. HAS-A
represents something with which the object has some kind of
(non-self) relationship and should be modeled with
composition. IS-A and inheritance correspond to implementation: the
abstracted internals where the type used defines behavior. HAS-A and
composition correspond to interactions: the boundaries where the
responsibilities of the object end and related work is delegated
to other objects.

In terms of dependencies this has a clear correlation...if I pull
in a library to make REST calls then it makes sense that it would in
turn pull in an HTTP client library...it IS-A[n] specialized HTTP
client. If, on the other hand, it pulls in some general purpose
library to provide more convenient coding or some essential concerns
like logging, then the library HAS-A dependency on that functionality.
Dragging in its own implementation is more likely to cause issues;
the project may already have another preferred implementation for
that concern, some other dependency is more likely to have a conflict,
and if anything
does go wrong it's going to be a non-intuitive and potentially
frustrating experience. Conflicts will happen: if two libraries that
serve a similar purpose conflict in a way related to that purpose
then it's a reasonable situation and the solution is likely to be
relevant and obvious...if dependencies conflict due to something
like internal metaprogramming libraries then the main project
may be suffering consequences from things it shouldn't have to care
about.

The solution to this problem is to avoid those types of dependencies
for released packages, or define the dependencies on an interface
rather than an implementation. Most languages now provide a rich
enough standard library that this type of interaction could be defined
in terms of a standard protocol. If such a contract does not exist
then dependencies should be declared on API modules which do not prescribe a
particular implementation (which can be explicitly controlled by a
client module). This is enforcing dependency inversion for your
released artifact. Unfortunately this seems to be a relatively
neglected area; solutions seem to be commonly available but under-utilized.

#### Conclusion

Modern dependency management means that most any bit of reusable code
you find on the Internet is only a copy and pasted line away, but even
though that code isn't yours doesn't mean it's not going to end up
being your problem at some point. This applies not only to the
dependencies you pull in but also to the dependencies of your
dependencies, and so on. The languages that we use are becoming more
powerful over time, and as a result we should assess the ability
to simplify projects and make sure to resist blind instant gratification.

When packaging a module for reuse it should be audited to ensure that it
does not include dependencies that are outside of the core concern of
the module and therefore introducing needless assumptions or constraints
about how/where it can be consumed. Dependencies should be minimized,
understood, and documented if not obvious. :golf:
