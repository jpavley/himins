synthesis
=========
[![Build Status](https://travis-ci.org/VirtuOz/synthesis.png)](https://travis-ci.org/VirtuOz/synthesis)

Synthesis borrows from Objective C's property concept.  It cuts down on boilerplate code by automatically generating
property accessors and mutators for an object.

    var $synthesize = require('vnodelib').load('synthesis');

    function MyObject()
    {
    }

    $synthesize(MyObject, 'foo');                 // Creates a read/write property for 'foo'.
    $synthesize(MyObject, 'bar', 'read');         // Creates a read-only property for 'bar'.
    $synthesize(MyObject, 'baz', 'write');        // Creates a write-only property for 'baz'.
    $synthesize(MyObject, 'qux', 'read-write');   // Creates a read/write property for 'qux'.

    module.exports = MyObject;

Generated functions may be used like this:

    var myObject = new MyObject();

    myObject.setFoo('hello');
    var fooValue = myObject.getFoo();

Internally, the property may be accessed like this:

    this.foo;
    this['foo'];

    var propName = 'foo';
    this[propName];

Synthesis is also compatible with JS.class:

    var $synthesize = require('vnodelib').load('synthesis');

    require('jsclass');
    JS.require('JS.Class');

    var JSClassTestObject = new JS.Class(
    {
        // my functions and stuff in here
    });

    $synthesize(JSClassTestObject, 'foo');
    $synthesize(JSClassTestObject, 'bar', 'read');
    $synthesize(JSClassTestObject, 'baz', 'write');
    $synthesize(JSClassTestObject, 'qux', 'read-write');

