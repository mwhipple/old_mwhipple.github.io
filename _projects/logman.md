---
title: LogMan
---
[![GitHub](http://img.shields.io/:GitHub-logman-blue.svg)](https://github.com/mwhipple/logman)

What is LogMan?
---
LogMan is a facade for managing logging systems similar to the way that slf4j is a facade for using logging systems. The management of
logging is more likely to need greater knowledge of the underlying logging system but is also a much narrower need, so it should not be expected that slf4j should provide this functionality. The narrowness of the need would also explain the lack of an existing library (at least as far as I know), but my reasons for starting this anyway are outlined on the [main GitHub page](https://github.com/mwhipple/logman).

Related Posts
---
<ul>
	{% for post in site.tags.logman %}
		<li><a href="{{post.url}}">{{post.title}}</a></li>
	{% endfor %}
</ul>



