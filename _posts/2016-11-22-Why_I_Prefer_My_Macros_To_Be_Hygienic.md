---
title: Why I Prefer My Macros to Be Hygienic
post_img:
  src: robben-showers.jpg
  title: Prison showers on Robben Island
---

We've all been there...at some fancy dinner party with delightful
small talk and inevitably the conversation shifts to a discussion of
Lisp macros and the heated discussion begins around the more common `defmacro`
style macros used in Common Lisp and Clojure versus the hygienic
alternative such as offered by Scheme. As the debate rages you slouch down in
your seat and hope everyone is too caught up in their own passion to
ask for your input and expose your ignorance on the matter. 

I'm obviously kidding....there's nothing delightful about small talk.

<!--more-->

### What are Macros

Lisp is an acronym for "List Processing": Lisp programs manipulate
lists...but Lisp programs are also represented as lists. One of the
killer, mind-bending features that this provides is that because
programs operate on the type of structure in which they're contained
programs can operate on programs (including themselves) using the same
basic approaches that are used to operate on any other data. Lisp macros
are a means to do just that: they provide a hook before the code is
evaluated at which a program can operate on the lists that are its
code so that structure can be changed before being executed.

Compared to the code generation/manipulation facilities in other
languages, the fact that Lisp macros are so consistent with more
general programming makes it a more readily acccessible and usable tool.

### Macro Problems

Standard functions in Scheme (and most modern languages) use lexical
scoping which guarantees that the function will operate in a way that
is determined by how it was declared, rather than possibly breaking
due to the environment in which it is called. Macros however are
expanded within the binding environment from which they're called
and therefore naive implementations don't provide that
protection. This can lead to the types of issues that functional
languages strive to avoid: unexpected side effects and lack of
referential integrity. Half of the art of writing Lisp macros becomes
adopting practices to isolate your macro code so that it will
execute in predictable ways regardless of where it is expanded:
but these approaches are incomplete and error prone.

### Hygienic Macros

Scheme (in addition to `defmacro`) provides an alternative in the from
of hygienic macros which cleanly, hygienically avoids these problems
(probably abusing the term "hygienic" there). I don't know the details of
how their implemented but also don't care at the moment (I'm
using them, not implementing them). Rather than dealing with the fully
fledged lists and atoms which make up your program these macros work on
half fledged syntactic elements. There is a more complete isolation
between the environment in which your macro is transformed and the
calling environments; those syntactic elements within the calling
environment must be explicitly referenced to be significant during
macro expansion rahter than having incidental consequences due to
naming collisions.

This system may be much cleaner, but as "half fledged" alludes to it
is not quite as powerul. Although the syntactic elements are
still represented in lists the full power of the language is no longer
available and some things that could easily be done with `defmacro`
become prohibitively difficult. Working with `defmacro` can often feel
like you're working with a superset of functionality: the core
language plus additional tools to help with writing macros; working
with hygienic macros can feel like you've had all of your tools ripped
out of your hands.

### Why I Prefer Hygienic Macros

Which type of macro system is better is a contentious issue in the
Lisp community and they each come with their benefits and
drawbacks...`defmacro` provides greater power and consistency while
hygienic macros provide better safety. My reason for preferring hygienic
macros is largely because they are _less_ powerful. The whole idea of
being able to process your code like any other data applies not only
to `defmacro` macros but also to reflection and
metaprogramming done at runtime: which is the environment that is most
consistent with other code since it only has to be consistent with itself.

A problem with `defmacro` is that it can make it far more
discretionary what can be done with a macro versus what can be done at
evaluation time. This can very quickly lead to abstruse code with
fuzzy boundaries between execution phases and abuses of the macro
system. I'd guess proponents may extol this as a strength of the
system, but one of the biggest strengths I see in Lisp is its
simplicity which I've seen many macros threaten to undermine.

Using hygienic macros provides a safe environment but it also provides
a clear boundary of where to use macros. Although the macro system
itself may not be as powerful it also does not lead a solitary
existence. Using hygienic macros combined with runtime reflection
can lead to a clearly defined system where macros provide minimal
staging of the data that is the code.
The macros remain focused on removing boilerplate and
simple transformations while most of the
logic is left to evaluation time with all of the associated support it
provides. If a macro becomes unwieldly using the basic syntax rules
Scheme provides it's a sign that too much logic is being done before
the code is evaluated and the design should be rethought.
