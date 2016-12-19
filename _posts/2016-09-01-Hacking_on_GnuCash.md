---
title: Hacking on GnuCash (Origin Story)
post_img:
  src: gnu.jpg
  title: A gnu in the wild
tags:
  - gnucash
  - scheme
---
I've been a long time on-and-off user of [GnuCash](http://www.gnucash.org)
but have only recently been starting to really pay attention to my
finances (age + family = time to start being a grown-up). In that
pursuit I'm looking for some reporting that goes beyond what GnuCash
offers. Customizing GnuCash reports
[the prescribed way](https://wiki.gnucash.org/wiki/Custom_Reports) is
not for the faint of heart, and having done some basic tweaks several
years ago my thought this time was to avoid the whole ordeal and
access the data directly using R or Python: the data is fairly
accessible and last I checked
[GNU Guile](https://www.gnu.org/software/guile/) (the extension
mechanism that GnuCash uses) seemed to be languishing.

<!--more-->

Although GnuCash data is either stored as gzipped XML or in an RDBMS
(either of which would be easily read by plenty of tools), the GnuCash
architecture consists of a core engine that enforces the model, so
accessing the data through the engine certainly seemed a preferable
option for maintainable consistent data rather than reconstructing the
associations within the stored data. I opted to at least look at
using the internal reporting engine to initially extract the
data...but in so doing I discovered that my perception of Guile being
abandoned was either wrong or outdated (as evidenced by their fancy
new Web site).

Perhaps most importantly, Guile is supporting multiple languages
including Lua and JavaScript/ECMAScript which will make it far more
likely to be adopted by greedy developers who want more from their
language than Scheme's parentheses. Mollified about possibly trying to
resurrect long dead code, further investigation has piqued my interest
about Guile. [insert beguile pun]

In light of this new-found wisdom I'm going to be looking at
implementing everything I need within GnuCash/Guile and hopefully
helping move report customization in GnuCash to a place where it
has less attached disclaimers. :dollar:
