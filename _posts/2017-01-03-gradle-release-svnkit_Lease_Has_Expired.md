---
title: gradle-release-svnkit's Lease Has Expired
post_img:
  src: candle.jpg
  title: A fellow extinguished flame
tags:
  - gradle
  - abandonware
---

[gradle-release-svnkit](https://github.com/mwhipple/gradle-release-svnkit)
is the latest casualty in my gradually cleaning up my GitHub
presence. The project was created when I'd introduced the
[gradle-release](https://github.com/researchgate/gradle-release)
plugin to a Subversion-housed project and some of the team (on
Windows) were having issues with the standard plugin's use of CLI svn.
That project switched to git shortly
thereafter and this extension became no longer necessary.

Shortly after the extension was created, the core `gradle-release`
plugin underwent significant internal revision and so a bit of work would be
needed to ensure this provider aligns with the new code. I don't see
myself spending any time with svn in the near future, and although the
individual technologies involved are very likely popular I wouldn't
bet on the intersection of them being that common...especially in an
environment where the CLI svn client wouldn't be readily usable by the
developers (and likely preferred). So for this reasons the code will
be left as is, targeting an increasingly out of date version of `gradle-release`.
:tractor:
