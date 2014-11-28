---
title: Avoiding null checks in Java
layout: post
---
_The primary purpose of this post is to explain an aspect of the programming style I have adopted for myself so that I can reference it elsewhere; any effect I may have on others is a happy bonus_

Introduction
---
Null checks in Java are a big pet peeve of mine. One of the immediate benefits of Java over many other modern alternatives is the safety the type system can provide at design and compile time, but all of this is immediately undermined by the idea that any reference must be pointing to an appropriate type that satisfies the specified contract...._or_ to something that is effectively useless and is going to blow up in your face.
The underlying issue is potentially the concept of null references in general or at least their common implementation as used by Java: [Tony Hoare has referred to null references as a billion dollar mistake](http://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare). As a user of the Java language however, that is presently somewhat of an academic discussion. There may be some hope that the new [Optional](https://docs.oracle.com/javase/8/docs/api/java/util/Optional.html) marker in Java 8 is the beginning of a course correction (I've not yet researched this but it is also not immediately relevant).  The implication of the implementation being common is also that this is not a Java specific issue, but it is the language that I'm presently positioned to grouse about.

The Problem Distilled
---
As a user of the language the implementation is a fact of life and even if it weren't I am certainly not prepared enough to discuss that aspect of the language's design. Since it is a part of the language there is little choice but to work with it, so the focus then shifts to one of _how_ to work with null references.

A naive, optimistic option would be to expect references to be non-null and just let the NullPointerExceptions fly. This would generally be considered poor practice as it can produce code that is neither robust nor descriptive and errors may be harder to diagnose.

The opposite option would be to practice defensive programming and check to see whether references are null. This allows code to be robust and for errors to be dealt with appropriately. This is, perhaps foolishly, the approach that I tend to dislike for the reason outlined in the introduction. The issue is that this approach tends to be applied blindly. Java developers are conditioned to check for nulls, which leads to code for things like traversing an object graph to be twice as long and half as readable as it otherwise would be.

The bigger issue in my mind however is that it often represents a violation of [Design by Contract ](http://en.wikipedia.org/wiki/Design_by_contract). I've seen far too much code where some form of aggregate object is created and the code that processes that object is littered with null checks which (if triggered) would render the object useless. Sometimes the answer to the internal question of "could this be null?" should be "no". If an object is modeled to satisfy a particular contract then it should not be able to violate that contract. The largest danger is the one that null checks become considered such a fact of life that they compromise any model defined with the notion that any members of that model which should be required could be invalid. Depending on the culture the loss of definition can also quickly degrade into a vicious cycle of bad data and workarounds.

Solutions
---

### JSR-305
It may seem like I'm about to advocate some middle of the road approach where optimism and defensive programming are balanced, but I am certainly not trusting enough to just drop my defenses.  Instead I advocate making liberal use of the JSR-305 annotations `@Nonnull` and `@Nullable`. The use of these annotations allows for clearly defining the contracts of a model or a method in a way where the condition is appropriately attached to the server code.  The responsibility then shifts to the client code and expands outward in an appropriately modular way. This should result in less code that is more self-descriptive.

JSR-305 can provide great support at design time when used with an appropriate IDE. Runtime support should also be added to ensure that your code is protected in the wild. A consistent approach to handle this would be using aspect oriented programming to apply the appropriate checks around the annotated references. This may raise two questions (that I can think of):

Wasn't the point of all of this to avoid the checks?
: The purpose was not to remove the fact that the checks were actually done but that they were done imperatively in the source code. The issue presented is that there is no facility provided by the language to consistently aid in this and so this is a way to pretend that there is. This possible question is a very nuanced one that should be less relevant if viewed from the larger perspective of language design and the OOP meta layer rather than from the assumptions of a particular language. From that perspective the large advantage is the changes in the source code rather than what is ultimately generated from the source.

Won't there be a performance hit?
:  Yes. A null check should be very negligble but this could certainly be a performance concern if resources are fantastically tight or, more likely, a large amount of data is being processed. This check is analogous to the index bounds check that Java provides and that is discussed in the above video, with a similar ratio of advantage to cost. In cases where the concern is justified there would be several options to avoid the checks (more targeted weaving, alternate trusted/safe annotations with limited visibility and no runtime checking).

There are several tools that handle this automatically including IntelliJ IDEA compilation and [Project Lombok](http://projectlombok.org/). I've also created a simple [gradle plugin](https://github.com/mwhipple/gradle-nonnull-runtime) that I presently use for some projects which is a simple combination of the tools listed on the GitHub page for that project.

### Nulls Shouldn't Travel
A large step that could be taken to mitigate the above issue would be to keep nulls local. Public methods should not be accept nulls as arguments. Method overloading will keep the resulting code simpler and the resulting program structure should align more closely with the execution paths and therefore more easily understood. Nulls may occasionally be returned when sensible (though this should be done judiciously), but that should result in an appropriate reaction rather than the null value being passed along. This advice applies to the API/blackbox style boundaries in an application. When designing code internal to a module or package where any server code is designed around specific client code then these restrictions may get in the way with little practical benefit, but when writing code that is expected to work with any client code, then this keeps the interface of the API simpler and should therefore lead to less of a chance of unexpected state on either side of the interface and should also leave the API in a better state to evolve.

This is certainly one of those rules that is made to be broken, but using this as a guideline should allow for any defined API to leverage the Java type system to simplify the resultant code.

Conclusion
---
The implementation of null references in Java is a historically questionable one but there are combinations of tools and practices that allow for some insulation from the possible warts of that implementation. I tend to make liberal use of those approaches to try to strictly define contracts as clearly as possible and maximize the benefits of the underlying type system. A combination of preventing null references and using the [Null Object pattern](http://en.wikipedia.org/wiki/Null_Object_pattern) allows for simpler code and a stronger level of guarantee that anything on the heap is in a consistent and useful state.

This approach does not avoid the issue entirely and null checks should not be considered inherently evil. Null references have their uses (and are also still a fact of life when dealing with some things such as collections), but the ability to more clearly define when and how null references are relevant (and when they are not) leads to fewer lines of source code that are more expressive and more reliable.
 
