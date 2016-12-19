---
title: Checking the Size of a Collection in RSpec
post_img:
  src: horizon-mountains.jpg
  title: Sometimes it can be hard to gague length
tags:
  - ruby
  - rspec
  - testing
---

Verifying the length of a collection is a common need when writing
tests, but doing so in newer versions of RSpec is something for 
which I had to stumble around a bit before finding a solution I
liked. Like many other pieces of RSpec it can be handled nicely by the
built-in matchers if you know how to yield them effectively, but my
relative inexperience with Ruby combined with the relatively low
priority of my attention to RSpec led me to defer attempting to adopt
`have_attributes` for that purpose until recently...but now it's a key
piece in my attempts to write more expressive tests.

<!--more-->

Back in the earlier days of RSpec when such problems were only a
monkey patch away there was a nifty matcher for this test in the
[Have(n).items matcher](https://www.relishapp.com/rspec/rspec-expectations/v/2-14/docs/built-in-matchers/have-n-items-matcher),
and this is also available for the latest versions in a
[separate project](https://github.com/rspec/rspec-collection_matchers)
(written by some of the RSpec devs). Based on activity
and CI status however, that project seems dormant.
I suspect (without any evidence or real knowledge),
that it is a port of the behavior from RSpec 2.x for backwards
compatibility and may not be in-line with some of the more modern
RSpec design...but in any case I moved away from it after getting some
deprecation warnings related to the used signature of 
[respond_to?](https://github.com/rspec/rspec-collection_matchers/pull/33/files)
which led me back to find an acceptable solution within the main RSpec kernel.

A straightforward approach to test for length is to just treat that
attribute as the subject of the expectation:

{% highlight ruby %}
expect(value.length).to be 1
{% endhighlight %}

This bothers me a bit in terms of conceptual purity and
readability...but it also has some practical drawbacks. Because the
dereferencing of the `length` attribute is attempted before the
the matcher is evaluated the feedback cannot be as useful. A quick
test of attempting something similar with the value set to `nil` yields:

{% highlight ruby %}
     Failure/Error: it('fails') { expect(value.length).to be 0 }

     NoMethodError:
       undefined method `length' for nil:NilClass
{% endhighlight %}

The `NoMethodError` _coincidentally_ fails the test. The feedback also
happens to be useful...but to highlight the frailty of the logic if
the code is wrapped with a `rescue` block the test *passes*. In more
complicated tests where the control flow of the test itself evolves,
this could lead to loss of useful feedback.

Another practical, though more stylistic, disadvatange of this
approach is that because the subject is shifted it inhibits compound
matchers. Compound matchers can help greatly in pursuing a single
`expect` call per `it` block and testing collection length in
particular can be very useful when combined with other expectations
such as using `all` for property based testing or `include` for
membership testing (example at end).

RSpec 3.x (at least...maybe earlier also) does provide a
`have_attributes` matcher which will perform the associated
indirection while evaluating the matcher, and is therefore able to
provide better react to unexpected inputs.

{% highlight ruby %}
expect(value).to have_attributes(length: 1)
{% endhighlight %}

When passed `nil`, an analog for the above yields:

{% highlight ruby %}
     Failure/Error: it('fails') { expect(value).to have_attributes(length: 0) }
       expected nil to respond to :length with 0 arguments
{% endhighlight %}

The message is slightly more emphatic, but more importantly it is
being returned approriately by the matcher so this behavior
remains consistent if the `rescue` block is added
to the test (more human friendly feedback could be provided by a thin
custom wrapper around this check).

Normally I'd prefer using the more explicit `:length => 0` hash syntax
in this type of case, but the above can also be used with other
comparison operators and the fat comma/hashrocket can add a couple too
many brackets/equals signs for my taste.

{% highlight ruby %}
expect(value).to have_attributes(length: be >= 1)
expect(value).to have_attributes(length: be > 1)
expect(value).to have_attributes(length: be <= 5)
expect(value).to have_attributes(length: be < 5)
{% endhighlight %}

The above provides a superset of the functionality available in
older RSpec and the previously linked `rspec-collection_matchers`
project but in a style that is less human oriented (though I prefer the more
explicit description of what is being tested). The one operation
missing is inequality which doesn't seem to be readily available but
could be easily done using either `to_not`, using a `<` and `>`
`.or`ed together...or using a
[negated have_attributes matcher](https://www.relishapp.com/rspec/rspec-expectations/v/3-5/docs/define-negated-matcher) (which I'd most likely
go with if I expected that to be a common test).

To wrap up with an example of using the above with a compound matcher:
here's an example of testing the result of a call for a single result
with a known `id`:

{% highlight ruby %}
expect(get_result)
  .to have_attributes(length: 1).and include(include('id'=>'foo'))
{% endhighlight %}

The second test is that the list should include an item that includes
an id of `foo` (I have plans to write a post about the many uses of
the `include` matcher).  Combined with the length test, this asserts
that the result consists of that single entity.
As the constraints grow the above pattern allows them to be expressed
very succinctly, particularly when combined with custom domain
specific matchers.

Using `have_attributes` for length testing isn't overly
readable, particularly when using the forms with the comparison
operators...but it's a good
showing of how testing needs can be satisfied by
the built-in matchers that RSpec provides. `have_attributes` is a key
piece in using RSpec as an expressive testing framework which can
provide a powerful and expressive set of lean tools which can be used
directly to keep tests explicit, or smoothly combined to create domain
specific definitions.
