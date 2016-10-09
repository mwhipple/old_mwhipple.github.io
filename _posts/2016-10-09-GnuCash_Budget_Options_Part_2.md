---
title: Hacking on GnuCash (Options, Part 2-Registration)
---

<div class="post-img fr">
    <img src="/images/tasty-options.jpg"
        title="Lobster Truffle Mac &amp; Cheese Bites"/>
</div>

In a [previous post]({% post_url 2016-09-12-GnuCash_Budget_Options_Part_1 %})
I worked on easing the retrieval of option values for a given GnuCash
report. The issue of registering the options is more complicated due
to the divergence in registration logic, but now that will be
addressed by extending the objects developed in that post.

The original option registration code in the budget report is
basically multiple flat lists which scatter the declaration a bit
and doesn't mesh with the more hierarchical result where
options are grouped together. By including the registration logic into the
objects created in the previous post the scattering can be removed and
the single list can be structured to reflect the resultant
grouping.

Much of the standard registration code calls a function of the pattern:

{% highlight Scheme %}
(gnc:register-option
   opt-collection created-opt)
{% endhighlight %}

Where `opt-collection` is all of the options for a given report
definition and `created-opt` is a specific option. In terms of a
method call on an options object this maps to something like
`(opt-object 'register~ opt-collection)` so, working from the outside
in, we can extend the dispatch code previously created accordingly:

{% highlight Scheme %}
(lambda args
  (apply
    (case (car args)
      ((name) get-name)
      ((register!) register!)
      ((value) value)
      (else (error "Invalid method")))
  (cdr args)))
{% endhighlight %}  

Of course this is calling an internal `register!` method which doesn't
yet exist and it is this piece that needs to be specialized for
different types of options. The implementation of `register!` will
depend on the type of option, so it makes sense to capture this
variation of logic in per-type creation functions. Since the
variations are more likely to be based on the option object rather
than the option collection that is passed as an actual parameter, I'll
use an implementation specific factory function that takes the option
information as arguments and returns the function to be used
as `register!`. The final result of the abstract `opt-template` is:

{% highlight Scheme %}
(define (opt-template reg-factory)
  (lambda* (raw-name section . p)
    (let* ((name (N_ raw-name))
           (register! (apply reg-factory (cons name (cons section p)))))
      (define (value r)
        (gnc:option-value
         (gnc:lookup-option
          (gnc:report-options r) section name)))
      (define (get-name) name)
      (lambda args
        (apply
         (case (car args)
           ((name) get-name)
           ((register!) register!)
           ((value) value)
           (else (error "Invalid method")))
         (cdr args))))))
{% endhighlight %}

which when called with a `reg-factory` implementation returns a
constructor for a concrete option type. (I'm hoping for better names
for some of these actors but don't have anything presently and don't
want to force it).

Most of the option types use very similar registration code based
on calling `gnc:register-option` with a provided type, where the type
is the necessary parameter, so this can be
expressed by a function which calls the above and takes that
parameter:

{% highlight Scheme %}
(define (opt-template-simple f)
  (opt-template
   (lambda* (name section . p)
     (lambda (o)
       (gnc:register-option
        o (apply f (cons section (cons name p))))))))
{% endhighlight %}

Now those standard types can be expressively defined in terms of their
`gnc:` provided functions such as:

{% highlight Scheme %}
(define opt-boolean (opt-template-simple gnc:make-simple-boolean-option))
{% endhighlight %}

Those types that require more specialized registration
(such as account selection or price source) or other
initialization logic can provide a richer `reg-factory` during
construction. One possible
snag is that some options (such as display depth) are registered as
arguments to other options rather than actually doing anything
themselves, to handle this case I've used a no-op option type which
does nothing during registration but still serves to hide that
subservience outside of registration.

The options can now be defined in an alist so they can be retrieved as
outlined in the previous post.

{% highlight Scheme %}
(define opts
  `((rollup-budget?
     ,(opt-boolean "Roll up budget amounts to parent" gnc:pagename-display "s4"
       (N_ "For accounts without allocated, sum children.") #f))
    (show-zb-accounts?
     ,(opt-boolean "Show accounts with no values" gnc:pagename-display "s5"
       (N_ "Show accounts with 0 total (recursive) balances")
       #t))))
{% endhighlight %}

All of which can be registered using:

{% highlight Scheme %}
(for-each
  (lambda (e)
    ((cadr e) 'register! options))
  opts)
{% endhighlight %}

Now that things have been DRYed up a bit the definition can also be
more easily organized to reflect their grouping (and the sort order
could be handled automatically). My present approach
is to use `let` blocks for each section all of which are contained within
`apply append` so that the result is the single alist (and leaving
explicit sort order. The `let` blocks also assist with the previously
mentioned no-ops which are created in the `let*` and referenced both in
their alist elements and also the functions for which they are arguments.

When I very first started refactoring the options I had methods to
handle the grouping more expressively, but that was before I'd added
the option retrieval code and switched to objects.
After reaching the present, more complex state I'm of the
opinion that this would be a better job for macros as it is primarily
design time sugar rather than having logical significance...but I've
yet to spend any time with macros in Scheme and the change seems
fairly low value so it will be deferred indefinitely for the time being.
