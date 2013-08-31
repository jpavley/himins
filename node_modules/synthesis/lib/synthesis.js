/*
 * Copyright 2012-2013 VirtuOz Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Library to allow synthesis of object properties without having to write boring boilerplate code to do it.
 *
 * Usage:
 *      function MyObject()
 *      {
 *      }
 *
 *      $synthesize(MyObject, 'foo');                 // Creates a read/write property for 'foo'.
 *      $synthesize(MyObject, 'bar', 'read');         // Creates a read-only property for 'bar'.
 *      $synthesize(MyObject, 'baz', 'write');        // Creates a write-only property for 'baz'.
 *      $synthesize(MyObject, 'qux', 'read-write');   // Creates a read/write property for 'qux'.
 *
 *      module.exports = MyObject;
 *
 * Generated functions may be used like this:
 *
 * var myObject = new MyObject();
 *
 * myObject.setFoo('hello');
 *
 * var fooValue = myObject.getFoo();
 *
 * Internally, the property may be accessed like this:
 *
 * this.foo;
 * this['foo'];
 *
 * Synthesis is also compatible with JS.class:
 *
 *      require('jsclass');
 *      JS.require('JS.Class');
 *
 *      var JSClassTestObject = new JS.Class(
 *      {
 *          // my functions and stuff in here
 *      });
 *
 *      $synthesize(JSClassTestObject, 'foo');
 *      $synthesize(JSClassTestObject, 'bar', 'read');
 *      $synthesize(JSClassTestObject, 'baz', 'write');
 *      $synthesize(JSClassTestObject, 'qux', 'read-write');
 *
 * @author Kevan Dunsmore
 * @created 2012/08/25
 */
var S = require('string');

var READ = 'read';
var WRITE = 'write';
var READ_WRITE = 'read-write';

function synthesize(object, propertyName, accessibility)
{
    accessibility = accessibility === undefined ? READ_WRITE : accessibility;

    // Capitalize first letter of the property name.
    var capitalizedPropertyName = propertyName.charAt(0).toUpperCase() + propertyName.slice(1);

    if (accessibility === READ_WRITE || accessibility === READ)
    {
        object.prototype["get" + capitalizedPropertyName] = function ()
        {
            return this[propertyName];
        };
    }

    if (accessibility === READ_WRITE || accessibility === WRITE)
    {
        object.prototype["set" + capitalizedPropertyName] = function (value)
        {
            this[propertyName] = value;
        };
    }
}

exports.synthesize = synthesize;
