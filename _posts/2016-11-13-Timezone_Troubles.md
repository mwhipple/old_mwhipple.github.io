---
title: Timezone Troubles
---

<div class="post-img fr">
	<img src="/images/pumpkin.jpg"
	  title="Timezone shifted coaches"/>
</div>

Date and time values are ubiquitious in programming (as in the modern
world). Unfortunately the domain of time is full of quirks which are
not particularly interesting but can get in the way of implementing
what would otherwise be trivial code. This often leads to
brittle implementations which sometimes lead to data mangling.

Java in particular has historically provided classes for working with
date and time values which offer abstractions to lean upon but which
do not protect users from some of the associated dangers. One
particularly subtle issue arises when trying to render/parse values in 
ISO 8601 format which does not have reliable support until Java 7.

<!--more-->

## Handling Time Values in General
Often the simplest and most overlooked solution for dealing with
temporal values is to just handle them as epoch time
values. Epoch/UNIX time is readily supported by a wide range of
platforms and provides a thoroughly proven and reliable
data representation. Issues often arise, however, when more human
friendly formats are desired or required. When dealing with formatted
data, issues can often arise where different timezones are involved at
different points of serialization/deserialization which are sometmes
resolved through quick and dirty solutions. These solutions are
generally not comprehensive and sometimes they involve tampering with
data and likely making it less reliable: leading to a cascade of
workarounds.

Generally the best solution for these issues is to find a library that
properly protects you from these issues: Java 8 provides the new
`java.time` pacakge and for earlier versions the excellent
[Joda-Time](http://www.joda.org/joda-time/) library is available
(if I've ignited burning curiosity about Java time libraries then
[here's some info](http://blog.joda.org/2009/11/why-jsr-310-isn-joda-time_4941.html)
about why Joda-Time didn't end up as the standard and some
of the differences between the two).

## Java <= 6 and ISO 8601

A pernicious issue in pre-Java 7 was handling ISO 8601 formatted
dates, which are generally represented in a format such as
`2016-11-13T19:00:32Z` where the "Z" indicates Coordinated Universal
Time (UTC). Java 7 introduced the `X` placeholder in
[SimpleDateFormat](https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html)
which provides ISO 8601 formatting but prior to that there was nothing
readily available (neither `z` nor `Z` provide
the desired behavior). To get the proper formatting
therefore requires using a literal `Z` in the format:

{% highlight java %}
SimpleDateFormat fmt = new SimpleDateFormat(​"yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"​);
fmt.format(new Date());​
{% endhighlight %}

The above produces the desired output format:
`2016-11-13T19:31:41.627Z` (I've included milliseconds
for later comparisons).  **But** this code
has a huge caveat in that the `Z` in that format has no logical
significance...it is just a literal "Z" which is telling the formatter
to spit out the present time and then put the letter "Z" after
it. The standard says the "Z" indicates timezone and it's easy to
assume that its presence indicates that the formatter is timezone
aware...but it's just the letter "Z".  This can be demonstrated by the
following code representing the communication of two imaginary
systems:

{% highlight java %}
SimpleDateFormat producer = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
SimpleDateFormat consumer = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
consumer.setTimeZone(TimeZone.getTimeZone("America/Los_Angeles"));

Date input = new Date();
Date parsed = consumer.parse(producer.format(input));

println producer.format(input);
println consumer.format(parsed);
{% endhighlight %}

This produces the seemingly correct output:

```
2016-11-13T19:40:19.627Z
2016-11-13T19:40:19.627Z
```

However if we throw an assertion in there (Groovy power assert since
I'm lazily doing this with the
[Groovy web console](https://groovyconsole.appspot.com/)):

{% highlight java %}
assert input == parsed;
{% endhighlight %}

we discover that although the data _looks_ alright it's actually been
mussed up:

```
Assertion failed: 

assert input == parsed
       |     |  |
       |     |  Mon Nov 14 03:43:27 UTC 2016
       |     false
       Sun Nov 13 19:43:27 UTC 2016
```

The underlying data has been shifted by the offset of the two
different timezones (in this case 8 hours). The solution to this issue
is to **always explicitly specify the timezone for your
date formatters**. A simple explanation is that there **is no way to
specify timezone conversion in a date format string**; all of the date
formatters will output the value in the timezone provided for that
formatter (and optionally include the offset information). 

There is nothing inherently wrong with needing to set the timezone
separately as it provides two discrete and focused pieces of
functionality which work together (formatting the date and setting the
timezone)...the danger is that the literal `Z` creates an implicit
dependency of the format string on the timezone of the formatter with nothing
to enforce proper behavior other than careful coding (preferably
encapsulated for re-use). Java 7 provides the more trustworthy `X`
placeholder which will render the "Z" character if the timezone is
correctly set to `UTC`, but will otherwise render the offset data,
thus avoiding cases where the rendered data inadvertently diverges
from the internal representation and thus consistently preserving data
reliability.

## What Happens

My main selfish reason for writing this post is to document what
happens when the above or similar happens. I've seen signs of this
issue often where dates are shifted a number of hours that is some
multiple of the likely offset of server time and UTC. For instance,
there was an issue about a year ago somewhere in the Amazon
ecosystem where shipments were reported to have been
delivered in the future and the difference was a multiple of 8
(the value likely having been shifted multiple times as it passed
through some channel). Whenever I suspect this issue or similar I have to
scribble on scrap paper to get a firm grasp on what a particular positive or
negative shift means in terms of send and receiving data.

As the example above shows (the sender is implicitly UTC and the
scenarios consider _local time_ to have a negative offset (i.e. US timezones)):

* If a _sending_ system is _UTC_ and the _receiving_ system is
_local time_ then the value will be shifted _forward_
* If a _sending_ system is _local time_ and the _receiving_ system is
_UTC_ then the value will be shifted _backward_ :clock9:
