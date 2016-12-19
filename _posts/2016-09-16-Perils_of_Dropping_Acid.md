---
title: The Perils of Dropping ACID Transactionality
post_img:
  src: walter-bishop.jpg
  title: Sometimes dropping helps, othertimes not so much
tags:
  - mongodb
  - databases
---

ACID compliant transactionality has been part and parcel of
RDBMS-backed enterprise software development for years, but its absence or
relative incompleteness is also one of the major trade offs of using one of the
newer breeds of NoSQL databases.

Transactionality introduces a hefty cost: a cost that seems often
disregarded by enterprise developers even though it should be apparent
if the functionality provided is thought through rather than being
written off as something the database "just does'. Even before getting
to bits about scaling and sharding and the CAP theorem: transactions
are expensive and incur a significant performance hit...so I also look
forward to the opportunity to try avoid them.

<!--more-->

Sometimes avoiding transactions and embracing some kind of
event-sourced, eventually-consistent other-new-buzzword system can be
easy, but other times you need some of the more traditional
transaction semantics. The
challenge then becomes how to model the state within your data so that
things may not be fully consistent internally but
do not become exposed in an inconsistent representation. I
just wrapped up spending a couple weeks at work writing such a system using
MongoDB, and using the tools it provides to perform atomic operations
with mostly
[compare-and-swap](https://en.wikipedia.org/wiki/Compare-and-swap)
style behavior (the particular logic involved operations involving
multiple documents which is outside of provided transactional boundaries).

By the end of the work I discovered a newfound appreciation for
ACID transactionality: designing some core pieces of your business
logic in a way that avoids what can be very clunky transactionality
can be a lot of fun and provide valuable insight into your business
model...having to think through that same stuff for all of ancillary
calls can be an exhausting nuisance. After a couple weeks I found
myself staring at my monitor at some trivial bit of supporting
logic...or at least it would have been trivial if I didn't have to
think through the different possible ways any of the data could
end up in a potentially inconsistent state if something unexpected
happened. I then realized what I was missing most about ACID
transactions was not that they helped make sure the primary pieces of my
app were holding together the right way, but that they helped keep the
amount of work for the secondary, etc. pieces in proportion to the
importance. The overhead of transactions suddenly seemed a much more
worthwhile price to pay.

There are libraries and approaches to add ACID transactions to
some of the NoSQL stores including MongoDB, but
I'm not about to cash in my chips on avoiding them;
it should get easier as recipes are acquired and a lot
of the approaches to ensure consistency are of general use for things
like concurrency. Presently I count it as exhausting time well spent. :droplet:
