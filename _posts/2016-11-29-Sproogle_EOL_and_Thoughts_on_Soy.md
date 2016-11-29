---
title: Sproogle EOL and Thoughts on Google Closure Templates
post_img:
  src: birdhouse.jpg
  title: Injection of Spring
---

Several years ago I threw together
[Sproogle](https://github.com/mwhipple/sproogle) which is a project to
integrate Google Closure Templates as a View technology for Spring
MVC. As part of tidying up some of my GirHub presence I'm now
officially end-of-life'ing the the long neglected code base.

Here's a little more info and some thoughts on Google Closure
Templates resulting from working on the associated project.

<!--more-->

### Sproogle EOL

Sproogle was used for a decently large project at my last job and held
up pretty well...in fact one of the contributing factors to the age
of the last commit to the repository is that the system is
extensible enough that most problems encountered were able to be
resolved quickly and relatively cleanly using the available extension
points without requiring changes
to be pushed back upstream (and at that time I did not have the time
or incentive to do so without necessity). At this point the code has been
untouched for quite a while, I no longer use the associated
technologies, and there is a far more viable alternative with
[spring-soy-view](https://github.com/matiwinnetou/spring-soy-view). My
last goal with Sproogle a couple years ago was actually to merge it into
spring-soy-view but a job change and my son being born kept me away
for long enough that I'm now going to just abandon the project
outright.

### Thoughts on Google Closure Templates

[Closure Templates](https://developers.google.com/closure/templates/)
are a portable template system which offer a more comprehensive view
solution than alternatives like Mustache. It was originally adopted in
the previously referenced project for a very specific role:
augmenting content in very controlled ways in the front
end with the option that that enrichment could be pushed to the
backend. It was then adopted as the view
technology throughout since my boss at the time chased silver
bullet solutions. AngularJS was also introduced into the same project
and the content augmentation was ultimately shifted to AngularJS templates as
developers grew more comfortable with it and we became unencumbered
by the thread of having to support ancient IE versions.

Closure Templates provides a nice set of tools for managing views once
they are well understood. The portability, unfortunately, introduces
significant indirection and associated cognitive overhead to achieve deep
understanding. While most templating technologies can be fairly
closely aligned with the languages/platforms upon which they sit,
Closure Templates needs to stay closer to the middle.

Perhaps the most notable value Closure Templates can provide is that
data can be rendered consistently in the front end or the back end,
thereby allowing seamless delivery of rendered data either through a
full page request or an AJAX request. This allows for the first
request to receive rendered content from the backend but then
subsequent navigation to use fancier HTML5'y stuff. If you're building
something like an ecommerce site where you want to make sure Web
crawlers find all of your content (or anyone using an old browser or
who has Javascript disabled), but still want to offer a more modern
feel within the site then this could be very, very helpful.  Several
years ago this utility may have also been a useful technique for
progressive enhancement...and it may also help with accessibility
concerns.

It seems like for most cases, however, the aforementioned complexity
would not be worth it. Other templating solutions are far simpler and
unless the above scenarios really align with some of the issues your solution
is looking to address it is unlikely that upfront costs will fully
amortize. Additionally, embracing the _portability_ carries the
limitation of being tied to the supported platforms and it doesn't really
fit in with the more forward facing design of backends providing semantic
APIs and the presentation of and interaction with data being provided
by client code. As that approach becomes more standard and more
supported within the Web ecosystem the value of freshly adopting
Closure Templates will continually dwindle. It seems probable that
freshly adopting it even now is too unlikely to be worth it to
justify the risk. There is a bunch of stuff I don't have info on to
support that (like what SEO looks like nowadays and similar
Webmaster concerns)...but all that stuff is off my radar
for the foreseeable future and therefore so is Closure Templates. :fire:
