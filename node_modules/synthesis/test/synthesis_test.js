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
 * Tests the functionality of the synthesis library.
 *
 * @author Kevan Dunsmore
 * @created 2012/08/25
 */

var expect = require('chai').expect;
var TestObject = require('./test_object');
var JSClassTestObject = require('./jsclass_test_object');

describe('synthesis', function ()
{
    describe('synthesize', function ()
    {
        testSynthesis(new TestObject());
        testSynthesis(new JSClassTestObject());

        function testSynthesis (testObject)
        {
            it('should synthesize read-write property', function ()
            {
                expect(testObject.getFoo).to.not.be.equal(undefined);
                expect(testObject.setFoo).to.not.be.equal(undefined);

                expect(testObject.getQux).to.not.be.equal(undefined);
                expect(testObject.setQux).to.not.be.equal(undefined);
            });

            it('should synthesize read-only property', function ()
            {
                // Now the read-only property.
                expect(testObject.getBar).to.not.be.equal(undefined);
                expect(testObject.setBar).to.be.equal(undefined);
            });

            it('should synthesize write-only property', function ()
            {
                // Now the write-only property.
                expect(testObject.getBaz).to.be.equal(undefined);
                expect(testObject.setBaz).to.not.be.equal(undefined);
            });

            // Now test updating the values.
            it('should mutate read-write properties', function ()
            {
                testObject.setFoo('wibble!');
                expect(testObject.getFoo()).to.equal('wibble!');

                testObject.setFoo('giblets!');
                expect(testObject.getFoo()).to.equal('giblets!');

                testObject.setQux('wibble!');
                expect(testObject.getQux()).to.equal('wibble!');

                testObject.setQux('giblets!');
                expect(testObject.getQux()).to.equal('giblets!');
            });

            it('should return read-only property', function ()
            {
                testObject['bar'] = 'harry';
                expect(testObject.getBar()).to.equal('harry');

                testObject['bar'] = 'ron';
                expect(testObject.getBar()).to.equal('ron');
            });

            it('should update write-only property', function ()
            {
                testObject.setBaz('hermione');
                expect(testObject['baz']).to.equal('hermione');

                testObject.setBaz('hedwig');
                expect(testObject['baz']).to.equal('hedwig');
            });
        };
    });
});
