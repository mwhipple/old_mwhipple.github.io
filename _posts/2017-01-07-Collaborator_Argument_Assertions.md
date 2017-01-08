---
title: Spock Recipe - Collaborator Argument Assertions
post_img:
  src: snow_day.jpg
  title: The View Outside While Writing
tags:
  - testing
  - groovy
  - spock
---

The [Spock](http://spockframework.org/) testing framework is likely my
favorite general purpose testing library: it allows for clearly organized and
expressive tests without introducing a notable departure from writing
standard code (and Groovy helps make the coding part enjoyable for
many target JVM languages).

In the course of using it for several years I've adopted some techniques
which use the provided tools in ways which extend beyond standard
documented approaches. One of these is an alternate way to check on
arguments that the unit under test passes to a collaborator so that
better feedback is returned on failure.

<!--more-->

Spock provides a great set of test double type behavior for
[interaction based testing](http://spockframework.org/spock/docs/1.1-rc-3/interaction_based_testing.html)
(the page was f.k.a. "interactions" which I'll lazily use below);
the mocking and stubbing functionality can be combined to conveniently
either isolate the local behavior from possible collaborator or to
verify that the interaction with those collaborators is satisfying
expectations. Unfortunately the syntax can be a little awkward and the
feedback confusing if you want to do something like do property based
testing on an argument that is being generated within the body of the
class.

For a focused example I'll use a class that handles a `Message` object
which would presumable contain some kind of payload in addition to
some kind of data used by the system over the course of handling the
message (written in Groovy for ease though Spock is good for any JVM language).

{% highlight groovy %}
import groovy.transform.TupleConstructor;
import java.util.concurrent.atomic.*

class Message<T> {
  T content
  String id
}

interface MyWorker {
  void doSomething(Message myArg)
}

@TupleConstructor
class MyDispatcher {
  final MyWorker worker;
  final AtomicLong sequence = new AtomicLong()

  void handle(Message input) {
    input.id = sequence.incrementAndGet().toString()
    worker.doSomething(input)
  }
}
{% endhighlight %}

#### The Problem

When writing a test against such a system it may make sense to use
property based testing for the arguments to `Worker`; it may not be
worthwhile to fully isolate all the potentially variables within the
tests, or it may be more valuable to verify some of the behavior
with tests that integrate a more complete view of the system. In any
case there should be a goal to specify particular behaviors without
over-specifying and thereby making the tests more brittle and a less
useful source of documentation about the system. Using the above we
could specify that the `Worker` is called with a `Message` that contains
the originally provided content.

Using basic Spock interaction constraints, this could be done with:

{% highlight groovy %}
import spock.lang.*
class MyDispatcherSpec extends Specification {
  MyWorker worker = Mock()
  MyDispatcher dispatcher = new MyDispatcher(worker)

  def 'passes arg with random to worker'() {
    when:
    dispatcher.handle(new Message<String>(content: 'foo'))

    then:
    1 * worker.doSomething({it.content == 'foo'})
  }
}
{% endhighlight %}

The above is easily manageable. The constraint however can quickly
start to get hairy if multiple constraints are included against an
argument.  If we change the above to `{it.content == 'foo' && it.id}`
and then remove the line that sets the id...now the test is failing,
but the message is less than helpful:

{% highlight groovy %}
Too few invocations for:

1 * worker.doSomething({it.content == 'foo' && it.id})   (0 invocations)

Unmatched invocations (ordered by similarity):

1 * worker.doSomething(Message@71bfc0b4)
{% endhighlight %}

It would be more helpful if `toString` is implemented on
`Message` (easily done with Groovy using
one of the standard
[AST transformations](http://docs.groovy-lang.org/2.4.7/html/gapi/groovy/transform/package-summary.html)
(`@Canonical` would work well for the above),
but that's a band-aid that's likely to wash off. It may not be
possible, or the difference may not be noticeable in the stringified
representation...nor does it help the verbosity creeping in to the
argument constraint. Perhaps most significantly the message above is
largely easy to track down because of the simplicity of the class
involved...in a more complex class with a large number of
interactions the cause for failure may be buried.

Spock provides *argument constraints* when
often what is really desired are *argument assertions*. The constraint
syntax indicates that the `Mock` will respond to a method call
matching the provided criteria and the response indicates that no such
call was made. But...sometimes we want to ensure that the `Mock`
responds to a given method call and that when that call is made the
argument satisfies conditions. It's a subtle distinction that I think
I had a clearer way to express a week or so ago but have now
forgotten. It's the difference between "expect this method to be
called with a matching argument" vs. "expect this method to be called, and
when it is called the argument should satisfy this". The Spock
[interactions](http://spockframework.org/spock/docs/1.1-rc-3/interaction_based_testing.html)
documentation page includes some notes about how the `Mock`s work in
terms of pattern matching which can also help elucidate this.

#### The Recipe

Fortunately Spock can also handle the _argument assertion_
functionality by hijacking its ability to generate return values
for `Mock`s based on `Closure`s (also covered on the interactions
documentation page):

{% highlight groovy %}
  def 'passes arg with random to worker'() {
    when:
    dispatcher.handle(new Message<String>(content: 'foo'))

    then:
    1 * worker.doSomething(*_) >> { args ->
      assert args[0].content == 'foo'
      assert args[0].id
    }
  }
{% endhighlight %}

Now the above test fails with the _way_ more helpful:

{% highlight groovy %}
Condition not satisfied:

args[0].id
|   |   |
|   |   null
|   Message@10bb68ec
[Message@10bb68ec]
{% endhighlight %}

This exposes all the power of assertions available elsewhere. If you
need the `Mock` to also return a value, it should just be the last line
of the `Closure`, or an explicit return as usual (I'd also add a space
between the assertions and the return).

This provides much better feedback on failure and can also foster
better verification of provided arguments through lowering the pain
point.

#### A Single Tool in the Toolbox

The example and therefore solution above is still pretty simple and
could not handle more elaborate use cases by itself. But...when
combined with some of the other facilities provided by Groovy it can
help with a large range of problems. Within the `Closure`s external
state can be accessed to provide more contextual assertions.
The `Closure`s can be combined with the assorted
constraints so that the pattern matching directs the calls to the
appropriate assertions, and it can be used with techniques such as
storing the arguments in data structures so that validations can be
done against the sum of all of the calls made (particularly useful for
testing multi-threaded/asynchronous code)...which is likely to be
covered in a later post.
