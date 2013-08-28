# jQuery Lint

Tested in jQuery 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, and 2.0.


---
**IMPORTANT** - If you encounter a bug, please [raise an issue](http://github.com/MrJoy/jQuery-Lint/issues). Likely bugs could include:

* Reporting correct argument lists as incorrect.
* Nested errors as a result of other oversights - e.g. you call `css()` incorrectly which might internally make a call to another method, which may then raise an error.
* Not recognizing changes to APIs in newer versions of jQuery.


## Intro

*jQuery Lint* is a simple script you can download and use with jQuery. It works over the top of jQuery and diligently reports errors and any incorrect usage of jQuery. It will also, to some extent, offer guidance on best practices and performance concerns.

Include it, **after jQuery** like this:

    <script src="jquery.js"></script>
    <script src="jquery.lint.js"></script>

Now, just use jQuery as you normally would. When you do something that jQuery Lint deems incorrect or a bad practice then you'll receive a warning in the console. Currently, it only works with Firebug (in Firefox). You can easily define another reporting mechanism within the script itself, but there's little reason to; the errors it reports are browser-agnostic, so you may as well do your testing in Firefox w/ Firebug.

**NOTE** - jQuery-Lint is shipped with [FireQuery](https://github.com/darwin/firequery).

### Screenshot

![jquery.lint.js preview](https://raw.github.com/MrJoy/jQuery-Lint/master/etc/lint.png)

**Read more about jQuery Lint in the [wiki](http://wiki.github.com/jamespadolsey/jQuery-Lint/)!**

### License

    * Dual licensed under the MIT and GPL licenses.
    *    - http://www.opensource.org/licenses/mit-license.php
    *    - http://www.gnu.org/copyleft/gpl.html

## Status and Known Issues

* All test cases have been observed to pass at least once, but many fail if
  re-run subsequently, or will randomly fail.  This suggests state-poisoning
  that I have yet to track down.
    * jQuery-UI in particular seems especially problematic.
* I've made no effort to update this with API changes in jQuery, yet.  Patches
  welcome.
* I've done no testing with jQuery Mobile.
* I've made no effort to differentiate behavior when jQuery Migrate is present.
