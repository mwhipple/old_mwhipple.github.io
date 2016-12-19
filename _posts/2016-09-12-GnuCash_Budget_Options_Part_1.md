---
title: Hacking on GnuCash (Options, Part 1-Retrieval)
post_img:
  src: options.jpg
  title: Options on a mountaintop
tags:
  - gnucash
  - scheme
  - lisp
---

As outlined [here]({% post_url 2016-09-01-Hacking_on_GnuCash %}), I'm
spending some time noodling around with GnuCash to attempt to bend it
to my wishes. Presently, I'm focusing on tweaking the provided
budget report a bit with the larger goal of making report authoring
an overall more pleasant experience that utilizes some more
modern technologies. The grand vision/possibly interesting
things will be covered in later posts, but for now I'll be
getting my feet wet with Scheme.

When trying to get my head around the original budget report, one of
the first obstacles was processing the way options are handled,
starting with looking up option values (I actually ended with value
retrieval but its simpler logic than registration). So here's some
scheming to try to make that a little more readable (for me at least).

<!--more-->

A standard option look-up is some derivative of:

{% highlight Scheme %}
(gnc:option-value
  (gnc:lookup-option
    (gnc:report-options report-obj)
    gnc:pagename-display optname-show-zb-accounts)))
{% endhighlight %}

A single option lookup therefore requires three variables:
`report-obj` which is the present incarnation of the report and both
the section name and the option name (represented by
`gnc:pagename-display` and `optname-show-zb-accounts` respectively)
to retrieve the value of a given option. The latter two parameters
effectively represent a compound identifier with no enforced
association. Given that they're both simple strings, there's also
not an overly good place to provide option specific feedback during look up.

What I want is a single handle that can be used to keep more of
that logic bundled together (a.k.a an object). We can start with some
basic dispatching logic to get back the name for the created object:

{% highlight Scheme %}
(define (opt raw-name section)
  (let ((name (N_ raw-name))) ;internationalize
    (define (get-name) name)
    (lambda args
      (apply
        (case (car args)
          ((name get-name))
          (else (error "Invalid method: " (car args))))
        (cdr args)))))
{% endhighlight %}

The above creates a closure around the provided name and section,
and returns a function which will dispatch
to a nested function within the closure based on the first parameter, for
instance: `(define opt-foo (opt "Foo" (N_ "Sec1"))) (opt-foo 'name)`.

There may be other, possibly better, options to handle the object style
behavior started above such as using either records or GOOPS...but as
I'm not presently familiar enough with the approaches to choose one
over the other, I'm starting with the one based on the most basic
functional approaches. I may revisit the decision after becoming more
familiar with Scheme/Guile but that would just happen incidentally
since the present approach works and I'll only be diving more deeply
into the related solutions somewhat passively.

The report object isn't really owned by the option and so must be
passed as another argument. The `apply` above will forward the
rest of the parameters appropriately to the nested function so
defining a `value` method only needs a new entry in the `case`
and the new nested method which is basically the same code from the
beginning of this post but using the variables bound within the closure:

{% highlight Scheme %}
(define (opt raw-name section)
  (let ((name (N_ raw-name))) ;internationalize
    (define (get-name) name)
    (define (value r)
      (gnc:option-value
        (gnc:lookup-option
          (gnc:report-options r) section name)))
    (lambda args
      (apply
        (case (car args)
          ((name) get-name)
          ((value) value)
          (else (error "Invalid method: " (car args))))
        (cdr args)))))
{% endhighlight %}

And now the value can be retrieved with a call like `(opt-foo 'value my-report)`
without having to worry about preserving the association with the
section name...

Calling it that way is still kinda ugly though; there's a chance that
there's going to be multiple report objects floating around but most
likely there will be one for which a bunch of options will be looked up.
Putting the options in some kind of container can also keep them from
running amok all over the global namespace and allow for some basic
sanity checking, so we could also enclose a report object and an
option container (using an alist):

{% highlight Scheme %}
(define (opts-for-report r opts)
  (lambda (o)
    (let ((opt (assoc-ref opts o)))
      (if (not opt) (error "Option " o " not found in " opts))
      ((car opt) 'value r))))
{% endhighlight %}

Which can be used like:
{% highlight Scheme %}
(define report-opt (opts-for-report report-obj my-opts))
(report-opt 'foo)
{% endhighlight %}

Ta-da! A look up mechanism that is neatly contained, expressive,
and provides a slightly better chance of triggering fat finger alerts
earlier and more loudly (thereby fighting the good fight against `#f`
gremlins). The ease with which options can be retrieved can also impact
the style used in the report...if it's cumbersome to look up options
then they are more likely to be done in bulk and passed around as
unpacked values. However if the look up function such as `report-opt`
is passed around instead it can lead to more focused function
signatures and a clear indication that a particular decision is based
on a report option. Passing this object around may be sometimes good,
and sometimes not, but now laziness may be less of a factor.

The above code by itself doesn't help with option
definition/registration and could lead to painful code or segmented
logic... :moneybag:
