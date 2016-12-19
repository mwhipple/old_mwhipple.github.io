---
title: Assessing MongoDb Text Search
post_img:
  src: mongo-hoodie.jpg
  title: Mongo swag
tags:
  - mongodb
  - databases
  - information-retrieval
---

Versions of MongoDB since 2.4 have integrated supported for full-text
searches...but just how useful is it? It certainly offers greater
convenience than a dedicated search solution but a cost is paid in
some significant limitations.

<!--more-->

A while ago I worked on a solution using the text index feature in
MongoDB. The specific implementation was to basically impersonate a
full featured text search solution by parsing a Lucene-style query and
converting that into a format that MongoDB could understand. Creating
the text index was incredibly painless, as was issuing simple queries
against that index. The size of the index was also reasonable, though
the collection size was not large enough for that to be a concern and
the indexed fields were of a short length. Compared to the
assorted types of overhead of launching a full blown text search
solution this could be a big win.

However, as I mentioned the specific logic was to take a Lucene
style query and execute it using the MongoDB text search and (even
before considering advanced Lucene query types) Lucene
has a far richer query syntax than what the MongoDB text search
provides so a square was still needed for the circle. A
decent amount of logic had to be added to allow mixing of key/value
pairs where the field is specified and "default" values which
correspond to the text index. A subtle limitation is that the
text index can only be used _once_ per query which means that some
queries will not be supported such as `(name:foo AND bar) OR (name:bar
AND foo)` which would require two `$text` lookups for the appropriate
grouping. There are other limitations such as `$text` not allowing
for ANDing the provided terms.
`$text` lookups can also only be combined with other indexes
but MongoDB's query planner is also _very_ simple so it needed some
additional help to see indexes which should have been implicit
(i.e. distributing clauses across a query tree rather than expecting `$and`
to help). The code itself for this problem revolved around using the
modular Lucene parser against the original query and then visiting the
parse tree and converting it to an equivalent MongoDB query (and
sprinkle in some fun tricks with Groovy). Due to the single `$text`
lookup limitation mentioned above, the default/`$text` terms are
grouped whenever possible but if there are such clauses in multiple
places in the tree which cannot be safely grouped an exception is
thrown (as in the example above).

So...at this point there's some funky logic but everything's probably still
coming out ahead of rolling a full blown text-search solution (and
some of the other features like relevancy sorting  seem to be working
well). With systems like the Lucene family or Endeca (or others but
those are the two I've been exposed to) not only are you likely to
need a different server but you also have to jump through hoops to
configure your index and likely how queries are executed. BUT...the
lack of those hoops should have set off alarms (a lesson I learned
later). The reason that all of those knobs exist is to help with
the battle to efficiently implement diverse information retrieval use
cases in the face of how limited the underlying technologies are. If
your requirements evolve (as rare as that is :/) then you're stuck
with a system that is not going to help you adapt.

MongoDB's text search offers tokenization and stemming...and that's
pretty much it. Neither the index nor the query engine seem to offer
ready customization so if your needs don't align with what is very
specific text search behavior then you'd have to implement further
functionality around that core (some of the
earlier mentioned limitations could similarly be worked around)...but
that's a short path to diminishing returns.

This is all covered in the
[MongoDB documentation](https://docs.mongodb.com/master/core/index-text/)
along with other knobs that cannot be turned.

I am glad to have had the experience with the MongoDB text index but I
can't say I'd be likely to use it again because of how blackboxed
everything is. The solution above was developed as a stopgap while
a Lucene based full text search infrastructure  was being refined
so the issues will be resolved that
way, but for similar cases I'd be more likely to use an indexed array
of tokens produced by appropriate analyzers which would then at least allow more
direct access to the index: possibly a key/value pair of term and
frequency to fake an inverted index with some aggregation pipelines to
do relevancy sorting (I'd also first look more closely at
[lumongo](https://github.com/lumongo/lumongo)). So far it seems like
a more homegrown solution provides more flexibility until it
would start to get unwieldly at which point the MongoDB text index
would also not be up to snuff and it would be time to use a real
full text search solution. If the additional flexibility is not
desired or designing a more custom index solution is out of reach
then the provided MongoDB text search may be a good fit.

Ultimately I'm disappointed that this seems to be related to but
outside of the core domain of what MongoDB provides and could
therefore be a great opportunity to engage the open source community
to create or contribute to a potentially innovative solution but
instead there's an offering which seems just powerful enough to add a
bullet point to a sales sheet. :mag:
