# Changes

## 1.2

* Fix some test breakages due to:
    * Incorrect method of checking jQuery version.
    * Incorrect way of setting up `jQuery` object.
    * HTML file pointing at removed jQuery version.
* Fix for version tests in JSLint that couldn't handle `1.10.x` versions.
* Add tests for:
    * jQuery Core:
        * 1.7.2
        * 1.8.3
        * 1.9.1
        * 2.0.3
    * jQuery UI:
        * 1.9.2
        * 1.10.3
* Upgrade QUnit to 1.12.0, and change tests to match new default behaviors.
