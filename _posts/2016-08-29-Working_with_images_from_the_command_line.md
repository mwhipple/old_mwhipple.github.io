---
title: Working with images from the command line
---

# Working with images from the command line

#### 2016-08-29

<div class="post-img fl">
  <img src="images/bay-bridge.jpg"
      title="Bay Bridge, from San Francisco;
the line about crossing a bridge was inadvertent but appreciated">
</div>

This post is mostly regurgitating readily available information:
mostly for my future reference and I may do something more
interesting with it in the future.

As part of working on this Web site I'm working on organizing my
pictures a bit, which is something for which I've never found a solution
that I particularly like (though I haven't looked too hard). Most
photo organizing software that I've tried has seemed too needy; I'm not
looking for the kind of commitment where I cede control of the
underlying storage or have to devote more than a couple seconds at
a time.

My usual workflow and the above constraints lead me to the
command line, and the command line has the excellent de facto
standard suite of utilities
[ImageMagick](http://www.imagemagick.org)
Additional metadata from
a photo file can be listed using `identify --verbose filename`
which can be used to belatedly tag or rename image files and
`convert` can be used to quickly modify an image for uses
such as sticking on a Web site. The photo on this page was
re-sized and rotated from my photo library with:

```bash
convert 20140614_Bay_Bridge.jpg -resize 8% -rotate 90 bay-bridge.jpg
```

A huge perk for me of preferring ImageMagick commands over using a
graphics editor is that source files are likely to be consistent
dimensions (whatever the camera uses) are the desired renditions
(to fit a Web page format) so once the percentage(s) are worked
out resizing images is totally painless. I can't say the same for
cropping or any other manipulations, but hopefully my laziness can
keep from having to cross that bridge for a while.

All the ImageMagick goodness is covered in the man pages and
(presumably) on the [site](http://www.imagemagick.org).
