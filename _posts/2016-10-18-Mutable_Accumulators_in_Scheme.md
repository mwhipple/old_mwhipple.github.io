---
title: Mutable Accumulators in Scheme
post_img:
  src: flowers.jpg
  title: Flowers mutate and accumulate
---

Scheme is agnostic about immutability....I prefer it
in Lisps since it seems to fit the structure of the language well
while code that mutates state can seem clunky,
but I may have just drank too much immutability Kool-Aid.

Sometimes, regardless of ideals, mutability makes sense and in those
cases the mutable values should still be handled in an organized way
rather than defaulting to global variables or the sprawling binding
environments that using `set!` by itself may invite. Here's an
approach I adopted to put a tighter rein on some of that potential
chaos.

<!--more-->

Passing structures that contain mutable values (i.e. where
aliasing is in play) do not suffer from this organizational challenge;
the problem arises when bindings are being mutated through means such
as `set!` (which are likely pointing to
underlying values which are immutable). 
Using `set!` to manage shared state like this requires
anywhere that updates the state to have access to the same binding:
preventing modularization and likely to introduce implicit dependencies.
The specific design in question is from the
GnuCash budget report (mixing things up).

The GnuCash reports were written in the dark ages when HTML
standardization was a pipe dream, tables were everywhere, and CSS was
a curiosity that couldn't be trusted to actually behave in
browsers. Accordingly there is significant logic tangled throughout
the reports to render HTML tables and inline styling. Keeping track of
the present coordinates within the table are a simple example of the
above issue. The original report uses a large tract of
code contained within one binding environment with intermingled state
mutations. (Of course a better solution would be to bring the
reporting system out of the 90's and use semantic markup...
I'm chipping away at but this is an interim step).

So rather than relying on a single binding environment I want
something I can pass around. In general shared state like this will
have fairly defined state transitions so I'm also going to write the
code with that in mind: an input value is provided and
the internal state is updated accordingly (the implementation is
much simpler than the description). Right now I'm abusing the name
`accumulator` for the pattern until I think of/steal better names.

{% highlight Scheme %}
(define (accumulator f init)
  (let* ([accum init])
    (define* (updater #:optional val)
      (if val
          (begin
            (set! accum (f accum val))
            updater)
          accum))
    updater))
{% endhighlight %}

The above accepts a function and an initial value and effectively
allows for lazily `fold`ing provided arguments and also de-referencing
the present value when no arguments are passed.
I'm giving the identifiers a convention of
appending a `@` since it kinda looks like a peg that could be moved
around (squint a little).
The mentioned table coordinate tracking is done with objects like
like:

`(col@ (accumulator + firstcol))`.

The present
column could then be retrieved with `(col@)` and the value incremented
with `(col@ 1)`...or incremented and retrieved with `((col@ 1))`. Now
`col@` can be passed as an argument to functions regardless of their
owning context and the state can be properly updated within the
body of those functions. The bundling of "using up" a column by
referencing it and incrementing it also cuts down on the visual
clutter allowing for calls such as

`(set-col-data (row@) ((col@ 1)))`

rather than requiring an additional line to update the value of
`col@`.

The above is a very simple implementation and surely be made far more
powerful but it scratches a couple immediate itches. In addition to
the table location tracking I'm also using it for keeping track of
running totals in GnuCash by using accumulators with `gnc-numeric-add`
and `gnc-numeric` parameters.

### Update (2016-11-06)

I've decided to spend some quality time formally learning Scheme,
and this approach is (not surprisingly) fairly standard and
seems to be a slight extension of `make-counter` desribed in
[The Scheme Programming Language by Kent Dybvig](http://scheme.com/tspl4/start.html). :hibiscus:
