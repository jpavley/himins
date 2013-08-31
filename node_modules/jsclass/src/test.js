(function(factory) {
  var E  = (typeof exports === 'object'),
      js = (typeof JS === 'undefined') ? require('./core') : JS,

      Console     = js.Console     || require('./console').Console,
      DOM         = js.DOM         || require('./dom').DOM,
      Enumerable  = js.Enumerable  || require('./enumerable').Enumerable,
      SortedSet   = js.SortedSet   || require('./set').SortedSet,
      Range       = js.Range       || require('./range').Range,
      Hash        = js.Hash        || require('./hash').Hash,
      MethodChain = js.MethodChain || require('./method_chain').MethodChain,
      Comparable  = js.Comparable  || require('./comparable').Comparable,
      StackTrace  = js.StackTrace  || require('./stack_trace').StackTrace;

  if (E) exports.JS = exports;
  factory(js, Console, DOM, Enumerable, SortedSet, Range, Hash, MethodChain, Comparable, StackTrace, E ? exports : js);

})(function(JS, Console, DOM, Enumerable, SortedSet, Range, Hash, MethodChain, Comparable, StackTrace, exports) {
'use strict';

var Test = new JS.Module('Test', {
  extend: {
    asyncTimeout: 5,

    filter: function(objects, suffix) {
      return Test.Runner.filter(objects, suffix);
    },

    Reporters: new JS.Module({
      extend: {
        METHODS: ['startSuite', 'startContext', 'startTest',
                  'update', 'addFault',
                  'endTest', 'endContext', 'endSuite'],

        _registry: {},

        register: function(name, klass) {
          this._registry[name] = klass;
        },

        get: function(name) {
          if (!name) return null;
          return this._registry[name] || null;
        }
      }
    }),

    UI:   new JS.Module({}),
    Unit: new JS.Module({})
  }
});

Test.Unit.extend({
  Observable: new JS.Module({
    addListener: function(channelName, block, context) {
      if (block === undefined) throw new Error('No callback was passed as a listener');

      this.channels()[channelName] = this.channels()[channelName] || [];
      this.channels()[channelName].push([block, context]);

      return block;
    },

    removeListener: function(channelName, block, context) {
      var channel = this.channels()[channelName];
      if (!channel) return;

      var i = channel.length;
      while (i--) {
        if (channel[i][0] === block) {
          channel.splice(i,1);
          return block;
        }
      }
      return null;
    },

    notifyListeners: function(channelName, args) {
      var args        = JS.array(arguments),
          channelName = args.shift(),
          channel     = this.channels()[channelName];

      if (!channel) return 0;

      for (var i = 0, n = channel.length; i < n; i++)
        channel[i][0].apply(channel[i][1] || null, args);

      return channel.length;
    },

    channels: function() {
      return this.__channels__ = this.__channels__ || [];
    }
  })
});

Test.Unit.extend({
  isFailure: function(error) {
    var types = Test.ASSERTION_ERRORS, i = types.length;
    while (i--) {
      if (JS.isType(error, types[i])) return true;
    }
    return false;
  },

  AssertionFailedError: new JS.Class(Error, {
    initialize: function(message) {
      this.message = message.toString();
    }
  }),

  Assertions: new JS.Module({
    assertBlock: function(message, block, context) {
      if (typeof message === 'function') {
        context = block;
        block   = message;
        message = null;
      }
      this.__wrapAssertion__(function() {
        if (!block.call(context)) {
          message = this.buildMessage(message || 'assertBlock failed');
          throw new Test.Unit.AssertionFailedError(message);
        }
      });
    },

    flunk: function(message) {
      this.assertBlock(this.buildMessage(message || 'Flunked'), function() { return false });
    },

    assert: function(bool, message) {
      this.__wrapAssertion__(function() {
        this.assertBlock(this.buildMessage(message, '<?> is not true', bool),
                         function() { return bool });
      });
    },

    assertNot: function(bool, message) {
      this.__wrapAssertion__(function() {
        this.assertBlock(this.buildMessage(message, '<?> is not false', bool),
                         function() { return !bool });
      });
    },

    assertEqual: function(expected, actual, message) {
      var fullMessage = this.buildMessage(message, '<?> expected but was\n<?>', expected, actual);
      this.assertBlock(fullMessage, function() {
        return Enumerable.areEqual(expected, actual);
      });
    },

    assertNotEqual: function(expected, actual, message) {
      var fullMessage = this.buildMessage(message, '<?> expected not to be equal to\n<?>',
                                                   expected,
                                                   actual);
      this.assertBlock(fullMessage, function() {
        return !Enumerable.areEqual(expected, actual);
      });
    },

    assertNull: function(object, message) {
      this.assertEqual(null, object, message);
    },

    assertNotNull: function(object, message) {
      var fullMessage = this.buildMessage(message, '<?> expected not to be null', object);
      this.assertBlock(fullMessage, function() { return object !== null });
    },

    assertKindOf: function(klass, object, message) {
      this.__wrapAssertion__(function() {
        var type = (!object || typeof klass === 'string') ? typeof object : (object.klass || object.constructor);
        var fullMessage = this.buildMessage(message, '<?> expected to be an instance of\n' +
                                                     '<?> but was\n' +
                                                     '<?>',
                                                     object, klass, type);
        this.assertBlock(fullMessage, function() { return JS.isType(object, klass) });
      });
    },

    assertRespondTo: function(object, method, message) {
      this.__wrapAssertion__(function() {
        var fullMessage = this.buildMessage('', '<?>\ngiven as the method name argument to #assertRespondTo must be a String', method);

        this.assertBlock(fullMessage, function() { return typeof method === 'string' });

        var type = object ? object.constructor : typeof object;
        fullMessage = this.buildMessage(message, '<?>\n' +
                                                 'of type <?>\n' +
                                                 'expected to respond to <?>',
                                                 object,
                                                 type,
                                                 method);
        this.assertBlock(fullMessage, function() { return object && object[method] !== undefined });
      });
    },

    assertMatch: function(pattern, string, message) {
      this.__wrapAssertion__(function() {
        var fullMessage = this.buildMessage(message, '<?> expected to match\n<?>', string, pattern);
        this.assertBlock(fullMessage, function() {
          return JS.match(pattern, string);
        });
      });
    },

    assertNoMatch: function(pattern, string, message) {
      this.__wrapAssertion__(function() {
        var fullMessage = this.buildMessage(message, '<?> expected not to match\n<?>', string, pattern);
        this.assertBlock(fullMessage, function() {
          return (typeof pattern.test === 'function')
               ? !pattern.test(string)
               : !pattern.match(string);
        });
      });
    },

    assertSame: function(expected, actual, message) {
      var fullMessage = this.buildMessage(message, '<?> expected to be the same as\n' +
                                                   '<?>',
                                                   expected, actual);
      this.assertBlock(fullMessage, function() { return actual === expected });
    },

    assertNotSame: function(expected, actual, message) {
      var fullMessage = this.buildMessage(message, '<?> expected not to be the same as\n' +
                                                   '<?>',
                                                   expected, actual);
      this.assertBlock(fullMessage, function() { return actual !== expected });
    },

    assertInDelta: function(expected, actual, delta, message) {
      this.__wrapAssertion__(function() {
        this.assertKindOf('number', expected);
        this.assertKindOf('number', actual);
        this.assertKindOf('number', delta);
        this.assert(delta >= 0, 'The delta should not be negative');

        var fullMessage = this.buildMessage(message, '<?> and\n' +
                                                     '<?> expected to be within\n' +
                                                     '<?> of each other',
                                                     expected,
                                                     actual,
                                                     delta);
        this.assertBlock(fullMessage, function() {
          return Math.abs(expected - actual) <= delta;
        });
      });
    },

    assertSend: function(sendArray, message) {
      this.__wrapAssertion__(function() {
        this.assertKindOf(Array, sendArray, 'assertSend requires an array of send information');
        this.assert(sendArray.length >= 2, 'assertSend requires at least a receiver and a message name');
        var fullMessage = this.buildMessage(message, '<?> expected to respond to\n' +
                                                     '<?(?)> with a true value',
                                                     sendArray[0],
                                                     Test.Unit.AssertionMessage.literal(sendArray[1]),
                                                     sendArray.slice(2));
        this.assertBlock(fullMessage, function() {
          return sendArray[0][sendArray[1]].apply(sendArray[0], sendArray.slice(2));
        });
      });
    },

    __processExceptionArgs__: function(args) {
      var args     = JS.array(args),
          context  = (typeof args[args.length - 1] === 'function') ? null : args.pop(),
          block    = args.pop(),
          message  = JS.isType(args[args.length - 1], 'string') ? args.pop() : '',
          expected = new Enumerable.Collection(args);

      return [args, expected, message, block, context];
    },

    assertThrow: function() {
      var A        = this.__processExceptionArgs__(arguments),
          args     = A[0],
          expected = A[1],
          message  = A[2],
          block    = A[3],
          context  = A[4];

      this.__wrapAssertion__(function() {
        var fullMessage = this.buildMessage(message, '<?> exception expected but none was thrown', args),
            actualException;

        this.assertBlock(fullMessage, function() {
          try {
            block.call(context);
          } catch (e) {
            actualException = e;
            return true;
          }
          return false;
        });

        fullMessage = this.buildMessage(message, '<?> exception expected but was\n?', args, actualException);
        this.assertBlock(fullMessage, function() {
          return expected.any(function(type) {
            return JS.isType(actualException, type) || (actualException.name &&
                                                        actualException.name === type.name);
          });
        });
      });
    },

    assertThrows: function() {
      return this.assertThrow.apply(this, arguments);
    },

    assertNothingThrown: function() {
      var A        = this.__processExceptionArgs__(arguments),
          args     = A[0],
          expected = A[1],
          message  = A[2],
          block    = A[3],
          context  = A[4];

      this.__wrapAssertion__(function() {
        try {
          block.call(context);
        } catch (e) {
          if ((args.length === 0 && !Test.Unit.isFailure(e)) ||
              expected.any(function(type) { return JS.isType(e, type) }))
            this.assertBlock(this.buildMessage(message, 'Exception thrown:\n?', e), function() { return false });
          else
            throw e;
        }
      });
    },

    buildMessage: function() {
      var args     = JS.array(arguments),
          head     = args.shift(),
          template = args.shift();
      return new Test.Unit.AssertionMessage(head, template, args);
    },

    __wrapAssertion__: function(block) {
      if (this.__assertionWrapped__ === undefined) this.__assertionWrapped__ = false;
      if (!this.__assertionWrapped__) {
        this.__assertionWrapped__ = true;
        try {
          this.addAssertion();
          return block.call(this);
        } finally {
          this.__assertionWrapped__ = false;
        }
      } else {
        return block.call(this);
      }
    },

    addAssertion: function() {}
  })
});

Test.extend({
  ASSERTION_ERRORS: [Test.Unit.AssertionFailedError]
});

if (Console.NODE)
  Test.ASSERTION_ERRORS.push(require('assert').AssertionError);

Test.Unit.extend({
  AssertionMessage: new JS.Class({
    extend: {
      Literal: new JS.Class({
        initialize: function(value) {
          this._value = value;
          this.toString = this.inspect;
        },

        inspect: function() {
          return this._value.toString();
        }
      }),

      literal: function(value) {
        return new this.Literal(value);
      },

      Template: new JS.Class({
        extend: {
          create: function(string) {
            var parts = string ? string.match(/\(\?\)|(?=[^\\])\?|(?:(?!\(\?\))(?:\\\?|[^\?]))+/g) : [];
            return new this(parts);
          }
        },

        initialize: function(parts) {
          this._parts = new Enumerable.Collection(parts);
          this.count = this._parts.findAll(function(e) { return e === '?' || e === '(?)' }).length;
        },

        result: function(parameters) {
          if (parameters.length !== this.count) throw 'The number of parameters does not match the number of substitutions';
          var params = JS.array(parameters);
          return this._parts.collect(function(e) {
            if (e === '(?)') return params.shift().replace(/^\[/, '(').replace(/\]$/, ')');
            if (e === '?') return params.shift();
            return e.replace(/\\\?/g, '?');
          }).join('');
        }
      })
    },

    initialize: function(head, template, parameters) {
      this._head = head;
      this._templateString = template;
      this._parameters = new Enumerable.Collection(parameters);
    },

    template: function() {
      return this._template = this._template || this.klass.Template.create(this._templateString);
    },

    toString: function() {
      var messageParts = [], head, tail;
      if (this._head) messageParts.push(this._head);
      tail = this.template().result(this._parameters.collect(function(e) {
        return Console.convert(e);
      }, this));
      if (tail !== '') messageParts.push(tail);
      return messageParts.join('\n');
    }
  })
});

Test.Unit.extend({
  Failure: new JS.Class({
    initialize: function(testCase, message) {
      this._testCase = testCase;
      this._message  = message;
    },

    metadata: function() {
      return {
        test:   this.testMetadata(),
        error:  this.errorMetadata()
      }
    },

    testMetadata: function() {
      return this._testCase.metadata();
    },

    errorMetadata: function() {
      return {
        type:     'failure',
        message:  this._message
      };
    }
  })
});

Test.Unit.extend({
  Error: new JS.Class({
    initialize: function(testCase, exception) {
      if (typeof exception === 'string')
        exception = new Error(exception);

      this._testCase  = testCase;
      this._exception = exception;
    },

    metadata: function() {
      return {
        test:   this.testMetadata(),
        error:  this.errorMetadata()
      }
    },

    testMetadata: function() {
      return this._testCase.metadata();
    },

    errorMetadata: function() {
      return {
        type:       'error',
        message:    this._exception.name + ': ' + this._exception.message,
        backtrace:  Console.filterBacktrace(this._exception.stack)
      };
    }
  })
});

Test.Unit.extend({
  TestResult: new JS.Class({
    include: Test.Unit.Observable,

    extend: {
      CHANGED:  'Test.Unit.TestResult.CHANGED',
      FAULT:    'Test.Unit.TestResult.FAULT'
    },

    initialize: function() {
      this._runCount = this._assertionCount = 0;
      this._failures = [];
      this._errors   = [];
    },

    addRun: function() {
      this._runCount += 1;
      this.notifyListeners(this.klass.CHANGED, this);
    },

    addFailure: function(failure) {
      this._failures.push(failure);
      this.notifyListeners(this.klass.FAULT, failure);
      this.notifyListeners(this.klass.CHANGED, this);
    },

    addError: function(error) {
      this._errors.push(error);
      this.notifyListeners(this.klass.FAULT, error);
      this.notifyListeners(this.klass.CHANGED, this);
    },

    addAssertion: function() {
      this._assertionCount += 1;
      this.notifyListeners(this.klass.CHANGED, this);
    },

    passed: function() {
      return this._failures.length === 0 && this._errors.length === 0;
    },

    runCount: function() {
      return this._runCount;
    },

    assertionCount: function() {
      return this._assertionCount;
    },

    failureCount: function() {
      return this._failures.length;
    },

    errorCount: function() {
      return this._errors.length;
    },

    metadata: function() {
      return {
        passed:     this.passed(),
        tests:      this.runCount(),
        assertions: this.assertionCount(),
        failures:   this.failureCount(),
        errors:     this.errorCount()
      };
    }
  })
});

Test.Unit.extend({
  TestSuite: new JS.Class({
    include: Enumerable,

    extend: {
      STARTED:  'Test.Unit.TestSuite.STARTED',
      FINISHED: 'Test.Unit.TestSuite.FINISHED',

      forEach: function(tests, block, continuation, context) {
        var looping    = false,
            pinged     = false,
            n          = tests.length,
            i          = -1,
            breakTime  = new JS.Date().getTime(),
            setTimeout = Test.FakeClock.REAL.setTimeout;

        var ping = function() {
          pinged = true;
          var time = new JS.Date().getTime();

          if (Console.BROWSER && (time - breakTime) > 1000) {
            breakTime = time;
            looping = false;
            setTimeout(iterate, 0);
          }
          else if (!looping) {
            looping = true;
            while (looping) iterate();
          }
        };

        var iterate = function() {
          i += 1;
          if (i === n) {
            looping = false;
            return continuation && continuation.call(context);
          }
          pinged = false;
          block.call(context, tests[i], ping);
          if (!pinged) looping = false;
        };

        ping();
      }
    },

    initialize: function(metadata, tests) {
      this._metadata = metadata;
      this._tests    = tests;
    },

    forEach: function(block, continuation, context) {
      this.klass.forEach(this._tests, block, continuation, context);
    },

    run: function(result, continuation, callback, context) {
      if (this._metadata.fullName)
        callback.call(context, this.klass.STARTED, this);

      this.forEach(function(test, resume) {
        test.run(result, resume, callback, context)

      }, function() {
        if (this._metadata.fullName)
          callback.call(context, this.klass.FINISHED, this);

        continuation.call(context);

      }, this);
    },

    size: function() {
      if (this._size !== undefined) return this._size;
      var totalSize = 0, i = this._tests.length;
      while (i--) totalSize += this._tests[i].size();
      return this._size = totalSize;
    },

    empty: function() {
      return this._tests.length === 0;
    },

    metadata: function(root) {
      var data = JS.extend({size: this.size()}, this._metadata);
      if (root) {
        delete data.fullName;
        delete data.shortName;
        delete data.context;
      }
      return data;
    }
  })
});

Test.Unit.extend({
  TestCase: new JS.Class({
    include: Test.Unit.Assertions,

    extend: [Enumerable, {
      STARTED:  'Test.Unit.TestCase.STARTED',
      FINISHED: 'Test.Unit.TestCase.FINISHED',

      reports:   [],
      handlers:  [],

      clear: function() {
        this.testCases = [];
      },

      inherited: function(klass) {
        if (!this.testCases) this.testCases = [];
        this.testCases.push(klass);
      },

      pushErrorCathcer: function(handler, push) {
        if (!handler) return;
        this.popErrorCathcer(false);

        if (Console.NODE)
          process.addListener('uncaughtException', handler);
        else if (Console.BROWSER)
          window.onerror = handler;

        if (push !== false) this.handlers.push(handler);
        return handler;
      },

      popErrorCathcer: function(pop) {
        var handlers = this.handlers,
            handler  = handlers[handlers.length - 1];

        if (!handler) return;

        if (Console.NODE)
          process.removeListener('uncaughtException', handler);
        else if (Console.BROWSER)
          window.onerror = null;

        if (pop !== false) {
          handlers.pop();
          this.pushErrorCathcer(handlers[handlers.length - 1], false);
        }
      },

      processError: function(testCase, error) {
        if (!error) return;

        if (Test.Unit.isFailure(error))
          testCase.addFailure(error.message);
        else
          testCase.addError(error);
      },

      runWithExceptionHandlers: function(testCase, _try, _catch, _finally) {
        try {
          _try.call(testCase);
        } catch (e) {
          if (_catch) _catch.call(testCase, e);
        } finally {
          if (_finally) _finally.call(testCase);
        }
      },

      metadata: function() {
        var shortName = this.displayName,
            context   = [],
            klass     = this,
            root      = Test.Unit.TestCase;

        while (klass !== root) {
          context.unshift(klass.displayName);
          klass = klass.superclass;
        }
        context.pop();

        return {
          fullName:   this === root ? '' : context.concat(shortName).join(' '),
          shortName:  shortName,
          context:    this === root ? null : context
        };
      },

      suite: function(filter, inherit, useDefault) {
        var metadata    = this.metadata(),
            root        = Test.Unit.TestCase,
            fullName    = metadata.fullName,
            methodNames = new Enumerable.Collection(this.instanceMethods(inherit)),
            suite       = [],
            children    = [],
            child, i, n;

        var tests = methodNames.select(function(name) {
              if (!/^test./.test(name)) return false;
              name = name.replace(/^test:\W*/ig, '');
              return this.filter(fullName + ' ' + name, filter);
            }, this).sort();

        for (i = 0, n = tests.length; i < n; i++) {
          try { suite.push(new this(tests[i])) } catch (e) {}
        }

        if (useDefault && suite.length === 0) {
          try { suite.push(new this('defaultTest')) } catch (e) {}
        }

        if (this.testCases) {
          for (i = 0, n = this.testCases.length; i < n; i++) {
            child = this.testCases[i].suite(filter, inherit, useDefault);
            if (child.size() === 0) continue;
            children.push(this.testCases[i].displayName);
            suite.push(child);
          }
        }

        metadata.children = children;
        return new Test.Unit.TestSuite(metadata, suite);
      },

      filter: function(name, filter) {
        if (!filter || filter.length === 0) return true;

        var n = filter.length;
        while (n--) {
          if (name.indexOf(filter[n]) >= 0) return true;
        }
        return false;
      }
    }],

    initialize: function(testMethodName) {
      if (typeof this[testMethodName] !== 'function') throw 'invalid_test';
      this._methodName = testMethodName;
      this._testPassed = true;
    },

    run: function(result, continuation, callback, context) {
      callback.call(context, this.klass.STARTED, this);
      this._result = result;

      var teardown = function(error) {
        this.klass.processError(this, error);

        this.exec('teardown', function(error) {
          this.klass.processError(this, error);

          this.exec(function() { Test.Unit.mocking.verify() }, function(error) {
            this.klass.processError(this, error);

            result.addRun();
            callback.call(context, this.klass.FINISHED, this);
            continuation();
          });
        });
      };

      this.exec('setup', function() {
        this.exec(this._methodName, teardown);
      }, teardown);
    },

    exec: function(methodName, onSuccess, onError) {
      if (!methodName) return onSuccess.call(this);

      if (!onError) onError = onSuccess;

      var arity = (typeof methodName === 'function')
                ? methodName.length
                : this.__eigen__().instanceMethod(methodName).arity,

          callable = (typeof methodName === 'function') ? methodName : this[methodName],
          timeout  = null,
          failed   = false,
          resumed  = false,
          self     = this;

      if (arity === 0)
        return this.klass.runWithExceptionHandlers(this, function() {
          callable.call(this);
          onSuccess.call(this);
        }, onError);

      var onUncaughtError = function(error) {
        failed = true;
        self.klass.popErrorCathcer();
        if (timeout) JS.ENV.clearTimeout(timeout);
        onError.call(self, error);
      };
      this.klass.pushErrorCathcer(onUncaughtError);

      this.klass.runWithExceptionHandlers(this, function() {
        callable.call(this, function(asyncResult) {
          resumed = true;
          self.klass.popErrorCathcer();
          if (timeout) JS.ENV.clearTimeout(timeout);
          if (failed) return;

          if (typeof asyncResult === 'string') asyncResult = new Error(asyncResult);

          if (typeof asyncResult === 'object')
            onUncaughtError(asyncResult);
          else if (typeof asyncResult === 'function')
            self.exec(asyncResult, onSuccess, onError);
          else
            self.exec(null, onSuccess, onError);
        });
      }, onError);

      if (resumed || !JS.ENV.setTimeout) return;

      timeout = JS.ENV.setTimeout(function() {
        failed = true;
        self.klass.popErrorCathcer();
        var message = 'Timed out after waiting ' + Test.asyncTimeout + ' seconds for test to resume';
        onError.call(self, new Error(message));
      }, Test.asyncTimeout * 1000);
    },

    setup: function() {},

    teardown: function() {},

    defaultTest: function() {
      return this.flunk('No tests were specified');
    },

    passed: function() {
      return this._testPassed;
    },

    size: function() {
      return 1;
    },

    addAssertion: function() {
      this._result.addAssertion();
    },

    addFailure: function(message) {
      this._testPassed = false;
      this._result.addFailure(new Test.Unit.Failure(this, message));
    },

    addError: function(exception) {
      this._testPassed = false;
      this._result.addError(new Test.Unit.Error(this, exception));
    },

    metadata: function() {
      var klassData = this.klass.metadata(),
          shortName = this._methodName.replace(/^test:\W*/ig, '');

      return {
        fullName:   klassData.fullName + ' ' + shortName,
        shortName:  shortName,
        context:    klassData.context.concat(klassData.shortName)
      };
    }
  })
});

Test.UI.extend({
  Terminal: new JS.Class({
    getOptions: function() {
      var options = {},
          format  = Console.envvar('FORMAT'),
          test    = Console.envvar('TEST');

      if (Console.envvar('TAP')) options.format = 'tap';

      if (format) options.format = format;
      if (test)   options.test   = [test];

      delete options.argv;
      options.test = options.test || [];
      return options;
    },

    getReporters: function(options) {
      var R = Test.Reporters,
          Printer = R.get(options.format) || R.Dot;

      return [
        new R.Coverage(options),
        new Printer(options),
        new R.ExitStatus(options)
      ];
    }
  })
});

Test.UI.extend({
  Browser: new JS.Class({
    getOptions: function() {
      var qs      = (location.search || '').replace(/^\?/, ''),
          pairs   = qs.split('&'),
          options = {},
          parts, key, value;

      for (var i = 0, n = pairs.length; i < n; i++) {
        parts = pairs[i].split('=');
        key   = decodeURIComponent(parts[0]);
        value = decodeURIComponent(parts[1]);

        if (/\[\]$/.test(parts[0])) {
          key = key.replace(/\[\]$/, '');
          if (!(options[key] instanceof Array)) options[key] = [];
          options[key].push(value);
        } else {
          options[key] = value;
        }
      }

      if (options.test)
        options.test = [].concat(options.test);
      else
        options.test = [];

      return options;
    },

    getReporters: function(options) {
      var reporters = [],
          R         = Test.Reporters,
          reg       = R._registry,
          browser   = new R.Browser(options),
          reporter;

      reporters.push(new R.Coverage());
      reporters.push(browser);

      for (var name in reg) {
        reporter = reg[name] && reg[name].create && reg[name].create(options, browser);
        if (reporter) reporters.push(reporter);
      }

      return reporters;
    }
  })
});

Test.Reporters.extend({
  Error: new JS.Class({
    include: Console,

    NAMES: {
      failure:  'Failure',
      error:    'Error'
    },

    startSuite: function(event) {
      this._faults = [];
      this._start  = event.timestamp;

      this.consoleFormat('bold');
      this.puts('Loaded suite: ' + event.children.join(', '));
      this.reset();
      this.puts('');
    },

    startContext: function(event) {},

    startTest: function(event) {},

    addFault: function(event) {
      this._faults.push(event);
      this._printFault(this._faults.length, event);
    },

    update: function(event) {},

    endTest: function(event) {},

    endContext: function(event) {},

    endSuite: function(event) {
      this._printSummary(event);
    },

    _printFault: function(index, fault) {
      this.consoleFormat('bold', 'red');
      this.puts(index + ') ' + this.NAMES[fault.error.type] + ': ' + fault.test.fullName);
      this.reset();
      this.puts(fault.error.message);
      if (fault.error.backtrace) {
        this.grey();
        this.puts(fault.error.backtrace);
      }
      this.reset();
      this.puts('');
    },

    _printSummary: function(event) {
      var runtime = (event.timestamp - this._start) / 1000;
      this.reset();
      this.puts('Finished in ' + runtime + ' seconds');

      var color = event.passed ? 'green' : 'red';
      this.consoleFormat(color);
      this.puts(this._plural(event.tests, 'test') + ', ' +
                this._plural(event.assertions, 'assertion') + ', ' +
                this._plural(event.failures, 'failure') + ', ' +
                this._plural(event.errors, 'error'));
      this.reset();
      this.puts('');
    },

    _plural: function(number, noun) {
      return number + ' ' + noun + (number === 1 ? '' : 's');
    }
  })
});

Test.Reporters.register('error', Test.Reporters.Error);

Test.Reporters.extend({
  Dot: new JS.Class(Test.Reporters.Error, {
    SYMBOLS: {
      failure:  'F',
      error:    'E'
    },

    startTest: function(event) {
      this._outputFault = false;
    },

    addFault: function(event) {
      this._faults.push(event);
      if (this._outputFault) return;
      this._outputFault = true;
      this.consoleFormat('bold', 'red');
      this.print(this.SYMBOLS[event.error.type]);
      this.reset();
    },

    endTest: function(event) {
      if (this._outputFault) return;
      this.consoleFormat('green');
      this.print('.');
      this.reset();
    },

    endSuite: function(event) {
      this.puts('\n');

      for (var i = 0, n = this._faults.length; i < n; i++)
        this._printFault(i + 1, this._faults[i]);

      this._printSummary(event);
    }
  })
});

Test.Reporters.register('dot', Test.Reporters.Dot);

Test.Reporters.extend({
  JSON: new JS.Class({
    include: Console,

    _log: function(eventName, data) {
      if (!JS.ENV.JSON) return;
      this.puts(JSON.stringify({jstest: [eventName, data]}));
    },

    extend: {
      create: function() {
        if (!JS.ENV.navigator) return;
        if (Test.Reporters.Headless.UA.test(navigator.userAgent)) return new this();
      },

      Reader: new JS.Class({
        initialize: function(reporter) {
          this._reporter = new Test.Reporters.Composite([reporter]);
        },

        read: function(message) {
          if (!JS.ENV.JSON) return false;
          try {
            var data    = JSON.parse(message),
                payload = data.jstest,
                method  = payload[0],
                event   = payload[1];

            this._reporter[method](event);
            return true;
          }
          catch (e) {
            return false;
          }
        }
      })
    }
  })
});

(function() {
  var methods = Test.Reporters.METHODS,
      n       = methods.length;

  while (n--)
    (function(i) {
      var method = methods[i];
      Test.Reporters.JSON.define(method, function(event) {
        this._log(method, event);
      });
    })(n);
})();

Test.Reporters.register('json', Test.Reporters.JSON);

Test.Reporters.extend({
  TAP: new JS.Class({
    extend: {
      HOSTNAME: 'testling',

      create: function(options) {
        if (!JS.ENV.location) return;
        var parts = location.hostname.split('.');
        if (JS.indexOf(parts, this.HOSTNAME) >= 0) return new this(options);
      }
    },

    include: Console,

    startSuite: function(event) {
      this._testId = 0;
      this.puts('1..' + event.size);
    },

    startContext: function(event) {},

    startTest: function(event) {
      this._testPassed = true;
      this._faults = [];
    },

    addFault: function(event) {
      this._testPassed = false;
      this._faults.push(event);
    },

    endTest: function(event) {
      var line = this._testPassed ? 'ok' : 'not ok';
      line += ' ' + ++this._testId + ' - ' + this._format(event.fullName);
      this.puts(line);

      var fault, message, parts, j, m;
      for (var i = 0, n = this._faults.length; i < n; i++) {
        fault = this._faults[i];
        var message = fault.error.message;
        if (fault.error.backtrace) message += '\n' + fault.error.backtrace;
        parts = message.split(/[\r\n]/);
        for (j = 0, m = parts.length; j < m; j++)
          this.puts('    ' + parts[j]);
      }
    },

    endContext: function(event) {},

    update: function(event) {},

    endSuite: function(event) {},

    _format: function(string) {
      return string.replace(/[\s\t\r\n]+/g, ' ');
    }
  })
});

Test.Reporters.register('tap', Test.Reporters.TAP);

Test.Reporters.extend({
  ExitStatus: new JS.Class({
    startSuite: function(event) {},

    startContext: function(event) {},

    startTest: function(event) {},

    addFault: function(event) {},

    endTest: function(event) {},

    endContext: function(event) {},

    update: function(event) {},

    endSuite: function(event) {
      Console.exit(event.passed ? 0 : 1);
    }
  })
});

// http://phantomjs.org/
// http://slimerjs.org/

Test.Reporters.extend({
  Headless: new JS.Class({
    extend: {
      UA: /\b(PhantomJS|SlimerJS)\b/
    },

    initialize: function(options) {
      this._options = options || {};

      var format = Console.envvar('FORMAT');

      if (Console.envvar('TAP')) format = format || 'tap';
      this._options.format = this._options.format || format;

      var R        = Test.Reporters,
          Printer  = R.get(this._options.format) || R.Dot,
          reporter = new R.Composite();

      reporter.addReporter(new Printer(options));
      reporter.addReporter(new R.ExitStatus());

      this._reader = new R.JSON.Reader(reporter);
    },

    open: function(url) {
      var page = (typeof WebPage === 'function') ? new WebPage() : require('webpage').create(),
          self = this;

      page.onConsoleMessage = function(message) {
        if (!self._reader.read(message)) console.log(message);
      };
      page.open(url);
      return page;
    }
  })
});

Test.Reporters.extend({
  Browser: new JS.Class({
    initialize: function(options) {
      this._options = options || {};
    },

    _contextFor: function(test) {
      var context = this._context,
          scopes  = test.context;

      for (var i = 0, n = scopes.length; i < n; i++)
        context = context.child(scopes[i]);

      return context;
    },

    startSuite: function(event) {
      var self = this;
      if (this._container) document.body.removeChild(this._container);
      this._start = event.timestamp;

      this._container = DOM.div({className: 'test-result-container'}, function(div) {
        div.table({className: 'report'}, function(table) {
          table.thead(function(thead) {
            thead.tr(function(tr) {
              tr.th({scope: 'col'}, 'Tests');
              tr.th({scope: 'col'}, 'Assertions');
              tr.th({scope: 'col'}, 'Failures');
              tr.th({scope: 'col'}, 'Errors');
            });
          });
          table.tbody(function(tbody) {
            tbody.tr(function(tr) {
              self._tests      = tr.td();
              self._assertions = tr.td();
              self._failures   = tr.td();
              self._errors     = tr.td();
            });
          });
        });
        self._light = div.div({className: 'light light-pending'});
        div.p({className: 'user-agent'}, window.navigator.userAgent);
        self._context = new self.klass.Context('spec', div.ul({className: 'specs'}), undefined, self._options);
        self._summary = div.p({className: 'summary'});
      });

      document.body.insertBefore(this._container, document.body.firstChild);
      this.update({tests: 0, assertions: 0, failures: 0, errors: 0});
    },

    startContext: function(event) {},

    startTest: function(event) {
      this._contextFor(event).addTest(event.shortName);
    },

    addFault: function(event) {
      this._contextFor(event.test).child(event.test.shortName).addFault(event.error);
    },

    endTest: function(event) {},

    endContext: function(event) {},

    update: function(event) {
      this._tests.innerHTML      = String(event.tests);
      this._assertions.innerHTML = String(event.assertions);
      this._failures.innerHTML   = String(event.failures);
      this._errors.innerHTML     = String(event.errors);
    },

    endSuite: function(event) {
      this.update(event);
      DOM.removeClass(this._light, 'light-pending');
      DOM.addClass(this._light, event.passed ? 'light-passed' : 'light-failed');

      var runtime = (event.timestamp - this._start) / 1000;
      this._summary.innerHTML = 'Finished in ' + runtime + ' seconds';
    },

    serialize: function() {
      var items = document.getElementsByTagName('li'),
          n     = items.length;
      while (n--) DOM.removeClass(items[n], 'closed');

      var items = document.getElementsByTagName('script'),
          n     = items.length;
      while (n--) items[n].parentNode.removeChild(items[n]);

      var html = document.getElementsByTagName('html')[0];
      return '<!doctype html><html>' + html.innerHTML + '</html>';
    }
  })
});

Test.Reporters.Browser.extend({
  Context: new JS.Class({
    initialize: function(type, parent, name, options) {
      this._parent   = parent;
      this._type     = type;
      this._name     = name;
      this._options  = options;
      this._children = [];

      if (name === undefined) {
        this._ul = parent;
        return;
      }

      var container = this._parent._ul || this._parent,
          fields    = {_tests: 'Tests', _failures: 'Failed'},
          self      = this;

      this._li = new DOM.Builder(container).li({className: this._type + ' passed'}, function(li) {
        li.ul({className: 'stats'}, function(ul) {
          for (var key in fields)
            ul.li(function(li) {
              li.span({className: 'label'}, fields[key] + ': ');
              self[key] = li.span({className: 'number'}, '0');
            });
        });
        if (name) {
          self._toggle = li.p({className: self._type + '-name'}, name);
          self._runner = DOM.span({className: 'runner'}, 'Run');
          self._toggle.insertBefore(self._runner, self._toggle.firstChild);
        }
        self._ul = li.ul({className: 'children'});
      });

      var filters = this._options.test || [];
      if (filters.length === 0)
        DOM.addClass(this._li, 'closed');

      DOM.Event.on(this._toggle, 'click', function() {
        DOM.toggleClass(this._li, 'closed');
      }, this);

      if (this._runner)
        DOM.Event.on(this._runner, 'click', this.runTest, this);
    },

    ping: function(field) {
      if (!this[field]) return;
      this[field].innerHTML = parseInt(this[field].innerHTML) + 1;
      if (this._parent.ping) this._parent.ping(field);
    },

    fail: function() {
      if (!this._li) return;
      DOM.removeClass(this._li, 'passed');
      DOM.addClass(this._toggle, 'failed');
      if (this._parent.fail) this._parent.fail();
    },

    child: function(name) {
      return this._children[name] = this._children[name] ||
                                    new this.klass('spec', this, name, this._options);
    },

    addTest: function(name) {
      var test = this._children[name] = new this.klass('test', this, name, this._options);
      test.ping('_tests');
    },

    addFault: function(fault) {
      var message = fault.message;
      if (fault.backtrace) message += '\n' + fault.backtrace;

      var item = DOM.li({className: 'fault'}, function(li) {
        li.p(function(p) {
          var parts = message.split(/[\r\n]+/);
          for (var i = 0, n = parts.length; i < n; i++) {
            if (i > 0) p.br();
            p.concat(parts[i]);
          }
        });
      });
      this._ul.appendChild(item);
      this.ping('_failures');
      this.fail();
    },

    getName: function() {
      var parts  = [],
          parent = this._parent && this._parent.getName && this._parent.getName();

      if (parent) parts.push(parent);
      parts.push(this._name);
      return parts.join(' ');
    },

    runTest: function() {
      window.location.search = 'test=' + encodeURIComponent(this.getName());
    }
  })
});

Test.Reporters.extend({
  Coverage: new JS.Class({
    include: Console,

    startSuite: function(event) {},

    startContext: function(event) {},

    startTest: function(event) {},

    addFault: function(event) {},

    endTest: function(event) {},

    endContext: function(event) {},

    update: function(event) {},

    endSuite: function(event) {
      var reports = Test.Unit.TestCase.reports;
      for (var i = 0, n = reports.length; i < n; i++) {
        this.reset();
        this.puts('');
        reports[i].report();
      }
    }
  })
});

Test.Reporters.extend({
  Composite: new JS.Class({
    initialize: function(reporters) {
      this._reporters = reporters || [];
      this._queue     = [];
      this._pointer   = 0;
    },

    addReporter: function(reporter) {
      if (!reporter) return;
      this._reporters.push(reporter);
    },

    removeReporter: function(reporter) {
      var index = JS.indexOf(this._reporters, reporter);
      if (index >= 0) this._reporters.splice(index, 1);
    },

    flush: function() {
      var queue = this._queue, method, event, i, n, fn;
      while (queue[this._pointer] !== undefined) {
        method = queue[this._pointer][0];
        event =  queue[this._pointer][1];
        for (i = 0, n = this._reporters.length; i < n; i++) {
          fn = this._reporters[i][method];
          if (fn) fn.call(this._reporters[i], event);
        }
        this._pointer += 1;
      }
    }
  })
});

(function() {
  var methods = Test.Reporters.METHODS,
      n       = methods.length;

  while (n--)
    (function(i) {
      var method = methods[i];
      Test.Reporters.Composite.define(method, function(event) {
        this._queue[event.eventId] = [method, event];
        this.flush();
      });
    })(n);
})();

// https://github.com/jquery/testswarm

Test.Reporters.extend({
  TestSwarm: new JS.Class({
    extend: {
      create: function(options, browser) {
        if (JS.ENV.TestSwarm) return new this(options, browser);
      }
    },

    initialize: function(options, browserReporter) {
      this._browserReporter = browserReporter;

      TestSwarm.serialize = function() {
        return browserReporter.serialize();
      };
    },

    startSuite: function(event) {},

    startContext: function(event) {},

    startTest: function(event) {},

    addFault: function(event) {},

    endTest: function(event) {
      TestSwarm.heartbeat();
    },

    endContext: function(event) {},

    update: function(event) {},

    endSuite: function(event) {
      TestSwarm.submit({
        fail:   event.failures,
        error:  event.errors,
        total:  event.tests
      });
    }
  })
});

Test.Reporters.register('testswarm', Test.Reporters.TestSwarm);

Test.extend({
  Context: new JS.Module({
    extend: {
      included: function(base) {
        base.extend(Test.Context.Context, {_resolve: false});
        base.include(Test.Context.LifeCycle, {_resolve: false});
        base.extend(Test.Context.Test, {_resolve: false});
        base.include(Console);
      },

      Context: new JS.Module({
        context: function(name, block) {
          var klass = new JS.Class(name.toString(), this, {}, {_resolve: false});
          klass.__eigen__().resolve();
          block.call(klass);
          return klass;
        },

        cover: function(module) {
          var logger = new Test.Coverage(module);
          this.before_all_callbacks.push(logger.method('attach'));
          this.after_all_callbacks.push(logger.method('detach'));
          Test.Unit.TestCase.reports.push(logger);
        }
      })
    }
  }),

  describe: function(name, block) {
    var klass = new JS.Class(name.toString(), Test.Unit.TestCase, {}, {_resolve: false});
    klass.include(Test.Context, {_resolve: false});
    klass.__eigen__().resolve();

    block.call(klass);
    return klass;
  }
});

Test.Context.Context.alias({describe: 'context'});

Test.extend({
  context:  Test.describe
});

Test.Context.LifeCycle = new JS.Module({
  extend: {
    included: function(base) {
      base.extend(this.ClassMethods);

      base.before_all_callbacks     = [];
      base.before_each_callbacks    = [];
      base.after_all_callbacks      = [];
      base.after_each_callbacks     = [];
      base.before_should_callbacks  = {};

      base.extend({
        inherited: function(child) {
          this.callSuper();
          child.before_all_callbacks    = [];
          child.before_each_callbacks   = [];
          child.after_all_callbacks     = [];
          child.after_each_callbacks    = [];
          child.before_should_callbacks = {};
        }
      });
    },

    ClassMethods: new JS.Module({
      blockTransform: function(block) {
        return block;
      },

      before: function(period, block) {
        if (block === undefined) {
          block  = period;
          period = 'each';
        }

        this['before_' + (period + '_') + 'callbacks'].push(this.blockTransform(block));
      },

      after: function(period, block) {
        if (block === undefined) {
          block  = period;
          period = 'each';
        }

        this['after_' + (period + '_') + 'callbacks'].push(this.blockTransform(block));
      },

      gatherCallbacks: function(callbackType, period) {
        var outerCallbacks = (typeof this.superclass.gatherCallbacks === 'function')
          ? this.superclass.gatherCallbacks(callbackType, period)
          : [];

        var mine = this[callbackType + '_' + (period + '_') + 'callbacks'];

        return (callbackType === 'before')
                ? outerCallbacks.concat(mine)
                : mine.concat(outerCallbacks);
      }
    })
  },

  setup: function(resume) {
    if (this.klass.before_should_callbacks[this._methodName])
      this.klass.before_should_callbacks[this._methodName].call(this);

    this.runCallbacks('before', 'each', resume);
  },

  teardown: function(resume) {
    this.runCallbacks('after', 'each', resume);
  },

  runCallbacks: function(callbackType, period, continuation) {
    var callbacks = this.klass.gatherCallbacks(callbackType, period);

    Test.Unit.TestSuite.forEach(callbacks, function(callback, resume) {
      this.exec(callback, resume, continuation);
    }, continuation, this);
  },

  runAllCallbacks: function(callbackType, continuation, context) {
    var previousIvars = this.instanceVariables();
    this.runCallbacks(callbackType, 'all', function() {

      var ivars = this.instanceVariables().inject({}, function(hash, ivar) {
        if (previousIvars.member(ivar)) return hash;
        hash[ivar] = this[ivar];
        return hash;
      }, this);

      if (continuation) continuation.call(context, ivars);
    });
  },

  setValuesFromCallbacks: function(values) {
    for (var key in values)
      this[key] = values[key];
  },

  instanceVariables: function() {
    var ivars = [];
    for (var key in this) {
      if (this.hasOwnProperty(key)) ivars.push(key);
    }
    return new Enumerable.Collection(ivars);
  }
});

(function() {
  var m = Test.Context.LifeCycle.ClassMethods.method('instanceMethod');

  Test.Context.LifeCycle.ClassMethods.include({
    setup:    m('before'),
    teardown: m('after')
  });
})();

Test.Context.extend({
  SharedBehavior: new JS.Class(JS.Module, {
    extend: {
      createFromBehavior: function(beh) {
        var mod = new this();
        mod._behavior = beh;
        return mod;
      },

      moduleName: function(name) {
        return name.toLowerCase()
                   .replace(/[\s:',\.~;!#=\(\)&]+/g, '_')
                   .replace(/\/(.?)/g, function(m,a) { return '.' + a.toUpperCase() })
                   .replace(/(?:^|_)(.)/g, function(m,a) { return a.toUpperCase() });
      }
    },

    included: function(arg) {
      this._behavior.call(arg);
    }
  })
});

Test.Unit.TestCase.extend({
  shared: function(name, block) {
    name = Test.Context.SharedBehavior.moduleName(name);
    JS.ENV[name] = Test.Context.SharedBehavior.createFromBehavior(block);
  },

  use: function(sharedName) {
    if (JS.isType(sharedName, Test.Context.SharedBehavior) ||
        JS.isType(sharedName, JS.Module))
      this.include(sharedName);

    else if (JS.isType(sharedName, 'string')) {
      var name = Test.Context.SharedBehavior.moduleName(sharedName),
          beh  = JS.ENV[name];

      if (!beh) throw new Error('Could not find example group named "' + sharedName + '"');
      this.include(beh);
    }
  }
});

(function() {
  var alias = function(method, aliases) {
    var extension = {};
    for (var i = 0, n = aliases.length; i < n; i++)
      extension[aliases[i]] = Test.Unit.TestCase[method];
    Test.Unit.TestCase.extend(extension);
  };

  alias('shared', ['sharedBehavior', 'shareAs', 'shareBehaviorAs', 'sharedExamplesFor']);
  alias('use', ['uses', 'itShouldBehaveLike', 'behavesLike', 'usesExamplesFrom']);
})();

Test.Context.Test = new JS.Module({
  test: function(name, opts, block) {
    var testName = 'test: ' + name;

    if (JS.indexOf(this.instanceMethods(false), testName) >= 0)
      throw new Error(testName + ' is already defined in ' + this.displayName);

    opts = opts || {};

    if (typeof opts === 'function') {
      block = opts;
    } else {
      if (opts.before !== undefined)
        this.before_should_callbacks[testName] = opts.before;
    }

    this.define(testName, this.blockTransform(block), {_resolve: false});
  },

  beforeTest: function(name, block) {
    this.it(name, {before: block}, function() {});
  }
});

Test.Context.Test.alias({
  it:           'test',
  should:       'test',
  tests:        'test',
  beforeIt:     'beforeTest',
  beforeShould: 'beforeTest',
  beforeTests:  'beforeTest'
});

(function() {
  var suite = Test.Unit.TestCase.suite;

  Test.Unit.TestCase.extend({
    // Tweaks to standard method so we don't get superclass methods and we don't
    // get weird default tests
    suite: function(filter) {
      return suite.call(this, filter, false, false);
    }
  });
})();

Test.Unit.TestSuite.include({
  run: function(result, continuation, callback, context) {
    if (this._metadata.fullName)
      callback.call(context, this.klass.STARTED, this);

    var withIvars = function(ivarsFromCallback) {
      this.forEach(function(test, resume) {
        if (ivarsFromCallback && test.setValuesFromCallbacks)
          test.setValuesFromCallbacks(ivarsFromCallback);

        test.run(result, resume, callback, context);

      }, function() {
        var afterCallbacks = function() {
          if (this._metadata.fullName)
            callback.call(context, this.klass.FINISHED, this);

          continuation.call(context);
        };
        if (ivarsFromCallback && first.runAllCallbacks)
          first.runAllCallbacks('after', afterCallbacks, this);
        else
          afterCallbacks.call(this);

      }, this);
    };

    var first = this._tests[0], ivarsFromCallback = null;

    if (first && first.runAllCallbacks)
      first.runAllCallbacks('before', withIvars, this);
    else
      withIvars.call(this, null);
  }
});

Test.extend({
  Mocking: new JS.Module({
    extend: {
      ExpectationError: new JS.Class(Test.Unit.AssertionFailedError),

      UnexpectedCallError: new JS.Class(Error, {
        initialize: function(message) {
          this.message = message.toString();
        }
      }),

      __activeStubs__: [],

      stub: function(object, methodName, implementation) {
        var constructor = false;

        if (object === 'new') {
          object         = methodName;
          methodName     = implementation;
          implementation = undefined;
          constructor    = true;
        }
        if (JS.isType(object, 'string')) {
          implementation = methodName;
          methodName     = object;
          object         = JS.ENV;
        }

        var stubs = this.__activeStubs__,
            i     = stubs.length;

        while (i--) {
          if (stubs[i]._object === object && stubs[i]._methodName === methodName)
            return stubs[i].defaultMatcher(implementation);
        }

        var stub = new Test.Mocking.Stub(object, methodName, constructor);
        stubs.push(stub);
        return stub.defaultMatcher(implementation);
      },

      removeStubs: function() {
        var stubs = this.__activeStubs__,
            i     = stubs.length;

        while (i--) stubs[i].revoke();
        this.__activeStubs__ = [];
      },

      verify: function() {
        try {
          var stubs = this.__activeStubs__;
          for (var i = 0, n = stubs.length; i < n; i++)
            stubs[i]._verify();
        } finally {
          this.removeStubs();
        }
      },

      Stub: new JS.Class({
        initialize: function(object, methodName, constructor) {
          this._object      = object;
          this._methodName  = methodName;
          this._constructor = constructor;
          this._original    = object[methodName];

          this._ownProperty = object.hasOwnProperty
                            ? object.hasOwnProperty(methodName)
                            : (typeof this._original !== 'undefined');

          var mocking = Test.Mocking;

          this._argMatchers = [];
          this._anyArgs     = new mocking.Parameters([new mocking.AnyArgs()]);
          this._expected    = false;

          this.apply();
        },

        defaultMatcher: function(implementation) {
          if (implementation !== undefined && typeof implementation !== 'function') {
            this._object[this._methodName] = implementation;
            return this;
          }

          this._activateLastMatcher();
          this._currentMatcher = this._anyArgs;
          if (typeof implementation === 'function')
            this._currentMatcher._fake = implementation;
          return this;
        },

        apply: function() {
          var object = this._object, methodName = this._methodName;
          if (object[methodName] !== this._original) return;

          var self = this;
          this._shim = function() { return self._dispatch(this, arguments) };
          object[methodName] = this._shim;
        },

        revoke: function() {
          if (this._ownProperty)
            this._object[this._methodName] = this._original;
          else
            try { delete this._object[this._methodName] }
            catch (e) { this._object[this._methodName] = undefined }
        },

        expected: function() {
          this._expected = true;
          this._anyArgs._expected = true;
        },

        _activateLastMatcher: function() {
          if (this._currentMatcher) this._currentMatcher._active = true;
        },

        _dispatch: function(receiver, args) {
          this._activateLastMatcher();
          var matchers = this._argMatchers.concat(this._anyArgs),
              matcher, result, message;

          if (this._constructor && !(receiver instanceof this._shim)) {
            message = new Test.Unit.AssertionMessage('',
                          '<?> expected to be a constructor but called without `new`',
                          [this._original]);

            throw new Test.Mocking.UnexpectedCallError(message);
          }

          this._anyArgs.ping();

          for (var i = 0, n = matchers.length; i < n; i++) {
            matcher = matchers[i];
            result  = matcher.match(args);

            if (!result) continue;
            if (matcher !== this._anyArgs) matcher.ping();

            if (result.fake)
              return result.fake.apply(receiver, args);

            if (result.exception) throw result.exception;

            if (result.hasOwnProperty('callback')) {
              if (!result.callback) continue;
              result.callback.apply(result.context, matcher.nextYieldArgs());
            }

            if (result) return matcher.nextReturnValue();
          }

          if (this._constructor) {
            message = new Test.Unit.AssertionMessage('',
                          '<?> constructed with unexpected arguments:\n(?)',
                          [this._original, JS.array(args)]);
          } else {
            message = new Test.Unit.AssertionMessage('',
                          '<?> received call to ' + this._methodName + '() with unexpected arguments:\n(?)',
                          [receiver, JS.array(args)]);
          }

          throw new Test.Mocking.UnexpectedCallError(message);
        },

        _verify: function() {
          if (!this._expected) return;

          for (var i = 0, n = this._argMatchers.length; i < n; i++)
            this._verifyParameters(this._argMatchers[i]);

          this._verifyParameters(this._anyArgs);
        },

        _verifyParameters: function(parameters) {
          var object = this._constructor ? this._original : this._object;
          parameters.verify(object, this._methodName, this._constructor);
        }
      })
    }
  })
});

Test.Mocking.extend({
  Parameters: new JS.Class({
    initialize: function(params, expected) {
      this._params    = JS.array(params);
      this._expected  = expected;
      this._active    = false;
      this._callsMade = 0;
    },

    toArray: function() {
      var array = this._params.slice();
      if (this._yieldArgs) array.push(new Test.Mocking.InstanceOf(Function));
      return array;
    },

    returns: function(returnValues) {
      this._returnIndex = 0;
      this._returnValues = returnValues;
    },

    nextReturnValue: function() {
      if (!this._returnValues) return undefined;
      var value = this._returnValues[this._returnIndex];
      this._returnIndex = (this._returnIndex + 1) % this._returnValues.length;
      return value;
    },

    yields: function(yieldValues) {
      this._yieldIndex = 0;
      this._yieldArgs = yieldValues;
    },

    nextYieldArgs: function() {
      if (!this._yieldArgs) return undefined;
      var value = this._yieldArgs[this._yieldIndex];
      this._yieldIndex = (this._yieldIndex + 1) % this._yieldArgs.length;
      return value;
    },

    setMinimum: function(n) {
      this._expected = true;
      this._minimumCalls = n;
    },

    setMaximum: function(n) {
      this._expected = true;
      this._maximumCalls = n;
    },

    setExpected: function(n) {
      this._expected = true;
      this._expectedCalls = n;
    },

    match: function(args) {
      if (!this._active) return false;

      var argsCopy = JS.array(args), callback, context;

      if (this._yieldArgs) {
        if (typeof argsCopy[argsCopy.length - 2] === 'function') {
          context  = argsCopy.pop();
          callback = argsCopy.pop();
        } else if (typeof argsCopy[argsCopy.length - 1] === 'function') {
          context  = null;
          callback = argsCopy.pop();
        }
      }

      if (!Enumerable.areEqual(this._params, argsCopy)) return false;

      var result = {};

      if (this._exception) { result.exception = this._exception }
      if (this._yieldArgs) { result.callback = callback; result.context = context }
      if (this._fake)      { result.fake = this._fake }

      return result;
    },

    ping: function() {
      this._callsMade += 1;
    },

    verify: function(object, methodName, constructor) {
      if (!this._expected) return;

      var okay = true, extraMessage;

      if (this._callsMade === 0 && this._maximumCalls === undefined && this._expectedCalls === undefined) {
        okay = false;
      } else if (this._expectedCalls !== undefined && this._callsMade !== this._expectedCalls) {
        extraMessage = this._createMessage('exactly');
        okay = false;
      } else if (this._maximumCalls !== undefined && this._callsMade > this._maximumCalls) {
        extraMessage = this._createMessage('at most');
        okay = false;
      } else if (this._minimumCalls !== undefined && this._callsMade < this._minimumCalls) {
        extraMessage = this._createMessage('at least');
        okay = false;
      }
      if (okay) return;

      var message;
      if (constructor) {
        message = new Test.Unit.AssertionMessage('Mock expectation not met',
                      '<?> expected to be constructed with\n(?)' +
                      (extraMessage ? '\n' + extraMessage : ''),
                      [object, this.toArray()]);
      } else {
        message = new Test.Unit.AssertionMessage('Mock expectation not met',
                      '<?> expected to receive call\n' + methodName + '(?)' +
                      (extraMessage ? '\n' + extraMessage : ''),
                      [object, this.toArray()]);
      }

      throw new Test.Mocking.ExpectationError(message);
    },

    _createMessage: function(type) {
      var actual = this._callsMade,
          report = 'but ' + actual + ' call' + (actual === 1 ? ' was' : 's were') + ' made';

      var copy = {
        'exactly':   this._expectedCalls,
        'at most':   this._maximumCalls,
        'at least':  this._minimumCalls
      };
      return type + ' ' + copy[type] + ' times\n' + report;
    }
  })
});

Test.Mocking.extend({
  Anything: new JS.Class({
    equals: function() { return true },
    toString: function() { return 'anything' }
  }),

  AnyArgs: new JS.Class({
    equals: function() { return Enumerable.ALL_EQUAL },
    toString: function() { return '*arguments' }
  }),

  ArrayIncluding: new JS.Class({
    initialize: function(elements) {
      this._elements = Array.prototype.slice.call(elements);
    },

    equals: function(array) {
      if (!JS.isType(array, Array)) return false;
      var i = this._elements.length, j;
      loop: while (i--) {
        j = array.length;
        while (j--) {
          if (Enumerable.areEqual(this._elements[i], array[j]))
            continue loop;
        }
        return false;
      }
      return true;
    },

    toString: function() {
      var name = Console.convert(this._elements);
      return 'arrayIncluding(' + name + ')';
    }
  }),

  ObjectIncluding: new JS.Class({
    initialize: function(elements) {
      this._elements = elements;
    },

    equals: function(object) {
      if (!JS.isType(object, Object)) return false;
      for (var key in this._elements) {
        if (!Enumerable.areEqual(this._elements[key], object[key]))
          return false;
      }
      return true;
    },

    toString: function() {
      var name = Console.convert(this._elements);
      return 'objectIncluding(' + name + ')';
    }
  }),

  InstanceOf: new JS.Class({
    initialize: function(type) {
      this._type = type;
    },

    equals: function(object) {
      return JS.isType(object, this._type);
    },

    toString: function() {
      var name = Console.convert(this._type),
          an   = /^[aeiou]/i.test(name) ? 'an' : 'a';
      return an + '(' + name + ')';
    }
  }),

  Matcher: new JS.Class({
    initialize: function(type) {
      this._type = type;
    },

    equals: function(object) {
      return JS.match(this._type, object);
    },

    toString: function() {
      var name = Console.convert(this._type);
      return 'matching(' + name + ')';
    }
  })
});

Test.Mocking.Stub.include({
  given: function() {
    var matcher = new Test.Mocking.Parameters(arguments, this._expected);
    this._argMatchers.push(matcher);
    this._currentMatcher = matcher;
    return this;
  },

  raises: function(exception) {
    this._currentMatcher._exception = exception;
    return this;
  },

  returns: function() {
    this._currentMatcher.returns(arguments);
    return this;
  },

  yields: function() {
    this._currentMatcher.yields(arguments);
    return this;
  },

  atLeast: function(n) {
    this._currentMatcher.setMinimum(n);
    return this;
  },

  atMost: function(n) {
    this._currentMatcher.setMaximum(n);
    return this;
  },

  exactly: function(n) {
    this._currentMatcher.setExpected(n);
    return this;
  }
});

Test.Mocking.Stub.alias({
  raising:    'raises',
  returning:  'returns',
  yielding:   'yields'
});

Test.Mocking.extend({
  DSL: new JS.Module({
    stub: function() {
      return Test.Mocking.stub.apply(Test.Mocking, arguments);
    },

    expect: function() {
      var stub = Test.Mocking.stub.apply(Test.Mocking, arguments);
      stub.expected();
      this.addAssertion();
      return stub;
    },

    anything: function() {
      return new Test.Mocking.Anything();
    },

    anyArgs: function() {
      return new Test.Mocking.AnyArgs();
    },

    instanceOf: function(type) {
      return new Test.Mocking.InstanceOf(type);
    },

    match: function(type) {
      return new Test.Mocking.Matcher(type);
    },

    arrayIncluding: function() {
      return new Test.Mocking.ArrayIncluding(arguments);
    },

    objectIncluding: function(elements) {
      return new Test.Mocking.ObjectIncluding(elements);
    }
  })
});

Test.Unit.TestCase.include(Test.Mocking.DSL);
Test.Unit.mocking = Test.Mocking;

Test.extend({
  AsyncSteps: new JS.Class(JS.Module, {
    define: function(name, method) {
      this.callSuper(name, function() {
        var args = [name, method].concat(JS.array(arguments));
        this.__enqueue__(args);
      });
    },

    included: function(klass) {
      klass.include(Test.AsyncSteps.Sync);
      if (!klass.blockTransform) return;

      klass.extend({
        blockTransform: function(block) {
          return function(resume) {
            this.exec(block, function(error) {
              this.sync(function() { resume(error) });
            });
          };
        }
      });
    },

    extend: {
      Sync: new JS.Module({
        __enqueue__: function(args) {
          this.__stepQueue__ = this.__stepQueue__ || [];
          this.__stepQueue__.push(args);
          if (this.__runningSteps__) return;
          this.__runningSteps__ = true;

          var setTimeout = Test.FakeClock.REAL.setTimeout;
          setTimeout(this.method('__runNextStep__'), 1);
        },

        __runNextStep__: function(error) {
          if (typeof error === 'object') return this.addError(error);

          var step = this.__stepQueue__.shift(), n;

          if (!step) {
            this.__runningSteps__ = false;
            if (!this.__stepCallbacks__) return;

            n = this.__stepCallbacks__.length;
            while (n--) this.__stepCallbacks__.shift().call(this);

            return;
          }

          var methodName = step.shift(),
              method     = step.shift(),
              parameters = step.slice(),
              block      = function() { method.apply(this, parameters) };

          parameters[method.length - 1] = this.method('__runNextStep__');
          if (!this.exec) return block.call(this);
          this.exec(block, function() {}, this.method('__endSteps__'));
        },

        __endSteps__: function(error) {
          Test.Unit.TestCase.processError(this, error);
          this.__stepQueue__ = [];
          this.__runNextStep__();
        },

        addError: function() {
          this.callSuper();
          this.__endSteps__();
        },

        sync: function(callback) {
          if (!this.__runningSteps__) return callback.call(this);
          this.__stepCallbacks__ = this.__stepCallbacks__ || [];
          this.__stepCallbacks__.push(callback);
        }
      })
    }
  }),

  asyncSteps: function(methods) {
    return new this.AsyncSteps(methods);
  }
});

Test.extend({
  FakeClock: new JS.Module({
    extend: {
      API: new JS.Singleton({
        METHODS: ['Date', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'],

        stub: function() {
          var mocking = Test.Mocking,
              methods = this.METHODS,
              i       = methods.length;

          Test.FakeClock.reset();

          while (i--)
            mocking.stub(methods[i], Test.FakeClock.method(methods[i]));

          Date.now = Test.FakeClock.REAL.Date.now;
        },

        reset: function() {
          return Test.FakeClock.reset();
        },

        tick: function(milliseconds) {
          return Test.FakeClock.tick(milliseconds);
        }
      }),

      REAL: {},

      Schedule: new JS.Class(SortedSet, {
        nextScheduledAt: function(time) {
          return this.find(function(timeout) { return timeout.time <= time });
        }
      }),

      Timeout: new JS.Class({
        include: JS.Comparable,

        initialize: function(callback, interval, repeat) {
          this.callback = callback;
          this.interval = interval;
          this.repeat   = repeat;
        },

        compareTo: function(other) {
          return this.time - other.time;
        },

        toString: function() {
          return (this.repeat ? 'Interval' : 'Timeout') +
                '(' + this.interval + ')' +
                ':' + this.time;
        }
      }),

      reset: function() {
        this._currentTime = new Date().getTime();
        this._callTime    = this._currentTime;
        this._schedule    = new this.Schedule();
      },

      tick: function(milliseconds) {
        this._currentTime += milliseconds;
        var timeout;
        while (timeout = this._schedule.nextScheduledAt(this._currentTime))
          this._run(timeout);
        this._callTime = this._currentTime;
      },

      _run: function(timeout) {
        this._callTime = timeout.time;
        timeout.callback();

        if (timeout.repeat) {
          timeout.time += timeout.interval;
          this._schedule.rebuild();
        } else {
          this.clearTimeout(timeout);
        }
      },

      _timer: function(callback, milliseconds, repeat) {
        var timeout = new this.Timeout(callback, milliseconds, repeat);
        timeout.time = this._callTime + milliseconds;
        this._schedule.add(timeout);
        return timeout;
      },

      Date: function() {
        var date = new Test.FakeClock.REAL.Date();
        date.setTime(this._callTime);
        return date;
      },

      setTimeout: function(callback, milliseconds) {
        return this._timer(callback, milliseconds, false);
      },

      setInterval: function(callback, milliseconds) {
        return this._timer(callback, milliseconds, true);
      },

      clearTimeout: function(timeout) {
        this._schedule.remove(timeout)
      },

      clearInterval: function(timeout) {
        this._schedule.remove(timeout);
      }
    }
  })
});

Test.FakeClock.include({
  clock: Test.FakeClock.API
});

(function() {
  var methods = Test.FakeClock.API.METHODS,
      i       = methods.length;

  while (i--) Test.FakeClock.REAL[methods[i]] = JS.ENV[methods[i]];
})();

Test.extend({
  Coverage: new JS.Class({
    initialize: function(module) {
      this._module = module;
      this._methods = new Hash([]);

      var storeMethods = function(module) {
        var methods = module.instanceMethods(false),
            i = methods.length;
        while (i--) this._methods.store(module.instanceMethod(methods[i]), 0);
      };
      storeMethods.call(this, module);
      storeMethods.call(this, module.__eigen__());
    },

    attach: function() {
      var module = this._module;
      StackTrace.addObserver(this);
      JS.Method.trace([module, module.__eigen__()]);
    },

    detach: function() {
      var module = this._module;
      JS.Method.untrace([module, module.__eigen__()]);
      StackTrace.removeObserver(this);
    },

    update: function(event, frame) {
      if (event !== 'call') return;
      var pair = this._methods.assoc(frame.method);
      if (pair) pair.setValue(pair.value + 1);
    },

    report: function() {
      var methods = this._methods.entries().sort(function(a,b) {
        return b.value - a.value;
      });
      var covered = this._methods.all(function(pair) { return pair.value > 0 });

      this.printTable(methods, function(row, i) {
        if (row[1] === 0) return ['bgred', 'white'];
        return (i % 2 === 0) ? ['bold'] : [];
      });
      return covered;
    },

    printTable: function(table, formatter) {
      var widths = [],
          table  = [['Method', 'Calls']].concat(table),
          C = Console,
          i = table.length,
          j, string;

      while (i--) {
        j = table[i].length;
        while (j--) {
          widths[j] = widths[j] || 0;
          string = (table[i][j] === undefined ? '' : table[i][j]).toString();
          widths[j] = Math.max(string.length, widths[j]);
        }
      }

      var divider = '+', j = widths.length;
      while (j--) divider = '+' + this.repeat('-', widths[j] + 2) + divider;
      divider = '  ' + divider;
      C.reset();
      C.puts();
      C.puts(divider);

      var printRow = function(row, format) {
        var data = table[row];
        C.reset();
        C.print('  ');
        for (var i = 0, n = data.length; i < n; i++) {
          C.reset();
          C.print('|');
          C.consoleFormat.apply(C, format);
          C.print(' ' + this.pad(data[i], widths[i]) + ' ');
        }
        C.reset();
        C.puts('|');
      };
      printRow.call(this, 0, ['bold']);
      C.reset();
      C.puts(divider);

      for (var i = 1, n = table.length; i < n; i++) {
        var format = formatter ? formatter(table[i], i) : [];
        printRow.call(this, i, format);
      }
      C.reset();
      C.puts(divider);
    },

    pad: function(string, width) {
      string = (string === undefined ? '' : string).toString();
      return string + this.repeat(' ', width - string.length);
    },

    repeat: function(string, n) {
      var result = '';
      while (n--) result += string;
      return result;
    }
  })
});

Test.extend({
  Helpers: new JS.Module({
    $R: function(start, end) {
      return new Range(start, end);
    },

    $w: function(string) {
      return string.split(/\s+/);
    },

    forEach: function(list, block, context) {
      for (var i = 0, n = list.length; i < n; i++) {
        block.call(context, list[i], i);
      }
    },

    its: function() {
      return new MethodChain();
    },

    map: function(list, block, context) {
      return new Enumerable.Collection(list).map(block, context)
    },

    repeat: function(n, block, context) {
      while (n--) block.call(context);
    }
  })
});

Test.extend({
  Runner: new JS.Class({
    initialize: function(settings) {
      this._settings = (typeof settings === 'string')
                     ? {format: settings}
                     : (settings || {});

      this._ui = this.klass.getUI(this._settings);
    },

    run: function(callback, context) {
      this.prepare(function() {
        this.start(callback, context);
      }, this);
    },

    prepare: function(callback, context) {
      var R    = Test.Reporters._registry,
          n    = 0,
          done = false;

      for (var name in R) {
        if (!R[name] || !R[name].prepare) continue;
        n += 1;
        R[name].prepare(function() {
          n -= 1;
          if (n === 0 && done) callback.call(context);
        });
      }
      done = true;
      if (n === 0) callback.call(context);
    },

    start: function(callback, context) {
      var options   = this.getOptions(),
          reporters = this._ui.getReporters(options),
          suite     = this.getSuite(options);

      this.setReporter(new Test.Reporters.Composite(reporters));
      if (callback) callback.call(context, this);

      var testResult = new Test.Unit.TestResult(),
          TR         = Test.Unit.TestResult,
          TS         = Test.Unit.TestSuite,
          TC         = Test.Unit.TestCase;

      var resultListener = testResult.addListener(TR.CHANGED, function() {
        var result = testResult.metadata();
        this._reporter.update(this.klass.timestamp(result));
      }, this);

      var faultListener = testResult.addListener(TR.FAULT, function(fault) {
        this._reporter.addFault(this.klass.timestamp(fault.metadata()));
      }, this);

      var reportResult = function() {
        testResult.removeListener(TR.CHANGED, resultListener);
        testResult.removeListener(TR.FAULT, faultListener);

        var result = testResult.metadata();
        this._reporter.endSuite(this.klass.timestamp(result));
      };

      var reportEvent = function(channel, testCase) {
        var event = this.klass.timestamp(testCase.metadata());
        if (channel === TS.STARTED)       this._reporter.startContext(event);
        else if (channel === TC.STARTED)  this._reporter.startTest(event);
        else if (channel === TC.FINISHED) this._reporter.endTest(event);
        else if (channel === TS.FINISHED) this._reporter.endContext(event);
      };

      this.klass.reportEventId = 0;
      this._reporter.startSuite(this.klass.timestamp(suite.metadata(true)));

      suite.run(testResult, reportResult, reportEvent, this);
    },

    addReporter: function(reporter) {
      var current = this._reporter;
      if (!(current instanceof Test.Reporters.Composite)) {
        this._reporter = new Test.Reporters.Composite();
        this._reporter.addReporter(current);
      }
      this._reporter.addReporter(reporter);
    },

    setReporter: function(reporter) {
      this._reporter = reporter;
    },

    getOptions: function() {
      return JS.extend(this._ui.getOptions(), this._settings);
    },

    getSuite: function(options) {
      var filter = options.test;
      Test.Unit.TestCase.resolve();
      var suite = Test.Unit.TestCase.suite(filter);
      Test.Unit.TestCase.clear();
      return suite;
    },

    extend: {
      timestamp: function(event) {
        event.eventId = this.reportEventId++;
        event.timestamp = new JS.Date().getTime();
        return event;
      },

      getUI: function(settings) {
        if (Console.BROWSER && !Console.PHANTOM)
          return new Test.UI.Browser(settings);
        else
          return new Test.UI.Terminal(settings);
      },

      filter: function(objects, suffix) {
        var filter = this.getUI().getOptions().test,
            n      = filter.length,
            output = [],
            m, object;

        if (n === 0) return objects;

        while (n--) {
          m = objects.length;
          while (m--) {
            object = objects[m].replace(new RegExp(suffix + '$'), '');
            if (filter[n].substr(0, object.length) === object)
              output.push(objects[m]);
          }
        }
        return output;
      }
    }
  }),

  autorun: function(options, callback, context) {
    if (typeof options === 'function') {
      context  = callback;
      callback = options;
      options  = {};
    }
    if (typeof callback !== 'function') {
      callback = undefined;
      context  = undefined;
    }
    var runner = new Test.Runner(options);
    runner.run(callback, context);
  }
});

exports.Test = Test;
});