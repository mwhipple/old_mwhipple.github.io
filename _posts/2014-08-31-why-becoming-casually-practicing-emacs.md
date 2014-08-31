---
title: Why Becoming a Casually Practicing Emacs-er is a Good Religious Choice
layout: post
---
_This is a repost of a blog post I originally posted on July 7th, 2012 to unnaturalcode.blogspot.com.  I will occasionally be consolidating posts to this site.  This one is expected to be a thematic prelude to future posts._

If you haven't already been indoctrinated to a text editor religion, joining the emacs flock has its perks.  I'm not saying you should go the strict devotional route, but being able to recite the basic incantations enough to blend in during the occasional service pays off.

What about that other religion?
---

That heading will more or less the end of the religion metaphor (even thought it is a heading).   In the *nix world there are two old families of text editors which have "religious" followings: vi & emacs.  From my perspective vi is far more "Unix-y"; it's minimal, powerful, modular...like a well written C program (like Unix itself).  Emacs on the other hand is overtly lisp-y, with an almost fluid sense of indirection and dynamism, making it a misfit in the *nix world (at least from what I've seen,even though Guile is a "standard" I've only run across it in GnuCash).  There is also a related performance difference in that vi programs are normally lighter weight, but that difference is inconsequential on modern computers.

I made the jump from vi (Vim) to Emacs (GNU Emacs) a couple years ago since I found Emacs more conducive to self-discovery with the combination of descriptive commands and powerful info system.  But...if you want to become a devotee and actual user of either then that is entirely a matter of preference and I'm not saying one is better than the other by itself.  vi has a fatal flaw in regards to the portability of knowledge, however, in that it has the concept of modes (so for instance to edit content you would enter an edit mode and then to move the cursor you would switch back to command mode and use what are often the same keys).  This concept doesn't map to most newer editors.

What is Emacs good for?
---

Dedicated Emacs users would answer that question with "anything".  Although I don't disagree with that sentiment, it can be difficult to convince others that Emacs can do anything that Tool-X can do with finer control after you spend the time to configure it and get comfortable with the bindings.  Even being able to customize the colors of the text display is often not enough to win them over.  So for every one else:

### Key bindings

Continuing from the vi comparison, Emacs doesn't use modes in that way and uses key combinations with the modifier keys (e.g. Ctrl-s...represented in Emacs as C-s) to perform commands, just like most modern editors.  Emacs is a little binding happy though and has what seems to be an obscene amount of key bindings and uses combinations/sequences to increase the number of possible combinations and contextualize the functionality.  The payoff though is that Emacs key bindings are supported in all sorts of unexpected places.  Most IDEs have Emacs binding support, in addition to the console and shell utilities.  So once you learn them and they become natural, you can use them most anywhere.  This was particularly brought to my attention not long ago when one of my co-workers was curious about how I was doing things in an OS X terminal.

### For simple"ish" tasks

A simple description of Emacs would be that it is a text editor.  Coming from a GUI background Emacs will seem odd and there will be a natural tendency to use a standard GUI editor or something simpler like nano on the command line.  Emacs offer a powerful environment that can be expected to be present in *nix  (and OS X) systems and are easily made available elsewhere.  That means that you always have access to an integrated editor for doing things like editing files, performing file system operations, and running shell commands.  This is complete with switching and splitting the screens and having powerful syntax aware file editing from both the GUI and the command line (which also translates to remotely over a shell connection).

This whole section applies equally to vi, but as mentioned above the key bindings and mode paradigm aren't portable from vi.  

How to join the cult of Emacs
---
So by now you're surely convinced that Emacs is worth an nth look and you're ready to get your feet wet.  Taking the built in Emacs tutorials to get used to the basic editor commands would be the standard first step. The program offers great built in help and command completion; as long as you become familiar with these you don't have to remember really anything else.  The learning overhead can therefore be reduced to getting familiar with Emacs's built in Info reader, and its lingo.  Emacs uses different terms then you may be used to, so if you know those terms its usually easy to figure out what you're trying to do. Learning some of the help commands and leaning on M-x can put everything within easy reach.

The next step is to just use Emacs for little things.  Use it as a simple text editor (check out org-mode), get comfortable with splitting the window and switching between buffers and then check out extensions like dired and eshell.

Conclusion
---

Sooner or later everyone needs to do something that falls in between the gaps of simple file editors and richer environments.  The usefulness of Emacs grows alongside your familiarity it.  Using it for simple tasks now, and then incrementally discovering its features will provide you with a powerful platform for more complex processes.  As the use of Emacs key bindings become automatic the benefit can transcend the program itself due to the near ubiquitous support for Emacs key bindings.
