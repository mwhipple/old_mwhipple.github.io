---
title: Why I've Returned to Emacs
layout: post
---
I've recently switched back to using emacs as my primary editor (which was the motivation for the repositng of the earlier emacs post). As such I'll be posting a decent amount about emacs info, so this provides the underlying motivation for why I continue to use emacs.

I was using emacs as my primary editor several years ago but had since switched over to some of the modern, more bloated targeted alternatives. I'd continued to consistently use emacs for some things but nothing of much significance. Recently, after going through withdrawal, I've gone crawling back.

Jack of All Trades, Master of None
---
Emacs is one of the most proven text editors available, and ultimately virtually everything I work on is some form of text editing. One of the biggest advantages of emacs is that it provides a consistent environment to handle all of those assorted forms of text editing. I'm not about to claim that emacs is a better solution than tools that are made specifically to serve certain purposes (such as IDEs), but it is a very powerful option to be able to handle _all_ of them. Because it is fairXly unbiased compared to alternatives it is less likely to get in the way with large amounts of power that is directed at something that isn't always relevant.

When working I tend to spend a large amount of time bouncing between different types of tasks which include different containing environments and so the ability to access everything through a consistent interface is enormously helpful.

On the Fly Customization
---
One of the signature advantages of emacs is the ability to evaluate code to modify the editor at runtime. When using heavier weight editors a common issue is that some feature does not work quite right. Modern IDEs are generally very good at satisfying the most common needs but they are also trying to provide an enormous range of functionality. When something is slightly out of alignment there is generally the means to implement an appropriate modification, but it generally requires the common development process of retrieving or creating source code which must be built and packaged for use by the tool. The associated context swtich is inconvenient enough that the misalignments are tolerated rather than tuned. In emacs on the other hand elisp can be evaluated at runtime to modify the behavior of the editor so itches can be scratched very quickly often without a notable context switch from the task at hand. Packaging and management of the code, if suitable, can then be deferred until after the immediate needs have been resolved and possible further refinements have been made.

Lightweight and Portable
---
Most of the development work that I do does not inherently require much in the way of resources, and so using a lightweight editor that is portable allows me to work more easily on a wider range of devices and utilize cloud resources to handle those aspects of build automation that are more resource intensive. This has allowed me to (among other things), use a Chromebook with Linux provided by [Crouton](https://github.com/dnschneid/crouton) as a highly portable system.

Conclusion
---
Emacs is one of the most established text editors and also provides a living development environment that can be tuned as needed. Although configuring some aspects may take significantly more initial work than more vertical solutions it is also far more versatile (and less assuming).

This covers my motivations for using emacs as it will be recurring topic in subsequent posts.
