---
title: Publishing Artifacts with Travis and Gradle
---
I'm a very lazy programmer. I certainly cannot be bothered (or trusted) to do all the work associated with releasing software with any kind of consistency or reliability. I'm also bored very easily so the idea of spending my time on administrivia rather than more interesting stuff makes me wish there was some kind of device that could be used to get standardized repetive tasks out of the way.

Release Automation
---
When releasing a version of software my desired outcome is a published binary artifact, a tag in version control that corresponds to the code at that time, and some cursory enforcement of version numbers. To handle all but the publishing I use the [gradle-release](https://github.com/researchgate/gradle-release) plugin which had languished a bit waiting for a new maintainer but has fairly recently been revitalized. For the standard reasons of consistency and repeatability I also look for the canonical builds to be done on a CI server. At work we use Jenkins and releases are initiated through the Jenkins UI (having added the publishing tasks to the release execution graph and smoothed out some rough edges). With Travis the launching of a release through the UI is less of an option and the great existing integration with GitHub makes it a less appealing.

Release Flow With Travis
---
Although I lumped the published artifact into release output above, it can also be useful to differentiate the concepts of _release_ and _publish_. Releasng can be scoped as the necessary changes to the _source code_, while publishing concerns the _binary artifacts_. Releasing therefore requires modifying the source code repository while publishing only requires reading from that repository and working with the output of the source code. This also means that the release process should be less environment dependent while the created binary may be impacted by how it is built (and hence should be handled by the CI server).

Travis runs builds for each commit in each branch in GitHub, which can map nicely onto the separation above. The release process will result in the associated commits and then Travis simply needs to publish the artifacts. This is also a valid option with Jenkins if it matches the development workflow (it was the original approach at my day job but didn't fit as well with the culture). The example binary repository is going to be Bintray, but any should be able to be handled similarly.

### Deployment
Publishing is effectively just another form of deployment where the destination is a repository rather than an environment set to execute the code; Travis supports [deployment](http://docs.travis-ci.com/user/deployment/custom/), so we just need the relevant line in the `.travis.yml`.

{% highlight yaml %}
after_success:
- ./gradlew bintrayUpload
{% endhighlight %}


And now it's set up to publish the artifact after each release...after likely requiring some further adjustments.

#### Credentials and Sensitive Information
For the above to work Travis needs the data to authenticate with Bintray or any other external service on your behalf, and you almost certainly don't want that info in your source code.  Travie provides the ability to add encrypted data into your Travis file as documented [here](http://docs.travis-ci.com/user/encryption-keys/). The `--add` flag for `travis encrypt` isn't highlighted on that page but is useful to have the `.travis.tml` file modified directly. 

After adding whatever credentials you need encrypted to the Travis file they'll be passed as environment variables to the build. I've normally provided these values in properties files, so in the interest of EIBTI and not relying too much on a possibly intricate resolution strategy I have a block to explicitly use the specified environment variables if they're present (this is subject to change). 

{% highlight groovy %}
['bintrayUser', 'bintrayApiKey', 'signingPassword',
    'mavenCentralUser', 'mavenCentralPassword'].each{
    if (System.env[it])
        project[it] = System.env[it]
}
{% endhighlight %}

Those properties can then be used as needed in the bintray (etc.) configuration.

#### Selectively Deploying
At this point Travis should be deploying your artifacts...but it will be trying to deploy on every commit. This may or may not be an issue but for for me it's an issue by default...and I also like to test my build across multiple JVMs and so I want to make sure that the build is only deployed from whatever is deemed to be the "right" JVM. Gradle makes it easy to attach a predicate to control whether a task is actually executed with an `onlyIf` block, so that can be made use of to check for conditions for publishing.

{% highlight groovy %}
bintrayUpload.onlyIf {
    System.env.TRAVIS_JDK_VERSION == 'oraclejdk7' &&
    !(version ==~ /.*SNAPSHOT/)
}
{% endhighlight %}

With the above I can have multiple JVMs run tests but only a selected one used to publish artifacts. By consistently using SNAPSHOT in the version and then allowing the release plugin to remove it only for the tagged releases it will also prevent repeated publishing for every commit.

Conclusion
---
With the above pieces in place and connecting a couple external dots (Bintray/Sonatype) I can now just run `./gradlew release`, provide the version number, and then get the tags added to GitHub, the artifacts on Bintray, and promoted through to Maven Central (for Maven Central I get the promotion emails pretty much instantly and then wait the standard couple hours for synchronization). I still have plans to pull tie in a couple other things like CHANGELOG automation but that should all be standard use of available tools.

The guinea pig app was [LogMan](https://github.com/mwhipple/logman) so anything I missed or skimmed over would be in the working source code.
