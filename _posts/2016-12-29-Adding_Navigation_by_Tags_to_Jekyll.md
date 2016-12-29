---
title: Adding Navigation by Tags to Jekyll
post_img:
  src: corn.jpg
  title: Good place to Hyde (painfully corny)
tags:
  - this-site
  - jekyll
  - liquid
  - foundation
  - javascript
  - jquery
---

When looking to add tags and tag-based navigation to this site, I
couldn't find an appealing documented solution for Jekyll (without plugins).
Some existing solutions that were discovered provided some ideas
(and in hindsight some large pieces that could have been used), but
most of them seemed to require some ongoing attention or introduce
needless complexity.

I was looking for a simple no-maintenance solution: ultimately 
created through the use of a single page which iterates over the
`site.tags` hash and uses JavaScript for in-page navigation.

<!--more-->

#### Iterating Over the Site Tags

An oddly buried piece of information, which seems to have led to some fairly
clumsy approaches, is how to enumerate the complete
set of tags in a Jekyll site.
An important hint is in the
[Site Variables](https://jekyllrb.com/docs/variables/#site-variables)
section of the Jekyll documentation which outlines the availability of
`site.tags.TAG` to look up the membership for specific tags. Using the
`inspect` filter that Jekyll provides reveals that to be a collection
(there would be other ways to figure that out but they wouldn't
provide the chance to point out the use of `inspect` for tinkering). From
the perspective of Jekyll/Liquid the collection is a list of pairs
where the first element is a tag and the second is the collection of
post objects associated with that tag. Under the hood this is (at
least presumably) a hash which happens to be represented as the pairs
by Liquid; being a hash is significant because it implies that
ordering should not be relied on and so first I'll sort the tags:

{% highlight liquid %}
{{ "{" }}% assign sorted_tags = site.tags | sort %}
{% endhighlight %}

This is relying on some implicit behavior which will sort the entries
of the hash based on the natural ordering of the keys. Sorting may not
be important based on how they are rendered...or another order may be
desired...so this may be useless or may need tweaking or ignoring.

The sorted results are a permutation of the original structure: a
sequence of pairs where the first element is tag and the second is a
collection of member post objects. Knowing the structure makes the
enumeration fairly straightforward (sprinkle in markup to taste):

{% highlight liquid %}
<ul>
  {{ "{" }}% for tag in sorted_tags %}
  <li>{{ tag[0] }}
    <ul>
      {{ "{" }}% for post in tag[1] %}
        <li><a href="{{ "{{" }} post.url }}">{{ "{{" }} post.title }}</a></li>
      {{ "{" }}% endfor %}
    </ul>
  </li>
  {{ "{" }}% endfor %}
</ul>
{% endhighlight %}

The posts within the tags seem to be posted in reverse chronological
order which suits me, though they could also be sorted similar
to the tags.

#### Rendering the Tags in a Single Page

So now that we have the tags, we need to decide where to put
them. On a dynamic site or one where plugins are involved this question
has a lot of options, but with basic static site generation the above
outer loop basically needs to be dumped somewhere. I opted for
creating a single HTML page which includes all the tags but can narrow
the display based on a provided URL fragment. Since I'm (barely) using
Foundation at the moment I: popped over to the
[Kitchen Sink](http://foundation.zurb.com/sites/docs/kitchen-sink.html)
and adopted the "Accordion Menu" as a good widget with which to start
considering the small amount of data; seasoned the above loop with the
relevant markup; made sure Foundation was being loaded at
startup; and then looked into responding to the URL fragment.

But...working with the Foundation programmatically seems to be less than
obvious, at least for a Foundation novice. I hadn't planned on
spending more than a couple minutes triggering the appropriate
behavior, but it probably took about ten minutes and so by the time I
stumbled into a solution by throwing lines into browser console I
didn't bother digging any deeper (with a TODO floating around the back
of my head for if/when I return to the topic). The
half-forgotten, half-blind gist is that Foundation attaches it's own
uber-method to the jQuery protoype object and within that method
there's some kind of plugin mechanism, all while sitting
fairly lightly upon jQuery semantics.

Poking around at some scattered posts and source code led me to
passing the `down` message to the `foundation` method on the root of
the Accordion Menu with an argument that was the jQuery-wrapped appropriate
submenu. In general using dataset attribute selectors would likely be
the safest means of selecting DOM elements since it's what
Foundation seems to use. For the present use I only want to process
the fragment on initial page load, so I'll just tack it on to the
standard `document.ready` handler:

{% highlight javascript %}
$(function() {
    $(document).foundation();

    $("#tag-container")
	.foundation('down', $(window.location.hash).find("[data-submenu]"));
});
{% endhighlight %}

I added the `tag-container` id to the outermost `ul` in the above
block to provide more semantic and unambiguous selection and added an
id of `{{ "{{" }} tag[0] | slugify }}` to the `li` inside the first
`for` loop. Note that `data-submenu` is being added by Foundation at
initialization so this approach ensures that the submenu within the
proper context is selected while limiting assumptions and beginning to
define page components.

#### Conclusion

Now with the tags being rendered and appropriate logic in
place on that page I need only include a link to
`/tags.html#{{ "{{" }} tag | slugify }}`
to plop the user in front of the rest of the posts with the selected
tag. Adding the links like above to the appropriate include referenced
from the appropriate layout(s) keeps everything tidy and out of the way.
As new tags are added they will automagically appear and collect
posts on the tags page and all of the associated navigation should
work.

As the number of tags and/or posts grow I may swap out the widget on
the tags page or add other navigational aides (and may switch to
relying on HTML5-y fragment based navigation), but for now this
handles what I'm looking for. I'll probably throw a tag cloud together
at some point since I like 'em (I feel like they may be dated now but
I'm too out of touch to know). :cloud:
