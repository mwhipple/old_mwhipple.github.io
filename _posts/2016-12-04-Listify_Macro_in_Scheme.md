---
title: Listify Macro in Scheme
post_img:
  src: james-sleighjack.jpg
  title: The check-twice macro may come later
tags:
  - scheme
  - lisp
---

Having [previously mentioned]({{ site.baseurl }}{% post_url
2016-11-22-Why_I_Prefer_My_Macros_To_Be_Hygienic %})
that hygienic macros in Scheme can help enforce a separation of
responsibilities that leaves most of the work to be done at evaluation
time, now I'll provide an example of what a macro can be useful for.

Macros in general can help make sure that the code that is written is
in a form that is consumable at evaluation time. A specific example of this
is making sure that s-expressions that contain only data aren't
evaluated. If a list such as `("a" "b" "c")` 
isn't quoted then Scheme won't be happy at evaluation time. As far as I can
tell there's no quoting behavior which behaves like `list` and works
recursively...so it's a perfect candidate for a macro.

<!--more-->

### The Problem

I'm trying to allow for small configuration definition that allows code like:

{% highlight scheme %}
(defopts group1
  ('opt1 text "default")
  ('opt2 boolean #f))
{% endhighlight %}

where the outer function provides additional context which will be
used while evaluating the nested lists, so they should not be left to
normal evaluation (and would throw an error if left as is).

The nested lists therefore need to be quoted. Simple `quote`ing of the
list does the trick...but a little too forcefully. `'('opt1 text
"default")` results in a list full of symbols where `opt1` is over
quoted, and `text` becomes a symbol rather than the binding that it
previously was. Unpacking this list to get the desired data has become
more complicated, as does allowing for additional logic within the
list. The value of mixing code and data has been lost, leaving only
dumb data. Lisps provide a handy solution for this kind of situation
with quasiquoting which allows for sexps within the list to be
unquoted and therefore evaluated in the appropriate environment...and
this is a perfectly viable solution but it feels a little dirty and is
a step away from the general direction of a DSL in which I'd like to
head. What I really want is a simple `(list 'opt1 text
"default")`, but without having to actually add the calls to `list`.
Adding the calls is also step
away from DSLishness and is fairly noisy (especially if the structure
is nested). Unlike `quote` and `quasiquote` there doesn't seem to
be any kind of special form to apply `list` like behavior to
another list while avoiding evaluation of that list...so time for a macro.

For basic demonstration I'll setup a couple variables that will be
referenced within the created list.

{% highlight scheme %}
(define a 1)
(define b "foo")

(list a b)
$ = (1 "foo")

;; Some quoting examples
'(a b)
$ = (a b)
`(a b)
$ = (a b)
`(,a ,b)
$ = (1 "foo")
{% endhighlight %}

The basic version of the macro would therefore take a list as an argument
and pass it to `list` so that it is not evaluated but the sexps within
the list are evaluated (therefore only avoiding attempting to apply
list). Since `list` exists
primarily to construct lists rather than avoid evaluation it is
normally the function _within_ the list that it is constructing rather
than operating on a list which has been previously defined. 

### `defmacro` Solution

I'll quickly do a more typical `defmacro` style macro for comparison.
Getting `list` into the defined list could be handled easily using splicing:

{% highlight scheme %}
(defmacro mlistify (l)
  `(list ,@l))

(mlistify (a b))
$ = (1 "foo")
{% endhighlight %}

To demonstrate an advantage of hygienic macros, note that the above would break
if the binding for `list` were changed
as the environment within `defmacro` is not closed:

{% highlight scheme %}
(let ([list "uh oh"])
  (mlistify (a b)))
ERROR: In procedure uh oh:
ERROR: Wrong type to apply: "uh oh"
{% endhighlight %}

### Hygienic Solution

This can be also be done fairly easily using a hygienic `define-syntax`
based solution which avoids the possible loss of referential
transparency. `define-syntax` does not provide splicing and is
generally oriented more towards lower level syntactic elements, so
it was not immediately obvious to me how to simply mutate an existing list
(although in hindsight there are a lot of similar examples). With
`define-syntax` you define the pattern you're matching in terms of
keywords, sexps...and braces; by including the braces within the
pattern the contents within the list get bound to the provided identifiers (similar to destructuring):

{% highlight scheme %}
(define-syntax listify
  (syntax-rules ()
    ((_ (l ...))
	 (list l ...))))
{% endhighlight %}

So by wrapping `l ...` in braces they get assigned the contents of the
list which can then be used within the new list which now contains the
call to `list` (list `list` listy `list`).
To demonstrate the improved safety of the hygienic
system, the same ugliness that broke `defmacro` doesn't phase `define-syntax`:

{% highlight scheme %}
(let ([list "uh oh"])
  (listify (a b)))

$ = (1 "foo")
{% endhighlight %}

That macro only handles a single list however...having to call it on
each list certainly isn't much of an advantage over just using `list`
directly so the larger goal would be to handle multiple passed lists
which can be handled with recursion:

{% highlight scheme %}
(define-syntax listify
  (syntax-rules ()
    ((_)
     (list))
    ((_ (l ...) rest ...)
     (cons (list l ...) (listify rest ...)))))

(listify (a b) (b a))
$ = ((1 "foo") ("foo" 1))
{% endhighlight %}

This provides a nice baseline for declarative actual parameters which can be
passed into functions to be sliced up a bit. For a painfully contrived
example we'll pretend we want to write a list of unary functions with their
arguments first:

{% highlight scheme %}
;; Keep the logic in standard functions
(define (backwards l)
  (apply (cadr l) (list (car l))))

;; Insert the call and avoid evaluation
(define-syntax go-back
  (syntax-rules ()
    ((_ l ...)
      (map backwards (listify l ...)))))

;; Sample use
(define dumb '(a))
(go-back (dumb list?) (dumb null?))
$ = (#t #f)
{% endhighlight %}

Hopefully I'll get around to actually pushing some of my lurking work
to GitHub in the not too distant future (and hopefully it seems less
inane than the example provided). :christmas_tree:
