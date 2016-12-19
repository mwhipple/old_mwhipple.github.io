---
title: Structural Jekyll Elements
post_img:
  src: field.jpg
  title: Clear view
tags:
  - this-site
  - jekyll
---

Jekyll is a great, simple solution for publishing basic Web
sites. It's one of the more popular static site generators and has the
potentially enormous advantage of being able to be published to GitHub
without requiring a pre-push build.

Although Jekyll and Markdown don't get in the way of writing HTML
directly, extending the combination of YAML and Liquid templates can
be more fruitful...but extension options are somewhat limited when
using GitHub pages.

<!--more-->

Dislaimer: I'm likely repeating information found elsewhere but so far I haven't
been bothered to look.

My initial impulse to extend a site that is using a templating
language is to create what amount to new tags in that templating
language. This is a standard feature in most templating languages
including Liquid which is the one used by Jekyll. The plugin mechanism
that allows for the creation of new tags, however, is not supported by
GitHub pages unless you publish an already built site. I'd like to
avoid manually building the site; there are some
advantages to pushing an unbuilt site (such as easier editing through
the GitHub Web UI)...but my main reason is probably just laziness.

### The Problem

The specific element that I wanted to clean up is the image that my
keen sense of design led me to attach to each page
(e.g. the picture of the field on this page). Originally the images
were marked up using a little HTML at the top of each post, which was
killing my Markdown mojo.

### The Fix

GitHub pages allows you the pretty low level stock Liquid tags that
could easily lead you to create an unintelligeble mess. Parameterized
includes are available and can act like ugly functions (I wonder
whether they can recurse...), but more significantly Jekyll provides
a bunch of support to define data semantically in assorted YAML
files. Adopting the right combination of Liquid and YAML allows for a
DRY solution which can be primarily driven by declarative data.

For this particular problem the image is fairly obviously part of the
structure of the page so the relevant bits are moved to the front
matter of that page. This page is using:

{% highlight yaml %}
post_img:
  src: field.jpg
  title: Clear view
{% endhighlight %}

This moves the image out of the content of the page and shifts
responsibility to the enclosing layouts. Presently I don't care much
about this but I do want the same markup in both places so I'll move
the snippet to an include:

{% highlight html %}
<div class="post-img">
  <img src="/images/{{ "{{" }} include.img.src }}"
       title="{{ "{{" }} include.img.title }}"/>
</div>
{% endhighlight %}

Then in the post layout and on the home page listing the above is
used like:

{% highlight liquid %}
{{ "{%" }}if page.post_img %}
{{ "{%" }} include post_img.html img=page.post_img %}
{{ "{%" }} endif %}
{% endhighlight %}

Previously, the posts also alternated between floating left and right
on the home page (another result of my refined sense of design). This
was being done manually but the above approach removes the
alternation.
This could be handled within the iteration, but a far cleaner approach IMO
is providing the right structure and using CSS combinator selectors to
handle that bit of styling.

{% highlight css %}
.post-img {
    padding: 0em 1em;
    float: right;
}
.posts article:nth-child(even) .post-img {
    float: left;
}
{% endhighlight %}

I'm relying on CSS specificity for overriding the position above
but using disjoint selection would probably be a safer option as the
number of styles increases.

### The Horizon

Using the `if` block isn't necessary in this case since the data is
always expected but is important in terms of how this approach could
be enhanced. Jekyll provides several places in which data can be
defined in YAML and these can drive basic Liquid templates in very
powerful ways. The templates in turn should be written in a way that
can be robustly driven by that data. By writing templates that expect
the data to vary the system can evolve to a place where those
templates reliably deliver increasingly variable data within a
consistent declarative framework.
This is an incredibly simple example ending with
a fairly grandioise outline of what could be done...but this is all I
need at the moment. :non-potable_water:
