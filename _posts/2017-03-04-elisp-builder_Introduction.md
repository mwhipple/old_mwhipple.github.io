---
title: elisp-builder Introduction
post_img:
  src: lego-train.jpg
  title: Not quite a train, not quite Legos
tags:
  - java
  - lisp
  - elisp-builder
  - gradle-emacs-jdee
---

Generating Lisp from Java...A contrived interview programming interview
question? A self-indulgent way to nerd out?

I do have a reason to undertake this that has a practical
application (albeit maybe still self-indulgent). I'm not doing
anything too elaborate and don't even need to be able to evaluate the
code. I threw together a
[Gradle plugin](https://github.com/mwhipple/gradle-emacs-jdee)
a couple years ago to help in
writing Java projects using Emacs with JDEE so I'm looking for a good
way to programmatically build the Lisp code which can be rendered 
to be later evaluated by Emacs. I'm not presently using JDEE,
but the plugin is being used by others and I do have plans to revisit
JDEE now that it seems to be getting renewed attention
(which working on this plugin will likely compel me to do).

<!--more-->

Background
---
When using a build tool like Gradle which is normally used to model
all of the aspects of a project build, it makes sense to also use that
tool to generate some of the configuration files for the editors being
used to develop that project. In the case of JDEE (or Emacs in
general) these configuration files are Lisp files which, although may
be executable code, are basically serialized data from the
perspective of Gradle (and with Lisp the line between code and data
is thin or non-existent regardless).

Presently the
[gradle-emacs-jdee](https://github.com/mwhipple/gradle-emacs-jdee/blob/master/src/main/groovy/com/mattwhipple/gradle/JdeePlugin.groovy)
plugin is using a combination of string concatenation and
the general Groovy NodeBuilder, which works decently but leads to an
incomplete representation of the data structure from the perspective
of the code as the strings are effectively opaque.
The segmented representation of the structure leads to a system that
will become increasingly scattered as
it grows and does not enforce well-formed output.

There is an existing Groovy builder for Lisp that I originally looked at
([https://github.com/uehaj/LispBuilder](https://github.com/uehaj/LispBuilder))
but it seems to use a syntax that ends up somewhere between Groovy and
Lisp: somewhere that seems unfamiliar and scary (and it is also
appears to be stale).

At this point I feel familiar enough with the metaprogramming
facilities that underlie builder creation in Groovy to tackle
a better solution to this problem, though as of yet I'm not entirely
sure what that solution will end up looking like. My initial goal is to keep
things small and simple to match the scope of its intended use.

The first step as alluded to above is to represent the code as a
consistent data structure. This is being done in Java because it can
be, and because I've had a couple too many times lately when I've had
Groovy code that I wanted to re-use in non-Groovy JVM project
but didn't want to introduce Groovy as a dependency. The
product of this module will be a fairly simple but verbose way to
construct Lisp code output.

After that a Groovy builder to absorb some of the noise will be
added. The idea of supporting writing Lisp in Groovy is not
unreasonable and could likely be done through some earlier stage
compile time metaprogramming if higher level approaches fail.
However, even though Lisp syntax may much simpler to deal with
than other languages it's still way more complicated than not dealing
with it, so if more accessible solutions don't work then the syntax
will land closer to Groovy's for the foreseeable future.
There are some interesting possibilities arising from the
combination of standard parentheses behavior, runtime metaprogramming,
and method chaining that could provide support for very Lisp like
syntax...but I'll need to experiment to see how far that can go.

Next up I'll cover modeling basic Lisp code in Java.
The current state of the code is available on
[GitHub](https://github.com/mwhipple/elisp-builder).
