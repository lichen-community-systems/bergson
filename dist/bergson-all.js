/*! Bergson 0.11.0, Copyright 2015 Colin Clark | github.com/colinbdclark/bergson */

/*
 * Definitions in this file taken from:
 *
 * jQuery JavaScript Library v1.6.1
 * http://jquery.com/
 *
 * This implementation is only intended to be used in contexts where the Fluid Infusion framework
 * is required to be used without a functioning DOM being available (node.js or other standalone contexts).
 * It includes the minimum definitions taken from jQuery required to operate the core of Fluid.js
 * without FluidView.js. Consult http://issues.fluidproject.org/browse/FLUID-4568 for more details.
 *
 * Copyright 2011, John Resig
 * Copyright 2011- OCAD University
 *
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 * Date: Thu May 12 15:04:36 2011 -0400
 */

/* global jQuery:true, global */
/* exported jQuery */

var fluid_2_0_0_beta_1 = fluid_2_0_0_beta_1 || {};
var fluid = fluid || fluid_2_0_0_beta_1;

(function (fluid) {
    "use strict";

    // Save a reference to some core methods
    var toString = Object.prototype.toString;
    var hasOwn = Object.prototype.hasOwnProperty;
    var globalScope = typeof window !== "undefined" ? window :
        typeof self !== "undefined" ? self : global;
    // Map over jQuery in case of overwrite
    var _jQuery = globalScope.jQuery;
    // Map over the $ in case of overwrite
    var _$ = globalScope.$;

    var jQuery = fluid.jQueryStandalone = {

        // The current version of jQuery being used
        jquery: "1.6.1-fluidStandalone",

        noConflict: function (deep) {
            if (globalScope.$ === jQuery) {
                globalScope.$ = _$;
            }
            if (deep && globalScope.jQuery === jQuery) {
                globalScope.jQuery = _jQuery;
            }
            return jQuery;
        },

        isArray: Array.isArray || function (obj) {
            return toString.call(obj) === "[object Array]";
        },

        // A crude way of determining if an object is a window
        isWindow: function (obj) {
            return obj && typeof obj === "object" && "setInterval" in obj;
        },

        isPlainObject: function (obj) {
            // Must be an Object.
            // Because of IE, we also have to check the presence of the constructor property.
            // Make sure that DOM nodes and window objects don't pass through, as well
            if ( !obj || toString.call(obj) !== "[object Object]" || obj.nodeType || jQuery.isWindow( obj ) ) {
                return false;
            }

            // Not own constructor property must be Object
            if ( obj.constructor &&
                !hasOwn.call(obj, "constructor") &&
                !hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
                return false;
            }
            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.
            // TODO: Isn't this enormously expensive?
            var key;
            for (key in obj) {}
            return key === undefined || hasOwn.call( obj, key );
        },

        trim: function (str) {
            return str.trim();
        },

        isEmptyObject: function (obj) {
            var name;
            for ( name in obj ) {
                return false;
            }
            return true;
        },

        extend: function () {
            var options,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            // Handle a deep copy situation
            if (typeof target === "boolean") {
                deep = target;
                target = arguments[1] || {};
                // skip the boolean and the target
                i = 2;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if (typeof target !== "object" && typeof(target) !== "function") {
                target = {};
            }

            for ( ; i < length; i++ ) {
                // Only deal with non-null/undefined values
                if ( (options = arguments[ i ]) !== null ) {
                    // Extend the base object
                    for (var name in options) {
                        var src = target[ name ];
                        var copy = options[ name ];

                        // Prevent never-ending loop
                        if ( target === copy ) {
                            continue;
                        }
                        var copyIsArray, clone;
                        // Recurse if we're merging plain objects or arrays
                        if (deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy))) ) {
                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && jQuery.isArray(src) ? src : [];
                            } else {
                                clone = src && jQuery.isPlainObject(src) ? src : {};
                            }
                            // Never move original objects, clone them
                            target[name] = jQuery.extend( deep, clone, copy );
                        } else if (copy !== undefined) {
                            // Don't bring in undefined values
                            target[name] = copy;
                        }
                    }
                }
            }
            return target;
        }
    };

})(fluid_2_0_0_beta_1);

var jQuery = fluid.jQueryStandalone;
;/*!
 * Fluid Infusion v2.0
 *
 * Infusion is distributed under the Educational Community License 2.0 and new BSD licenses:
 * http://wiki.fluidproject.org/display/fluid/Fluid+Licensing
 *
 * For information on copyright, see the individual Infusion source code files:
 * https://github.com/fluid-project/infusion/
 */
/*
Copyright 2007-2010 University of Cambridge
Copyright 2007-2009 University of Toronto
Copyright 2007-2009 University of California, Berkeley
Copyright 2010-2011 Lucendo Development Ltd.
Copyright 2010 OCAD University
Copyright 2011 Charly Molter
Copyright 2014-2015 Raising the Floor - International

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/* global console */

var fluid_2_0_0_beta_1 = fluid_2_0_0_beta_1 || {};
var fluid = fluid || fluid_2_0_0_beta_1;

(function ($, fluid) {
    "use strict";

    fluid.version = "Infusion 2.0.0";

    // Export this for use in environments like node.js, where it is useful for
    // configuring stack trace behaviour
    fluid.Error = Error;

    fluid.environment = {
        fluid: fluid
    };

    fluid.global = fluid.global || typeof window !== "undefined" ?
        window : typeof self !== "undefined" ? self : {};

    // A standard utility to schedule the invocation of a function after the current
    // stack returns. On browsers this defaults to setTimeout(func, 1) but in
    // other environments can be customised - e.g. to process.nextTick in node.js
    // In future, this could be optimised in the browser to not dispatch into the event queue
    fluid.invokeLater = function (func) {
        return setTimeout(func, 1);
    };

    // The following flag defeats all logging/tracing activities in the most performance-critical parts of the framework.
    // This should really be performed by a build-time step which eliminates calls to pushActivity/popActivity and fluid.log.
    fluid.defeatLogging = true;

    // This flag enables the accumulating of all "activity" records generated by pushActivity into a running trace, rather
    // than removing them from the stack record permanently when receiving popActivity. This trace will be consumed by
    // visual debugging tools.
    fluid.activityTracing = false;
    fluid.activityTrace = [];

    var activityParser = /(%\w+)/g;

    // Renders a single activity element in a form suitable to be sent to a modern browser's console
    // unsupported, non-API function
    fluid.renderOneActivity = function (activity, nowhile) {
        var togo = nowhile === true ? [] : ["    while "];
        var message = activity.message;
        var index = activityParser.lastIndex = 0;
        while (true) {
            var match = activityParser.exec(message);
            if (match) {
                var key = match[1].substring(1);
                togo.push(message.substring(index, match.index));
                togo.push(activity.args[key]);
                index = activityParser.lastIndex;
            }
            else {
                break;
            }
        }
        if (index < message.length) {
            togo.push(message.substring(index));
        }
        return togo;
    };

    // Renders an activity stack in a form suitable to be sent to a modern browser's console
    // unsupported, non-API function
    fluid.renderActivity = function (activityStack, renderer) {
        renderer = renderer || fluid.renderOneActivity;
        return fluid.transform(activityStack, renderer);
    };

    // Definitions for ThreadLocals - lifted here from
    // FluidIoC.js so that we can issue calls to fluid.describeActivity for debugging purposes
    // in the core framework

    // unsupported, non-API function
    fluid.singleThreadLocal = function (initFunc) {
        var value = initFunc();
        return function (newValue) {
            return newValue === undefined ? value : value = newValue;
        };
    };

    // Currently we only support single-threaded environments - ensure that this function
    // is not used on startup so it can be successfully monkey-patched
    // only remaining uses of threadLocals are for activity reporting and in the renderer utilities
    // unsupported, non-API function
    fluid.threadLocal = fluid.singleThreadLocal;

    // unsupported, non-API function
    fluid.globalThreadLocal = fluid.threadLocal(function () {
        return {};
    });

    // Return an array of objects describing the current activity
    // unsupported, non-API function
    fluid.getActivityStack = function () {
        var root = fluid.globalThreadLocal();
        if (!root.activityStack) {
            root.activityStack = [];
        }
        return root.activityStack;
    };

    // Return an array of objects describing the current activity
    // unsupported, non-API function
    fluid.describeActivity = fluid.getActivityStack;

    // Renders either the current activity or the supplied activity to the console
    fluid.logActivity = function (activity) {
        activity = activity || fluid.describeActivity();
        var rendered = fluid.renderActivity(activity).reverse();
        fluid.log("Current activity: ");
        fluid.each(rendered, function (args) {
            fluid.doLog(args);
        });
    };

    // Execute the supplied function with the specified activity description pushed onto the stack
    // unsupported, non-API function
    fluid.pushActivity = function (type, message, args) {
        var record = {type: type, message: message, args: args, time: new Date().getTime()};
        if (fluid.activityTracing) {
            fluid.activityTrace.push(record);
        }
        if (fluid.passLogLevel(fluid.logLevel.TRACE)) {
            fluid.doLog(fluid.renderOneActivity(record, true));
        }
        var activityStack = fluid.getActivityStack();
        activityStack.push(record);
    };

    // Undo the effect of the most recent pushActivity, or multiple frames if an argument is supplied
    fluid.popActivity = function (popframes) {
        popframes = popframes || 1;
        if (fluid.activityTracing) {
            fluid.activityTrace.push({pop: popframes});
        }
        var activityStack = fluid.getActivityStack();
        var popped = activityStack.length - popframes;
        activityStack.length = popped < 0 ? 0 : popped;
    };
    // "this-ist" style Error so that we can distinguish framework errors whilst still retaining access to platform Error features
    // unsupported, non-API function
    fluid.FluidError = function (message) {
        this.message = message;
        this.stack = new Error().stack;
    };
    fluid.FluidError.prototype = new Error();

    // The framework's built-in "log" failure handler - this logs the supplied message as well as any framework activity in progress via fluid.log
    fluid.logFailure = function (args, activity) {
        fluid.log.apply(null, [fluid.logLevel.FAIL, "ASSERTION FAILED: "].concat(args));
        fluid.logActivity(activity);
    };

    fluid.renderLoggingArg = function (arg) {
        return fluid.isPrimitive(arg) || !fluid.isPlainObject(arg) ? arg : JSON.stringify(arg);
    };

    // The framework's built-in "fail" failure handler - this throws an exception of type <code>fluid.FluidError</code>
    fluid.builtinFail = function (args /*, activity*/) {
        var message = fluid.transform(args, fluid.renderLoggingArg).join("");
        throw new fluid.FluidError("Assertion failure - check console for more details: " + message);
    };

    /**
     * Signals an error to the framework. The default behaviour is to log a structured error message and throw an exception. This strategy may be configured using the legacy
     * API <code>fluid.pushSoftFailure</code> or else by adding and removing suitably namespaced listeners to the special event <code>fluid.failureEvent</code>
     *
     * @param {String} message the error message to log
     * @param ... Additional arguments, suitable for being sent to the native console.log function
     */
    fluid.fail = function (/* message, ... */) {
        var args = fluid.makeArray(arguments);
        var activity = fluid.makeArray(fluid.describeActivity()); // Take copy since we will destructively modify
        fluid.popActivity(activity.length); // clear any current activity - TODO: the framework currently has no exception handlers, although it will in time
        if (fluid.failureEvent) { // notify any framework failure prior to successfully setting up the failure event below
            fluid.failureEvent.fire(args, activity);
        } else {
            fluid.logFailure(args, activity);
            fluid.builtinFail(args, activity);
        }
    };

    // TODO: rescued from kettleCouchDB.js - clean up in time
    fluid.expect = function (name, target, members) {
        fluid.transform(fluid.makeArray(members), function (key) {
            if (typeof target[key] === "undefined") {
                fluid.fail(name + " missing required parameter " + key);
            }
        });
    };

    // Logging

    /** Returns whether logging is enabled **/
    fluid.isLogging = function () {
        return logLevelStack[0].priority > fluid.logLevel.IMPORTANT.priority;
    };

    /** Determines whether the supplied argument is a valid logLevel marker **/
    fluid.isLogLevel = function (arg) {
        return fluid.isMarker(arg) && arg.priority !== undefined;
    };

    /** Accepts one of the members of the <code>fluid.logLevel</code> structure. Returns <code>true</code> if
     *  a message supplied at that log priority would be accepted at the current logging level. Clients who
     *  issue particularly expensive log payload arguments are recommended to guard their logging statements with this
     *  function */

    fluid.passLogLevel = function (testLogLevel) {
        return testLogLevel.priority <= logLevelStack[0].priority;
    };

    /** Method to allow user to control the logging level. Accepts either a boolean, for which <code>true</code>
      * represents <code>fluid.logLevel.INFO</code> and <code>false</code> represents <code>fluid.logLevel.IMPORTANT</code> (the default),
      * or else any other member of the structure <code>fluid.logLevel</code>
      * Messages whose priority is strictly less than the current logging level will not be shown*/
    fluid.setLogging = function (enabled) {
        var logLevel;
        if (typeof enabled === "boolean") {
            logLevel = fluid.logLevel[enabled? "INFO" : "IMPORTANT"];
        } else if (fluid.isLogLevel(enabled)) {
            logLevel = enabled;
        } else {
            fluid.fail("Unrecognised fluid logging level ", enabled);
        }
        logLevelStack.unshift(logLevel);
        fluid.defeatLogging = !fluid.isLogging();
    };

    fluid.setLogLevel = fluid.setLogging;

    /** Undo the effect of the most recent "setLogging", returning the logging system to its previous state **/
    fluid.popLogging = function () {
        var togo = logLevelStack.length === 1? logLevelStack[0] : logLevelStack.shift();
        fluid.defeatLogging = !fluid.isLogging();
        return togo;
    };

    /** Actually do the work of logging <code>args</code> to the environment's console. If the standard "console"
     * stream is available, the message will be sent there.
     */
    fluid.doLog = function (args) {
        if (typeof (console) !== "undefined") {
            if (console.debug) {
                console.debug.apply(console, args);
            } else if (typeof (console.log) === "function") {
                console.log.apply(console, args);
            }
        }
    };

    /** Log a message to a suitable environmental console. If the first argument to fluid.log is
     * one of the members of the <code>fluid.logLevel</code> structure, this will be taken as the priority
     * of the logged message - else if will default to <code>fluid.logLevel.INFO</code>. If the logged message
     * priority does not exceed that set by the most recent call to the <code>fluid.setLogging</code> function,
     * the message will not appear.
     */
    fluid.log = function (/* message /*, ... */) {
        var directArgs = fluid.makeArray(arguments);
        var userLogLevel = fluid.logLevel.INFO;
        if (fluid.isLogLevel(directArgs[0])) {
            userLogLevel = directArgs.shift();
        }
        if (fluid.passLogLevel(userLogLevel)) {
            var arg0 = fluid.renderTimestamp(new Date()) + ":  ";
            var args = [arg0].concat(directArgs);
            fluid.doLog(args);
        }
    };

    // Functional programming utilities.

    // Type checking functions

    /** Returns true if the argument is a value other than null or undefined **/
    fluid.isValue = function (value) {
        return value !== undefined && value !== null;
    };

    /** Returns true if the argument is a primitive type **/
    fluid.isPrimitive = function (value) {
        var valueType = typeof (value);
        return !value || valueType === "string" || valueType === "boolean" || valueType === "number" || valueType === "function";
    };

    /** Determines whether the supplied object is an array. The strategy used is an optimised
     * approach taken from an earlier version of jQuery - detecting whether the toString() version
     * of the object agrees with the textual form [object Array], or else whether the object is a
     * jQuery object (the most common source of "fake arrays").
     */
    fluid.isArrayable = function (totest) {
        return totest && (totest.jquery || Object.prototype.toString.call(totest) === "[object Array]");
    };

    /** Determines whether the supplied object is a plain JSON-forming container - that is, it is either a plain Object
     * or a plain Array */
    fluid.isPlainObject = function (totest) {
        var string = Object.prototype.toString.call(totest);
        if (string === "[object Array]") {
            return true;
        } else if (string !== "[object Object]") {
            return false;
        } // FLUID-5226: This inventive strategy taken from jQuery detects whether the object's prototype is directly Object.prototype by virtue of having an "isPrototypeOf" direct member
        return !totest.constructor || !totest.constructor.prototype || Object.prototype.hasOwnProperty.call(totest.constructor.prototype, "isPrototypeOf");
    };

    /** Returns <code>primitive</code>, <code>array</code> or <code>object</code> depending on whether the supplied object has
     * one of those types, by use of the <code>fluid.isPrimitive</code>, <code>fluid.isPlainObject</code> and <code>fluid.isArrayable</code> utilities
     */
    fluid.typeCode = function (totest) {
        return fluid.isPrimitive(totest) || !fluid.isPlainObject(totest) ? "primitive" :
            fluid.isArrayable(totest) ? "array" : "object";
    };

    fluid.isDOMNode = function (obj) {
      // This could be more sound, but messy:
      // http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
      // The real problem is browsers like IE6, 7 and 8 which still do not feature a "constructor" property on DOM nodes
        return obj && typeof (obj.nodeType) === "number";
    };

    fluid.isDOMish = function (obj) {
        return fluid.isDOMNode(obj) || obj.jquery;
    };

    fluid.isComponent = function (obj) {
        return obj && obj.constructor === fluid.componentConstructor;
    };

    /** A basic utility that returns its argument unchanged */

    fluid.identity = function (arg) {
        return arg;
    };

    /** A function which raises a failure if executed */

    fluid.notImplemented = function () {
        fluid.fail("This operation is not implemented");
    };

    /** Return an empty container as the same type as the argument (either an
     * array or hash */
    fluid.freshContainer = function (tocopy) {
        return fluid.isArrayable(tocopy) ? [] : {};
    };

    fluid.isUncopyable = function (totest) {
        return fluid.isPrimitive(totest) || fluid.isDOMish(totest) || !fluid.isPlainObject(totest);
    };

    fluid.copyRecurse = function (tocopy, segs) {
        if (segs.length > fluid.strategyRecursionBailout) {
            fluid.fail("Runaway recursion encountered in fluid.copy - reached path depth of " + fluid.strategyRecursionBailout + " via path of " + segs.join(".") +
                "this object is probably circularly connected. Either adjust your object structure to remove the circularity or increase fluid.strategyRecursionBailout");
        }
        if (fluid.isUncopyable(tocopy)) {
            return tocopy;
        } else {
            return fluid.transform(tocopy, function (value, key) {
                segs.push(key);
                var togo = fluid.copyRecurse(value, segs);
                segs.pop();
                return togo;
            });
        }
    };

    /** Performs a deep copy (clone) of its argument. This will guard against cloning a circular object by terminating if it reaches a path depth
     * greater than <code>fluid.strategyRecursionBailout</code>
     **/

    fluid.copy = function (tocopy) {
        return fluid.copyRecurse(tocopy, []);
    };

    /** Corrected version of jQuery makeArray that returns an empty array on undefined rather than crashing.
      * We don't deal with as many pathological cases as jQuery **/
    fluid.makeArray = function (arg) {
        var togo = [];
        if (arg !== null && arg !== undefined) {
            if (fluid.isPrimitive(arg) || typeof(arg.length) !== "number") {
                togo.push(arg);
            }
            else {
                for (var i = 0; i < arg.length; ++ i) {
                    togo[i] = arg[i];
                }
            }
        }
        return togo;
    };

    function transformInternal(source, togo, key, args) {
        var transit = source[key];
        for (var j = 0; j < args.length - 1; ++j) {
            transit = args[j + 1](transit, key);
        }
        togo[key] = transit;
    }

    /** Return a list or hash of objects, transformed by one or more functions. Similar to
     * jQuery.map, only will accept an arbitrary list of transformation functions and also
     * works on non-arrays.
     * @param source {Array or Object} The initial container of objects to be transformed. If the source is
     * neither an array nor an object, it will be returned untransformed
     * @param fn1, fn2, etc. {Function} An arbitrary number of optional further arguments,
     * all of type Function, accepting the signature (object, index), where object is the
     * list member to be transformed, and index is its list index. Each function will be
     * applied in turn to each list member, which will be replaced by the return value
     * from the function.
     * @return The finally transformed list, where each member has been replaced by the
     * original member acted on by the function or functions.
     */
    fluid.transform = function (source) {
        if (fluid.isPrimitive(source)) {
            return source;
        }
        var togo = fluid.freshContainer(source);
        if (fluid.isArrayable(source)) {
            for (var i = 0; i < source.length; ++i) {
                transformInternal(source, togo, i, arguments);
            }
        } else {
            for (var key in source) {
                transformInternal(source, togo, key, arguments);
            }
        }
        return togo;
    };

    /** Better jQuery.each which works on hashes as well as having the arguments
     * the right way round.
     * @param source {Arrayable or Object} The container to be iterated over
     * @param func {Function} A function accepting (value, key) for each iterated
     * object.
     */
    fluid.each = function (source, func) {
        if (fluid.isArrayable(source)) {
            for (var i = 0; i < source.length; ++i) {
                func(source[i], i);
            }
        } else {
            for (var key in source) {
                func(source[key], key);
            }
        }
    };

    fluid.make_find = function (find_if) {
        var target = find_if ? false : undefined;
        return function (source, func, deffolt) {
            var disp;
            if (fluid.isArrayable(source)) {
                for (var i = 0; i < source.length; ++i) {
                    disp = func(source[i], i);
                    if (disp !== target) {
                        return find_if ? source[i] : disp;
                    }
                }
            } else {
                for (var key in source) {
                    disp = func(source[key], key);
                    if (disp !== target) {
                        return find_if ? source[key] : disp;
                    }
                }
            }
            return deffolt;
        };
    };

    /** Scan through a list or hash of objects, terminating on the first member which
     * matches a predicate function.
     * @param source {Arrayable or Object} The list or hash of objects to be searched.
     * @param func {Function} A predicate function, acting on a member. A predicate which
     * returns any value which is not <code>undefined</code> will terminate
     * the search. The function accepts (object, index).
     * @param deflt {Object} A value to be returned in the case no predicate function matches
     * a list member. The default will be the natural value of <code>undefined</code>
     * @return The first return value from the predicate function which is not <code>undefined</code>
     */
    fluid.find = fluid.make_find(false);
    /** The same signature as fluid.find, only the return value is the actual element for which the
     * predicate returns a value different from <code>false</code>
     */
    fluid.find_if = fluid.make_find(true);

    /** Scan through a list of objects, "accumulating" a value over them
     * (may be a straightforward "sum" or some other chained computation). "accumulate" is the name derived
     * from the C++ STL, other names for this algorithm are "reduce" or "fold".
     * @param list {Array} The list of objects to be accumulated over.
     * @param fn {Function} An "accumulation function" accepting the signature (object, total, index) where
     * object is the list member, total is the "running total" object (which is the return value from the previous function),
     * and index is the index number.
     * @param arg {Object} The initial value for the "running total" object.
     * @return {Object} the final running total object as returned from the final invocation of the function on the last list member.
     */
    fluid.accumulate = function (list, fn, arg) {
        for (var i = 0; i < list.length; ++i) {
            arg = fn(list[i], arg, i);
        }
        return arg;
    };

    /** Scan through a list or hash of objects, removing those which match a predicate. Similar to
     * jQuery.grep, only acts on the list in-place by removal, rather than by creating
     * a new list by inclusion.
     * @param source {Array|Object} The list or hash of objects to be scanned over.
     * @param fn {Function} A predicate function determining whether an element should be
     * removed. This accepts the standard signature (object, index) and returns a "truthy"
     * result in order to determine that the supplied object should be removed from the list.
     * @param target {Array|Object} (optional) A target object of the same type as <code>source</code>, which will
     * receive any objects removed from it.
     * @return <code>target</code>, containing the removed elements, if it was supplied, or else <code>source</code>
     * modified by the operation of removing the matched elements.
     */
    fluid.remove_if = function (source, fn, target) {
        if (fluid.isArrayable(source)) {
            for (var i = source.length - 1; i >= 0; --i) {
                if (fn(source[i], i)) {
                    if (target) {
                        target.unshift(source[i]);
                    }
                    source.splice(i, 1);
                }
            }
        } else {
            for (var key in source) {
                if (fn(source[key], key)) {
                    if (target) {
                        target[key] = source[key];
                    }
                    delete source[key];
                }
            }
        }
        return target || source;
    };

    /** Fills an array of given size with copies of a value or result of a function invocation
     * @param n {Number} The size of the array to be filled
     * @param generator {Object|Function} Either a value to be replicated or function to be called
     * @param applyFunc {Boolean} If true, treat the generator value as a function to be invoked with
     * argument equal to the index position
     */

    fluid.generate = function (n, generator, applyFunc) {
        var togo = [];
        for (var i = 0; i < n; ++ i) {
            togo[i] = applyFunc? generator(i) : generator;
        }
        return togo;
    };

    /** Returns an array of size count, filled with increasing integers, starting at 0 or at the index specified by first.
     * @param count {Number} Size of the filled array to be returned
     * @param first {Number} (optional, defaults to 0) First element to appear in the array
     */

    fluid.iota = function (count, first) {
        first = first || 0;
        var togo = [];
        for (var i = 0; i < count; ++i) {
            togo[togo.length] = first++;
        }
        return togo;
    };

    /** Extracts a particular member from each top-level member of a container, returning a new container of the same type
     * @param holder {Array|Object} The container to be filtered
     * @param name {String|Array of String} An EL path to be fetched from each top-level member
     */

    fluid.getMembers = function (holder, name) {
        return fluid.transform(holder, function(member) {
            return fluid.get(member, name);
        });
    };

    /** Accepts an object to be filtered, and a list of keys. Either all keys not present in
     * the list are removed, or only keys present in the list are returned.
     * @param toFilter {Array|Object} The object to be filtered - this will be NOT modified by the operation (current implementation
     * passes through $.extend shallow algorithm)
     * @param keys {Array of String} The list of keys to operate with
     * @param exclude {boolean} If <code>true</code>, the keys listed are removed rather than included
     * @return the filtered object (the same object that was supplied as <code>toFilter</code>
     */

    fluid.filterKeys = function (toFilter, keys, exclude) {
        return fluid.remove_if($.extend({}, toFilter), function (value, key) {
            return exclude ^ (keys.indexOf(key) === -1);
        });
    };

    /** A convenience wrapper for <code>fluid.filterKeys</code> with the parameter <code>exclude</code> set to <code>true</code>
     *  Returns the supplied object with listed keys removed */

    fluid.censorKeys = function (toCensor, keys) {
        return fluid.filterKeys(toCensor, keys, true);
    };

    // TODO: This is not as clever an idea as we think it is - this typically inner-loop function will optimise badly due to closure
    fluid.makeFlatten = function (index) {
        return function (obj) {
            var togo = [];
            fluid.each(obj, function (/* value, key */) {
                togo.push(arguments[index]);
            });
            return togo;
        };
    };

    /** Return the keys in the supplied object as an array. Note that this will return keys found in the prototype chain as well as "own properties", unlike Object.keys() **/
    fluid.keys = fluid.makeFlatten(1);

    /** Return the values in the supplied object as an array **/
    fluid.values = fluid.makeFlatten(0);

    /**
     * Searches through the supplied object, and returns <code>true</code> if the supplied value
     * can be found
     */
    fluid.contains = function (obj, value) {
        return obj ? (fluid.isArrayable(obj) ? obj.indexOf(value) !== -1 : fluid.find(obj, function (thisValue) {
            if (value === thisValue) {
                return true;
            }
        })) : undefined;
    };

    /**
     * Searches through the supplied object for the first value which matches the one supplied.
     * @param obj {Object} the Object to be searched through
     * @param value {Object} the value to be found. This will be compared against the object's
     * member using === equality.
     * @return {String} The first key whose value matches the one supplied
     */
    fluid.keyForValue = function (obj, value) {
        return fluid.find(obj, function (thisValue, key) {
            if (value === thisValue) {
                return key;
            }
        });
    };

    /** Converts an array into an object whose keys are the elements of the array, each with the value "true"
     * @param array {Array of String} The array to be converted to a hash
     * @return hash {Object} An object with value <code>true</code> for each key taken from a member of <code>array</code>
     */

    fluid.arrayToHash = function (array) {
        var togo = {};
        fluid.each(array, function (el) {
            togo[el] = true;
        });
        return togo;
    };

    /** Applies a stable sorting algorithm to the supplied array and comparator (note that Array.sort in JavaScript is not specified
     * to be stable). The algorithm used will be an insertion sort, which whilst quadratic in time, will perform well
     * on small array sizes.
     * @param array {Array} The array to be sorted. This input array will be modified in place.
     * @param func {Function} A comparator returning >0, 0, or <0 on pairs of elements representing their sort order (same contract as Array.sort comparator)
     */

    fluid.stableSort = function (array, func) {
        for (var i = 0; i < array.length; i++) {
            var k = array[i];
            for (var j = i; j > 0 && func(k, array[j - 1]) < 0; j--) {
                array[j] = array[j - 1];
            }
            array[j] = k;
        }
    };

    /** Converts a hash into an object by hoisting out the object's keys into an array element via the supplied String "key", and then transforming via an optional further function, which receives the signature
     * (newElement, oldElement, key) where newElement is the freshly cloned element, oldElement is the original hash's element, and key is the key of the element.
     * If the function is not supplied, the old element is simply deep-cloned onto the new element (same effect
     * as transform fluid.transforms.objectToArray)
     */
    fluid.hashToArray = function (hash, keyName, func) {
        var togo = [];
        fluid.each(hash, function (el, key) {
            var newEl = {};
            newEl[keyName] = key;
            if (func) {
                newEl = func(newEl, el, key) || newEl;
            } else {
                $.extend(true, newEl, el);
            }
            togo.push(newEl);
        });
        return togo;
    };

    /** Converts an array consisting of a mixture of arrays and non-arrays into the concatenation of any inner arrays
     * with the non-array elements
     */
    fluid.flatten = function (array) {
        var togo = [];
        fluid.each(array, function (element) {
            if (fluid.isArrayable(element)) {
                togo = togo.concat(element);
            } else {
                togo.push(element);
            }
        });
        return togo;
    };

    /**
     * Clears an object or array of its contents. For objects, each property is deleted.
     *
     * @param {Object|Array} target the target to be cleared
     */
    fluid.clear = function (target) {
        if (fluid.isArrayable(target)) {
            target.length = 0;
        } else {
            for (var i in target) {
                delete target[i];
            }
        }
    };

   /**
    * @param boolean ascending <code>true</code> if a comparator is to be returned which
    * sorts strings in descending order of length
    */
    fluid.compareStringLength = function (ascending) {
        return ascending ? function (a, b) {
            return a.length - b.length;
        } : function (a, b) {
            return b.length - a.length;
        };
    };

    /**
     * Returns the converted integer if the input string can be converted to an integer. Otherwise, return NaN.
     * @param {String} a string to be returned in integer
     */
    fluid.parseInteger = function (string) {
        return isFinite(string) && ((string % 1) === 0) ? Number(string) : NaN;
    };

    /** A set of special "marker values" used in signalling in function arguments and return values,
      * to partially compensate for JavaScript's lack of distinguished types. These should never appear
      * in JSON structures or other kinds of static configuration. An API specifically documents if it
      * accepts or returns any of these values, and if so, what its semantic is  - most are of private
      * use internal to the framework **/

    fluid.marker = function () {};

    fluid.makeMarker = function (value, extra) {
        var togo = Object.create(fluid.marker.prototype);
        togo.value = value;
        $.extend(togo, extra);
        return Object.freeze(togo);
    };

    /** A special "marker object" representing that a distinguished
     * (probably context-dependent) value should be substituted.
     */
    fluid.VALUE = fluid.makeMarker("VALUE");

    /** A special "marker object" representing that no value is present (where
     * signalling using the value "undefined" is not possible - e.g. the return value from a "strategy") */
    fluid.NO_VALUE = fluid.makeMarker("NO_VALUE");

    /** A marker indicating that a value requires to be expanded after component construction begins **/
    fluid.EXPAND = fluid.makeMarker("EXPAND");

    /** Determine whether an object is any marker, or a particular marker - omit the
     * 2nd argument to detect any marker
     */
    fluid.isMarker = function (totest, type) {
        if (!(totest instanceof fluid.marker)) {
            return false;
        }
        if (!type) {
            return true;
        }
        return totest.value === type.value;
    };

    fluid.logLevelsSpec = {
        "FATAL":      0,
        "FAIL":       5,
        "WARN":      10,
        "IMPORTANT": 12, // The default logging "off" level - corresponds to the old "false"
        "INFO":      15, // The default logging "on" level - corresponds to the old "true"
        "TRACE":     20
    };

    /** A structure holding all supported log levels as supplied as a possible first argument to fluid.log
     * Members with a higher value of the "priority" field represent lower priority logging levels */
    // Moved down here since it uses fluid.transform and fluid.makeMarker on startup
    fluid.logLevel = fluid.transform(fluid.logLevelsSpec, function (value, key) {
        return fluid.makeMarker(key, {priority: value});
    });
    var logLevelStack = [fluid.logLevel.IMPORTANT]; // The stack of active logging levels, with the current level at index 0


    // Model functions
    fluid.model = {}; // cannot call registerNamespace yet since it depends on fluid.model

    /** Copy a source "model" onto a target **/
    fluid.model.copyModel = function (target, source) {
        fluid.clear(target);
        $.extend(true, target, source);
    };

    /** Parse an EL expression separated by periods (.) into its component segments.
     * @param {String} EL The EL expression to be split
     * @return {Array of String} the component path expressions.
     * TODO: This needs to be upgraded to handle (the same) escaping rules (as RSF), so that
     * path segments containing periods and backslashes etc. can be processed, and be harmonised
     * with the more complex implementations in fluid.pathUtil(data binding).
     */
    fluid.model.parseEL = function (EL) {
        return EL === "" ? [] : String(EL).split(".");
    };

    /** Compose an EL expression from two separate EL expressions. The returned
     * expression will be the one that will navigate the first expression, and then
     * the second, from the value reached by the first. Either prefix or suffix may be
     * the empty string **/

    fluid.model.composePath = function (prefix, suffix) {
        return prefix === "" ? suffix : (suffix === "" ? prefix : prefix + "." + suffix);
    };

    /** Compose any number of path segments, none of which may be empty **/
    fluid.model.composeSegments = function () {
        return fluid.makeArray(arguments).join(".");
    };

    /** Returns the index of the last occurrence of the period character . in the supplied string */
    fluid.lastDotIndex = function (path) {
        return path.lastIndexOf(".");
    };

    /** Returns all of an EL path minus its final segment - if the path consists of just one segment, returns "" -
     * WARNING - this method does not follow escaping rules */
    fluid.model.getToTailPath = function (path) {
        var lastdot = fluid.lastDotIndex(path);
        return lastdot === -1 ? "" : path.substring(0, lastdot);
    };

    /** Returns the very last path component of an EL path
     * WARNING - this method does not follow escaping rules */
    fluid.model.getTailPath = function (path) {
        var lastdot = fluid.lastDotIndex(path);
        return path.substring(lastdot + 1);
    };

    /** Helpful alias for old-style API **/
    fluid.path = fluid.model.composeSegments;
    fluid.composePath = fluid.model.composePath;


    // unsupported, NON-API function
    fluid.requireDataBinding = function () {
        fluid.fail("Please include DataBinding.js in order to operate complex model accessor configuration");
    };

    fluid.model.setWithStrategy = fluid.model.getWithStrategy = fluid.requireDataBinding;

    // unsupported, NON-API function
    fluid.model.resolvePathSegment = function (root, segment, create, origEnv) {
        if (!origEnv && root.resolvePathSegment) {
            return root.resolvePathSegment(segment);
        }
        if (create && root[segment] === undefined) {
            // This optimisation in this heavily used function has a fair effect
            return root[segment] = {}; // jshint ignore:line
        }
        return root[segment];
    };

    // unsupported, NON-API function
    fluid.model.parseToSegments = function (EL, parseEL, copy) {
        return typeof(EL) === "number" || typeof(EL) === "string" ? parseEL(EL) : (copy ? fluid.makeArray(EL) : EL);
    };

    // unsupported, NON-API function
    fluid.model.pathToSegments = function (EL, config) {
        var parser = config && config.parser ? config.parser.parse : fluid.model.parseEL;
        return fluid.model.parseToSegments(EL, parser);
    };

    // Overall strategy skeleton for all implementations of fluid.get/set
    fluid.model.accessImpl = function (root, EL, newValue, config, initSegs, returnSegs, traverser) {
        var segs = fluid.model.pathToSegments(EL, config);
        var initPos = 0;
        if (initSegs) {
            initPos = initSegs.length;
            segs = initSegs.concat(segs);
        }
        var uncess = newValue === fluid.NO_VALUE ? 0 : 1;
        root = traverser(root, segs, initPos, config, uncess);
        if (newValue === fluid.NO_VALUE || newValue === fluid.VALUE) { // get or custom
            return returnSegs ? {root: root, segs: segs} : root;
        }
        else { // set
            root[segs[segs.length - 1]] = newValue;
        }
    };

    // unsupported, NON-API function
    fluid.model.accessSimple = function (root, EL, newValue, environment, initSegs, returnSegs) {
        return fluid.model.accessImpl(root, EL, newValue, environment, initSegs, returnSegs, fluid.model.traverseSimple);
    };

    // unsupported, NON-API function
    fluid.model.traverseSimple = function (root, segs, initPos, environment, uncess) {
        var origEnv = environment;
        var limit = segs.length - uncess;
        for (var i = 0; i < limit; ++i) {
            if (!root) {
                return root;
            }
            var segment = segs[i];
            if (environment && environment[segment]) {
                root = environment[segment];
            } else {
                root = fluid.model.resolvePathSegment(root, segment, uncess === 1, origEnv);
            }
            environment = null;
        }
        return root;
    };

    fluid.model.setSimple = function (root, EL, newValue, environment, initSegs) {
        fluid.model.accessSimple(root, EL, newValue, environment, initSegs, false);
    };

    /** Optimised version of fluid.get for uncustomised configurations **/

    fluid.model.getSimple = function (root, EL, environment, initSegs) {
        if (EL === null || EL === undefined || EL.length === 0) {
            return root;
        }
        return fluid.model.accessSimple(root, EL, fluid.NO_VALUE, environment, initSegs, false);
    };

    /** Even more optimised version which assumes segs are parsed and no configuration **/
    fluid.getImmediate = function (root, segs, i) {
        var limit = (i === undefined ? segs.length: i + 1);
        for (var j = 0; j < limit; ++ j) {
            root = root ? root[segs[j]] : undefined;
        }
        return root;
    };

    // unsupported, NON-API function
    // Returns undefined to signal complex configuration which needs to be farmed out to DataBinding.js
    // any other return represents an environment value AND a simple configuration we can handle here
    fluid.decodeAccessorArg = function (arg3) {
        return (!arg3 || arg3 === fluid.model.defaultGetConfig || arg3 === fluid.model.defaultSetConfig) ?
            null : (arg3.type === "environment" ? arg3.value : undefined);
    };

    fluid.set = function (root, EL, newValue, config, initSegs) {
        var env = fluid.decodeAccessorArg(config);
        if (env === undefined) {
            fluid.model.setWithStrategy(root, EL, newValue, config, initSegs);
        } else {
            fluid.model.setSimple(root, EL, newValue, env, initSegs);
        }
    };

    /** Evaluates an EL expression by fetching a dot-separated list of members
     * recursively from a provided root.
     * @param root The root data structure in which the EL expression is to be evaluated
     * @param {string/array} EL The EL expression to be evaluated, or an array of path segments
     * @param config An optional configuration or environment structure which can customise the fetch operation
     * @return The fetched data value.
     */

    fluid.get = function (root, EL, config, initSegs) {
        var env = fluid.decodeAccessorArg(config);
        return env === undefined ?
            fluid.model.getWithStrategy(root, EL, config, initSegs)
            : fluid.model.accessImpl(root, EL, fluid.NO_VALUE, env, null, false, fluid.model.traverseSimple);
    };

    fluid.getGlobalValue = function (path, env) {
        if (path) {
            env = env || fluid.environment;
            return fluid.get(fluid.global, path, {type: "environment", value: env});
        }
    };

    /**
     * Allows for the binding to a "this-ist" function
     * @param {Object} obj, "this-ist" object to bind to
     * @param {Object} fnName, the name of the function to call
     * @param {Object} args, arguments to call the function with
     */
    fluid.bind = function (obj, fnName, args) {
        return obj[fnName].apply(obj, fluid.makeArray(args));
    };

    /**
     * Allows for the calling of a function from an EL expression "functionPath", with the arguments "args", scoped to an framework version "environment".
     * @param {Object} functionPath - An EL expression
     * @param {Object} args - An array of arguments to be applied to the function, specified in functionPath
     * @param {Object} environment - (optional) The object to scope the functionPath to  (typically the framework root for version control)
     */
    fluid.invokeGlobalFunction = function (functionPath, args, environment) {
        var func = fluid.getGlobalValue(functionPath, environment);
        if (!func) {
            fluid.fail("Error invoking global function: " + functionPath + " could not be located");
        } else {
            return func.apply(null, fluid.isArrayable(args) ? args : fluid.makeArray(args));
        }
    };

    /** Registers a new global function at a given path
     */

    fluid.registerGlobalFunction = function (functionPath, func, env) {
        env = env || fluid.environment;
        fluid.set(fluid.global, functionPath, func, {type: "environment", value: env});
    };

    fluid.setGlobalValue = fluid.registerGlobalFunction;

    /** Ensures that an entry in the global namespace exists. If it does not, a new entry is created as {} and returned. If an existing
     * value is found, it is returned instead **/
    fluid.registerNamespace = function (naimspace, env) {
        env = env || fluid.environment;
        var existing = fluid.getGlobalValue(naimspace, env);
        if (!existing) {
            existing = {};
            fluid.setGlobalValue(naimspace, existing, env);
        }
        return existing;
    };

    // stubs for two functions in FluidDebugging.js
    fluid.dumpEl = fluid.identity;
    fluid.renderTimestamp = fluid.identity;

    /*** The Fluid instance id ***/

    // unsupported, NON-API function
    fluid.generateUniquePrefix = function () {
        return (Math.floor(Math.random() * 1e12)).toString(36) + "-";
    };

    var fluid_prefix = fluid.generateUniquePrefix();

    fluid.fluidInstance = fluid_prefix;

    var fluid_guid = 1;

    /** Allocate a string value that will be unique within this Infusion instance (frame or process), and
     * globally unique with high probability (50% chance of collision after a million trials) **/

    fluid.allocateGuid = function () {
        return fluid_prefix + (fluid_guid++);
    };

    /*** The Fluid Event system. ***/

    fluid.registerNamespace("fluid.event");

    // Fluid priority system for encoding relative positions of, e.g. listeners, transforms, options, in lists

    fluid.extremePriority = 4e9; // around 2^32 - allows headroom of 21 fractional bits for sub-priorities
    fluid.priorityTypes = {
        first: -1,
        last: 1,
        before: 0,
        after: 0
    };
    // TODO: This should be properly done with defaults blocks and a much more performant fluid.indexDefaults
    fluid.extremalPriorities = {
        // a built-in definition to allow test infrastructure "last" listeners to sort after all impl listeners, and authoring/debugging listeners to sort after those
        // these are "priority intensities", and will be flipped for "first" listeners
        none: 0,
        testing: 10,
        authoring: 20
    };

    // unsupported, NON-API function
    fluid.parsePriorityConstraint = function (constraint, fixedOnly, site) {
        var segs = constraint.split(":");
        var type = segs[0];
        var lookup = fluid.priorityTypes[type];
        if (lookup === undefined) {
            fluid.fail("Invalid constraint type in priority field " + constraint + ": the only supported values are " + fluid.keys(fluid.priorityTypes).join(", ") + " or numeric");
        }
        if (fixedOnly && lookup === 0) {
            fluid.fail("Constraint type in priority field " + constraint + " is not supported in a " + site + " record - you must use either a numeric value or first, last");
        }
        return {
            type: segs[0],
            target: segs[1]
        };
    };

    // unsupported, NON-API function
    fluid.parsePriority = function (priority, count, fixedOnly, site) {
        priority = priority || 0;
        var togo = {
            count: count || 0,
            fixed: null,
            constraint: null,
            site: site
        };
        if (typeof(priority) === "number") {
            togo.fixed = -priority;
        } else {
            togo.constraint = fluid.parsePriorityConstraint(priority, fixedOnly, site);
        }
        var multiplier = togo.constraint ? fluid.priorityTypes[togo.constraint.type] : 0;
        if (multiplier !== 0) {
            var target = togo.constraint.target || "none";
            var extremal = fluid.extremalPriorities[target];
            if (extremal === undefined) {
                fluid.fail("Unrecognised extremal priority target " + target + ": the currently supported values are " + fluid.keys(fluid.extremalPriorities).join(", ") + ": register your value in fluid.extremalPriorities");
            }
            togo.fixed = multiplier * (fluid.extremePriority + extremal);
        }
        if (togo.fixed !== null) {
            togo.fixed += togo.count / 1024; // use some fractional bits to encode count bias
        }

        return togo;
    };

    fluid.renderPriority = function (parsed) {
        return parsed.constraint ? (parsed.constraint.target ? parsed.constraint.type + ":" + parsed.constraint.target : parsed.constraint.type ) : Math.floor(parsed.fixed);
    };

    // unsupported, NON-API function
    fluid.compareByPriority = function (recA, recB) {
        if (recA.priority.fixed !== null && recB.priority.fixed !== null) {
            return recA.priority.fixed - recB.priority.fixed;
        } else { // sort constraint records to the end
            // relies on JavaScript boolean coercion rules (ECMA 9.3 toNumber)
            return (recA.priority.fixed === null) - (recB.priority.fixed === null);
        }
    };

    fluid.honourConstraint = function (array, firstConstraint, c) {
        var constraint = array[c].priority.constraint;
        var matchIndex = fluid.find(array, function (element, index) {
            return element.namespace === constraint.target ? index : undefined;
        }, -1);
        if (matchIndex === -1) { // TODO: We should report an error during firing if this condition persists until then
            return true;
        } else if (matchIndex >= firstConstraint) {
            return false;
        } else {
            var offset = constraint.type === "after" ? 1 : 0;
            var target = matchIndex + offset;
            var temp = array[c];
            for (var shift = c; shift >= target; -- shift) {
                array[shift] = array[shift - 1];
            }
            array[target] = temp;
            return true;
        }
    };

    // unsupported, NON-API function
    // Priorities accepted from users have higher numbers representing high priority (sort first) -
    fluid.sortByPriority = function (array) {
        fluid.stableSort(array, fluid.compareByPriority);

        var firstConstraint = fluid.find(array, function (element, index) {
            return element.priority.constraint && fluid.priorityTypes[element.priority.constraint.type] === 0 ? index : undefined;
        }, array.length);

        while (true) {
            if (firstConstraint === array.length) {
                return array;
            }
            var oldFirstConstraint = firstConstraint;
            for (var c = firstConstraint; c < array.length; ++ c) {
                var applied = fluid.honourConstraint(array, firstConstraint, c);
                if (applied) {
                    ++firstConstraint;
                }
            }
            if (firstConstraint === oldFirstConstraint) {
                var holders = array.slice(firstConstraint);
                fluid.fail("Could not find targets for any constraints in " + holders[0].priority.site + " ", holders, ": none of the targets (" + fluid.getMembers(holders, "priority.constraint.target").join(", ") +
                    ") matched any namespaces of the elements in (", array.slice(0, firstConstraint) + ") - this is caused by either an invalid or circular reference");
            }
        }
    };

    fluid.event.identifyListener = function (listener, soft) {
        if (typeof(listener) !== "string" && !listener.$$fluid_guid && !soft) {
            listener.$$fluid_guid = fluid.allocateGuid();
        }
        return listener.$$fluid_guid;
    };

    // unsupported, NON-API function
    fluid.event.impersonateListener = function (origListener, newListener) {
        fluid.event.identifyListener(origListener);
        newListener.$$fluid_guid = origListener.$$fluid_guid;
    };


    // unsupported, NON-API function
    fluid.event.sortListeners = function (listeners) {
        var togo = [];
        fluid.each(listeners, function (oneNamespace) {
            var headHard; // notify only the first listener with hard namespace - or else all if all are soft
            for (var i = 0; i < oneNamespace.length; ++ i) {
                var thisListener = oneNamespace[i];
                if (!thisListener.softNamespace && !headHard) {
                    headHard = thisListener;
                }
            }
            if (headHard) {
                togo.push(headHard);
            } else {
                togo = togo.concat(oneNamespace);
            }
        });
        return fluid.sortByPriority(togo);
    };

    // unsupported, non-API function
    fluid.event.invokeListener = function (listener, args) {
        if (typeof(listener) === "string") {
            listener = fluid.event.resolveListener(listener); // just resolves globals
        }
        return listener.apply(null, args);
    };

    // unsupported, NON-API function
    fluid.event.resolveListener = function (listener) {
        var listenerName = listener.globalName || (typeof(listener) === "string" ? listener : null);
        if (listenerName) {
            var listenerFunc = fluid.getGlobalValue(listenerName);
            if (!listenerFunc) {
                fluid.fail("Unable to look up name " + listenerName + " as a global function");
            } else {
                listener = listenerFunc;
            }
        }
        return listener;
    };

    /** Generate a name for a component for debugging purposes */
    fluid.nameComponent = function (that) {
        return that ? "component with typename " + that.typeName + " and id " + that.id : "[unknown component]";
    };

    fluid.event.nameEvent = function (that, eventName) {
        return eventName + " of " + fluid.nameComponent(that);
    };

    /** Construct an "event firer" object which can be used to register and deregister
     * listeners, to which "events" can be fired. These events consist of an arbitrary
     * function signature. General documentation on the Fluid events system is at
     * http://wiki.fluidproject.org/display/fluid/The+Fluid+Event+System .
     * @param {Object} options - A structure to configure this event firer. Supported fields:
     *     {String} name - a name for this firer
     *     {Boolean} preventable - If <code>true</code> the return value of each handler will
     * be checked for <code>false</code> in which case further listeners will be shortcircuited, and this
     * will be the return value of fire()
     */
    fluid.makeEventFirer = function (options) {
        options = options || {};
        var name = options.name || "<anonymous>";
        var that;

        var lazyInit = function () { // Lazy init function to economise on object references for events which are never listened to
            that.listeners = {};
            that.byId = {};
            that.sortedListeners = [];
            that.addListener = function (listener, namespace, priority, softNamespace, listenerId) {
                if (that.destroyed) {
                    fluid.fail("Cannot add listener to destroyed event firer " + that.name);
                }
                if (!listener) {
                    return;
                }
                if (typeof(listener) === "string") {
                    listener = {globalName: listener};
                }
                var id = listenerId || fluid.event.identifyListener(listener);
                namespace = namespace || id;
                var record = {listener: listener,
                    namespace: namespace,
                    softNamespace: softNamespace,
                    listenerId: listenerId,
                    priority: fluid.parsePriority(priority, that.sortedListeners.length, false, "listeners")
                };
                that.byId[id] = record;

                var thisListeners = (that.listeners[namespace] = fluid.makeArray(that.listeners[namespace]));
                thisListeners[softNamespace ? "push" : "unshift"] (record);

                that.sortedListeners = fluid.event.sortListeners(that.listeners);
            };
            that.addListener.apply(null, arguments);
        };
        that = {
            eventId: fluid.allocateGuid(),
            name: name,
            ownerId: options.ownerId,
            typeName: "fluid.event.firer",
            destroy: function () {
                that.destroyed = true;
            },
            addListener: function () {
                lazyInit.apply(null, arguments);
            },

            removeListener: function (listener) {
                if (!that.listeners) { return; }
                var namespace, id, record;
                if (typeof (listener) === "string") {
                    namespace = listener;
                    record = that.listeners[namespace];
                    if (!record) { // it was an id and not a namespace - take the namespace from its record later
                        id = namespace;
                        namespace = null;
                    }
                }
                else if (typeof(listener) === "function") {
                    id = fluid.event.identifyListener(listener, true);
                    if (!id) {
                        fluid.fail("Cannot remove unregistered listener function ", listener, " from event " + that.name);
                    }
                }
                var rec = that.byId[id];
                var softNamespace = rec && rec.softNamespace;
                namespace = namespace || (rec && rec.namespace) || id;
                delete that.byId[id];
                record = that.listeners[namespace];
                if (record) {
                    if (softNamespace) {
                        fluid.remove_if(record, function (thisLis) {
                            return thisLis.listener.$$fluid_guid === id || thisLis.listenerId === id;
                        });
                    } else {
                        record.shift();
                    }
                    if (record.length === 0) {
                        delete that.listeners[namespace];
                    }
                }
                that.sortedListeners = fluid.event.sortListeners(that.listeners);
            },
            fire: function () {
                var listeners = that.sortedListeners;
                if (!listeners || that.destroyed) { return; }
                fluid.log(fluid.logLevel.TRACE, "Firing event " + name + " to list of " + listeners.length + " listeners");
                for (var i = 0; i < listeners.length; ++i) {
                    var lisrec = listeners[i];
                    lisrec.listener = fluid.event.resolveListener(lisrec.listener);
                    var listener = lisrec.listener;
                    var ret = listener.apply(null, arguments);
                    var value;
                    if (options.preventable && ret === false || that.destroyed) {
                        value = false;
                    }
                    if (value !== undefined) {
                        return value;
                    }
                }
            }
        };
        return that;
    };

    // unsupported, NON-API function
    fluid.event.addListenerToFirer = function (firer, value, namespace, wrapper) {
        wrapper = wrapper || fluid.identity;
        if (fluid.isArrayable(value)) {
            for (var i = 0; i < value.length; ++i) {
                fluid.event.addListenerToFirer(firer, value[i], namespace, wrapper);
            }
        } else if (typeof (value) === "function" || typeof (value) === "string") {
            wrapper(firer).addListener(value, namespace);
        } else if (value && typeof (value) === "object") {
            wrapper(firer).addListener(value.listener, namespace || value.namespace, value.priority, value.softNamespace, value.listenerId);
        }
    };

    // unsupported, NON-API function - non-IOC passthrough
    fluid.event.resolveListenerRecord = function (records) {
        return { records: records };
    };

    fluid.expandImmediate = function (material) {
        fluid.fail("fluid.expandImmediate could not be loaded - please include FluidIoC.js in order to operate IoC-driven event with descriptor " + material);
    };

    // unsupported, NON-API function
    fluid.mergeListeners = function (that, events, listeners) {
        fluid.each(listeners, function (value, key) {
            var firer, namespace;
            if (key.charAt(0) === "{") {
                firer = fluid.expandImmediate(key, that);
                if (!firer) {
                    fluid.fail("Error in listener record: key " + key + " could not be looked up to an event firer - did you miss out \"events.\" when referring to an event firer?");
                }
            } else {
                var keydot = key.indexOf(".");

                if (keydot !== -1) {
                    namespace = key.substring(keydot + 1);
                    key = key.substring(0, keydot);
                }
                if (!events[key]) {
                    fluid.fail("Listener registered for event " + key + " which is not defined for this component");
                }
                firer = events[key];
            }
            var record = fluid.event.resolveListenerRecord(value, that, key, namespace, true);
            fluid.event.addListenerToFirer(firer, record.records, namespace, record.adderWrapper);
        });
    };

    // unsupported, NON-API function
    fluid.eventFromRecord = function (eventSpec, eventKey, that) {
        var isIoCEvent = eventSpec && (typeof (eventSpec) !== "string" || eventSpec.charAt(0) === "{");
        var event;
        if (isIoCEvent) {
            if (!fluid.event.resolveEvent) {
                fluid.fail("fluid.event.resolveEvent could not be loaded - please include FluidIoC.js in order to operate IoC-driven event with descriptor ",
                    eventSpec);
            } else {
                event = fluid.event.resolveEvent(that, eventKey, eventSpec);
            }
        } else {
            event = fluid.makeEventFirer({
                name: fluid.event.nameEvent(that, eventKey),
                preventable: eventSpec === "preventable",
                ownerId: that.id
            });
        }
        return event;
    };

    // unsupported, NON-API function - this is patched from FluidIoC.js
    fluid.instantiateFirers = function (that, options) {
        fluid.each(options.events, function (eventSpec, eventKey) {
            that.events[eventKey] = fluid.eventFromRecord(eventSpec, eventKey, that);
        });
    };

    // unsupported, NON-API function
    fluid.mergeListenerPolicy = function (target, source, key) {
        if (typeof (key) !== "string") {
            fluid.fail("Error in listeners declaration - the keys in this structure must resolve to event names - got " + key + " from ", source);
        }
        // cf. triage in mergeListeners
        var hasNamespace = key.charAt(0) !== "{" && key.indexOf(".") !== -1;
        return hasNamespace ? (source || target) : fluid.arrayConcatPolicy(target, source);
    };

    // unsupported, NON-API function
    fluid.makeMergeListenersPolicy = function (merger) {
        return function (target, source) {
            target = target || {};
            fluid.each(source, function (listeners, key) {
                target[key] = merger(target[key], listeners, key);
            });
            return target;
        };
    };

    fluid.validateListenersImplemented = function (that) {
        var errors = [];
        fluid.each(that.events, function (event, name) {
            fluid.each(event.sortedListeners, function (lisrec) {
                if (lisrec.listener === fluid.notImplemented || lisrec.listener.globalName === "fluid.notImplemented") {
                    errors.push({name: name, namespace: lisrec.namespace, componentSource: fluid.model.getSimple(that.options.listeners, [name + "." + lisrec.namespace, 0, "componentSource"])});
                }
            });
        });
        return errors;
    };

    /** Removes duplicated and empty elements from an already sorted array **/
    fluid.unique = function (array) {
        return fluid.remove_if(array, function (element, i) {
            return !element || i > 0 && element === array[i - 1];
        });
    };

    fluid.arrayConcatPolicy = function (target, source) {
        return fluid.makeArray(target).concat(fluid.makeArray(source));
    };

    /*** FLUID ERROR SYSTEM ***/

    fluid.failureEvent = fluid.makeEventFirer({name: "failure event"});

    fluid.failureEvent.addListener(fluid.builtinFail, "fail");
    fluid.failureEvent.addListener(fluid.logFailure, "log", "before:fail");

    /**
     * Configure the behaviour of fluid.fail by pushing or popping a disposition record onto a stack.
     * @param {Number|Function} condition
     & Supply either a function, which will be called with two arguments, args (the complete arguments to
     * fluid.fail) and activity, an array of strings describing the current framework invocation state.
     * Or, the argument may be the number <code>-1</code> indicating that the previously supplied disposition should
     * be popped off the stack
     */
    fluid.pushSoftFailure = function (condition) {
        if (typeof (condition) === "function") {
            fluid.failureEvent.addListener(condition, "fail");
        } else if (condition === -1) {
            fluid.failureEvent.removeListener("fail");
        } else if (typeof(condition) === "boolean") {
            fluid.fail("pushSoftFailure with boolean value is no longer supported");
        }
    };

    /*** DEFAULTS AND OPTIONS MERGING SYSTEM ***/

    // A function to tag the types of all Fluid components
    fluid.componentConstructor = function () {};

    /** Create a "type tag" component with no state but simply a type name and id. The most
     *  minimal form of Fluid component */
    // No longer a publically supported function - we don't abolish this because it is too annoying to prevent
    // circularity during the bootup of the IoC system if we try to construct full components before it is complete
    // unsupported, non-API function
    fluid.typeTag = function (name) {
        var that = Object.create(fluid.componentConstructor.prototype);
        that.typeName = name;
        that.id = fluid.allocateGuid();
        return that;
    };

    var gradeTick = 1; // tick counter for managing grade cache invalidation
    var gradeTickStore = {};

    fluid.defaultsStore = {};

    var resolveGradesImpl = function (gs, gradeNames, base) {
        var raw = true;
        if (base) {
            raw = gradeNames.length === 1; // We are just resolving a single grade and populating the cache
        }
        else {
            gradeNames = fluid.makeArray(gradeNames);
        }
        for (var i = gradeNames.length - 1; i >= 0; -- i) {
            var gradeName = gradeNames[i];
            if (gradeName && !gs.gradeHash[gradeName]) {
                var isDynamic = gradeName.charAt(0) === "{";
                var options = (isDynamic ? null : (raw ? fluid.rawDefaults(gradeName) : fluid.getGradedDefaults(gradeName))) || {};
                var thisTick = gradeTickStore[gradeName] || (gradeTick - 1); // a nonexistent grade is recorded as previous to current
                gs.lastTick = Math.max(gs.lastTick, thisTick);
                gs.gradeHash[gradeName] = true;
                gs.gradeChain.push(gradeName);
                gs.optionsChain.push(options);
                var oGradeNames = fluid.makeArray(options.gradeNames);
                for (var j = oGradeNames.length - 1; j >= 0; -- j) { // from stronger to weaker grades
                    var oGradeName = oGradeNames[j];
                    if (raw) {
                        resolveGradesImpl(gs, oGradeName);
                    } else {
                        if (!gs.gradeHash[oGradeName]) {
                            gs.gradeHash[oGradeName] = true; // these have already been resolved
                            gs.gradeChain.push(oGradeName);
                        }
                    }
                }
            }
        }
        return gs;
    };

    // unsupported, NON-API function
    fluid.resolveGradeStructure = function (defaultName, gradeNames) {
        var gradeStruct = {
            lastTick: 0,
            gradeChain: [],
            gradeHash: {},
            optionsChain: []
        };
        // stronger grades appear to the right in defaults - dynamic grades are stronger still - FLUID-5085
        // we supply these in reverse order to resolveGradesImpl with weak grades at the right
        return resolveGradesImpl(gradeStruct, [defaultName].concat(fluid.makeArray(gradeNames)), true);
    };

    var mergedDefaultsCache = {};

    // unsupported, NON-API function
    fluid.gradeNamesToKey = function (defaultName, gradeNames) {
        return defaultName + "|" + gradeNames.join("|");
    };

    fluid.hasGrade = function (options, gradeName) {
        return !options || !options.gradeNames ? false : fluid.contains(options.gradeNames, gradeName);
    };

    // unsupported, NON-API function
    fluid.resolveGrade = function (defaults, defaultName, gradeNames) {
        var gradeStruct = fluid.resolveGradeStructure(defaultName, gradeNames);
        var mergeArgs = gradeStruct.optionsChain.reverse();
        var mergePolicy = {};
        for (var i = 0; i < mergeArgs.length; ++ i) {
            if (mergeArgs[i] && mergeArgs[i].mergePolicy) {
                mergePolicy = $.extend(true, mergePolicy, mergeArgs[i].mergePolicy);
            }
        }
        mergeArgs = [mergePolicy, {}].concat(mergeArgs);
        var mergedDefaults = fluid.merge.apply(null, mergeArgs);
        mergedDefaults.gradeNames = gradeStruct.gradeChain.reverse();
        return {defaults: mergedDefaults, lastTick: gradeStruct && gradeStruct.lastTick};
    };

    // unsupported, NON-API function
    fluid.getGradedDefaults = function (defaultName, gradeNames) {
        gradeNames = fluid.makeArray(gradeNames);
        var key = fluid.gradeNamesToKey(defaultName, gradeNames);
        var mergedDefaults = mergedDefaultsCache[key];
        if (mergedDefaults) {
            var lastTick = 0; // check if cache should be invalidated through real latest tick being later than the one stored
            var searchGrades = mergedDefaults.defaults.gradeNames || [];
            for (var i = 0; i < searchGrades.length; ++ i) {
                lastTick = Math.max(lastTick, gradeTickStore[searchGrades[i]] || 0);
            }
            if (lastTick > mergedDefaults.lastTick) {
                fluid.log("Clearing cache for component " + defaultName + " with gradeNames ", searchGrades);
                mergedDefaults = null;
            }
        }
        if (!mergedDefaults) {
            var defaults = fluid.rawDefaults(defaultName);
            if (!defaults) {
                return defaults;
            }
            mergedDefaults = mergedDefaultsCache[key] = fluid.resolveGrade(defaults, defaultName, gradeNames);
        }
        return mergedDefaults.defaults;
    };

    // unsupported, NON-API function
    fluid.upgradePrimitiveFunc = function (rec, key) {
        if (rec && fluid.isPrimitive(rec)) {
            var togo = {};
            togo[key || (typeof(rec) === "string" && rec.charAt(0) !== "{" ? "funcName" : "func")] = rec;
            togo.args = fluid.NO_VALUE;
            return togo;
        } else {
            return rec;
        }
    };

    // unsupported, NON-API function
    // Modify supplied options record to include "componentSource" annotation required by FLUID-5082
    // TODO: This function really needs to act recursively in order to catch listeners registered for subcomponents - fix with FLUID-5614
    fluid.annotateListeners = function (componentName, options) {
        options.listeners = fluid.transform(options.listeners, function (record) {
            var togo = fluid.makeArray(record);
            return fluid.transform(togo, function (onerec) {
                onerec = fluid.upgradePrimitiveFunc(onerec, "listener");
                onerec.componentSource = componentName;
                return onerec;
            });
        });
        options.invokers = fluid.transform(options.invokers, function (record) {
            record = fluid.upgradePrimitiveFunc(record);
            if (record) {
                record.componentSource = componentName;
            }
            return record;
        });
    };

    // unsupported, NON-API function
    fluid.rawDefaults = function (componentName, options) {
        if (options === undefined) {
            var entry = fluid.defaultsStore[componentName];
            return entry && entry.options;
        } else {
            fluid.pushActivity("registerDefaults", "registering defaults for grade %componentName with options %options",
                {componentName: componentName, options: options});
            var optionsCopy = fluid.expandCompact ? fluid.expandCompact(options) : fluid.copy(options);
            fluid.annotateListeners(componentName, optionsCopy);
            var callerInfo = fluid.getCallerInfo && fluid.getCallerInfo(6);
            fluid.defaultsStore[componentName] = {
                options: optionsCopy,
                callerInfo: callerInfo
            };
            gradeTickStore[componentName] = gradeTick++;
            fluid.popActivity();
        }
    };

    // unsupported, NON-API function
    fluid.doIndexDefaults = function (defaultName, defaults, index, indexSpec) {
        var requiredGrades = fluid.makeArray(indexSpec.gradeNames);
        for (var i = 0; i < requiredGrades.length; ++ i) {
            if (!fluid.hasGrade(defaults, requiredGrades[i])) { return; }
        }
        var indexFunc = typeof(indexSpec.indexFunc) === "function" ? indexSpec.indexFunc : fluid.getGlobalValue(indexSpec.indexFunc);
        var keys = indexFunc(defaults) || [];
        for (var j = 0; j < keys.length; ++ j) {
            (index[keys[j]] = index[keys[j]] || []).push(defaultName);
        }
    };

    /** Evaluates an index specification over all the defaults records registered into the system.
     * @param indexName {String} The name of this index record (currently ignored)
     * @param indexSpec {Object} Specification of the index to be performed - fields:
     *     gradeNames: {String/Array of String} List of grades that must be matched by this indexer
     *     indexFunc:  {String/Function} An index function which accepts a defaults record and returns a list of keys
     * @return A structure indexing keys to lists of matched gradenames
     */
    // The expectation is that this function is extremely rarely used with respect to registration of defaults
    // in the system, so currently we do not make any attempts to cache the results. The field "indexName" is
    // supplied in case a future implementation chooses to implement caching
    fluid.indexDefaults = function (indexName, indexSpec) {
        var index = {};
        for (var defaultName in fluid.defaultsStore) {
            var defaults = fluid.getGradedDefaults(defaultName);
            fluid.doIndexDefaults(defaultName, defaults, index, indexSpec);
        }
        return index;
    };

    /**
     * Retrieves and stores a grade's configuration centrally.
     * @param {String} gradeName the name of the grade whose options are to be read or written
     * @param {Object} (optional) an object containing the options to be set
     */

    fluid.defaults = function (componentName, options) {
        if (options === undefined) {
            return fluid.getGradedDefaults(componentName);
        }
        else {
            if (options && options.options) {
                fluid.fail("Probable error in options structure for " + componentName +
                    " with option named \"options\" - perhaps you meant to write these options at top level in fluid.defaults? - ", options);
            }
            fluid.rawDefaults(componentName, options);
            var gradedDefaults = fluid.getGradedDefaults(componentName);
            if (!fluid.hasGrade(gradedDefaults, "fluid.function")) {
                fluid.makeComponentCreator(componentName);
            }
        }
    };

    fluid.makeComponentCreator = function (componentName) {
        var creator = function () {
            var defaults = fluid.getGradedDefaults(componentName);
            if (!defaults.gradeNames || defaults.gradeNames.length === 0) {
                fluid.fail("Cannot make component creator for type " + componentName + " which does not have any gradeNames defined");
            } else if (!defaults.initFunction) {
                var blankGrades = [];
                for (var i = 0; i < defaults.gradeNames.length; ++ i) {
                    var gradeName = defaults.gradeNames[i];
                    var rawDefaults = fluid.rawDefaults(gradeName);
                    if (!rawDefaults) {
                        blankGrades.push(gradeName);
                    }
                }
                if (blankGrades.length === 0) {
                    fluid.fail("Cannot make component creator for type " + componentName + " which does not have an initFunction defined");
                } else {
                    fluid.fail("The grade hierarchy of component with type " + componentName + " is incomplete - it inherits from the following grade(s): " +
                     blankGrades.join(", ") + " for which the grade definitions are corrupt or missing. Please check the files which might include these " +
                     "grades and ensure they are readable and have been loaded by this instance of Infusion");
                }
            } else {
                return fluid.initComponent(componentName, arguments);
            }
        };
        var existing = fluid.getGlobalValue(componentName);
        if (existing) {
            $.extend(creator, existing);
        }
        fluid.setGlobalValue(componentName, creator);
    };

    // Cheapskate implementation which avoids dependency on DataBinding.js
    // TODO: This is apparently still used by the core merging algorithm, for reasons we no longer understand, even though
    // it has long been disused by DataBinding itself
    fluid.model.mergeModel = function (target, source) {
        if (fluid.isPlainObject(target)) {
            var copySource = fluid.copy(source);
            $.extend(true, source, target);
            $.extend(true, source, copySource);
        }
        return source;
    };

    var emptyPolicy = {};
    // unsupported, NON-API function
    fluid.derefMergePolicy = function (policy) {
        return (policy? policy["*"]: emptyPolicy) || emptyPolicy;
    };

    // unsupported, NON-API function
    fluid.compileMergePolicy = function (mergePolicy) {
        var builtins = {}, defaultValues = {};
        var togo = {builtins: builtins, defaultValues: defaultValues};

        if (!mergePolicy) {
            return togo;
        }
        fluid.each(mergePolicy, function (value, key) {
            var parsed = {}, builtin = true;
            if (typeof(value) === "function") {
                parsed.func = value;
            }
            else if (typeof(value) === "object") {
                parsed = value;
            }
            else if (!fluid.isDefaultValueMergePolicy(value)) {
                var split = value.split(/\s*,\s*/);
                for (var i = 0; i < split.length; ++ i) {
                    parsed[split[i]] = true;
                }
            }
            else {
                // Convert to ginger self-reference - NB, this can only be parsed by IoC
                fluid.set(defaultValues, key, "{that}.options." + value);
                togo.hasDefaults = true;
                builtin = false;
            }
            if (builtin) {
                fluid.set(builtins, fluid.composePath(key, "*"), parsed);
            }
        });
        return togo;
    };

    // TODO: deprecate this method of detecting default value merge policies before 1.6 in favour of
    // explicit typed records a la ModelTransformations
    // unsupported, NON-API function
    fluid.isDefaultValueMergePolicy = function (policy) {
        return typeof(policy) === "string" &&
            (policy.indexOf(",") === -1 && !/replace|nomerge|noexpand/.test(policy));
    };

    // unsupported, NON-API function
    fluid.mergeOneImpl = function (thisTarget, thisSource, j, sources, newPolicy, i, segs) {
        var togo = thisTarget;

        var primitiveTarget = fluid.isPrimitive(thisTarget);

        if (thisSource !== undefined) {
            if (!newPolicy.func && thisSource !== null && fluid.isPlainObject(thisSource) &&
                    !fluid.isDOMish(thisSource) && thisSource !== fluid.VALUE && !newPolicy.nomerge) {
                if (primitiveTarget) {
                    togo = thisTarget = fluid.freshContainer(thisSource);
                }
                // recursion is now external? We can't do it from here since sources are not all known
                // options.recurse(thisTarget, i + 1, segs, sources, newPolicyHolder, options);
            } else {
                sources[j] = undefined;
                if (newPolicy.func) {
                    togo = newPolicy.func.call(null, thisTarget, thisSource, segs[i - 1], segs, i); // NB - change in this mostly unused argument
                } else {
                    togo = fluid.isValue(thisTarget) ? fluid.model.mergeModel(thisTarget, thisSource) : thisSource;
                }
            }
        }
        return togo;
    };
    // NB - same quadratic worry about these as in FluidIoC in the case the RHS trundler is live -
    // since at each regeneration step driving the RHS we are discarding the "cursor arguments" these
    // would have to be regenerated at each step - although in practice this can only happen once for
    // each object for all time, since after first resolution it will be concrete.
    function regenerateCursor (source, segs, limit, sourceStrategy) {
        for (var i = 0; i < limit; ++ i) {
            source = sourceStrategy(source, segs[i], i, fluid.makeArray(segs)); // copy for FLUID-5243
        }
        return source;
    }

    function regenerateSources (sources, segs, limit, sourceStrategies) {
        var togo = [];
        for (var i = 0; i < sources.length; ++ i) {
            var thisSource = regenerateCursor(sources[i], segs, limit, sourceStrategies[i]);
            if (thisSource !== undefined) {
                togo.push(thisSource);
            }
        }
        return togo;
    }

    // unsupported, NON-API function
    fluid.fetchMergeChildren = function (target, i, segs, sources, mergePolicy, options) { /* unused parameter left for documentation purposes */ // jshint ignore:line
        var thisPolicy = fluid.derefMergePolicy(mergePolicy);
        for (var j = sources.length - 1; j >= 0; -- j) { // this direction now irrelevant - control is in the strategy
            var source = sources[j];
            // NB - this detection relies on strategy return being complete objects - which they are
            // although we need to set up the roots separately. We need to START the process of evaluating each
            // object root (sources) COMPLETELY, before we even begin! Even if the effect of this is to cause a
            // dispatch into ourselves almost immediately. We can do this because we can take control over our
            // TARGET objects and construct them early. Even if there is a self-dispatch, it will be fine since it is
            // DIRECTED and so will not trouble our "slow" detection of properties. After all self-dispatches end, control
            // will THEN return to "evaluation of arguments" (expander blocks) and only then FINALLY to this "slow"
            // traversal of concrete properties to do the final merge.
            if (source !== undefined) {
                fluid.each(source, function (newSource, name) {
                    if (!(name in target)) { // only request each new target key once -- all sources will be queried per strategy
                        segs[i] = name;
                        if (!fluid.getImmediate(options.exceptions, segs, i)) {
                            options.strategy(target, name, i + 1, segs, sources, mergePolicy);
                        }
                    }
                });  /* function in loop */ // jshint ignore:line
                if (thisPolicy.replace) { // this branch primarily deals with a policy of replace at the root
                    break;
                }
            }
        }
        return target;
    };

    // A special marker object which will be placed at a current evaluation point in the tree in order
    // to protect against circular evaluation
    fluid.inEvaluationMarker = Object.freeze({"__CURRENTLY_IN_EVALUATION__": true});

    // A path depth above which the core "process strategies" will bail out, assuming that the
    // structure has become circularly linked. Helpful in environments such as Firebug which will
    // kill the browser process if they happen to be open when a stack overflow occurs. Also provides
    // a more helpful diagnostic.
    fluid.strategyRecursionBailout = 50;

    // unsupported, NON-API function
    fluid.makeMergeStrategy = function (options) {
        var strategy = function (target, name, i, segs, sources, policy) {
            if (i > fluid.strategyRecursionBailout) {
                fluid.fail("Overflow/circularity in options merging, current path is ", segs, " at depth " , i, " - please protect components from merging using the \"nomerge\" merge policy");
            }
            if (fluid.isPrimitive(target)) { // For "use strict"
                return undefined; // Review this after FLUID-4925 since the only trigger is in slow component lookahead
            }
            if (fluid.isTracing) {
                fluid.tracing.pathCount.push(fluid.path(segs.slice(0, i)));
            }

            var oldTarget;
            if (name in target) { // bail out if our work has already been done
                oldTarget = target[name];
                if (!options.evaluateFully) { // see notes on this hack in "initter" - early attempt to deal with FLUID-4930
                    return oldTarget;
                }
            }
            else {
                if (target !== fluid.inEvaluationMarker) { // TODO: blatant "coding to the test" - this enables the simplest "re-trunking" in
                    // FluidIoCTests to function. In practice, we need to throw away this implementation entirely in favour of the
                    // "iterative deepening" model coming with FLUID-4925
                    target[name] = fluid.inEvaluationMarker;
                }
            }
            if (sources === undefined) { // recover our state in case this is an external entry point
                segs = fluid.makeArray(segs); // avoid trashing caller's segs
                sources = regenerateSources(options.sources, segs, i - 1, options.sourceStrategies);
                policy = regenerateCursor(options.mergePolicy, segs, i - 1, fluid.concreteTrundler);
            }
            // var thisPolicy = fluid.derefMergePolicy(policy);
            var newPolicyHolder = fluid.concreteTrundler(policy, name);
            var newPolicy = fluid.derefMergePolicy(newPolicyHolder);

            var start, limit, mul;
            if (newPolicy.replace) {
                start = 1 - sources.length; limit = 0; mul = -1; /* on one line for easier visual comparison of the two algorithms  */ // jshint ignore:line
            }
            else {
                start = 0; limit = sources.length - 1; mul = +1; /* on one line for easier visual comparison of the two algorithms  */ // jshint ignore:line
            }
            var newSources = [];
            var thisTarget;

            for (var j = start; j <= limit; ++j) { // TODO: try to economise on this array and on gaps
                var k = mul * j;
                var thisSource = options.sourceStrategies[k](sources[k], name, i, segs); // Run the RH algorithm in "driving" mode
                if (thisSource !== undefined) {
                    newSources[k] = thisSource;
                    if (oldTarget === undefined) {
                        if (mul === -1) { // if we are going backwards, it is "replace"
                            thisTarget = target[name] = thisSource;
                            break;
                        }
                        else {
                            // write this in early, since early expansions may generate a trunk object which is written in to by later ones
                            thisTarget = fluid.mergeOneImpl(thisTarget, thisSource, j, newSources, newPolicy, i, segs, options);
                            if (target !== fluid.inEvaluationMarker) {
                                target[name] = thisTarget;
                            }
                        }
                    }
                }
            }
            if (oldTarget !== undefined) {
                thisTarget = oldTarget;
            }
            if (newSources.length > 0) {
                if (fluid.isPlainObject(thisTarget)) {
                    fluid.fetchMergeChildren(thisTarget, i, segs, newSources, newPolicyHolder, options);
                }
            }
            if (oldTarget === undefined && newSources.length === 0) {
                delete target[name]; // remove the evaluation marker - nothing to evaluate
            }
            return thisTarget;
        };
        options.strategy = strategy;
        return strategy;
    };

    // A simple stand-in for "fluid.get" where the material is covered by a single strategy
    fluid.driveStrategy = function (root, pathSegs, strategy) {
        pathSegs = fluid.makeArray(pathSegs);
        for (var i = 0; i < pathSegs.length; ++ i) {
            if (!root) {
                return undefined;
            }
            root = strategy(root, pathSegs[i], i + 1, pathSegs);
        }
        return root;
    };

    // A very simple "new inner trundler" that just performs concrete property access
    // Note that every "strategy" is also a "trundler" of this type, considering just the first two arguments
    fluid.concreteTrundler = function (source, seg) {
        return !source? undefined : source[seg];
    };

    /** Merge a collection of options structures onto a target, following an optional policy.
     * This method is now used only for the purpose of merging "dead" option documents in order to
     * cache graded component defaults. Component option merging is now performed by the
     * fluid.makeMergeOptions pathway which sets up a deferred merging process. This function
     * will not be removed in the Fluid 2.0 release but it is recommended that users not call it
     * directly.
     * The behaviour of this function is explained more fully on
     * the page http://wiki.fluidproject.org/display/fluid/Options+Merging+for+Fluid+Components .
     * @param policy {Object/String} A "policy object" specifiying the type of merge to be performed.
     * If policy is of type {String} it should take on the value "replace" representing
     * a static policy. If it is an
     * Object, it should contain a mapping of EL paths onto these String values, representing a
     * fine-grained policy. If it is an Object, the values may also themselves be EL paths
     * representing that a default value is to be taken from that path.
     * @param options1, options2, .... {Object} an arbitrary list of options structure which are to
     * be merged together. These will not be modified.
     */

    fluid.merge = function (policy /*, ... sources */) {
        var sources = Array.prototype.slice.call(arguments, 1);
        var compiled = fluid.compileMergePolicy(policy).builtins;
        var options = fluid.makeMergeOptions(compiled, sources, {});
        options.initter();
        return options.target;
    };

    // unsupported, NON-API function
    fluid.simpleGingerBlock = function (source, recordType) {
        var block = {
            target: source,
            simple: true,
            strategy: fluid.concreteTrundler,
            initter: fluid.identity,
            recordType: recordType,
            priority: fluid.mergeRecordTypes[recordType]
        };
        return block;
    };

    // unsupported, NON-API function
    fluid.makeMergeOptions = function (policy, sources, userOptions) {
        // note - we close over the supplied policy as a shared object reference - it will be updated during discovery
        var options = {
            mergePolicy: policy,
            sources: sources
        };
        options = $.extend(options, userOptions);
        options.target = options.target || fluid.freshContainer(options.sources[0]);
        options.sourceStrategies = options.sourceStrategies || fluid.generate(options.sources.length, fluid.concreteTrundler);
        options.initter = function () {
            // This hack is necessary to ensure that the FINAL evaluation doesn't balk when discovering a trunk path which was already
            // visited during self-driving via the expander. This bi-modality is sort of rubbish, but we currently don't have "room"
            // in the strategy API to express when full evaluation is required - and the "flooding API" is not standardised. See FLUID-4930
            options.evaluateFully = true;
            fluid.fetchMergeChildren(options.target, 0, [], options.sources, options.mergePolicy, options);
        };
        fluid.makeMergeStrategy(options);
        return options;
    };

    // unsupported, NON-API function
    fluid.transformOptions = function (options, transRec) {
        fluid.expect("Options transformation record", transRec, ["transformer", "config"]);
        var transFunc = fluid.getGlobalValue(transRec.transformer);
        return transFunc.call(null, options, transRec.config);
    };

    // unsupported, NON-API function
    fluid.findMergeBlocks = function (mergeBlocks, recordType) {
        return fluid.remove_if(fluid.makeArray(mergeBlocks), function (block) { return block.recordType !== recordType; });
    };

    // unsupported, NON-API function
    fluid.transformOptionsBlocks = function (mergeBlocks, transformOptions, recordTypes) {
        fluid.each(recordTypes, function (recordType) {
            var blocks = fluid.findMergeBlocks(mergeBlocks, recordType);
            fluid.each(blocks, function (block) {
                var source = block.source ? "source" : "target"; // TODO: Problem here with irregular presentation of options which consist of a reference in their entirety
                block[block.simple || source === "target" ? "target": "source"] = fluid.transformOptions(block[source], transformOptions);
            });
        });
    };

    // unsupported, NON-API function
    fluid.deliverOptionsStrategy = fluid.identity;
    fluid.computeComponentAccessor = fluid.identity;
    fluid.computeDynamicComponents = fluid.identity;

    // The types of merge record the system supports, with the weakest records first
    fluid.mergeRecordTypes = {
        defaults:           1000,
        defaultValueMerge:  900,
        subcomponentRecord: 800,
        user:               700,
        distribution:       100 // and above
    };

    // Utility used in the framework (primarily with distribution assembly), unconnected with new ChangeApplier
    // unsupported, NON-API function
    fluid.model.applyChangeRequest = function (model, request) {
        var segs = request.segs;
        if (segs.length === 0) {
            if (request.type === "ADD") {
                $.extend(true, model, request.value);
            } else {
                fluid.clear(model);
            }
        } else if (request.type === "ADD") {
            fluid.model.setSimple(model, request.segs, request.value);
        } else {
            for (var i = 0; i < segs.length - 1; ++ i) {
                model = model[segs[i]];
                if (!model) {
                    return;
                }
            }
            var last = segs[segs.length - 1];
            delete model[last];
        }
    };

    /** Delete the value in the supplied object held at the specified path
     * @param target {Object} The object holding the value to be deleted (possibly empty)
     * @param segs {Array of String} the path of the value to be deleted
     */
    // unsupported, NON-API function
    fluid.destroyValue = function (target, segs) {
        if (target) {
            fluid.model.applyChangeRequest(target, {type: "DELETE", segs: segs});
        }
    };

    /**
     * Merges the component's declared defaults, as obtained from fluid.defaults(),
     * with the user's specified overrides.
     *
     * @param {Object} that the instance to attach the options to
     * @param {String} componentName the unique "name" of the component, which will be used
     * to fetch the default options from store. By recommendation, this should be the global
     * name of the component's creator function.
     * @param {Object} userOptions the user-specified configuration options for this component
     */
    // unsupported, NON-API function
    fluid.mergeComponentOptions = function (that, componentName, userOptions, localOptions) {
        var rawDefaults = fluid.rawDefaults(componentName);
        var defaults = fluid.getGradedDefaults(componentName, rawDefaults && rawDefaults.gradeNames ? null : localOptions.gradeNames);
        var sharedMergePolicy = {};

        var mergeBlocks = [];

        if (fluid.expandComponentOptions) {
            mergeBlocks = mergeBlocks.concat(fluid.expandComponentOptions(sharedMergePolicy, defaults, userOptions, that));
        }
        else {
            mergeBlocks = mergeBlocks.concat([fluid.simpleGingerBlock(defaults, "defaults"),
                                              fluid.simpleGingerBlock(userOptions, "user")]);
        }
        var options = {}; // ultimate target
        var sourceStrategies = [], sources = [];
        var baseMergeOptions = {
            target: options,
            sourceStrategies: sourceStrategies
        };
        // Called both from here and from IoC whenever there is a change of block content or arguments which
        // requires them to be resorted and rebound
        var updateBlocks = function () {
            fluid.each(mergeBlocks, function (block) {
                if (fluid.isPrimitive(block.priority)) {
                    block.priority = fluid.parsePriority(block.priority, 0, false, "options distribution");
                }
            });
            fluid.sortByPriority(mergeBlocks);
            sourceStrategies.length = 0;
            sources.length = 0;
            fluid.each(mergeBlocks, function (block) {
                sourceStrategies.push(block.strategy);
                sources.push(block.target);
            });
        };
        updateBlocks();
        var mergeOptions = fluid.makeMergeOptions(sharedMergePolicy, sources, baseMergeOptions);
        mergeOptions.mergeBlocks = mergeBlocks;
        mergeOptions.updateBlocks = updateBlocks;
        mergeOptions.destroyValue = function (segs) { // This method is a temporary hack to assist FLUID-5091
            for (var i = 0; i < mergeBlocks.length; ++ i) {
                fluid.destroyValue(mergeBlocks[i].target, segs);
            }
            fluid.destroyValue(baseMergeOptions.target, segs);
        };

        var compiledPolicy;
        var mergePolicy;
        function computeMergePolicy() {
            // Decode the now available mergePolicy
            mergePolicy = fluid.driveStrategy(options, "mergePolicy", mergeOptions.strategy);
            mergePolicy = $.extend({}, fluid.rootMergePolicy, mergePolicy);
            compiledPolicy = fluid.compileMergePolicy(mergePolicy);
            // TODO: expandComponentOptions has already put some builtins here - performance implications of the now huge
            // default mergePolicy material need to be investigated as well as this deep merge
            $.extend(true, sharedMergePolicy, compiledPolicy.builtins); // ensure it gets broadcast to all sharers
        }
        computeMergePolicy();
        mergeOptions.computeMergePolicy = computeMergePolicy;

        if (compiledPolicy.hasDefaults) {
            if (fluid.generateExpandBlock) {
                mergeBlocks.push(fluid.generateExpandBlock({
                        options: compiledPolicy.defaultValues,
                        recordType: "defaultValueMerge",
                        priority: fluid.mergeRecordTypes.defaultValueMerge
                    }, that, {}));
                updateBlocks();
            }
            else {
                fluid.fail("Cannot operate mergePolicy ", mergePolicy, " for component ", that, " without including FluidIoC.js");
            }
        }
        that.options = options;
        fluid.driveStrategy(options, "gradeNames", mergeOptions.strategy);

        fluid.deliverOptionsStrategy(that, options, mergeOptions); // do this early to broadcast and receive "distributeOptions"

        fluid.computeComponentAccessor(that, userOptions && userOptions.localRecord);

        var transformOptions = fluid.driveStrategy(options, "transformOptions", mergeOptions.strategy);
        if (transformOptions) {
            fluid.transformOptionsBlocks(mergeBlocks, transformOptions, ["user", "subcomponentRecord"]);
            updateBlocks(); // because the possibly simple blocks may have changed target
        }

        if (!baseMergeOptions.target.mergePolicy) {
            computeMergePolicy();
        }

        return mergeOptions;
    };

    // The Fluid Component System proper

    // The base system grade definitions

    fluid.defaults("fluid.function", {});

    /** Invoke a global function by name and named arguments. A courtesy to allow declaratively encoded function calls
     * to use named arguments rather than bare arrays.
     * @param name {String} A global name which can be resolved to a Function. The defaults for this name must
     * resolve onto a grade including "fluid.function". The defaults record should also contain an entry
     * <code>argumentMap</code>, a hash of argument names onto indexes.
     * @param spec {Object} A named hash holding the argument values to be sent to the function. These will be looked
     * up in the <code>argumentMap</code> and resolved into a flat list of arguments.
     * @return {Any} The return value from the function
     */

    fluid.invokeGradedFunction = function (name, spec) {
        var defaults = fluid.defaults(name);
        if (!defaults || !defaults.argumentMap || !fluid.hasGrade(defaults, "fluid.function")) {
            fluid.fail("Cannot look up name " + name +
                " to a function with registered argumentMap - got defaults ", defaults);
        }
        var args = [];
        fluid.each(defaults.argumentMap, function (value, key) {
            args[value] = spec[key];
        });
        return fluid.invokeGlobalFunction(name, args);
    };

    fluid.noNamespaceDistributionPrefix = "no-namespace-distribution-";

    fluid.mergeOneDistribution = function (target, source, key) {
        var namespace = source.namespace || key || fluid.noNamespaceDistributionPrefix + fluid.allocateGuid();
        source.namespace = namespace;
        target[namespace] = source;
    };

    fluid.distributeOptionsPolicy = function (target, source) {
        target = target || {};
        if (fluid.isArrayable(source)) {
            for (var i = 0; i < source.length; ++ i) {
                fluid.mergeOneDistribution(target, source[i]);
            }
        } else if (typeof(source.target) === "string") {
            fluid.mergeOneDistribution(target, source);
        } else {
            fluid.each(source, function (oneSource, key) {
                fluid.mergeOneDistribution(target, oneSource, key);
            });
        }
        return target;
    };

    fluid.mergingArray = function () {};
    fluid.mergingArray.prototype = [];

    // Defer all evaluation of all nested members to resolve FLUID-5668
    fluid.membersMergePolicy = function (target, source) {
        target = target || {};
        fluid.each(source, function (oneSource, key) {
            if (!target[key]) {
                target[key] = new fluid.mergingArray();
            }
            if (oneSource instanceof fluid.mergingArray) {
                target[key].push.apply(target[key], oneSource);
            } else if (oneSource !== undefined) {
                target[key].push(oneSource);
            }
        });
        return target;
    };

    fluid.invokerStrategies = fluid.arrayToHash(["func", "funcName", "listener", "this", "method"]);

    // Resolve FLUID-5741, FLUID-5184 by ensuring that we avoid mixing incompatible invoker strategies
    fluid.invokersMergePolicy = function (target, source) {
        target = target || {};
        fluid.each(source, function (oneInvoker, name) {
            if (!oneInvoker) {
                target[name] = oneInvoker;
                return;
            } else {
                oneInvoker = fluid.upgradePrimitiveFunc(oneInvoker);
            }
            var oneT = target[name];
            if (!oneT) {
                oneT = target[name] = {};
            }
            for (var key in fluid.invokerStrategies) {
                if (key in oneInvoker) {
                    for (var key2 in fluid.invokerStrategies) {
                        oneT[key2] = undefined; // can't delete since stupid driveStrategy bug from recordStrategy reinstates them
                    }
                }
            }
            $.extend(oneT, oneInvoker);
        });
        return target;
    };

    fluid.rootMergePolicy = {
        gradeNames: fluid.arrayConcatPolicy,
        distributeOptions: fluid.distributeOptionsPolicy,
        members: {
            noexpand: true,
            func: fluid.membersMergePolicy
        },
        invokers: {
            noexpand: true,
            func: fluid.invokersMergePolicy
        },
        transformOptions: "replace",
        listeners: fluid.makeMergeListenersPolicy(fluid.mergeListenerPolicy)
    };

    fluid.defaults("fluid.component", {
        initFunction: "fluid.initLittleComponent",
        mergePolicy: fluid.rootMergePolicy,
        argumentMap: {
            options: 0
        },
        events: { // Three standard lifecycle points common to all components
            onCreate:     null,
            onDestroy:    null,
            afterDestroy: null
        }
    });

    fluid.defaults("fluid.emptySubcomponent", {
        gradeNames: ["fluid.component"]
    });

    /** Compute a "nickname" given a fully qualified typename, by returning the last path
     * segment.
     */

    fluid.computeNickName = function (typeName) {
        var segs = fluid.model.parseEL(typeName);
        return segs[segs.length - 1];
    };

    /** A specially recognised grade tag which directs the IoC framework to instantiate this component first amongst
     * its set of siblings, since it is likely to bear a context-forming type name. This will be removed from the framework
     * once we have implemented FLUID-4925 "wave of explosions" */

    fluid.defaults("fluid.typeFount", {
        gradeNames: ["fluid.component"]
    });

    /**
     * Creates a new "little component": a that-ist object with options merged into it by the framework.
     * This method is a convenience for creating small objects that have options but don't require full
     * View-like features such as the DOM Binder or events
     *
     * @param {Object} name the name of the little component to create
     * @param {Object} options user-supplied options to merge with the defaults
     */
    // NOTE: the 3rd argument localOptions is NOT to be advertised as part of the stable API, it is present
    // just to allow backward compatibility whilst grade specifications are not mandatory - similarly for 4th arg "receiver"
    // NOTE historical name to avoid confusion with fluid.initComponent below - this will all be refactored with FLUID-4925
    fluid.initLittleComponent = function (name, userOptions, localOptions, receiver) {
        var that = fluid.typeTag(name);
        that.lifecycleStatus = "constructing";
        localOptions = localOptions || {gradeNames: "fluid.component"};

        that.destroy = fluid.makeRootDestroy(that); // overwritten by FluidIoC for constructed subcomponents
        var mergeOptions = fluid.mergeComponentOptions(that, name, userOptions, localOptions);
        mergeOptions.exceptions = {members: {model: true, modelRelay: true}}; // don't evaluate these in "early flooding" - they must be fetched explicitly
        var options = that.options;
        that.events = {};
        // deliver to a non-IoC side early receiver of the component (currently only initView)
        (receiver || fluid.identity)(that, options, mergeOptions.strategy);
        fluid.computeDynamicComponents(that, mergeOptions);

        // TODO: ****THIS**** is the point we must deliver and suspend!! Construct the "component skeleton" first, and then continue
        // for as long as we can continue to find components.
        for (var i = 0; i < mergeOptions.mergeBlocks.length; ++ i) {
            mergeOptions.mergeBlocks[i].initter();
        }
        mergeOptions.initter();
        delete options.mergePolicy;

        fluid.instantiateFirers(that, options);
        fluid.mergeListeners(that, that.events, options.listeners);

        return that;
    };

    fluid.diagnoseFailedView = fluid.identity;

    // unsupported, NON-API function
    fluid.makeRootDestroy = function (that) {
        return function () {
            fluid.doDestroy(that);
            that.events.afterDestroy.fire(that, "", null);
        };
    };

    /** Returns <code>true</code> if the supplied reference holds a component which has been destroyed **/

    fluid.isDestroyed = function (that) {
        return that.lifecycleStatus === "destroyed";
    };

    // unsupported, NON-API function
    fluid.doDestroy = function (that, name, parent) {
        that.events.onDestroy.fire(that, name || "", parent);
        that.lifecycleStatus = "destroyed";
        for (var key in that.events) {
            if (key !== "afterDestroy" && typeof(that.events[key].destroy) === "function") {
                that.events[key].destroy();
            }
        }
        if (that.applier) { // TODO: Break this out into the grade's destroyer
            that.applier.destroy();
        }
    };

    // unsupported, NON-API function
    fluid.initComponent = function (componentName, initArgs) {
        var options = fluid.defaults(componentName);
        if (!options.gradeNames) {
            fluid.fail("Cannot initialise component " + componentName + " which has no gradeName registered");
        }
        var args = [componentName].concat(fluid.makeArray(initArgs));
        var that;
        fluid.pushActivity("initComponent", "constructing component of type %componentName with arguments %initArgs",
            {componentName: componentName, initArgs: initArgs});
        that = fluid.invokeGlobalFunction(options.initFunction, args);
        fluid.diagnoseFailedView(componentName, that, options, args);
        if (fluid.initDependents) {
            fluid.initDependents(that);
        }
        var errors = fluid.validateListenersImplemented(that);
        if (errors.length > 0) {
            fluid.fail(fluid.transform(errors, function (error) {
                return "Error constructing component ", that, " - the listener for event " + error.name + " with namespace " + error.namespace + (
                    (error.componentSource ? " which was defined in grade " + error.componentSource : "") + " needs to be overridden with a concrete implementation");
            })).join("\n");
        }
        that.lifecycleStatus = "constructed";
        that.events.onCreate.fire(that);
        fluid.popActivity();
        return that;
    };

    // unsupported, NON-API function
    fluid.initSubcomponentImpl = function (that, entry, args) {
        var togo;
        if (typeof (entry) !== "function") {
            var entryType = typeof (entry) === "string" ? entry : entry.type;
            togo = entryType === "fluid.emptySubcomponent" ?
                null : fluid.invokeGlobalFunction(entryType, args);
        } else {
            togo = entry.apply(null, args);
        }
        return togo;
    };

    // ******* SELECTOR ENGINE *********

    // selector regexps copied from jQuery - recent versions correct the range to start C0
    // The initial portion of the main character selector: "just add water" to add on extra
    // accepted characters, as well as the "\\\\." -> "\." portion necessary for matching
    // period characters escaped in selectors
    var charStart = "(?:[\\w\\u00c0-\\uFFFF*_-";

    fluid.simpleCSSMatcher = {
        regexp: new RegExp("([#.]?)(" + charStart + "]|\\\\.)+)", "g"),
        charToTag: {
            "": "tag",
            "#": "id",
            ".": "clazz"
        }
    };

    fluid.IoCSSMatcher = {
        regexp: new RegExp("([&#]?)(" + charStart + "]|\\.|\\/)+)", "g"),
        charToTag: {
            "": "context",
            "&": "context",
            "#": "id"
        }
    };

    var childSeg = new RegExp("\\s*(>)?\\s*", "g");
//    var whiteSpace = new RegExp("^\\w*$");

    // Parses a selector expression into a data structure holding a list of predicates
    // 2nd argument is a "strategy" structure, e.g.  fluid.simpleCSSMatcher or fluid.IoCSSMatcher
    // unsupported, non-API function
    fluid.parseSelector = function (selstring, strategy) {
        var togo = [];
        selstring = selstring.trim();
        //ws-(ss*)[ws/>]
        var regexp = strategy.regexp;
        regexp.lastIndex = 0;
        var lastIndex = 0;
        while (true) {
            var atNode = []; // a list of predicates at a particular node
            var first = true;
            while (true) {
                var segMatch = regexp.exec(selstring);
                if (!segMatch) {
                    break;
                }
                if (segMatch.index !== lastIndex) {
                    if (first) {
                        fluid.fail("Error in selector string - cannot match child selector expression starting at " + selstring.substring(lastIndex));
                    }
                    else {
                        break;
                    }
                }
                var thisNode = {};
                var text = segMatch[2];
                var targetTag = strategy.charToTag[segMatch[1]];
                if (targetTag) {
                    thisNode[targetTag] = text;
                }
                atNode[atNode.length] = thisNode;
                lastIndex = regexp.lastIndex;
                first = false;
            }
            childSeg.lastIndex = lastIndex;
            var fullAtNode = {predList: atNode};
            var childMatch = childSeg.exec(selstring);
            if (!childMatch || childMatch.index !== lastIndex) {
                fluid.fail("Error in selector string - can not match child selector expression at " + selstring.substring(lastIndex));
            }
            if (childMatch[1] === ">") {
                fullAtNode.child = true;
            }
            togo[togo.length] = fullAtNode;
            // >= test here to compensate for IE bug http://blog.stevenlevithan.com/archives/exec-bugs
            if (childSeg.lastIndex >= selstring.length) {
                break;
            }
            lastIndex = childSeg.lastIndex;
            regexp.lastIndex = childSeg.lastIndex;
        }
        return togo;
    };

    // Message resolution and templating

   /**
    * Converts a string to a regexp with the specified flags given in parameters
    * @param {String} a string that has to be turned into a regular expression
    * @param {String} the flags to provide to the reg exp
    */
    // TODO: this is an abominably inefficient technique for something that could simply be done by means of indexOf and slice
    fluid.stringToRegExp = function (str, flags) {
        return new RegExp(str.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&"), flags);
    };

    /**
     * Simple string template system.
     * Takes a template string containing tokens in the form of "%value".
     * Returns a new string with the tokens replaced by the specified values.
     * Keys and values can be of any data type that can be coerced into a string.
     *
     * @param {String}    template    a string (can be HTML) that contains tokens embedded into it
     * @param {object}    values      a collection of token keys and values
     */
    fluid.stringTemplate = function (template, values) {
        var keys = fluid.keys(values);
        keys = keys.sort(fluid.compareStringLength());
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            var re = fluid.stringToRegExp("%" + key, "g");
            template = template.replace(re, values[key]);
        }
        return template;
    };

})(jQuery, fluid_2_0_0_beta_1);
;/*
Copyright 2007-2010 University of Cambridge
Copyright 2007-2009 University of Toronto
Copyright 2007-2009 University of California, Berkeley
Copyright 2010 OCAD University
Copyright 2010-2011 Lucendo Development Ltd.

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var fluid_2_0_0_beta_1 = fluid_2_0_0_beta_1 || {};
var fluid = fluid || fluid_2_0_0_beta_1;

(function ($, fluid) {
    "use strict";

    /** Render a timestamp from a Date object into a helpful fixed format for debug logs to millisecond accuracy
     * @param date {Date} The date to be rendered
     * @return {String} A string format consisting of hours:minutes:seconds.millis for the datestamp padded to fixed with 
     */

    fluid.renderTimestamp = function (date) {
        var zeropad = function (num, width) {
            if (!width) { width = 2; }
            var numstr = (num === undefined ? "" : num.toString());
            return "00000".substring(5 - width + numstr.length) + numstr;
        };
        return zeropad(date.getHours()) + ":" + zeropad(date.getMinutes()) + ":" + zeropad(date.getSeconds()) + "." + zeropad(date.getMilliseconds(), 3);
    };

    fluid.isTracing = false;

    fluid.registerNamespace("fluid.tracing");

    fluid.tracing.pathCount = [];

    fluid.tracing.summarisePathCount = function (pathCount) {
        pathCount = pathCount || fluid.tracing.pathCount;
        var togo = {};
        for (var i = 0; i < pathCount.length; ++ i) {
            var path = pathCount[i];
            if (!togo[path]) {
                togo[path] = 1;
            }
            else {
                ++togo[path];
            }
        }
        var toReallyGo = [];
        fluid.each(togo, function (el, path) {
            toReallyGo.push({path: path, count: el});
        });
        toReallyGo.sort(function (a, b) {return b.count - a.count;});
        return toReallyGo;
    };

    fluid.tracing.condensePathCount = function (prefixes, pathCount) {
        prefixes = fluid.makeArray(prefixes);
        var prefixCount = {};
        fluid.each(prefixes, function(prefix) {
            prefixCount[prefix] = 0;
        });
        var togo = [];
        fluid.each(pathCount, function (el) {
            var path = el.path;
            if (!fluid.find(prefixes, function(prefix) {
                if (path.indexOf(prefix) === 0) {
                    prefixCount[prefix] += el.count;
                    return true;
                }
            })) {
                togo.push(el);
            }
        });
        fluid.each(prefixCount, function(count, path) {
            togo.unshift({path: path, count: count});
        });
        return togo;
    };

    // Exception stripping code taken from https://github.com/emwendelin/javascript-stacktrace/blob/master/stacktrace.js
    // BSD licence, see header

    fluid.detectStackStyle = function (e) {
        var style = "other";
        var stackStyle = {
            offset: 0
        };
        if (e["arguments"]) {
            style = "chrome";
        } else if (typeof window !== "undefined" && window.opera && e.stacktrace) {
            style = "opera10";
        } else if (e.stack) {
            style = "firefox";
            // Detect FireFox 4-style stacks which are 1 level less deep
            stackStyle.offset = e.stack.indexOf("Trace exception") === -1? 1 : 0;
        } else if (typeof window !== "undefined" && window.opera && !("stacktrace" in e)) { //Opera 9-
            style = "opera";
        }
        stackStyle.style = style;
        return stackStyle;
    };

    fluid.obtainException = function () {
        try {
            throw new Error("Trace exception");
        }
        catch (e) {
            return e;
        }
    };

    var stackStyle = fluid.detectStackStyle(fluid.obtainException());

    fluid.registerNamespace("fluid.exceptionDecoders");

    fluid.decodeStack = function () {
        if (stackStyle.style !== "firefox") {
            return null;
        }
        var e = fluid.obtainException();
        return fluid.exceptionDecoders[stackStyle.style](e);
    };

    fluid.exceptionDecoders.firefox = function (e) {
        var delimiter = "at ";
        var lines = e.stack.replace(/(?:\n@:0)?\s+$/m, "").replace(/^\(/gm, "{anonymous}(").split("\n");
        return fluid.transform(lines, function (line) {
            line = line.replace(/\)/g, "");
            var atind = line.indexOf(delimiter);
            return atind === -1? [line] : [line.substring(atind + delimiter.length), line.substring(0, atind)];
        });
    };

    // Main entry point for callers. 
    fluid.getCallerInfo = function (atDepth) {
        atDepth = (atDepth || 3) - stackStyle.offset;
        var stack = fluid.decodeStack();
        var element = stack && stack[atDepth][0];
        if (element) {
            var lastslash = element.lastIndexOf("/");
            if (lastslash === -1) {
                lastslash = 0;
            }
            var nextColon = element.indexOf(":", lastslash);
            return {
                path: element.substring(0, lastslash),
                filename: element.substring(lastslash + 1, nextColon),
                index: element.substring(nextColon + 1)
            };
        } else {
            return null;
        }
    };

    /** Generates a string for padding purposes by replicating a character a given number of times
     * @param c {Character} A character to be used for padding
     * @param count {Integer} The number of times to repeat the character
     * @return A string of length <code>count</code> consisting of repetitions of the supplied character
     */
    // UNOPTIMISED 
    fluid.generatePadding = function (c, count) {
        var togo = "";
        for (var i = 0; i < count; ++ i) {
            togo += c;
        }
        return togo;
    };
     
    // Marker so that we can render a custom string for properties which are not direct and concrete
    fluid.SYNTHETIC_PROPERTY = {};

    // utility to avoid triggering custom getter code which could throw an exception - e.g. express 3.x's request object 
    fluid.getSafeProperty = function (obj, key) {
        var desc = Object.getOwnPropertyDescriptor(obj, key); // supported on all of our environments - is broken on IE8
        return desc && !desc.get ? obj[key] : fluid.SYNTHETIC_PROPERTY;
    };

    function printImpl (obj, small, options) {
        function out(str) {
            options.output += str;
        }
        var big = small + options.indentChars, isFunction = typeof(obj) === "function";
        if (options.maxRenderChars !== undefined && options.output.length > options.maxRenderChars) {
            return true;
        }
        if (obj === null) {
            out("null");
        } else if (obj === undefined) {
            out("undefined"); // NB - object invalid for JSON interchange
        } else if (obj === fluid.SYNTHETIC_PROPERTY) {
            out("[Synthetic property]");
        } else if (fluid.isPrimitive(obj) && !isFunction) {
            out(JSON.stringify(obj));
        }
        else {
            if (options.stack.indexOf(obj) !== -1) {
                out("(CIRCULAR)"); // NB - object invalid for JSON interchange
                return;
            }
            options.stack.push(obj);
            var i;
            if (fluid.isArrayable(obj)) {
                if (obj.length === 0) {
                    out("[]");
                } else {
                    out("[\n" + big);
                    for (i = 0; i < obj.length; ++ i) {
                        if (printImpl(obj[i], big, options)) {
                            return true;
                        }
                        if (i !== obj.length - 1) {
                            out(",\n" + big);
                        }
                    }
                    out("\n" + small + "]");
                }
            }
            else {
                out("{" + (isFunction ? " Function" : "") + "\n" + big); // NB - Function object invalid for JSON interchange
                var keys = fluid.keys(obj);
                for (i = 0; i < keys.length; ++ i) {
                    var key = keys[i];
                    var value = fluid.getSafeProperty(obj, key);
                    out(JSON.stringify(key) + ": ");
                    if (printImpl(value, big, options)) {
                        return true;
                    }
                    if (i !== keys.length - 1) {
                        out(",\n" + big);
                    }
                }
                out("\n" + small + "}");
            }
            options.stack.pop();
        }
        return;
    }

    /** Render a complex JSON object into a nicely indented format suitable for human readability.
     * @param obj {Object} The object to be rendered
     * @param options {Object} An options structure governing the rendering process. This supports the following options:
     *     <code>indent</code> {Integer} the number of space characters to be used to indent each level of containment (default value: 4)
     *     <code>maxRenderChars</code> {Integer} rendering the object will cease once this number of characters has been generated
     */
    fluid.prettyPrintJSON = function (obj, options) {
        options = $.extend({indent: 4, stack: [], output: ""}, options);
        options.indentChars = fluid.generatePadding(" ", options.indent);
        printImpl(obj, "", options);
        return options.output;
    };

    /**
     * Dumps a DOM element into a readily recognisable form for debugging - produces a
     * "semi-selector" summarising its tag name, class and id, whichever are set.
     *
     * @param {jQueryable} element The element to be dumped
     * @return A string representing the element.
     */
    fluid.dumpEl = function (element) {
        var togo;

        if (!element) {
            return "null";
        }
        if (element.nodeType === 3 || element.nodeType === 8) {
            return "[data: " + element.data + "]";
        }
        if (element.nodeType === 9) {
            return "[document: location " + element.location + "]";
        }
        if (!element.nodeType && fluid.isArrayable(element)) {
            togo = "[";
            for (var i = 0; i < element.length; ++ i) {
                togo += fluid.dumpEl(element[i]);
                if (i < element.length - 1) {
                    togo += ", ";
                }
            }
            return togo + "]";
        }
        element = $(element);
        togo = element.get(0).tagName;
        if (element.id) {
            togo += "#" + element.id;
        }
        if (element.attr("class")) {
            togo += "." + element.attr("class");
        }
        return togo;
    };

})(jQuery, fluid_2_0_0_beta_1);
;/*
Copyright 2011-2013 OCAD University
Copyright 2010-2015 Lucendo Development Ltd.

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var fluid_2_0_0_beta_1 = fluid_2_0_0_beta_1 || {};

(function ($, fluid) {
    "use strict";
    
    /** NOTE: The contents of this file are by default NOT PART OF THE PUBLIC FLUID API unless explicitly annotated before the function **/

    /** The Fluid "IoC System proper" - resolution of references and
     * completely automated instantiation of declaratively defined
     * component trees */

    // Currently still uses manual traversal - once we ban manually instantiated components,
    // it will use the instantiator's records instead.
    fluid.visitComponentChildren = function (that, visitor, options, segs) {
        segs = segs || [];
        for (var name in that) {
            var component = that[name];
            // This entire algorithm is primitive and expensive and will be removed once we can abolish manual init components
            if (!fluid.isComponent(component) || (options.visited && options.visited[component.id])) {
                continue;
            }
            segs.push(name);
            if (options.visited) { // recall that this is here because we may run into a component that has been cross-injected which might otherwise cause cyclicity
                options.visited[component.id] = true;
            }
            if (visitor(component, name, segs, segs.length - 1)) {
                return true;
            }
            if (!options.flat) {
                fluid.visitComponentChildren(component, visitor, options, segs);
            }
            segs.pop();
        }
    };
    
    fluid.getContextHash = function (instantiator, that) {
        var shadow = instantiator.idToShadow[that.id];
        return shadow && shadow.contextHash;
    };
    
    fluid.componentHasGrade = function (that, gradeName) {
        var contextHash = fluid.getContextHash(fluid.globalInstantiator, that);
        return !!(contextHash && contextHash[gradeName]);
    };
    
    // A variant of fluid.visitComponentChildren that supplies the signature expected for fluid.matchIoCSelector
    // this is: thatStack, contextHashes, memberNames, i - note, the supplied arrays are NOT writeable and shared through the iteration
    fluid.visitComponentsForMatching = function (that, options, visitor) {
        var instantiator = fluid.getInstantiator(that);
        options = $.extend({
            visited: {},
            instantiator: instantiator
        }, options);
        var thatStack = [that];
        var contextHashes = [fluid.getContextHash(instantiator, that)];
        var visitorWrapper = function (component, name, segs) {
            thatStack.length = 1;
            contextHashes.length = 1;
            for (var i = 0; i < segs.length; ++ i) {
                var child = thatStack[i][segs[i]];
                thatStack[i + 1] = child;
                contextHashes[i + 1] = fluid.getContextHash(instantiator, child) || {};
            }
            return visitor(component, thatStack, contextHashes, segs, segs.length);
        };
        fluid.visitComponentChildren(that, visitorWrapper, options, []);
    };

    fluid.getMemberNames = function (instantiator, thatStack) {
        var path = instantiator.idToPath(thatStack[thatStack.length - 1].id);
        var segs = instantiator.parseEL(path);
            // TODO: we should now have no longer shortness in the stack
        segs.unshift.apply(segs, fluid.generate(thatStack.length - segs.length, ""));
        
        return segs;
    };

    // thatStack contains an increasing list of MORE SPECIFIC thats.
    // this visits all components starting from the current location (end of stack)
    // in visibility order UP the tree.
    fluid.visitComponentsForVisibility = function (instantiator, thatStack, visitor, options) {
        options = options || {
            visited: {},
            flat: true,
            instantiator: instantiator
        };
        var memberNames = fluid.getMemberNames(instantiator, thatStack);
        for (var i = thatStack.length - 1; i >= 0; --i) {
            var that = thatStack[i];

            // explicitly visit the direct parent first
            options.visited[that.id] = true;
            if (visitor(that, memberNames[i], memberNames, i)) {
                return;
            }
            
            if (fluid.visitComponentChildren(that, visitor, options, memberNames)) {
                return;
            }
            memberNames.pop();
        }
    };

    fluid.mountStrategy = function (prefix, root, toMount) {
        var offset = prefix.length;
        return function (target, name, i, segs) {
            if (i <= prefix.length) { // Avoid OOB to not trigger deoptimisation!
                return;
            }
            for (var j = 0; j < prefix.length; ++ j) {
                if (segs[j] !== prefix[j]) {
                    return;
                }
            }
            return toMount(target, name, i - prefix.length, segs.slice(offset));
        };
    };

    fluid.invokerFromRecord = function (invokerec, name, that) {
        fluid.pushActivity("makeInvoker", "beginning instantiation of invoker with name %name and record %record as child of %that",
            {name: name, record: invokerec, that: that});
        var invoker = invokerec ? fluid.makeInvoker(that, invokerec, name) : undefined;
        fluid.popActivity();
        return invoker;
    };

    fluid.memberFromRecord = function (memberrecs, name, that) {
        var togo;
        for (var i = 0; i < memberrecs.length; ++ i) { // memberrecs is the special "fluid.mergingArray" type which is not Arrayable
            var expanded = fluid.expandImmediate(memberrecs[i], that);
            if (!fluid.isPlainObject(togo)) { // poor man's "merge" algorithm to hack FLUID-5668 for now
                togo = expanded;
            } else {
                togo = $.extend(true, togo, expanded);
            }
        }
        return togo;
    };

    fluid.recordStrategy = function (that, options, optionsStrategy, recordPath, recordMaker, prefix, exceptions) {
        prefix = prefix || [];
        return {
            strategy: function (target, name, i) {
                if (i !== 1) {
                    return;
                }
                var record = fluid.driveStrategy(options, [recordPath, name], optionsStrategy);
                if (record === undefined) {
                    return;
                }
                fluid.set(target, [name], fluid.inEvaluationMarker);
                var member = recordMaker(record, name, that);
                fluid.set(target, [name], member);
                return member;
            },
            initter: function () {
                var records = fluid.driveStrategy(options, recordPath, optionsStrategy) || {};
                for (var name in records) {
                    if (!exceptions || !exceptions[name]) {
                        fluid.getForComponent(that, prefix.concat([name]));
                    }
                }
            }
        };
    };

    // patch Fluid.js version for timing
    fluid.instantiateFirers = function (that) {
        var shadow = fluid.shadowForComponent(that);
        var initter = fluid.get(shadow, ["eventStrategyBlock", "initter"]) || fluid.identity;
        initter();
    };

    fluid.makeDistributionRecord = function (contextThat, sourceRecord, sourcePath, targetSegs, exclusions, sourceType) {
        sourceType = sourceType || "distribution";

        var source = fluid.copy(fluid.get(sourceRecord, sourcePath));
        fluid.each(exclusions, function (exclusion) {
            fluid.model.applyChangeRequest(source, {segs: exclusion, type: "DELETE"});
        });

        var record = {options: {}};
        fluid.model.applyChangeRequest(record, {segs: targetSegs, type: "ADD", value: source});
        fluid.checkComponentRecord(record);
        return $.extend(record, {contextThat: contextThat, recordType: sourceType});
    };

    // Part of the early "distributeOptions" workflow. Given the description of the blocks to be distributed, assembles "canned" records
    // suitable to be either registered into the shadow record for later or directly pushed to an existing component, as well as honouring
    // any "removeSource" annotations by removing these options from the source block.
    fluid.filterBlocks = function (contextThat, sourceBlocks, sourceSegs, targetSegs, exclusions, removeSource) {
        var togo = [];
        fluid.each(sourceBlocks, function (block) {
            var source = fluid.get(block.source, sourceSegs);
            if (source) {
                togo.push(fluid.makeDistributionRecord(contextThat, block.source, sourceSegs, targetSegs, exclusions, block.recordType));
                var rescued = $.extend({}, source);
                if (removeSource) {
                    fluid.model.applyChangeRequest(block.source, {segs: sourceSegs, type: "DELETE"});
                }
                fluid.each(exclusions, function (exclusion) {
                    var orig = fluid.get(rescued, exclusion);
                    fluid.set(block.source, sourceSegs.concat(exclusion), orig);
                });
            }
        });
        return togo;
    };

    // Use this peculiar signature since the actual component and shadow itself may not exist yet. Perhaps clean up with FLUID-4925
    fluid.noteCollectedDistribution = function (parentShadow, memberName, distribution) {
        fluid.model.setSimple(parentShadow, ["collectedDistributions", memberName, distribution.id], true);
    };

    fluid.isCollectedDistribution = function (parentShadow, memberName, distribution) {
        return fluid.model.getSimple(parentShadow, ["collectedDistributions", memberName, distribution.id]);
    };

    fluid.clearCollectedDistributions = function (parentShadow, memberName) {
        fluid.model.applyChangeRequest(parentShadow, {segs: ["collectedDistributions", memberName], type: "DELETE"});
    };

    fluid.collectDistributions = function (distributedBlocks, parentShadow, distribution, thatStack, contextHashes, memberNames, i) {
        var lastMember = memberNames[memberNames.length - 1];
        if (!fluid.isCollectedDistribution(parentShadow, lastMember, distribution) &&
                fluid.matchIoCSelector(distribution.selector, thatStack, contextHashes, memberNames, i)) {
            distributedBlocks.push.apply(distributedBlocks, distribution.blocks);
            fluid.noteCollectedDistribution(parentShadow, lastMember, distribution);
        }
    };

    // Slightly silly function to clean up the "appliedDistributions" records. In general we need to be much more aggressive both
    // about clearing instantiation garbage (e.g. onCreate and most of the shadow)
    // as well as caching frequently-used records such as the "thatStack" which
    // would mean this function could be written in a sensible way
    fluid.registerCollectedClearer = function (shadow, parentShadow, memberName) {
        if (!shadow.collectedClearer && parentShadow) {
            shadow.collectedClearer = function () {
                fluid.clearCollectedDistributions(parentShadow, memberName);
            };
        }
    };

    fluid.receiveDistributions = function (parentThat, gradeNames, memberName, that) {
        var instantiator = fluid.getInstantiator(parentThat || that);
        var thatStack = instantiator.getThatStack(parentThat || that); // most specific is at end
        thatStack.unshift(fluid.rootComponent);
        var memberNames = fluid.getMemberNames(instantiator, thatStack);
        var shadows = fluid.transform(thatStack, function (thisThat) {
            return instantiator.idToShadow[thisThat.id];
        });
        var parentShadow = shadows[shadows.length - (parentThat ? 1 : 2)];
        var contextHashes = fluid.getMembers(shadows, "contextHash");
        if (parentThat) { // if called before construction of component from assembleCreatorArguments - NB this path will be abolished/amalgamated
            memberNames.push(memberName);
            contextHashes.push(fluid.gradeNamesToHash(gradeNames));
            thatStack.push(that);
        } else {
            fluid.registerCollectedClearer(shadows[shadows.length - 1], parentShadow, memberNames[memberNames.length - 1]);
        }
        var distributedBlocks = [];
        for (var i = 0; i < thatStack.length - 1; ++ i) {
            fluid.each(shadows[i].distributions, function (distribution) {
                fluid.collectDistributions(distributedBlocks, parentShadow, distribution, thatStack, contextHashes, memberNames, i);
            });  /* function in loop */ /* jshint ignore:line */
        }
        return distributedBlocks;
    };
    
    fluid.computeTreeDistance = function (path1, path2) {
        var i = 0;
        while (i < path1.length && i < path2.length && path1[i] === path2[i]) {
            ++i;
        }
        return path1.length + path2.length - 2*i;
    };
    
    // Called from applyDistributions (immediate application route) as well as mergeRecordsToList (pre-instantiation route)
    fluid.computeDistributionPriority = function (targetThat, distributedBlock) {
        if (!distributedBlock.priority) {
            var instantiator = fluid.getInstantiator(targetThat);
            var targetStack = instantiator.getThatStack(targetThat);
            var targetPath = fluid.getMemberNames(instantiator, targetStack);
            var sourceStack = instantiator.getThatStack(distributedBlock.contextThat);
            var sourcePath = fluid.getMemberNames(instantiator, sourceStack);
            var distance = fluid.computeTreeDistance(targetPath, sourcePath);
            distributedBlock.priority = fluid.mergeRecordTypes.distribution + distance;
        }
        return distributedBlock;
    };

    // convert "preBlocks" as produced from fluid.filterBlocks into "real blocks" suitable to be used by the expansion machinery.
    fluid.applyDistributions = function (that, preBlocks, targetShadow) {
        var distributedBlocks = fluid.transform(preBlocks, function (preBlock) {
            return fluid.generateExpandBlock(preBlock, that, targetShadow.mergePolicy);
        }, function (distributedBlock) {
            return fluid.computeDistributionPriority(that, distributedBlock);
        });
        var mergeOptions = targetShadow.mergeOptions;
        mergeOptions.mergeBlocks.push.apply(mergeOptions.mergeBlocks, distributedBlocks);
        mergeOptions.updateBlocks();
        return distributedBlocks;
    };
    
    // TODO: This implementation is obviously poor and has numerous flaws - in particular it does no backtracking as well as matching backwards through the selector
    fluid.matchIoCSelector = function (selector, thatStack, contextHashes, memberNames, i) {
        var thatpos = thatStack.length - 1;
        var selpos = selector.length - 1;
        while (true) {
            var mustMatchHere = thatpos === thatStack.length - 1 || selector[selpos].child;

            var that = thatStack[thatpos];
            var selel = selector[selpos];
            var match = true;
            for (var j = 0; j < selel.predList.length; ++j) {
                var pred = selel.predList[j];
                if (pred.context && !(contextHashes[thatpos][pred.context] || memberNames[thatpos] === pred.context)) {
                    match = false;
                    break;
                }
                if (pred.id && that.id !== pred.id) {
                    match = false;
                    break;
                }
            }
            if (selpos === 0 && thatpos > i && mustMatchHere) {
                match = false; // child selector must exhaust stack completely - FLUID-5029
            }
            if (match) {
                if (selpos === 0) {
                    return true;
                }
                --thatpos;
                --selpos;
            }
            else {
                if (mustMatchHere) {
                    return false;
                }
                else {
                    --thatpos;
                }
            }
            if (thatpos < i) {
                return false;
            }
        }
    };
    
    /** Query for all components matching a selector in a particular tree
     * @param root {Component} The root component at which to start the search
     * @param selector {String} An IoCSS selector, in form of a string. Note that since selectors supplied to this function implicitly
     * match downwards, they need not contain the "head context" followed by whitespace required in the distributeOptions form. E.g.
     * simply <code>"fluid.viewComponent"</code> will match all viewComponents below the root.
     * @param flat {Boolean} [Optional] <code>true</code> if the search should just be performed at top level of the component tree
     * Note that with <code>flat=true</code> this search will scan every component in the tree and may well be very slow.
     */
    // supported, PUBLIC API function 
    fluid.queryIoCSelector = function (root, selector, flat) {
        var parsed = fluid.parseSelector(selector, fluid.IoCSSMatcher);
        var togo = [];

        fluid.visitComponentsForMatching(root, {flat: flat}, function (that, thatStack, contextHashes, memberNames, i) {
            if (fluid.matchIoCSelector(parsed, thatStack, contextHashes, memberNames, i)) {
                togo.push(that);
            }
        });
        return togo;
    };

    fluid.isIoCSSSelector = function (context) {
        return context.indexOf(" ") !== -1; // simple-minded check for an IoCSS reference
    };

    fluid.pushDistributions = function (targetHead, selector, blocks) {
        var targetShadow = fluid.shadowForComponent(targetHead);
        var id = fluid.allocateGuid();
        var distributions = (targetShadow.distributions = targetShadow.distributions || []);
        distributions.push({
            id: id, // This id is used in clearDistributions
            selector: selector,
            blocks: blocks
        });
        return id;
    };

    fluid.clearDistribution = function (targetHead, id) {
        var targetShadow = fluid.shadowForComponent(targetHead);
        fluid.remove_if(targetShadow.distributions, function (distribution) {
            return distribution.id === id;
        });
    };
    
    fluid.clearDistributions = function (shadow) {
        fluid.each(shadow.outDistributions, function (outDist) {
            fluid.clearDistribution(outDist.targetComponent, outDist.distributionId);
        });
    };

    // Modifies a parsed selector to extract and remove its head context which will be matched upwards
    fluid.extractSelectorHead = function (parsedSelector) {
        var predList = parsedSelector[0].predList;
        var context = predList[0].context;
        predList.length = 0;
        return context;
    };
    
    fluid.parseExpectedOptionsPath = function (path, role) {
        var segs = fluid.model.parseEL(path);
        if (segs[0] !== "options") {
            fluid.fail("Error in options distribution path ", path, " - only " + role + " paths beginning with \"options\" are supported");
        }
        return segs.slice(1);
    };
    
    fluid.replicateProperty = function (source, property, targets) {
        if (source[property] !== undefined) {
            fluid.each(targets, function (target) {
                target[property] = source[property];
            });
        }
    };

    fluid.undistributableOptions = ["gradeNames", "distributeOptions", "argumentMap", "initFunction", "mergePolicy", "progressiveCheckerOptions"]; // automatically added to "exclusions" of every distribution

    fluid.distributeOptions = function (that, optionsStrategy) {
        var thatShadow = fluid.shadowForComponent(that);
        var records = fluid.driveStrategy(that.options, "distributeOptions", optionsStrategy);
        fluid.each(records, function (record) {
            var targetRef = fluid.parseContextReference(record.target);
            var targetComp, selector, context;
            if (fluid.isIoCSSSelector(targetRef.context)) {
                selector = fluid.parseSelector(targetRef.context, fluid.IoCSSMatcher);
                var headContext = fluid.extractSelectorHead(selector);
                if (headContext === "/") {
                    targetComp = fluid.rootComponent;
                } else {
                    context = headContext;
                }
            }
            else {
                context = targetRef.context;
            }
            targetComp = targetComp || fluid.resolveContext(context, that);
            if (!targetComp) {
                fluid.fail("Error in options distribution record ", record, " - could not resolve context {"+context+"} to a root component");
            }
            var targetSegs = fluid.model.parseEL(targetRef.path);
            var preBlocks;
            if (record.record !== undefined) {
                preBlocks = [(fluid.makeDistributionRecord(that, record.record, [], targetSegs, []))];
            }
            else {
                var source = fluid.parseContextReference(record.source || "{that}.options"); // TODO: This is probably not a sensible default
                if (source.context !== "that") {
                    fluid.fail("Error in options distribution record ", record, " only a context of {that} is supported");
                }
                var sourceSegs = fluid.parseExpectedOptionsPath(source.path, "source");
                var fullExclusions = fluid.makeArray(record.exclusions).concat(sourceSegs.length === 0 ? fluid.undistributableOptions : []);

                var exclusions = fluid.transform(fullExclusions, function (exclusion) {
                    return fluid.model.parseEL(exclusion);
                });

                preBlocks = fluid.filterBlocks(that, thatShadow.mergeOptions.mergeBlocks, sourceSegs, targetSegs, exclusions, record.removeSource);
                thatShadow.mergeOptions.updateBlocks(); // perhaps unnecessary
            }
            fluid.replicateProperty(record, "priority", preBlocks);
            fluid.replicateProperty(record, "namespace", preBlocks);
            // TODO: inline material has to be expanded in its original context!

            if (selector) {
                var distributionId = fluid.pushDistributions(targetComp, selector, preBlocks);
                thatShadow.outDistributions = thatShadow.outDistributions || [];
                thatShadow.outDistributions.push({
                    targetComponent: targetComp,
                    distributionId: distributionId
                });
            }
            else { // The component exists now, we must rebalance it
                var targetShadow = fluid.shadowForComponent(targetComp);
                fluid.applyDistributions(that, preBlocks, targetShadow);
            }
        });
    };

    fluid.gradeNamesToHash = function (gradeNames) {
        var contextHash = {};
        fluid.each(gradeNames, function (gradeName) {
            contextHash[gradeName] = true;
            contextHash[fluid.computeNickName(gradeName)] = true;
        });
        return contextHash;
    };

    fluid.cacheShadowGrades = function (that, shadow) {
        var contextHash = fluid.gradeNamesToHash(that.options.gradeNames);
        if (!contextHash[shadow.memberName]) {
            contextHash[shadow.memberName] = "memberName"; // This is filtered out again in recordComponent - TODO: Ensure that ALL resolution uses the scope chain eventually
        }
        shadow.contextHash = contextHash;
        fluid.each(contextHash, function (troo, context) {
            shadow.ownScope[context] = that;
            if (shadow.parentShadow && shadow.parentShadow.that.type !== "fluid.rootComponent") {
                shadow.parentShadow.childrenScope[context] = that;
            }
        });
    };

    // First sequence point where the mergeOptions strategy is delivered from Fluid.js - here we take care
    // of both receiving and transmitting options distributions
    fluid.deliverOptionsStrategy = function (that, target, mergeOptions) {
        var shadow = fluid.shadowForComponent(that, shadow);
        fluid.cacheShadowGrades(that, shadow);
        shadow.mergeOptions = mergeOptions;
    };

    fluid.expandDynamicGrades = function (that, shadow, gradeNames, dynamicGrades) {
        var resolved = [];
        // Receive distributions first since these may cause arrival of more contextAwareness blocks.
        // TODO: this closure algorithm is not reliable since we only get one shot at a "function" grade source when
        // really we should perform complete closure over all other sources of options before we try it at the very end - particularly important for contextAwareness
        var distributedBlocks = fluid.receiveDistributions(null, null, null, that);
        if (distributedBlocks.length > 0) {
            var readyBlocks = fluid.applyDistributions(that, distributedBlocks, shadow);
            // rely on the fact that "dirty tricks are not permitted" wrt. resolving gradeNames - each element must be a literal entry or array
            // holding primitive or EL values - otherwise we would have to go all round the houses and reenter the top of fluid.computeDynamicGrades
            var gradeNamesList = fluid.transform(fluid.getMembers(readyBlocks, ["source", "gradeNames"]), fluid.makeArray);
            resolved = resolved.concat.apply(resolved, gradeNamesList);
        }
        fluid.each(dynamicGrades, function (dynamicGrade) {
            var expanded = fluid.expandImmediate(dynamicGrade, that, shadow.localDynamic);
            if (typeof(expanded) === "function") {
                expanded = expanded();
            }
            if (expanded) {
                resolved = resolved.concat(expanded);
            }
        });
        return resolved;
    };

    // Discover further grades that are entailed by the given base typeName and the current total "dynamic grades list" held in the argument "resolved".
    // These are looked up conjointly in the grade registry, and then any further dynamic grades references  
    // are expanded and added into the list and concatenated into "resolved". Additional grades discovered during this function are returned as
    // "furtherResolved".
    fluid.collectDynamicGrades = function (that, shadow, defaultsBlock, gradeNames, dynamicGrades, resolved) {
        var newDefaults = fluid.copy(fluid.getGradedDefaults(that.typeName, resolved));
        gradeNames.length = 0; // acquire derivatives of dynamic grades (FLUID-5054)
        gradeNames.push.apply(gradeNames, newDefaults.gradeNames);

        fluid.cacheShadowGrades(that, shadow);
        // This cheap strategy patches FLUID-5091 for now - some more sophisticated activity will take place
        // at this site when we have a full fix for FLUID-5028
        shadow.mergeOptions.destroyValue(["mergePolicy"]);
        shadow.mergeOptions.destroyValue(["components"]);
        shadow.mergeOptions.destroyValue(["invokers"]);

        defaultsBlock.source = newDefaults;
        shadow.mergeOptions.updateBlocks();
        shadow.mergeOptions.computeMergePolicy(); // TODO: we should really only do this if its content changed - this implies moving all options evaluation over to some (cheap) variety of the ChangeApplier

        var furtherResolved = fluid.remove_if(gradeNames, function (gradeName) {
            return gradeName.charAt(0) === "{" && !fluid.contains(dynamicGrades, gradeName);
        }, []);
        dynamicGrades.push.apply(dynamicGrades, furtherResolved);
        furtherResolved = fluid.expandDynamicGrades(that, shadow, gradeNames, furtherResolved);

        resolved.push.apply(resolved, furtherResolved);

        return furtherResolved;
    };

    fluid.computeDynamicGrades = function (that, shadow, strategy) {
        delete that.options.gradeNames; // Recompute gradeNames for FLUID-5012 and others

        var gradeNames = fluid.driveStrategy(that.options, "gradeNames", strategy);
        // TODO: In complex distribution cases, a component might end up with multiple default blocks
        var defaultsBlock = fluid.findMergeBlocks(shadow.mergeOptions.mergeBlocks, "defaults")[0];
        var dynamicGrades = fluid.remove_if(gradeNames, function (gradeName) {
            return gradeName.charAt(0) === "{" || !fluid.hasGrade(defaultsBlock.target, gradeName);
        }, []);
        var resolved = fluid.expandDynamicGrades(that, shadow, gradeNames, dynamicGrades);
        if (resolved.length !== 0) {
            var furtherResolved;
            do { // repeatedly collect dynamic grades whilst they arrive (FLUID-5155)
                furtherResolved = fluid.collectDynamicGrades(that, shadow, defaultsBlock, gradeNames, dynamicGrades, resolved);
            }
            while (furtherResolved.length !== 0);
        }
        if (shadow.collectedClearer) {
            shadow.collectedClearer();
            delete shadow.collectedClearer;
        }
    };

    fluid.computeDynamicComponentKey = function (recordKey, sourceKey) {
        return recordKey + (sourceKey === 0 ? "" : "-" + sourceKey); // TODO: configurable name strategies
    };

    fluid.registerDynamicRecord = function (that, recordKey, sourceKey, record, toCensor) {
        var key = fluid.computeDynamicComponentKey(recordKey, sourceKey);
        var cRecord = fluid.copy(record);
        delete cRecord[toCensor];
        fluid.set(that.options, ["components", key], cRecord);
        return key;
    };

    fluid.computeDynamicComponents = function (that, mergeOptions) {
        var shadow = fluid.shadowForComponent(that);
        var localSub = shadow.subcomponentLocal = {};
        var records = fluid.driveStrategy(that.options, "dynamicComponents", mergeOptions.strategy);
        fluid.each(records, function (record, recordKey) {
            if (!record.sources && !record.createOnEvent) {
                fluid.fail("Cannot process dynamicComponents record ", record, " without a \"sources\" or \"createOnEvent\" entry");
            }
            if (record.sources) {
                var sources = fluid.expandOptions(record.sources, that);
                fluid.each(sources, function (source, sourceKey) {
                    var key = fluid.registerDynamicRecord(that, recordKey, sourceKey, record, "sources");
                    localSub[key] = {"source": source, "sourcePath": sourceKey};
                });
            }
            else if (record.createOnEvent) {
                var event = fluid.event.expandOneEvent(that, record.createOnEvent);
                fluid.set(shadow, ["dynamicComponentCount", recordKey], 0);
                var listener = function () {
                    var key = fluid.registerDynamicRecord(that, recordKey, shadow.dynamicComponentCount[recordKey]++, record, "createOnEvent");
                    var localRecord = {"arguments": fluid.makeArray(arguments)};
                    fluid.initDependent(that, key, localRecord);
                };
                event.addListener(listener);
                fluid.recordListener(event, listener, shadow);
            }
        });
    };

    // Second sequence point for mergeOptions from Fluid.js - here we construct all further
    // strategies required on the IoC side and mount them into the shadow's getConfig for universal use
    fluid.computeComponentAccessor = function (that, localRecord) {
        var instantiator = fluid.globalInstantiator;
        var shadow = fluid.shadowForComponent(that);
        shadow.localDynamic = localRecord; // for signalling to dynamic grades from dynamic components
        var options = that.options;
        var strategy = shadow.mergeOptions.strategy;
        var optionsStrategy = fluid.mountStrategy(["options"], options, strategy);
        shadow.invokerStrategy = fluid.recordStrategy(that, options, strategy, "invokers", fluid.invokerFromRecord);
        shadow.eventStrategyBlock = fluid.recordStrategy(that, options, strategy, "events", fluid.eventFromRecord, ["events"]);
        var eventStrategy = fluid.mountStrategy(["events"], that, shadow.eventStrategyBlock.strategy, ["events"]);
        shadow.memberStrategy = fluid.recordStrategy(that, options, strategy, "members", fluid.memberFromRecord, null, {model: true, modelRelay: true});
        // NB - ginger strategy handles concrete, rationalise
        shadow.getConfig = {strategies: [fluid.model.funcResolverStrategy, fluid.makeGingerStrategy(that),
            optionsStrategy, shadow.invokerStrategy.strategy, shadow.memberStrategy.strategy, eventStrategy]};

        fluid.computeDynamicGrades(that, shadow, strategy, shadow.mergeOptions.mergeBlocks);
        fluid.distributeOptions(that, strategy);
        if (shadow.contextHash["fluid.resolveRoot"]) {
            var memberName;
            if (shadow.contextHash["fluid.resolveRootSingle"]) {
                var singleRootType = fluid.getForComponent(that, ["options", "singleRootType"]);
                if (!singleRootType) {
                    fluid.fail("Cannot register object with grades " + Object.keys(shadow.contextHash).join(", ") + " as fluid.resolveRootSingle since it has not defined option singleRootType");
                }
                memberName = fluid.typeNameToMemberName(singleRootType);
            } else {
                memberName = fluid.computeGlobalMemberName(that);
            }
            var parent = fluid.resolveRootComponent;
            if (parent[memberName]) {
                instantiator.clearComponent(parent, memberName);
            }
            instantiator.recordKnownComponent(parent, that, memberName, false);
        }

        return shadow.getConfig;
    };

    // About the SHADOW:
    // Allocated at: instantiator's "recordComponent"
    // Contents:
    //     path {String} Principal allocated path (point of construction) in tree
    //     that {Component} The component itself
    //     contextHash {String to Boolean} Map of context names which this component matches
    //     mergePolicy, mergeOptions: Machinery for last phase of options merging
    //     invokerStrategy, eventStrategyBlock, memberStrategy, getConfig: Junk required to operate the accessor
    //     listeners: Listeners registered during this component's construction, to be cleared during clearListeners
    //     distributions, collectedClearer: Managing options distributions
    //     subcomponentLocal: Signalling local record from computeDynamicComponents to assembleCreatorArguments
    //     dynamicLocal: Local signalling for dynamic grades
    
    fluid.shadowForComponent = function (component) {
        var instantiator = fluid.getInstantiator(component);
        return instantiator && component ? instantiator.idToShadow[component.id] : null;
    };

    // Access the member at a particular path in a component, forcing it to be constructed gingerly if necessary
    // supported, PUBLIC API function 
    fluid.getForComponent = function (component, path) {
        var shadow = fluid.shadowForComponent(component);
        var getConfig = shadow ? shadow.getConfig : undefined;
        return fluid.get(component, path, getConfig);
    };

    // An EL segment resolver strategy that will attempt to trigger creation of
    // components that it discovers along the EL path, if they have been defined but not yet
    // constructed.
    fluid.makeGingerStrategy = function (that) {
        var instantiator = fluid.getInstantiator(that);
        return function (component, thisSeg, index, segs) {
            var atval = component[thisSeg];
            if (atval === fluid.inEvaluationMarker && index === segs.length) {
                fluid.fail("Error in component configuration - a circular reference was found during evaluation of path segment \"" + thisSeg +
                    "\": for more details, see the activity records following this message in the console, or issue fluid.setLogging(fluid.logLevel.TRACE) when running your application");
            }
            if (index > 1) {
                return atval;
            }
            if (atval === undefined && component.hasOwnProperty(thisSeg)) { // avoid recomputing properties that have been explicitly evaluated to undefined
                return fluid.NO_VALUE;
            }
            if (atval === undefined) { // pick up components in instantiation here - we can cut this branch by attaching early
                var parentPath = instantiator.idToShadow[component.id].path;
                var childPath = instantiator.composePath(parentPath, thisSeg);
                atval = instantiator.pathToComponent[childPath];
            }
            if (atval === undefined) {
                // TODO: This check is very expensive - once gingerness is stable, we ought to be able to
                // eagerly compute and cache the value of options.components - check is also incorrect and will miss injections
                var subRecord = fluid.getForComponent(component, ["options", "components", thisSeg]);
                if (subRecord) {
                    if (subRecord.createOnEvent) {
                        fluid.fail("Error resolving path segment \"" + thisSeg + "\" of path " + segs.join(".") + " since component with record ", subRecord,
                            " has annotation \"createOnEvent\" - this very likely represents an implementation error. Either alter the reference so it does not " +
                            " match this component, or alter your workflow to ensure that the component is instantiated by the time this reference resolves");
                    }
                    fluid.initDependent(component, thisSeg);
                    atval = component[thisSeg];
                }
            }
            return atval;
        };
    };
    
    // Listed in dependence order
    fluid.frameworkGrades = ["fluid.component", "fluid.modelComponent", "fluid.viewComponent", "fluid.rendererComponent"];
        
    fluid.filterBuiltinGrades = function (gradeNames) {
        return fluid.remove_if(fluid.makeArray(gradeNames), function (gradeName) {
            return fluid.frameworkGrades.indexOf(gradeName) !== -1;
        });
    };

    fluid.dumpGradeNames = function (that) {
        return that.options && that.options.gradeNames ?
            " gradeNames: " + JSON.stringify(fluid.filterBuiltinGrades(that.options.gradeNames)) : "";
    };

    fluid.dumpThat = function (that) {
        return "{ typeName: \"" + that.typeName + "\"" + fluid.dumpGradeNames(that) + " id: " + that.id + "}";
    };

    fluid.dumpThatStack = function (thatStack, instantiator) {
        var togo = fluid.transform(thatStack, function(that) {
            var path = instantiator.idToPath(that.id);
            return fluid.dumpThat(that) + (path? (" - path: " + path) : "");
        });
        return togo.join("\n");
    };

    fluid.resolveContext = function (context, that, fast) {
        if (context === "that") {
            return that;
        }
        var foundComponent;
        var instantiator = fluid.globalInstantiator; // fluid.getInstantiator(that); // this hash lookup takes over 1us!
        if (fast) {
            var shadow = instantiator.idToShadow[that.id];
            return shadow.ownScope[context];
        } else {
            var thatStack = instantiator.getFullStack(that);
            fluid.visitComponentsForVisibility(instantiator, thatStack, function (component, name) {
                var shadow = fluid.shadowForComponent(component);
                // TODO: Some components, e.g. the static environment and typeTags do not have a shadow, which slows us down here
                if (context === name || shadow && shadow.contextHash && shadow.contextHash[context] || context === component.typeName) {
                    foundComponent = component;
                    return true; // YOUR VISIT IS AT AN END!!
                }
                if (fluid.getForComponent(component, ["options", "components", context]) && !component[context]) {
      // This is an expensive guess since we make it for every component up the stack - must apply the WAVE OF EXPLOSIONS (FLUID-4925) to discover all components first
      // This line attempts a hopeful construction of components that could be guessed by nickname through finding them unconstructed
      // in options. In the near future we should eagerly BEGIN the process of constructing components, discovering their
      // types and then attaching them to the tree VERY EARLY so that we get consistent results from different strategies.
                    foundComponent = fluid.getForComponent(component, context);
                    return true;
                }
            });
            return foundComponent;
        }
    };
    
    fluid.makeStackFetcher = function (parentThat, localRecord, fast) {
        var fetcher = function (parsed) {
            if (parentThat && parentThat.lifecycleStatus === "destroyed") {
                fluid.fail("Cannot resolve reference " + fluid.renderContextReference(parsed) + " from component " + fluid.dumpThat(parentThat) + " which has been destroyed");
            }
            var context = parsed.context;
            if (localRecord && context in localRecord) {
                return fluid.get(localRecord[context], parsed.path);
            }
            var foundComponent = fluid.resolveContext(context, parentThat, fast);
            if (!foundComponent && parsed.path !== "") {
                var ref = fluid.renderContextReference(parsed);
                fluid.fail("Failed to resolve reference " + ref + " - could not match context with name " +
                    context + " from component " + fluid.dumpThat(parentThat), parentThat);
            }
            return fluid.getForComponent(foundComponent, parsed.path);
        };
        return fetcher;
    };

    fluid.makeStackResolverOptions = function (parentThat, localRecord, fast) {
        return $.extend(fluid.copy(fluid.rawDefaults("fluid.makeExpandOptions")), {
            localRecord: localRecord || {},
            fetcher: fluid.makeStackFetcher(parentThat, localRecord, fast),
            contextThat: parentThat,
            exceptions: {members: {model: true, modelRelay: true}}
        });
    };

    fluid.clearListeners = function (shadow) {
        // TODO: bug here - "afterDestroy" listeners will be unregistered already unless they come from this component
        fluid.each(shadow.listeners, function (rec) {
            rec.event.removeListener(rec.listenerId || rec.listener);
        });
        delete shadow.listeners;
    };

    fluid.recordListener = function (event, listener, shadow, listenerId) {
        if (event.ownerId !== shadow.that.id) { // don't bother recording listeners registered from this component itself
            var listeners = shadow.listeners;
            if (!listeners) {
                listeners = shadow.listeners = [];
            }
            listeners.push({event: event, listener: listener, listenerId: listenerId});
        }
    };
    
    fluid.constructScopeObjects = function (instantiator, parent, child, childShadow) {
        var parentShadow = parent ? instantiator.idToShadow[parent.id] : null;
        childShadow.childrenScope = parentShadow ? Object.create(parentShadow.ownScope) : {};
        childShadow.ownScope = Object.create(childShadow.childrenScope);
        childShadow.parentShadow = parentShadow;
    };
    
    fluid.clearChildrenScope = function (instantiator, parentShadow, child, childShadow) {
        fluid.each(childShadow.contextHash, function (troo, context) {
            if (parentShadow.childrenScope[context] === child) {
                delete parentShadow.childrenScope[context]; // TODO: ambiguous resolution
            }
        });
    };

    // unsupported, non-API function - however, this structure is of considerable interest to those debugging
    // into IoC issues. The structures idToShadow and pathToComponent contain a complete map of the component tree
    // forming the surrounding scope
    fluid.instantiator = function () {
        var that = fluid.typeTag("instantiator");
        $.extend(that, {
            lifecycleStatus: "constructed",
            pathToComponent: {},
            idToShadow: {},
            modelTransactions: {init: {}}, // a map of transaction id to map of component id to records of components enlisted in a current model initialisation transaction
            composePath: fluid.model.composePath, // For speed, we declare that no component's name may contain a period
            composeSegments: fluid.model.composeSegments,
            parseEL: fluid.model.parseEL,
            events: {
                onComponentAttach: fluid.makeEventFirer({name: "instantiator's onComponentAttach event"}),
                onComponentClear: fluid.makeEventFirer({name: "instantiator's onComponentClear event"})
            }
        });
        // TODO: this API can shortly be removed
        that.idToPath = function (id) {
            var shadow = that.idToShadow[id];
            return shadow ? shadow.path : "";
        };
        // Note - the returned stack is assumed writeable and does not include the root
        that.getThatStack = function (component) {
            var shadow = that.idToShadow[component.id];
            if (shadow) {
                var path = shadow.path;
                var parsed = that.parseEL(path);
                var root = that.pathToComponent[""], togo = [];
                for (var i = 0; i < parsed.length; ++ i) {
                    root = root[parsed[i]];
                    togo.push(root);
                }
                return togo;
            }
            else { return [];}
        };
        that.getFullStack = function (component) {
            var thatStack = component? that.getThatStack(component) : [];
            thatStack.unshift(fluid.resolveRootComponent);
            return thatStack;
        };
        function recordComponent(parent, component, path, name, created) {
            var shadow;
            if (created) {
                shadow = that.idToShadow[component.id] = {};
                shadow.that = component;
                shadow.path = path;
                shadow.memberName = name;
                fluid.constructScopeObjects(that, parent, component, shadow);
            } else {
                shadow = that.idToShadow[component.id];
                shadow.injectedPaths = shadow.injectedPaths || [];
                shadow.injectedPaths.push(path);
                var parentShadow = that.idToShadow[parent.id]; // structural parent shadow - e.g. resolveRootComponent
                var keys = fluid.keys(shadow.contextHash);
                keys.push(name); // add local name - FLUID-5696
                fluid.remove_if(keys, function (key) {
                    return shadow.contextHash && shadow.contextHash[key] === "memberName";
                });
                fluid.each(keys, function (context) {
                    if (!parentShadow.childrenScope[context]) {
                        parentShadow.childrenScope[context] = component;
                    }
                });
            }
            if (that.pathToComponent[path]) {
                fluid.fail("Error during instantiation - path " + path + " which has just created component " + fluid.dumpThat(component) +
                    " has already been used for component " + fluid.dumpThat(that.pathToComponent[path]) + " - this is a circular instantiation or other oversight." +
                    " Please clear the component using instantiator.clearComponent() before reusing the path.");
            }
            that.pathToComponent[path] = component;
        }
        that.recordRoot = function (component) {
            recordComponent(null, component, "", "", true);
        };
        that.recordKnownComponent = function (parent, component, name, created) {
            parent[name] = component;
            if (fluid.isComponent(component) || component.type === "instantiator") {
                var parentPath = that.idToShadow[parent.id].path;
                var path = that.composePath(parentPath, name);
                recordComponent(parent, component, path, name, created);
                that.events.onComponentAttach.fire(component, path, that, created);
            } else {
                fluid.fail("Cannot record non-component with value ", component, " at path \"" + name + "\" of parent ", parent);
            }
        };
        that.clearComponent = function (component, name, child, options, noModTree, path) {
            // options are visitor options for recursive driving
            var shadow = that.idToShadow[component.id];
            // use flat recursion since we want to use our own recursion rather than rely on "visited" records
            options = options || {flat: true, instantiator: that};
            child = child || component[name];
            path = path || shadow.path;
            if (path === undefined) {
                fluid.fail("Cannot clear component " + name + " from component ", component,
                    " which was not created by this instantiator");
            }

            var childPath = that.composePath(path, name);
            var childShadow = that.idToShadow[child.id];
            var created = childShadow.path === childPath;
            that.events.onComponentClear.fire(child, childPath, component, created);

            // only recurse on components which were created in place - if the id record disagrees with the
            // recurse path, it must have been injected
            if (created) {
                // Clear injected instance of this component from all other paths - historically we didn't bother
                // to do this since injecting into a shorter scope is an error - but now we have resolveRoot area
                fluid.each(childShadow.injectedPaths, function (injectedPath) {
                    var parentPath = fluid.model.getToTailPath(injectedPath);
                    var otherParent = that.pathToComponent[parentPath];
                    that.clearComponent(otherParent, fluid.model.getTailPath(injectedPath), child);
                });
                fluid.visitComponentChildren(child, function(gchild, gchildname, segs, i) {
                    var parentPath = that.composeSegments.apply(null, segs.slice(0, i));
                    that.clearComponent(child, gchildname, null, options, true, parentPath);
                }, options, that.parseEL(childPath));
                fluid.doDestroy(child, name, component);
                fluid.clearDistributions(childShadow);
                fluid.clearListeners(childShadow);
                child.events.afterDestroy.fire(child, name, component);
                delete that.idToShadow[child.id];
            }
            fluid.clearChildrenScope(that, shadow, child, childShadow);
            delete that.pathToComponent[childPath];
            if (!noModTree) {
                delete component[name]; // there may be no entry - if creation is not concluded
            }
        };
        return that;
    };

    // The global instantiator, holding all components instantiated in this context (instance of Infusion)
    fluid.globalInstantiator = fluid.instantiator();
    
    // Look up the globally registered instantiator for a particular component - we now only really support a
    // single, global instantiator, but this method is left as a notation point in case this ever reverts
    fluid.getInstantiator = function (component) {
        var instantiator = fluid.globalInstantiator;
        return component && instantiator.idToShadow[component.id] ? instantiator : null;
    };
    
    // The grade supplied to components which will be resolvable from all parts of the component tree
    fluid.defaults("fluid.resolveRoot");
    // In addition to being resolvable at the root, "resolveRootSingle" component will have just a single instance available. Fresh
    // instances will displace older ones.
    fluid.defaults("fluid.resolveRootSingle", {
        gradeNames: "fluid.resolveRoot"
    });
    
    fluid.constructRootComponents = function (instantiator) {
        // Instantiate the primordial components at the root of each context tree
        fluid.rootComponent = instantiator.rootComponent = fluid.typeTag("fluid.rootComponent");
        instantiator.recordRoot(fluid.rootComponent);
        
        // The component which for convenience holds injected instances of all components with fluid.resolveRoot grade
        fluid.resolveRootComponent = instantiator.resolveRootComponent = fluid.typeTag("fluid.resolveRootComponent");
        instantiator.recordKnownComponent(fluid.rootComponent, fluid.resolveRootComponent, "resolveRootComponent", true);
      
        // obliterate resolveRoot's scope objects and replace by the real root scope - which is unused by its own children 
        var rootShadow = instantiator.idToShadow[fluid.rootComponent.id];
        var resolveRootShadow = instantiator.idToShadow[fluid.resolveRootComponent.id];
        resolveRootShadow.ownScope = rootShadow.ownScope;
        resolveRootShadow.childrenScope = rootShadow.childrenScope;
        
        instantiator.recordKnownComponent(fluid.resolveRootComponent, instantiator, "instantiator", true); // needs to have a shadow so it can be injected
        resolveRootShadow.childrenScope.instantiator = instantiator; // needs to be mounted since it never passes through cacheShadowGrades
    };
    
    fluid.constructRootComponents(fluid.globalInstantiator); // currently a singleton - in future, alternative instantiators might come back

    /** Expand a set of component options either immediately, or with deferred effect.
     *  The current policy is to expand immediately function arguments within fluid.assembleCreatorArguments which are not the main options of a
     *  component. The component's own options take <code>{defer: true}</code> as part of
     *  <code>outerExpandOptions</code> which produces an "expandOptions" structure holding the "strategy" and "initter" pattern
     *  common to ginger participants.
     *  Probably not to be advertised as part of a public API, but is considerably more stable than most of the rest
     *  of the IoC API structure especially with respect to the first arguments.
     */

// TODO: Can we move outerExpandOptions to 2nd place? only user of 3 and 4 is fluid.makeExpandBlock
    fluid.expandOptions = function (args, that, mergePolicy, localRecord, outerExpandOptions) {
        if (!args) {
            return args;
        }
        fluid.pushActivity("expandOptions", "expanding options %args for component %that ", {that: that, args: args});
        var expandOptions = fluid.makeStackResolverOptions(that, localRecord);
        expandOptions.mergePolicy = mergePolicy;
        var expanded = outerExpandOptions && outerExpandOptions.defer ?
            fluid.makeExpandOptions(args, expandOptions) : fluid.expand(args, expandOptions);
        fluid.popActivity();
        return expanded;
    };

    fluid.localRecordExpected = fluid.arrayToHash(["type", "options", "container", "createOnEvent", "priority", "recordType"]); // last element unavoidably polluting

    fluid.checkComponentRecord = function (localRecord) {
        fluid.each(localRecord, function (value, key) {
            if (!fluid.localRecordExpected[key]) {
                fluid.fail("Probable error in subcomponent record ", localRecord, " - key \"" + key +
                    "\" found, where the only legal options are " +
                    fluid.keys(fluid.localRecordExpected).join(", "));
            }
        });
    };

    fluid.mergeRecordsToList = function (that, mergeRecords) {
        var list = [];
        fluid.each(mergeRecords, function (value, key) {
            value.recordType = key;
            if (key === "distributions") {
                list.push.apply(list, fluid.transform(value, function (distributedBlock) {
                    return fluid.computeDistributionPriority(that, distributedBlock);
                }));
            }
            else {
                if (!value.options) { return; }
                value.priority = fluid.mergeRecordTypes[key];
                if (value.priority === undefined) {
                    fluid.fail("Merge record with unrecognised type " + key + ": ", value);
                }
                list.push(value);
            }
        });
        return list;
    };

    // TODO: overall efficiency could huge be improved by resorting to the hated PROTOTYPALISM as an optimisation
    // for this mergePolicy which occurs in every component. Although it is a deep structure, the root keys are all we need
    var addPolicyBuiltins = function (policy) {
        fluid.each(["gradeNames", "mergePolicy", "argumentMap", "components", "dynamicComponents", "events", "listeners", "modelListeners", "distributeOptions", "transformOptions"], function (key) {
            fluid.set(policy, [key, "*", "noexpand"], true);
        });
        return policy;
    };

    // used from Fluid.js
    fluid.generateExpandBlock = function (record, that, mergePolicy, localRecord) {
        var expanded = fluid.expandOptions(record.options, record.contextThat || that, mergePolicy, localRecord, {defer: true});
        expanded.priority = record.priority;
        expanded.namespace = record.namespace;
        expanded.recordType = record.recordType;
        return expanded;
    };

    var expandComponentOptionsImpl = function (mergePolicy, defaults, initRecord, that) {
        var defaultCopy = fluid.copy(defaults);
        addPolicyBuiltins(mergePolicy);
        var shadow = fluid.shadowForComponent(that);
        shadow.mergePolicy = mergePolicy;
        var mergeRecords = {
            defaults: {options: defaultCopy}
        };

        $.extend(mergeRecords, initRecord.mergeRecords);
        // Do this here for gradeless components that were corrected by "localOptions"
        if (mergeRecords.subcomponentRecord) {
            fluid.checkComponentRecord(mergeRecords.subcomponentRecord);
        }
        
        var expandList = fluid.mergeRecordsToList(that, mergeRecords);

        var togo = fluid.transform(expandList, function (value) {
            return fluid.generateExpandBlock(value, that, mergePolicy, initRecord.localRecord);
        });
        return togo;
    };

    fluid.fabricateDestroyMethod = function (that, name, instantiator, child) {
        return function () {
            instantiator.clearComponent(that, name, child);
        };
    };
    
    // Computes a name for a component appearing at the global root which is globally unique, from its nickName and id
    fluid.computeGlobalMemberName = function (that) {
        var nickName = fluid.computeNickName(that.typeName);
        return nickName + "-" + that.id;
    };
    
    // Maps a type name to the member name to be used for it at a particular path level where it is intended to be unique
    // Note that "." is still not supported within a member name
    // supported, PUBLIC API function
    fluid.typeNameToMemberName = function (typeName) {
        return typeName.replace(/\./g, "_");
    };

    // This is the initial entry point from the non-IoC side reporting the first presence of a new component - called from fluid.mergeComponentOptions
    fluid.expandComponentOptions = function (mergePolicy, defaults, userOptions, that) {
        var initRecord = userOptions; // might have been tunnelled through "userOptions" from "assembleCreatorArguments"
        var instantiator = userOptions && userOptions.marker === fluid.EXPAND ? userOptions.instantiator : null;
        if (!instantiator) { // it is a top-level component which needs to be attached to the global root
            instantiator = fluid.globalInstantiator;
            initRecord = { // upgrade "userOptions" to the same format produced by fluid.assembleCreatorArguments via the subcomponent route
                mergeRecords: {user: {options: fluid.expandCompact(userOptions, true)}},
                memberName: fluid.computeGlobalMemberName(that),
                instantiator: instantiator,
                parentThat: fluid.rootComponent
            };
        }
        that.destroy = fluid.fabricateDestroyMethod(initRecord.parentThat, initRecord.memberName, instantiator, that);
        fluid.pushActivity("expandComponentOptions", "expanding component options %options with record %record for component %that",
            {options: fluid.get(initRecord.mergeRecords, "user.options"), record: initRecord, that: that});
            
        instantiator.recordKnownComponent(initRecord.parentThat, that, initRecord.memberName, true);
        var togo = expandComponentOptionsImpl(mergePolicy, defaults, initRecord, that);
        
        fluid.popActivity();
        return togo;
    };

    /** Given a typeName, determine the final concrete
     * "invocation specification" consisting of a concrete global function name
     * and argument list which is suitable to be executed directly by fluid.invokeGlobalFunction.
     */
    // options is just a disposition record containing memberName, componentRecord
    fluid.assembleCreatorArguments = function (parentThat, typeName, options) {
        var upDefaults = fluid.defaults(typeName); // we're not responsive to dynamic changes in argMap, but we don't believe in these anyway
        if (!upDefaults || !upDefaults.argumentMap) {
            fluid.fail("Error in assembleCreatorArguments: cannot look up component type name " + typeName + " to a component creator grade with an argumentMap");
        }

        var fakeThat = {}; // fake "that" for receiveDistributions since we try to match selectors before creation for FLUID-5013
        var distributions = parentThat ? fluid.receiveDistributions(parentThat, upDefaults.gradeNames, options.memberName, fakeThat) : [];

        var localDynamic = options.localDynamic;
        var localRecord = $.extend({}, fluid.censorKeys(options.componentRecord, ["type"]), localDynamic);
 
        var argMap = upDefaults.argumentMap;
        var findKeys = Object.keys(argMap).concat(["type"]);

        fluid.each(findKeys, function (name) {
            for (var i = 0; i < distributions.length; ++ i) { // Apply non-options material from distributions (FLUID-5013)
                if (distributions[i][name] !== undefined) {
                    localRecord[name] = distributions[i][name];
                }
            }
        });
        typeName = localRecord.type || typeName;
        
        delete localRecord.type;
        delete localRecord.options;

        var mergeRecords = {distributions: distributions};

        if (options.componentRecord !== undefined) {
            // Deliberately put too many things here so they can be checked in expandComponentOptions (FLUID-4285)
            mergeRecords.subcomponentRecord = $.extend({}, options.componentRecord);
        }
        var args = [];
        fluid.each(argMap, function (index, name) {
            var arg;
            if (name === "options") {
                arg = {marker: fluid.EXPAND,
                           localRecord: localDynamic,
                           mergeRecords: mergeRecords,
                           instantiator: fluid.getInstantiator(parentThat),
                           parentThat: parentThat,
                           memberName: options.memberName};
            } else {
                var value = localRecord[name];
                arg = fluid.expandImmediate(value, parentThat, localRecord);
            }
            args[index] = arg;
        });

        var togo = {
            args: args,
            funcName: typeName
        };
        return togo;
    };

    /** Instantiate the subcomponent with the supplied name of the supplied top-level component. Although this method
     * is published as part of the Fluid API, it should not be called by general users and may not remain stable. It is
     * currently the only mechanism provided for instantiating components whose definitions are dynamic, and will be
     * replaced in time by dedicated declarative framework described by FLUID-5022.
     * @param that {Component} the parent component for which the subcomponent is to be instantiated
     * @param name {String} the name of the component - the index of the options block which configures it as part of the
     * <code>components</code> section of its parent's options
     */
    fluid.initDependent = function (that, name, localRecord) {
        if (that[name]) { return; } // TODO: move this into strategy
        var component = that.options.components[name];
        fluid.pushActivity("initDependent", "instantiating dependent component with name \"%name\" with record %record as child of %parent",
            {name: name, record: component, parent: that});
        var instance;
        var instantiator = fluid.globalInstantiator;
        var shadow = instantiator.idToShadow[that.id];
        var localDynamic = localRecord || shadow.subcomponentLocal && shadow.subcomponentLocal[name];

        if (typeof(component) === "string") {
            that[name] = fluid.inEvaluationMarker;
            instance = fluid.expandImmediate(component, that);
            if (instance) {
                instantiator.recordKnownComponent(that, instance, name, false);
            } else {
                delete that[name];
            }
        }
        else if (component.type) {
            var type = fluid.expandImmediate(component.type, that, localDynamic);
            if (!type) {
                fluid.fail("Error in subcomponent record: ", component.type, " could not be resolved to a type for component ", name,
                    " of parent ", that);
            }
            var invokeSpec = fluid.assembleCreatorArguments(that, type, {componentRecord: component, memberName: name, localDynamic: localDynamic});
            instance = fluid.initSubcomponentImpl(that, {type: invokeSpec.funcName}, invokeSpec.args);
        }
        else {
            fluid.fail("Unrecognised material in place of subcomponent " + name + " - no \"type\" field found");
        }
        fluid.popActivity();
        return instance;
    };

    fluid.bindDeferredComponent = function (that, componentName, component) {
        var events = fluid.makeArray(component.createOnEvent);
        fluid.each(events, function(eventName) {
            var event = eventName.charAt(0) === "{" ? fluid.expandOptions(eventName, that) : that.events[eventName];
            if (!event || !event.addListener) {
                fluid.fail("Error instantiating createOnEvent component with name " + componentName + " of parent ", that, " since event specification " +
                    eventName + " could not be expanded to an event - got ", event);
            }
            event.addListener(function () {
                fluid.pushActivity("initDeferred", "instantiating deferred component %componentName of parent %that due to event %eventName",
                 {componentName: componentName, that: that, eventName: eventName});
                if (that[componentName]) {
                    fluid.globalInstantiator.clearComponent(that, componentName);
                }
                fluid.initDependent(that, componentName);
                fluid.popActivity();
            }, null, component.priority);
        });
    };

    fluid.priorityForComponent = function (component) {
        return component.priority? component.priority :
            (component.type === "fluid.typeFount" || fluid.hasGrade(fluid.defaults(component.type), "fluid.typeFount"))?
            "first" : undefined;
    };

    fluid.initDependents = function (that) {
        fluid.pushActivity("initDependents", "instantiating dependent components for component %that", {that: that});
        var shadow = fluid.shadowForComponent(that);
        shadow.memberStrategy.initter();
        shadow.invokerStrategy.initter();

        fluid.getForComponent(that, "modelRelay");
        fluid.getForComponent(that, "model"); // trigger this as late as possible - but must be before components so that child component has model on its onCreate

        var options = that.options;
        var components = options.components || {};
        var componentSort = [];

        fluid.each(components, function (component, name) {
            if (!component.createOnEvent) {
                var priority = fluid.priorityForComponent(component);
                componentSort.push({namespace: name, priority: fluid.parsePriority(priority)});
            }
            else {
                fluid.bindDeferredComponent(that, name, component);
            }
        });
        fluid.sortByPriority(componentSort);
        fluid.each(componentSort, function (entry) {
            fluid.initDependent(that, entry.namespace);
        });
        if (shadow.subcomponentLocal) {
            fluid.clear(shadow.subcomponentLocal); // still need repo for event-driven dynamic components - abolish these in time
        }

        fluid.popActivity();
    };

    
    /** BEGIN NEXUS METHODS **/
    
    fluid.pathForComponent = function (component, instantiator) {
        instantiator = instantiator || fluid.getInstantiator(component);
        var shadow = instantiator.idToShadow[component.id];
        if (!shadow) {
            fluid.fail("Cannot get path for ", component, " which is not a component");
        }
        return instantiator.parseEL(shadow.path);
    };
    
    /** Construct a component with the supplied options at the specified path in the component tree. The parent path of the location must already be a component.
     * @param path {String|Array of String} Path where the new component is to be constructed, represented as a string or array of segments
     * @param options {Object} Top-level options supplied to the component - must at the very least include a field <code>type</code> holding the component's type 
     * @param instantiator {Instantiator} [optional] The instantiator holding the component to be created - if blank, the global instantiator will be used
     */
    fluid.construct = function (path, options, instantiator) {
        var record = fluid.destroy(path, instantiator);
        // TODO: We must construct a more principled scheme for designating child components than this - especially once options become immutable
        fluid.set(record.parent, ["options", "components", record.memberName], {
            type: options.type,
            options: options
        });
        return fluid.initDependent(record.parent, record.memberName);
    };

    /** Destroys a component held at the specified path. The parent path must represent a component, although the component itself may be nonexistent
     * @param path {String|Array of String} Path where the new component is to be destroyed, represented as a string or array of segments
     * @param instantiator {Instantiator} [optional] The instantiator holding the component to be destroyed - if blank, the global instantiator will be used
     */
    fluid.destroy = function (path, instantiator) {
        instantiator = instantiator || fluid.globalInstantiator;
        var segs = fluid.model.parseToSegments(path, instantiator.parseEL, true);
        if (segs.length === 0) {
            fluid.fail("Cannot destroy the root component");
        }
        var memberName = segs.pop(), parentPath = instantiator.composeSegments.apply(null, segs);
        var parent = instantiator.pathToComponent[parentPath];
        if (!parent) {
            fluid.fail("Cannot modify component with nonexistent parent at path ", path);
        }
        if (parent[memberName]) {
            parent[memberName].destroy();
        }
        return {
            parent: parent,
            memberName: memberName
        };
    };
    
    /** END NEXUS METHODS **/
    
    /** BEGIN IOC DEBUGGING METHODS **/
    fluid["debugger"] = function () {
        /* jshint ignore:start */
        debugger;
        /* jshint ignore:end */
    };
    
    fluid.defaults("fluid.debuggingProbe", {
        gradeNames: ["fluid.component"]
    });
    
    // probe looks like:
    // target: {preview other}.listeners.eventName
    // priority: first/last
    // func: console.log/fluid.log/fluid.debugger
    fluid.probeToDistribution = function (probe) {
        var instantiator = fluid.globalInstantiator;
        var parsed = fluid.parseContextReference(probe.target);
        var segs = fluid.model.parseToSegments(parsed.path, instantiator.parseEL, true);
        if (segs[0] !== "options") {
            segs.unshift("options"); // compensate for this insanity until we have the great options flattening
        }
        var parsedPriority = fluid.parsePriority(probe.priority);
        if (parsedPriority.constraint && !parsedPriority.constraint.target) {
            parsedPriority.constraint.target = "authoring";
        }
        return {
            target: "{/ " + parsed.context + "}." + instantiator.composeSegments.apply(null, segs),
            record: {
                func: probe.func,
                funcName: probe.funcName,
                args: probe.args,
                priority: fluid.renderPriority(parsedPriority)
            }
        };
    };
    
    fluid.registerProbes = function (probes) {
        var probeDistribution = fluid.transform(probes, fluid.probeToDistribution);
        var memberName = "fluid_debuggingProbe_" + fluid.allocateGuid();
        fluid.construct([memberName], {
            type: "fluid.debuggingProbe",
            distributeOptions: probeDistribution
        });
        return memberName;
    };
    
    fluid.deregisterProbes = function (probeName) {
        fluid.destroy([probeName]);
    };
    
    /** END IOC DEBUGGING METHODS **/

    fluid.thisistToApplicable = function (record, recthis, that) {
        return {
            apply: function (noThis, args) {
                // Resolve this material late, to deal with cases where the target has only just been brought into existence
                // (e.g. a jQuery target for rendered material) - TODO: Possibly implement cached versions of these as we might do for invokers
                var resolvedThis = fluid.expandOptions(recthis, that);
                if (typeof(resolvedThis) === "string") {
                    resolvedThis = fluid.getGlobalValue(resolvedThis);
                }
                if (!resolvedThis) {
                    fluid.fail("Could not resolve reference " + recthis + " to a value");
                }
                var resolvedFunc = resolvedThis[record.method];
                if (typeof(resolvedFunc) !== "function") {
                    fluid.fail("Object ", resolvedThis, " at reference " + recthis + " has no member named " + record.method + " which is a function ");
                }
                fluid.log("Applying arguments ", args, " to method " + record.method + " of instance ", resolvedThis);
                return resolvedFunc.apply(resolvedThis, args);
            }
        };
    };

    fluid.changeToApplicable = function (record, that) {
        return {
            apply: function (noThis, args) {
                var parsed = fluid.parseValidModelReference(that, "changePath listener record", record.changePath);
                var value = fluid.expandOptions(record.value, that, {}, {"arguments": args});
                fluid.fireSourcedChange(parsed.applier, parsed.path, value, record.source);
            }
        };
    };

    // Convert "exotic records" into an applicable form ("this/method" for FLUID-4878 or "changePath" for FLUID-3674)
    fluid.recordToApplicable = function (record, that) {
        if (record.changePath) {
            return fluid.changeToApplicable(record, that);
        }
        var recthis = record["this"];
        if (record.method ^ recthis) {
            fluid.fail("Record ", that, " must contain both entries \"method\" and \"this\" if it contains either");
        }
        return record.method ? fluid.thisistToApplicable(record, recthis, that) : null;
    };
    
    fluid.getGlobalValueNonComponent = function (funcName, context) { // TODO: Guard this in listeners as well
        var defaults = fluid.defaults(funcName);
        if (defaults && fluid.hasGrade(defaults, "fluid.component")) {
            fluid.fail("Error in function specification - cannot invoke function " + funcName + " in the context of " + context + ": component creator functions can only be used as subcomponents");
        }
        return fluid.getGlobalValue(funcName);
    };

    fluid.makeInvoker = function (that, invokerec, name) {
        invokerec = fluid.upgradePrimitiveFunc(invokerec); // shorthand case for direct function invokers (FLUID-4926)
        if (invokerec.args !== undefined && invokerec.args !== fluid.NO_VALUE && !fluid.isArrayable(invokerec.args)) {
            invokerec.args = fluid.makeArray(invokerec.args);
        }
        var func = fluid.recordToApplicable(invokerec, that);
        var invokePre = fluid.preExpand(invokerec.args);
        var localRecord = {};
        var expandOptions = fluid.makeStackResolverOptions(that, localRecord, true);
        func = func || (invokerec.funcName? fluid.getGlobalValueNonComponent(invokerec.funcName, "an invoker") : fluid.expandImmediate(invokerec.func, that));
        if (!func || !func.apply) {
            fluid.fail("Error in invoker record: could not resolve members func, funcName or method to a function implementation - got " + func + " from ", invokerec);
        } else if (func === fluid.notImplemented) {
            fluid.fail("Error constructing component ", that, " - the invoker named " + name + " which was defined in grade " + invokerec.componentSource + " needs to be overridden with a concrete implementation");
        }
        return function invokeInvoker () {
            if (fluid.defeatLogging === false) {
                fluid.pushActivity("invokeInvoker", "invoking invoker with name %name and record %record from component %that", {name: name, record: invokerec, that: that});
            }
            var togo, finalArgs;
            localRecord["arguments"] = arguments;
            if (invokerec.args === undefined || invokerec.args === fluid.NO_VALUE) {
                finalArgs = arguments;
            } else {
                fluid.expandImmediateImpl(invokePre, expandOptions);
                finalArgs = invokePre.source;
            }
            togo = func.apply(null, finalArgs);
            if (fluid.defeatLogging === false) {
                fluid.popActivity();
            }
            return togo;
        };
    };

    // weird higher-order function so that we can staightforwardly dispatch original args back onto listener
    fluid.event.makeTrackedListenerAdder = function (source) {
        var shadow = fluid.shadowForComponent(source);
        return function (event) {
            return {addListener: function (listener, namespace, priority, softNamespace, listenerId) {
                    fluid.recordListener(event, listener, shadow, listenerId);
                    event.addListener.apply(null, arguments);
                }
            };
        };
    };

    fluid.event.listenerEngine = function (eventSpec, callback, adder) {
        var argstruc = {};
        function checkFire() {
            var notall = fluid.find(eventSpec, function(value, key) {
                if (argstruc[key] === undefined) {
                    return true;
                }
            });
            if (!notall) {
                var oldstruc = argstruc;
                argstruc = {}; // guard against the case the callback perversely fires one of its prerequisites (FLUID-5112)
                callback(oldstruc);
            }
        }
        fluid.each(eventSpec, function (event, eventName) {
            adder(event).addListener(function () {
                argstruc[eventName] = fluid.makeArray(arguments);
                checkFire();
            });
        });
    };

    fluid.event.dispatchListener = function (that, listener, eventName, eventSpec, indirectArgs) {
        if (eventSpec.args !== undefined && eventSpec.args !== fluid.NO_VALUE && !fluid.isArrayable(eventSpec.args)) {
            eventSpec.args = fluid.makeArray(eventSpec.args);
        }
        listener = fluid.event.resolveListener(listener); // In theory this optimisation is too aggressive if global name is not defined yet
        var dispatchPre = fluid.preExpand(eventSpec.args);
        var localRecord = {};
        var expandOptions = fluid.makeStackResolverOptions(that, localRecord, true);
        var togo = function () {
            if (fluid.defeatLogging === false) {
                fluid.pushActivity("dispatchListener", "firing to listener to event named %eventName of component %that",
                    {eventName: eventName, that: that});
            }

            var args = indirectArgs ? arguments[0] : arguments, finalArgs;
            localRecord["arguments"] = args;
            if (eventSpec.args !== undefined && eventSpec.args !== fluid.NO_VALUE) {
                fluid.expandImmediateImpl(dispatchPre, expandOptions);
                finalArgs = dispatchPre.source;
            } else {
                finalArgs = args;
            }
            var togo = listener.apply(null, finalArgs);
            if (fluid.defeatLogging === false) {
                fluid.popActivity();
            }
            return togo;
        };
        fluid.event.impersonateListener(listener, togo); // still necessary for FLUID-5254 even though framework's listeners now get explicit guids
        return togo;
    };

    fluid.event.resolveSoftNamespace = function (key) {
        if (typeof(key) !== "string") {
            return null;
        } else {
            var lastpos = Math.max(key.lastIndexOf("."), key.lastIndexOf("}"));
            return key.substring(lastpos + 1);
        }
    };

    fluid.event.resolveListenerRecord = function (lisrec, that, eventName, namespace, standard) {
        var badRec = function (record, extra) {
            fluid.fail("Error in listener record - could not resolve reference ", record, " to a listener or firer. " +
                "Did you miss out \"events.\" when referring to an event firer?" + extra);
        };
        fluid.pushActivity("resolveListenerRecord", "resolving listener record for event named %eventName for component %that",
            {eventName: eventName, that: that});
        var records = fluid.makeArray(lisrec);
        var transRecs = fluid.transform(records, function (record) {
            // TODO: FLUID-5242 fix - we copy here since distributeOptions does not copy options blocks that it distributes and we can hence corrupt them.
            // need to clarify policy on options sharing - for slightly better efficiency, copy should happen during distribution and not here
            var expanded = fluid.isPrimitive(record) || record.expander ? {listener: record} : fluid.copy(record);
            var methodist = fluid.recordToApplicable(record, that);
            if (methodist) {
                expanded.listener = methodist;
            }
            else {
                expanded.listener = expanded.listener || expanded.func || expanded.funcName;
            }
            if (!expanded.listener) {
                badRec(record, " Listener record must contain a member named \"listener\", \"func\", \"funcName\" or \"method\"");
            }
            var softNamespace = record.method ?
                fluid.event.resolveSoftNamespace(record["this"]) + "." + record.method :
                fluid.event.resolveSoftNamespace(expanded.listener);
            if (!expanded.namespace && !namespace && softNamespace) {
                expanded.softNamespace = true;
                expanded.namespace = (record.componentSource ? record.componentSource : that.typeName) + "." + softNamespace;
            }
            var listener = expanded.listener = fluid.expandOptions(expanded.listener, that);
            if (!listener) {
                badRec(record, "");
            }
            var firer = false;
            if (listener.typeName === "fluid.event.firer") {
                listener = listener.fire;
                firer = true;
            }
            expanded.listener = (standard && (expanded.args && listener !== "fluid.notImplemented" || firer)) ? fluid.event.dispatchListener(that, listener, eventName, expanded) : listener;
            expanded.listenerId = fluid.allocateGuid();
            return expanded;
        });
        var togo = {
            records: transRecs,
            adderWrapper: standard ? fluid.event.makeTrackedListenerAdder(that) : null
        };
        fluid.popActivity();
        return togo;
    };

    fluid.event.expandOneEvent = function (that, event) {
        var origin;
        if (typeof(event) === "string" && event.charAt(0) !== "{") {
            // Shorthand for resolving onto our own events, but with GINGER WORLD!
            origin = fluid.getForComponent(that, ["events", event]);
        }
        else {
            origin = fluid.expandOptions(event, that);
        }
        if (!origin || origin.typeName !== "fluid.event.firer") {
            fluid.fail("Error in event specification - could not resolve base event reference ", event, " to an event firer: got ", origin);
        }
        return origin;
    };

    fluid.event.expandEvents = function (that, event) {
        return typeof(event) === "string" ?
            fluid.event.expandOneEvent(that, event) :
            fluid.transform(event, function (oneEvent) {
                return fluid.event.expandOneEvent(that, oneEvent);
            });
    };

    fluid.event.resolveEvent = function (that, eventName, eventSpec) {
        fluid.pushActivity("resolveEvent", "resolving event with name %eventName attached to component %that",
            {eventName: eventName, that: that});
        var adder = fluid.event.makeTrackedListenerAdder(that);
        if (typeof(eventSpec) === "string") {
            eventSpec = {event: eventSpec};
        }
        var event = eventSpec.typeName === "fluid.event.firer" ? eventSpec : eventSpec.event || eventSpec.events;
        if (!event) {
            fluid.fail("Event specification for event with name " + eventName + " does not include a base event specification: ", eventSpec);
        }

        var origin = event.typeName === "fluid.event.firer" ? event : fluid.event.expandEvents(that, event);

        var isMultiple = origin.typeName !== "fluid.event.firer";
        var isComposite = eventSpec.args || isMultiple;
        // If "event" is not composite, we want to share the listener list and FIRE method with the original
        // If "event" is composite, we need to create a new firer. "composite" includes case where any boiling
        // occurred - this was implemented wrongly in 1.4.
        var firer;
        if (isComposite) {
            firer = fluid.makeEventFirer({name: " [composite] " + fluid.event.nameEvent(that, eventName)});
            var dispatcher = fluid.event.dispatchListener(that, firer.fire, eventName, eventSpec, isMultiple);
            if (isMultiple) {
                fluid.event.listenerEngine(origin, dispatcher, adder);
            }
            else {
                adder(origin).addListener(dispatcher);
            }
        }
        else {
            firer = {typeName: "fluid.event.firer"};
            firer.fire = function () {
                var outerArgs = fluid.makeArray(arguments);
                fluid.pushActivity("fireSynthetic", "firing synthetic event %eventName ", {eventName: eventName});
                var togo = origin.fire.apply(null, outerArgs);
                fluid.popActivity();
                return togo;
            };
            firer.addListener = function (listener, namespace, priority, softNamespace, listenerId) {
                var dispatcher = fluid.event.dispatchListener(that, listener, eventName, eventSpec);
                adder(origin).addListener(dispatcher, namespace, priority, softNamespace, listenerId);
            };
            firer.removeListener = function (listener) {
                origin.removeListener(listener);
            };
        }
        fluid.popActivity();
        return firer;
    };

    /** BEGIN unofficial IoC material **/
    // The following three functions are unsupported ane only used in the renderer expander.
    // The material they produce is no longer recognised for component resolution.

    fluid.withEnvironment = function (envAdd, func, root) {
        root = root || fluid.globalThreadLocal();
        try {
            for (var key in envAdd) {
                root[key] = envAdd[key];
            }
            $.extend(root, envAdd);
            return func();
        } finally {
            for (var key in envAdd) { /* jshint ignore:line */ /* duplicate "key" */
                delete root[key]; // TODO: users may want a recursive "scoping" model
            }
        }
    };

    fluid.fetchContextReference = function (parsed, directModel, env, elResolver, externalFetcher) {
        // The "elResolver" is a hack to make certain common idioms in protoTrees work correctly, where a contextualised EL
        // path actually resolves onto a further EL reference rather than directly onto a value target
        if (elResolver) {
            parsed = elResolver(parsed, env);
        }
        var base = parsed.context? env[parsed.context] : directModel;
        if (!base) {
            var resolveExternal = externalFetcher && externalFetcher(parsed);
            return resolveExternal || base;
        }
        return parsed.noDereference? parsed.path : fluid.get(base, parsed.path);
    };

    fluid.makeEnvironmentFetcher = function (directModel, elResolver, envGetter, externalFetcher) {
        envGetter = envGetter || fluid.globalThreadLocal;
        return function(parsed) {
            var env = envGetter();
            return fluid.fetchContextReference(parsed, directModel, env, elResolver, externalFetcher);
        };
    };

    /** END of unofficial IoC material **/
    
    /* Compact expansion machinery - for short form invoker and expander references such as @expand:func(arg) and func(arg) */

    fluid.coerceToPrimitive = function (string) {
        return string === "false" ? false : (string === "true" ? true :
            (isFinite(string) ? Number(string) : string));
    };

    fluid.compactStringToRec = function (string, type) {
        var openPos = string.indexOf("(");
        var closePos = string.indexOf(")");
        if (openPos === -1 ^ closePos === -1 || openPos > closePos) {
            fluid.fail("Badly-formed compact " + type + " record without matching parentheses: ", string);
        }
        if (openPos !== -1 && closePos !== -1) {
            var trail = string.substring(closePos + 1);
            if ($.trim(trail) !== "") {
                fluid.fail("Badly-formed compact " + type + " - unexpected material following close parenthesis: " + trail);
            }
            var prefix = string.substring(0, openPos);
            var body = string.substring(openPos + 1, closePos);
            var args = fluid.transform(body.split(","), $.trim, fluid.coerceToPrimitive);
            var togo = fluid.upgradePrimitiveFunc(prefix, null);
            togo.args = args;
            return togo;
        }
        else if (type === "expander") {
            fluid.fail("Badly-formed compact expander record without parentheses: ", string);
        }
        return string;
    };

    fluid.expandPrefix = "@expand:";

    fluid.expandCompactString = function (string, active) {
        var rec = string;
        if (string.indexOf(fluid.expandPrefix) === 0) {
            var rem = string.substring(fluid.expandPrefix.length);
            rec = {
                expander: fluid.compactStringToRec(rem, "expander")
            };
        }
        else if (active) {
            rec = fluid.compactStringToRec(string, active);
        }
        return rec;
    };

    var singularPenRecord = {
        listeners: "listener",
        modelListeners: "modelListener"
    };

    var singularRecord = $.extend({
        invokers: "invoker"
    }, singularPenRecord);

    fluid.expandCompactRec = function (segs, target, source) {
        fluid.guardCircularExpansion(segs, segs.length);
        var pen = segs.length > 0 ? segs[segs.length - 1] : "";
        var active = singularRecord[pen];
        if (!active && segs.length > 1) {
            active = singularPenRecord[segs[segs.length - 2]]; // support array of listeners and modelListeners
        }
        fluid.each(source, function (value, key) {
            if (fluid.isPlainObject(value)) {
                target[key] = fluid.freshContainer(value);
                segs.push(key);
                fluid.expandCompactRec(segs, target[key], value);
                segs.pop();
                return;
            }
            else if (typeof(value) === "string") {
                value = fluid.expandCompactString(value, active);
            }
            target[key] = value;
        });
    };

    fluid.expandCompact = function (options) {
        var togo = {};
        fluid.expandCompactRec([], togo, options);
        return togo;
    };
    
    /** End compact record expansion machinery **/
    
    fluid.isIoCReference = function (ref) {
        return typeof(ref) === "string" && ref.charAt(0) === "{" && ref.indexOf("}") > 0;
    };

    fluid.extractEL = function (string, options) {
        if (options.ELstyle === "ALL") {
            return string;
        }
        else if (options.ELstyle.length === 1) {
            if (string.charAt(0) === options.ELstyle) {
                return string.substring(1);
            }
        }
        else if (options.ELstyle === "${}") {
            var i1 = string.indexOf("${");
            var i2 = string.lastIndexOf("}");
            if (i1 === 0 && i2 !== -1) {
                return string.substring(2, i2);
            }
        }
    };

    fluid.extractELWithContext = function (string, options) {
        var EL = fluid.extractEL(string, options);
        if (fluid.isIoCReference(EL)) {
            return fluid.parseContextReference(EL);
        }
        return EL? {path: EL} : EL;
    };

    fluid.parseContextReference = function (reference, index, delimiter) {
        index = index || 0;
        var endcpos = reference.indexOf("}", index + 1);
        if (endcpos === -1) {
            fluid.fail("Cannot parse context reference \"" + reference + "\": Malformed context reference without }");
        }
        var context = reference.substring(index + 1, endcpos);
        var endpos = delimiter? reference.indexOf(delimiter, endcpos + 1) : reference.length;
        var path = reference.substring(endcpos + 1, endpos);
        if (path.charAt(0) === ".") {
            path = path.substring(1);
        }
        return {context: context, path: path, endpos: endpos};
    };

    fluid.renderContextReference = function (parsed) {
        return "{" + parsed.context + "}" + (parsed.path ? "." + parsed.path : "");
    };
    
    // TODO: Once we eliminate expandSource, all of this tree of functions can be hived off to RendererUtilities
    fluid.resolveContextValue = function (string, options) {
        function fetch(parsed) {
            fluid.pushActivity("resolveContextValue", "resolving context value %string", {string: string});
            var togo = options.fetcher(parsed);
            fluid.pushActivity("resolvedContextValue", "resolved value %string to value %value", {string: string, value: togo});
            fluid.popActivity(2);
            return togo;
        }
        var parsed;
        if (options.bareContextRefs && fluid.isIoCReference(string)) {
            parsed = fluid.parseContextReference(string);
            return fetch(parsed);
        }
        else if (options.ELstyle && options.ELstyle !== "${}") {
            parsed = fluid.extractELWithContext(string, options);
            if (parsed) {
                return fetch(parsed);
            }
        }
        while (typeof(string) === "string") {
            var i1 = string.indexOf("${");
            var i2 = string.indexOf("}", i1 + 2);
            if (i1 !== -1 && i2 !== -1) {
                if (string.charAt(i1 + 2) === "{") {
                    parsed = fluid.parseContextReference(string, i1 + 2, "}");
                    i2 = parsed.endpos;
                }
                else {
                    parsed = {path: string.substring(i1 + 2, i2)};
                }
                var subs = fetch(parsed);
                var all = (i1 === 0 && i2 === string.length - 1);
                // TODO: test case for all undefined substitution
                if (subs === undefined || subs === null) {
                    return subs;
                }
                string = all? subs : string.substring(0, i1) + subs + string.substring(i2 + 1);
            }
            else {
                break;
            }
        }
        return string;
    };

    // This function appears somewhat reusable, but not entirely - it probably needs to be packaged
    // along with the particular "strategy". Very similar to the old "filter"... the "outer driver" needs
    // to execute it to get the first recursion going at top level. This was one of the most odd results
    // of the reorganisation, since the "old work" seemed much more naturally expressed in terms of values
    // and what happened to them. The "new work" is expressed in terms of paths and how to move amongst them.
    fluid.fetchExpandChildren = function (target, i, segs, source, mergePolicy, options) {
        if (source.expander) { // possible expander at top level
            var expanded = fluid.expandExpander(target, source, options);
            if (fluid.isPrimitive(expanded) || fluid.isDOMish(expanded) || !fluid.isPlainObject(expanded) || (fluid.isArrayable(expanded) ^ fluid.isArrayable(target))) {
                return expanded;
            }
            else { // make an attempt to preserve the root reference if possible
                $.extend(true, target, expanded);
            }
        }
        // NOTE! This expects that RHS is concrete! For material input to "expansion" this happens to be the case, but is not
        // true for other algorithms. Inconsistently, this algorithm uses "sourceStrategy" below. In fact, this "fetchChildren"
        // operation looks like it is a fundamental primitive of the system. We do call "deliverer" early which enables correct
        // reference to parent nodes up the tree - however, anyone processing a tree IN THE CHAIN requires that it is produced
        // concretely at the point STRATEGY returns. Which in fact it is...............
        fluid.each(source, function (newSource, key) {
            if (newSource === undefined) {
                target[key] = undefined; // avoid ever dispatching to ourselves with undefined source
            }
            else if (key !== "expander") {
                segs[i] = key;
                if (fluid.getImmediate(options.exceptions, segs, i) !== true) {
                    options.strategy(target, key, i + 1, segs, source, mergePolicy);
                }
            }
        });
        return target;
    };

    // TODO: This method is unnecessary and will quadratic inefficiency if RHS block is not concrete.
    // The driver should detect "homogeneous uni-strategy trundling" and agree to preserve the extra
    // "cursor arguments" which should be advertised somehow (at least their number)
    function regenerateCursor (source, segs, limit, sourceStrategy) {
        for (var i = 0; i < limit; ++ i) {
            // copy segs to avoid aliasing with FLUID-5243
            source = sourceStrategy(source, segs[i], i, fluid.makeArray(segs));
        }
        return source;
    }

    fluid.isUnexpandable = function (source) { // slightly more efficient compound of fluid.isCopyable and fluid.isComponent - review performance
        return fluid.isPrimitive(source) || !fluid.isPlainObject(source);
    };

    fluid.expandSource = function (options, target, i, segs, deliverer, source, policy, recurse) {
        var expanded, isTrunk;
        var thisPolicy = fluid.derefMergePolicy(policy);
        if (typeof (source) === "string" && !thisPolicy.noexpand) {
            if (!options.defaultEL || source.charAt(0) === "{") { // hard-code this for performance
                fluid.pushActivity("expandContextValue", "expanding context value %source held at path %path", {source: source, path: fluid.path.apply(null, segs.slice(0, i))});
                expanded = fluid.resolveContextValue(source, options);
                fluid.popActivity(1);
            } else {
                expanded = source;
            }
        }
        else if (thisPolicy.noexpand || fluid.isUnexpandable(source)) {
            expanded = source;
        }
        else if (source.expander) {
            expanded = fluid.expandExpander(deliverer, source, options);
        }
        else {
            expanded = fluid.freshContainer(source);
            isTrunk = true;
        }
        if (expanded !== fluid.NO_VALUE) {
            deliverer(expanded);
        }
        if (isTrunk) {
            recurse(expanded, source, i, segs, policy);
        }
        return expanded;
    };
    
    fluid.guardCircularExpansion = function (segs, i) {
        if (i > fluid.strategyRecursionBailout) {
            fluid.fail("Overflow/circularity in options expansion, current path is ", segs, " at depth " , i, " - please ensure options are not circularly connected, or protect from expansion using the \"noexpand\" policy or expander");
        }
    };

    fluid.makeExpandStrategy = function (options) {
        var recurse = function (target, source, i, segs, policy) {
            return fluid.fetchExpandChildren(target, i || 0, segs || [], source, policy, options);
        };
        var strategy = function (target, name, i, segs, source, policy) {
            fluid.guardCircularExpansion(segs, i);
            if (!target) {
                return;
            }
            if (target.hasOwnProperty(name)) { // bail out if our work has already been done
                return target[name];
            }
            if (source === undefined) { // recover our state in case this is an external entry point
                source = regenerateCursor(options.source, segs, i - 1, options.sourceStrategy);
                policy = regenerateCursor(options.mergePolicy, segs, i - 1, fluid.concreteTrundler);
            }
            var thisSource = options.sourceStrategy(source, name, i, segs);
            var thisPolicy = fluid.concreteTrundler(policy, name);
            function deliverer(value) {
                target[name] = value;
            }
            return fluid.expandSource(options, target, i, segs, deliverer, thisSource, thisPolicy, recurse);
        };
        options.recurse = recurse;
        options.strategy = strategy;
        return strategy;
    };

    fluid.defaults("fluid.makeExpandOptions", {
        ELstyle:          "${}",
        bareContextRefs:  true,
        target:           fluid.inCreationMarker
    });

    fluid.makeExpandOptions = function (source, options) {
        options = $.extend({}, fluid.rawDefaults("fluid.makeExpandOptions"), options);
        options.defaultEL = options.ELStyle === "${}" && options.bareContextRefs; // optimisation to help expander
        options.expandSource = function (source) {
            return fluid.expandSource(options, null, 0, [], fluid.identity, source, options.mergePolicy, false);
        };
        if (!fluid.isUnexpandable(source)) {
            options.source = source;
            options.target = fluid.freshContainer(source);
            options.sourceStrategy = options.sourceStrategy || fluid.concreteTrundler;
            fluid.makeExpandStrategy(options);
            options.initter = function () {
                options.target = fluid.fetchExpandChildren(options.target, 0, [], options.source, options.mergePolicy, options);
            };
        }
        else { // these init immediately since we must deliver a valid root target
            options.strategy = fluid.concreteTrundler;
            options.initter = fluid.identity;
            if (typeof(source) === "string") {
                options.target = options.expandSource(source);
            }
            else {
                options.target = source;
            }
        }
        return options;
    };

    // supported, PUBLIC API function
    fluid.expand = function (source, options) {
        var expandOptions = fluid.makeExpandOptions(source, options);
        expandOptions.initter();
        return expandOptions.target;
    };
    
    fluid.preExpandRecurse = function (root, source, holder, member, rootSegs) { // on entry, holder[member] = source
        fluid.guardCircularExpansion(rootSegs, rootSegs.length);
        function pushExpander(expander) {
            root.expanders.push({expander: expander, holder: holder, member: member});
            delete holder[member];
        }
        if (fluid.isIoCReference(source)) {
            var parsed = fluid.parseContextReference(source);
            var segs = fluid.model.parseEL(parsed.path);
            pushExpander({
                typeFunc: fluid.expander.fetch,
                context: parsed.context,
                segs: segs
            });
        } else if (fluid.isPlainObject(source)) {
            if (source.expander) {
                source.expander.typeFunc = fluid.getGlobalValue(source.expander.type || "fluid.invokeFunc");
                pushExpander(source.expander);
            } else {
                fluid.each(source, function (value, key) {
                    rootSegs.push(key);
                    fluid.preExpandRecurse(root, value, source, key, rootSegs);
                    rootSegs.pop();
                });
            }
        }
    };
    
    fluid.preExpand = function (source) {
        var root = {
            expanders: [],
            source: fluid.isUnexpandable(source) ? source : fluid.copy(source)
        };
        fluid.preExpandRecurse(root, root.source, root, "source", []);
        return root;
    };
    
    // Main pathway for freestanding material that is not part of a component's options
    fluid.expandImmediate = function (source, that, localRecord) {
        var options = fluid.makeStackResolverOptions(that, localRecord, true); // TODO: ELstyle and target are now ignored
        var root = fluid.preExpand(source);
        fluid.expandImmediateImpl(root, options);
        return root.source;
    };
    
    // High performance expander for situations such as invokers, listeners, where raw materials can be cached - consumes "root" structure produced by preExpand
    fluid.expandImmediateImpl = function (root, options) {
        var expanders = root.expanders;
        for (var i = 0; i < expanders.length; ++ i) {
            var expander = expanders[i];
            expander.holder[expander.member] = expander.expander.typeFunc(null, expander, options);
        }
    };

    fluid.expandExpander = function (deliverer, source, options) {
        var expander = fluid.getGlobalValue(source.expander.type || "fluid.invokeFunc");
        if (!expander) {
            fluid.fail("Unknown expander with type " + source.expander.type);
        }
        return expander(deliverer, source, options);
    };

    fluid.registerNamespace("fluid.expander");
    
    fluid.expander.fetch = function (deliverer, source, options) {
        var localRecord = options.localRecord, context = source.expander.context, segs = source.expander.segs;
        var inLocal = localRecord[context] !== undefined;
        // somewhat hack to anticipate "fits" for FLUID-4925 - we assume that if THIS component is in construction, its reference target might be too
        var component = inLocal ? localRecord[context] : fluid.resolveContext(context, options.contextThat, options.contextThat.lifecycleStatus === "constructed");
        if (component) {
            var root = component;
            if (inLocal || component.lifecycleStatus === "constructed") {
                for (var i = 0; i < segs.length; ++ i) {
                    root = root ? root[segs[i]] : undefined;
                }
            } else if (component.lifecycleStatus !== "destroyed") {
                root = fluid.getForComponent(component, segs);
            } else {
                fluid.fail("Cannot resolve path " + segs.join(".") + " into component ", component, " which has been destroyed");
            }
            if (root === undefined && !inLocal) { // last-ditch attempt to get exotic EL value from component
                root = fluid.getForComponent(component, segs);
            }
            return root;
        }
    };

    /** "light" expanders, starting with the default expander invokeFunc,
         which makes an arbitrary function call (after expanding arguments) and are then replaced in
         the configuration with the call results. These will probably be abolished and replaced with
         equivalent model transformation machinery **/

    // This one is now positioned as the "universal expander" - default if no type supplied
    fluid.invokeFunc = function (deliverer, source, options) {
        var expander = source.expander;
        var args = fluid.makeArray(expander.args);
        expander.args = args; // head off case where args is an EL reference which resolves to an array
        if (options.recurse) { // only available in the path from fluid.expandOptions - this will be abolished in the end
            args = options.recurse([], args);
        } else {
            expander = fluid.expandImmediate(expander, options.contextThat, options.localRecord);
            args = expander.args;
        }
        var funcEntry = expander.func || expander.funcName;
        var func = (options.expandSource ? options.expandSource(funcEntry) : funcEntry) || fluid.recordToApplicable(expander, options.contextThat);
        if (!func) {
            fluid.fail("Error in expander record - " + funcEntry + " could not be resolved to a function for component ", options.contextThat);
        }
        return func.apply ? func.apply(null, args) : fluid.invokeGlobalFunction(func, args);
    };

    // The "noexpand" expander which simply unwraps one level of expansion and ceases.
    fluid.noexpand = function (deliverer, source) {
        return source.expander.value ? source.expander.value : source.expander.tree;
    };

})(jQuery, fluid_2_0_0_beta_1);
;/*
Copyright 2008-2010 University of Cambridge
Copyright 2008-2009 University of Toronto
Copyright 2010-2011 Lucendo Development Ltd.
Copyright 2010-2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var fluid_2_0_0_beta_1 = fluid_2_0_0_beta_1 || {};

(function ($, fluid) {
    "use strict";

    /** NOTE: The contents of this file are by default NOT PART OF THE PUBLIC FLUID API unless explicitly annotated before the function **/

    /** MODEL ACCESSOR ENGINE **/

    /** Standard strategies for resolving path segments **/

    fluid.model.makeEnvironmentStrategy = function (environment) {
        return function (root, segment, index) {
            return index === 0 && environment[segment] ?
                environment[segment] : undefined;
        };
    };

    fluid.model.defaultCreatorStrategy = function (root, segment) {
        if (root[segment] === undefined) {
            root[segment] = {};
            return root[segment];
        }
    };

    fluid.model.defaultFetchStrategy = function (root, segment) {
        return root[segment];
    };

    fluid.model.funcResolverStrategy = function (root, segment) {
        if (root.resolvePathSegment) {
            return root.resolvePathSegment(segment);
        }
    };

    fluid.model.traverseWithStrategy = function (root, segs, initPos, config, uncess) {
        var strategies = config.strategies;
        var limit = segs.length - uncess;
        for (var i = initPos; i < limit; ++i) {
            if (!root) {
                return root;
            }
            var accepted;
            for (var j = 0; j < strategies.length; ++ j) {
                accepted = strategies[j](root, segs[i], i + 1, segs);
                if (accepted !== undefined) {
                    break; // May now short-circuit with stateless strategies
                }
            }
            if (accepted === fluid.NO_VALUE) {
                accepted = undefined;
            }
            root = accepted;
        }
        return root;
    };

    /** Returns both the value and the path of the value held at the supplied EL path **/
    fluid.model.getValueAndSegments = function (root, EL, config, initSegs) {
        return fluid.model.accessWithStrategy(root, EL, fluid.NO_VALUE, config, initSegs, true);
    };

    // Very lightweight remnant of trundler, only used in resolvers
    fluid.model.makeTrundler = function (config) {
        return function (valueSeg, EL) {
            return fluid.model.getValueAndSegments(valueSeg.root, EL, config, valueSeg.segs);
        };
    };

    fluid.model.getWithStrategy = function (root, EL, config, initSegs) {
        return fluid.model.accessWithStrategy(root, EL, fluid.NO_VALUE, config, initSegs);
    };

    fluid.model.setWithStrategy = function (root, EL, newValue, config, initSegs) {
        fluid.model.accessWithStrategy(root, EL, newValue, config, initSegs);
    };

    fluid.model.accessWithStrategy = function (root, EL, newValue, config, initSegs, returnSegs) {
        // This function is written in this unfortunate style largely for efficiency reasons. In many cases
        // it should be capable of running with 0 allocations (EL is preparsed, initSegs is empty)
        if (!fluid.isPrimitive(EL) && !fluid.isArrayable(EL)) {
            var key = EL.type || "default";
            var resolver = config.resolvers[key];
            if (!resolver) {
                fluid.fail("Unable to find resolver of type " + key);
            }
            var trundler = fluid.model.makeTrundler(config); // very lightweight trundler for resolvers
            var valueSeg = {root: root, segs: initSegs};
            valueSeg = resolver(valueSeg, EL, trundler);
            if (EL.path && valueSeg) { // every resolver supports this piece of output resolution
                valueSeg = trundler(valueSeg, EL.path);
            }
            return returnSegs ? valueSeg : (valueSeg ? valueSeg.root : undefined);
        }
        else {
            return fluid.model.accessImpl(root, EL, newValue, config, initSegs, returnSegs, fluid.model.traverseWithStrategy);
        }
    };

    // Implementation notes: The EL path manipulation utilities here are equivalents of the simpler ones
    // that are provided in Fluid.js and elsewhere - they apply escaping rules to parse characters .
    // as \. and \ as \\ - allowing us to process member names containing periods. These versions are mostly 
    // in use within model machinery, whereas the cheaper versions based on String.split(".") are mostly used
    // within the IoC machinery.
    // Performance testing in early 2015 suggests that modern browsers now allow these to execute slightly faster
    // than the equivalent machinery written using complex regexps - therefore they will continue to be maintained
    // here. However, there is still a significant performance gap with respect to the performance of String.split(".")
    // especially on Chrome, so we will continue to insist that component member names do not contain a "." character
    // for the time being.
    // See http://jsperf.com/parsing-escaped-el for some experiments

    fluid.registerNamespace("fluid.pathUtil");

    fluid.pathUtil.getPathSegmentImpl = function (accept, path, i) {
        var segment = null;
        if (accept) {
            segment = "";
        }
        var escaped = false;
        var limit = path.length;
        for (; i < limit; ++i) {
            var c = path.charAt(i);
            if (!escaped) {
                if (c === ".") {
                    break;
                }
                else if (c === "\\") {
                    escaped = true;
                }
                else if (segment !== null) {
                    segment += c;
                }
            }
            else {
                escaped = false;
                if (segment !== null) {
                    segment += c;
                }
            }
        }
        if (segment !== null) {
            accept[0] = segment;
        }
        return i;
    };

    var globalAccept = []; // TODO: reentrancy risk here. This holder is here to allow parseEL to make two returns without an allocation.

    /** A version of fluid.model.parseEL that apples escaping rules - this allows path segments
     * to contain period characters . - characters "\" and "}" will also be escaped. WARNING -
     * this current implementation is EXTREMELY slow compared to fluid.model.parseEL and should
     * not be used in performance-sensitive applications */
    // supported, PUBLIC API function
    fluid.pathUtil.parseEL = function (path) {
        var togo = [];
        var index = 0;
        var limit = path.length;
        while (index < limit) {
            var firstdot = fluid.pathUtil.getPathSegmentImpl(globalAccept, path, index);
            togo.push(globalAccept[0]);
            index = firstdot + 1;
        }
        return togo;
    };

    // supported, PUBLIC API function
    fluid.pathUtil.composeSegment = function (prefix, toappend) {
        toappend = toappend.toString();
        for (var i = 0; i < toappend.length; ++i) {
            var c = toappend.charAt(i);
            if (c === "." || c === "\\" || c === "}") {
                prefix += "\\";
            }
            prefix += c;
        }
        return prefix;
    };

    /** Escapes a single path segment by replacing any character ".", "\" or "}" with
     * itself prepended by \
     */
    // supported, PUBLIC API function
    fluid.pathUtil.escapeSegment = function (segment) {
        return fluid.pathUtil.composeSegment("", segment);
    };

    /**
     * Compose a prefix and suffix EL path, where the prefix is already escaped.
     * Prefix may be empty, but not null. The suffix will become escaped.
     */
    // supported, PUBLIC API function
    fluid.pathUtil.composePath = function (prefix, suffix) {
        if (prefix.length !== 0) {
            prefix += ".";
        }
        return fluid.pathUtil.composeSegment(prefix, suffix);
    };

    /**
     * Compose a set of path segments supplied as arguments into an escaped EL expression. Escaped version
     * of fluid.model.composeSegments
     */

    // supported, PUBLIC API function
    fluid.pathUtil.composeSegments = function () {
        var path = "";
        for (var i = 0; i < arguments.length; ++ i) {
            path = fluid.pathUtil.composePath(path, arguments[i]);
        }
        return path;
    };
    
    /** Helpful utility for use in resolvers - matches a path which has already been
     * parsed into segments **/

    fluid.pathUtil.matchSegments = function (toMatch, segs, start, end) {
        if (end - start !== toMatch.length) {
            return false;
        }
        for (var i = start; i < end; ++ i) {
            if (segs[i] !== toMatch[i - start]) {
                return false;
            }
        }
        return true;
    };

    fluid.model.unescapedParser = {
        parse: fluid.model.parseEL,
        compose: fluid.model.composeSegments
    };

    // supported, PUBLIC API record
    fluid.model.defaultGetConfig = {
        parser: fluid.model.unescapedParser,
        strategies: [fluid.model.funcResolverStrategy, fluid.model.defaultFetchStrategy]
    };

    // supported, PUBLIC API record
    fluid.model.defaultSetConfig = {
        parser: fluid.model.unescapedParser,
        strategies: [fluid.model.funcResolverStrategy, fluid.model.defaultFetchStrategy, fluid.model.defaultCreatorStrategy]
    };

    fluid.model.escapedParser = {
        parse: fluid.pathUtil.parseEL,
        compose: fluid.pathUtil.composeSegments
    };

    // supported, PUBLIC API record
    fluid.model.escapedGetConfig = {
        parser: fluid.model.escapedParser,
        strategies: [fluid.model.defaultFetchStrategy]
    };

    // supported, PUBLIC API record
    fluid.model.escapedSetConfig = {
        parser: fluid.model.escapedParser,
        strategies: [fluid.model.defaultFetchStrategy, fluid.model.defaultCreatorStrategy]
    };

    /** MODEL COMPONENT HIERARCHY AND RELAY SYSTEM **/

    fluid.initRelayModel = function (that) {
        fluid.deenlistModelComponent(that);
        return that.model;
    };

    // TODO: This utility compensates for our lack of control over "wave of explosions" initialisation - we may
    // catch a model when it is apparently "completely initialised" and that's the best we can do, since we have
    // missed its own initial transaction

    fluid.isModelComplete = function (that) {
        return "model" in that && that.model !== fluid.inEvaluationMarker;
    };

    // Enlist this model component as part of the "initial transaction" wave - note that "special transaction" init
    // is indexed by component, not by applier, and has special record type (complete + initModel), not transaction
    fluid.enlistModelComponent = function (that) {
        var instantiator = fluid.getInstantiator(that);
        var enlist = instantiator.modelTransactions.init[that.id];
        if (!enlist) {
            enlist = {
                that: that,
                applier: fluid.getForComponent(that, "applier"), // required for FLUID-5504 even though currently unused
                complete: fluid.isModelComplete(that)
            };
            instantiator.modelTransactions.init[that.id] = enlist;
        }
        return enlist;
    };
    
    fluid.clearTransactions = function () {
        var instantiator = fluid.globalInstantiator;
        fluid.clear(instantiator.modelTransactions);
        instantiator.modelTransactions.init = {};
    };
    
    fluid.failureEvent.addListener(fluid.clearTransactions, "clearTransactions", "before:fail");

    // Utility to coordinate with our crude "oscillation prevention system" which limits each link to 2 updates (presumably
    // in opposite directions). In the case of the initial transaction, we need to reset the count given that genuine
    // changes are arising in the system with each new enlisted model. TODO: if we ever get users operating their own
    // transactions, think of a way to incorporate this into that workflow
    fluid.clearLinkCounts = function (transRec, relaysAlso) {
        fluid.each(transRec, function (value, key) {
            if (typeof(value) === "number") {
                transRec[key] = 0;
            } else if (relaysAlso && value.options && typeof(value.relayCount) === "number") {
                value.relayCount = 0;
            }
        });
    };

    fluid.sortCompleteLast = function (reca, recb) {
        return (reca.completeOnInit ? 1 : 0) - (recb.completeOnInit ? 1 : 0);
    };

    // Operate all coordinated transactions by bringing models to their respective initial values, and then commit them all
    fluid.operateInitialTransaction = function (instantiator, mrec) {
        var transId = fluid.allocateGuid();
        var transRec = fluid.getModelTransactionRec(instantiator, transId);
        var transac;
        var transacs = fluid.transform(mrec, function (recel) {
            transac = recel.that.applier.initiate("init", transId);
            transRec[recel.that.applier.applierId] = {transaction: transac};
            return transac;
        });
        // TODO: This sort has very little effect in any current test (can be replaced by no-op - see FLUID-5339) - but
        // at least can't be performed in reverse order ("FLUID-3674 event coordination test" will fail) - need more cases
        var recs = fluid.values(mrec).sort(fluid.sortCompleteLast);
        fluid.each(recs, function (recel) {
            var that = recel.that;
            var transac = transacs[that.id];
            if (recel.completeOnInit) {
                fluid.initModelEvent(that, that.applier, transac, that.applier.changeListeners.listeners);
            } else {
                fluid.each(recel.initModels, function (initModel) {
                    transac.fireChangeRequest({type: "ADD", segs: [], value: initModel});
                    fluid.clearLinkCounts(transRec, true);
                });
            }
            var shadow = fluid.shadowForComponent(that);
            shadow.modelComplete = true; // technically this is a little early, but this flag is only read in fluid.connectModelRelay
        });

        transac.commit(); // committing one representative transaction will commit them all
    };

    // This modelComponent has now concluded initialisation - commit its initialisation transaction if it is the last such in the wave
    fluid.deenlistModelComponent = function (that) {
        var instantiator = fluid.getInstantiator(that);
        var mrec = instantiator.modelTransactions.init;
        if (!mrec[that.id]) { // avoid double evaluation through currently hacked "members" implementation
            return;
        }
        that.model = undefined; // Abuse of the ginger system - in fact it is "currently in evaluation" - we need to return a proper initial model value even if no init occurred yet
        mrec[that.id].complete = true; // flag means - "complete as in ready to participate in this transaction"
        var incomplete = fluid.find_if(mrec, function (recel) {
            return recel.complete !== true;
        });
        if (!incomplete) {
            fluid.operateInitialTransaction(instantiator, mrec);
            // NB: Don't call fluid.concludeTransaction since "init" is not a standard record - this occurs in commitRelays for the corresponding genuine record as usual
            instantiator.modelTransactions.init = {};
        }
    };

    fluid.transformToAdapter = function (transform, targetPath) {
        var basedTransform = {};
        basedTransform[targetPath] = transform;
        return function (trans, newValue /*, sourceSegs, targetSegs */) {
            // TODO: More efficient model that can only run invalidated portion of transform (need to access changeMap of source transaction)
            fluid.model.transformWithRules(newValue, basedTransform, {finalApplier: trans});
        };
    };

    fluid.parseModelReference = function (that, ref) {
        var parsed = fluid.parseContextReference(ref);
        parsed.segs = that.applier.parseEL(parsed.path);
        return parsed;
    };

    fluid.parseValidModelReference = function (that, name, ref) {
        var reject = function (message) {
            fluid.fail("Error in " + name + ": " + ref + message);
        };
        var parsed, target;
        if (ref.charAt(0) === "{") {
            parsed = fluid.parseModelReference(that, ref);
            if (parsed.segs[0] !== "model") {
                reject(" must be a reference into a component model beginning with \"model\"");
            } else {
                parsed.modelSegs = parsed.segs.slice(1);
                delete parsed.path;
            }
            target = fluid.resolveContext(parsed.context, that);
            if (!target) {
                reject(" must be a reference to an existing component");
            }
        } else {
            target = that;
            parsed = {
                path: ref,
                modelSegs: that.applier.parseEL(ref)
            };
        }
        if (!target.applier) {
            fluid.getForComponent(target, ["applier"]);
        }
        if (!target.applier) {
            reject(" must be a reference to a component with a ChangeApplier (descended from fluid.modelComponent)");
        }
        parsed.that = target;
        parsed.applier = target.applier;
        if (!parsed.path) { // ChangeToApplicable amongst others rely on this
            parsed.path = target.applier.composeSegments.apply(null, parsed.modelSegs);
        }
        return parsed;
    };

    // Gets global record for a particular transaction id - looks up applier id to transaction,
    // as well as looking up source id (linkId in below) to count/true
    fluid.getModelTransactionRec = function (instantiator, transId) {
        if (!transId) {
            fluid.fail("Cannot get transaction record without transaction id");
        }
        if (!instantiator) {
            return null;
        }
        var transRec = instantiator.modelTransactions[transId];
        if (!transRec) {
            transRec = instantiator.modelTransactions[transId] = {
                externalChanges: {} // index by applierId to changePath to listener record
            };
        }
        return transRec;
    };

    fluid.recordChangeListener = function (component, applier, sourceListener) {
        var shadow = fluid.shadowForComponent(component);
        fluid.recordListener(applier.modelChanged, sourceListener, shadow);
    };
    
    // Configure this parameter to tweak the number of relays the model will attempt per transaction before bailing out with an error
    fluid.relayRecursionBailout = 100;

    // Used with various arg combinations from different sources. For standard "implicit relay" or fully lensed relay,
    // the first 4 args will be set, and "options" will be empty

    // For a model-dependent relay, this will be used in two halves - firstly, all of the model
    // sources will bind to the relay transform document itself. In this case the argument "targetApplier" within "options" will be set.
    // In this case, the component known as "target" is really the source - it is a component reference discovered by parsing the
    // relay document.

    // Secondly, the relay itself will schedule an invalidation (as if receiving change to "*" of its source - which may in most
    // cases actually be empty) and play through its transducer. "Source" component itself is never empty, since it is used for listener
    // degistration on destruction (check this is correct for external model relay). However, "sourceSegs" may be empty in the case
    // there is no "source" component registered for the link. This change is played in a "half-transactional" way - that is, we wait
    // for all other changes in the system to settle before playing the relay document, in order to minimise the chances of multiple
    // firing and corruption. This is done via the "preCommit" hook registered at top level in establishModelRelay. This listener
    // is transactional but it does not require the transaction to conclude in order to fire - it may be reused as many times as
    // required within the "overall" transaction whilst genuine (external) changes continue to arrive.

    fluid.registerDirectChangeRelay = function (target, targetSegs, source, sourceSegs, linkId, transducer, options) {
        var instantiator = fluid.getInstantiator(target);
        var targetApplier = options.targetApplier || target.applier; // implies the target is a relay document
        var sourceApplier = options.sourceApplier || source.applier; // implies the source is a relay document - listener will be transactional
        var applierId = targetApplier.applierId;
        targetSegs = fluid.makeArray(targetSegs);
        sourceSegs = sourceSegs ? fluid.makeArray(sourceSegs) : sourceSegs; // take copies since originals will be trashed
        var sourceListener = function (newValue, oldValue, path, changeRequest, trans, applier) {
            var transId = trans.id;
            var transRec = fluid.getModelTransactionRec(instantiator, transId);
            if (applier && trans && !transRec[applier.applierId]) { // don't trash existing record which may contain "options" (FLUID-5397)
                transRec[applier.applierId] = {transaction: trans}; // enlist the outer user's original transaction
            }
            var existing = transRec[applierId];
            transRec[linkId] = transRec[linkId] || 0;
            // Crude "oscillation prevention" system limits each link to maximum of 2 operations per cycle (presumably in opposite directions)
            var relay = true; // TODO: See FLUID-5303 - we currently disable this check entirely to solve FLUID-5293 - perhaps we might remove link counts entirely
            if (relay) {
                ++transRec[linkId];
                if (transRec[linkId] > fluid.relayRecursionBailout) {
                    fluid.fail("Error in model relay specification at component ", target, " - operated more than " + fluid.relayRecursionBailout + " relays without model value settling - current model contents are ", trans.newHolder.model);
                }
                if (!existing) {
                    var newTrans = targetApplier.initiate("relay", transId); // non-top-level transaction will defeat postCommit
                    existing = transRec[applierId] = {transaction: newTrans, relayCount: 0, options: options};
                }
                if (transducer && !options.targetApplier) {
                    // TODO: This is just for safety but is still unusual and now abused. The transducer doesn't need the "newValue" since all the transform information
                    // has been baked into the transform document itself. However, we now rely on this special signalling value to make sure we regenerate transforms in 
                    // the "forwardAdapter"
                    transducer(existing.transaction, options.sourceApplier ? undefined : newValue, sourceSegs, targetSegs);
                } else if (newValue !== undefined) {
                    existing.transaction.fireChangeRequest({type: "ADD", segs: targetSegs, value: newValue});
                }
            }
        };
        sourceListener.relayListenerId = fluid.allocateGuid();
        if (sourceSegs) {
            fluid.log(fluid.logLevel.TRACE, "Adding relay listener with id " + sourceListener.relayListenerId + " to source applier with id " +
                sourceApplier.applierId + " from target applier with id " + applierId + " for target component with id " + target.id);
            sourceApplier.modelChanged.addListener({
                isRelay: true,
                segs: sourceSegs,
                transactional: options.transactional
            }, sourceListener);
        }
        if (source) { // TODO - we actually may require to register on THREE sources in the case modelRelay is attached to a
            // component which is neither source nor target. Note there will be problems if source, say, is destroyed and recreated,
            // and holder is not - relay will in that case be lost. Need to integrate relay expressions with IoCSS.
            fluid.recordChangeListener(source, sourceApplier, sourceListener);
            if (target !== source) {
                fluid.recordChangeListener(target, sourceApplier, sourceListener);
            }
        }
    };

    // When called during parsing a contextualised model relay document, these arguments are reversed - "source" refers to the
    // current component, and "target" refers successively to the various "source" components.
    // "options" will be transformPackage
    fluid.connectModelRelay = function (source, sourceSegs, target, targetSegs, options) {
        var linkId = fluid.allocateGuid();
        function enlistComponent(component) {
            var enlist = fluid.enlistModelComponent(component);

            if (enlist.complete) {
                var shadow = fluid.shadowForComponent(component);
                if (shadow.modelComplete) {
                    enlist.completeOnInit = true;
                }
            }
        }
        enlistComponent(target);
        enlistComponent(source); // role of "source" and "target" may have been swapped in a modelRelay document

        if (options.update) { // it is a call via parseImplicitRelay for a relay document
            if (options.targetApplier) {
                // register changes from the model onto changes to the model relay document
                fluid.registerDirectChangeRelay(source, sourceSegs, target, targetSegs, linkId, null, {
                    transactional: false,
                    targetApplier: options.targetApplier,
                    update: options.update
                });
            } else {
                // if parsing a contextualised MR, skip the "orthogonal" registration - instead
                // register the "half-transactional" listener which binds changes from the relay itself onto the target
                fluid.registerDirectChangeRelay(target, targetSegs, source, [], linkId+"-transform", options.forwardAdapter, {transactional: true, sourceApplier: options.forwardApplier});
            }
        } else { // more efficient branch where relay is uncontextualised
            fluid.registerDirectChangeRelay(target, targetSegs, source, sourceSegs, linkId, options.forwardAdapter, {transactional: false});
            if (sourceSegs) {
                fluid.registerDirectChangeRelay(source, sourceSegs, target, targetSegs, linkId, options.backwardAdapter, {transactional: false});
            }
        }
    };

    fluid.model.guardedAdapter = function (componentThat, cond, func, args) {
        // TODO: We can't use fluid.isModelComplete here because of the broken half-transactional system - it may appear that model has arrived halfway through init transaction
        var instantiator = fluid.getInstantiator(componentThat);
        var enlist = instantiator.modelTransactions.init[componentThat.id];
        var condValue = cond[enlist ? "init" : "live"];
        if (condValue) {
            func.apply(null, args);
        }
    };

    fluid.makeTransformPackage = function (componentThat, transform, sourcePath, targetPath, forwardCond, backwardCond) {
        var that = {
            forwardHolder: {model: transform},
            backwardHolder: {model: null}
        };
        that.generateAdapters = function (trans) {
            // can't commit "half-transaction" or events will fire - violate encapsulation in this way
            that.forwardAdapterImpl = fluid.transformToAdapter(trans ? trans.newHolder.model : that.forwardHolder.model, targetPath);
            if (sourcePath !== null) {
                that.backwardHolder.model = fluid.model.transform.invertConfiguration(transform);
                that.backwardAdapterImpl = fluid.transformToAdapter(that.backwardHolder.model, sourcePath);
            }
        };
        that.forwardAdapter = function (transaction, newValue) { // create a stable function reference for this possibly changing adapter
            if (newValue === undefined) {
                that.generateAdapters(); // TODO: Quick fix for incorrect scheduling of invalidation/transducing
                // "it so happens" that fluid.registerDirectChangeRelay invokes us with empty newValue in the case of invalidation -> transduction
            }
            fluid.model.guardedAdapter(componentThat, forwardCond, that.forwardAdapterImpl, arguments);
        };
        // fired from fluid.model.updateRelays via invalidator event
        that.runTransform = function (trans) {
            trans.commit(); // this will reach the special "half-transactional listener" registered in fluid.connectModelRelay,
            // branch with options.targetApplier - by committing the transaction, we update the relay document in bulk and then cause
            // it to execute (via "transducer")
            trans.reset();
        };
        that.forwardApplier = fluid.makeHolderChangeApplier(that.forwardHolder);
        that.forwardApplier.isRelayApplier = true; // special annotation so these can be discovered in the transaction record
        that.invalidator = fluid.makeEventFirer({name: "Invalidator for model relay with applier " + that.forwardApplier.applierId});
        if (sourcePath !== null) {
            that.backwardApplier = fluid.makeHolderChangeApplier(that.backwardHolder);
            that.backwardAdapter = function () {
                fluid.model.guardedAdapter(componentThat, backwardCond, that.backwardAdapterImpl, arguments);
            };
        }
        that.update = that.invalidator.fire; // necessary so that both routes to fluid.connectModelRelay from here hit the first branch
        var implicitOptions = {
            targetApplier: that.forwardApplier, // this special field identifies us to fluid.connectModelRelay
            update: that.update,
            refCount: 0
        };
        that.forwardHolder.model = fluid.parseImplicitRelay(componentThat, transform, [], implicitOptions);
        that.refCount = implicitOptions.refCount;
        that.generateAdapters();
        that.invalidator.addListener(that.generateAdapters);
        that.invalidator.addListener(that.runTransform);
        return that;
    };

    fluid.singleTransformToFull = function (singleTransform) {
        var withPath = $.extend(true, {valuePath: ""}, singleTransform);
        return {
            "": {
                transform: withPath
            }
        };
    };

    fluid.model.relayConditions = {
        initOnly: {init: true,  live: false},
        liveOnly: {init: false, live: true},
        never:    {init: false, live: false},
        always:   {init: true,  live: true}
    };

    fluid.model.parseRelayCondition = function (condition) {
        return fluid.model.relayConditions[condition || "always"];
    };

    fluid.parseModelRelay = function (that, mrrec) {
        var parsedSource = mrrec.source ? fluid.parseValidModelReference(that, "modelRelay record member \"source\"", mrrec.source) :
            {path: null, modelSegs: null};
        var parsedTarget = fluid.parseValidModelReference(that, "modelRelay record member \"target\"", mrrec.target);

        var transform = mrrec.singleTransform ? fluid.singleTransformToFull(mrrec.singleTransform) : mrrec.transform;
        if (!transform) {
            fluid.fail("Cannot parse modelRelay record without element \"singleTransform\" or \"transform\":", mrrec);
        }
        var forwardCond = fluid.model.parseRelayCondition(mrrec.forward), backwardCond = fluid.model.parseRelayCondition(mrrec.backward);
        var transformPackage = fluid.makeTransformPackage(that, transform, parsedSource.path, parsedTarget.path, forwardCond, backwardCond);
        if (transformPackage.refCount === 0) {
            // This first call binds changes emitted from the relay ends to each other, synchronously
            fluid.connectModelRelay(parsedSource.that || that, parsedSource.modelSegs, parsedTarget.that, parsedTarget.modelSegs, {
                forwardAdapter: transformPackage.forwardAdapter,
                backwardAdapter: transformPackage.backwardAdapter
            });
        } else {
            // This second call binds changes emitted from the relay document itself onto the relay ends (using the "half-transactional system")
            fluid.connectModelRelay(parsedSource.that || that, parsedSource.modelSegs, parsedTarget.that, parsedTarget.modelSegs, transformPackage);
        }
    };

    fluid.parseImplicitRelay = function (that, modelRec, segs, options) {
        var value;
        if (typeof(modelRec) === "string" && modelRec.charAt(0) === "{") {
            var parsed = fluid.parseModelReference(that, modelRec);
            var target = fluid.resolveContext(parsed.context, that);
            if (parsed.segs[0] === "model") {
                var modelSegs = parsed.segs.slice(1);
                ++options.refCount;
                fluid.connectModelRelay(that, segs, target, modelSegs, options);
            } else {
                value = fluid.getForComponent(target, parsed.segs);
            }
        } else if (fluid.isPrimitive(modelRec) || !fluid.isPlainObject(modelRec)) {
            value = modelRec;
        } else if (modelRec.expander && fluid.isPlainObject(modelRec.expander)) {
            value = fluid.expandOptions(modelRec, that);
        } else {
            value = fluid.freshContainer(modelRec);
            fluid.each(modelRec, function (innerValue, key) {
                segs.push(key);
                var innerTrans = fluid.parseImplicitRelay(that, innerValue, segs, options);
                if (innerTrans !== undefined) {
                    value[key] = innerTrans;
                }
                segs.pop();
            });
        }
        return value;
    };


    // Conclude the transaction by firing to all external listeners in priority order
    fluid.model.notifyExternal = function (transRec) {
        var allChanges = transRec ? fluid.values(transRec.externalChanges) : [];
        fluid.sortByPriority(allChanges);
        for (var i = 0; i < allChanges.length; ++ i) {
            var change = allChanges[i];
            var targetApplier = change.args[5]; // NOTE: This argument gets here via fluid.model.storeExternalChange from fluid.notifyModelChanges
            if (!targetApplier.destroyed) { // 3rd point of guarding for FLUID-5592
                change.listener.apply(null, change.args);
            }
        }
        fluid.clearLinkCounts(transRec, true); // "options" structures for relayCount are aliased
    };

    fluid.model.commitRelays = function (instantiator, transactionId) {
        var transRec = instantiator.modelTransactions[transactionId];
        fluid.each(transRec, function (transEl) {
        // EXPLAIN: This must commit ALL current transactions, not just those for relays - why?
            if (transEl.transaction) { // some entries are links
                transEl.transaction.commit("relay");
                transEl.transaction.reset();
            }
        });
    };

    fluid.model.updateRelays = function (instantiator, transactionId) {
        var transRec = instantiator.modelTransactions[transactionId];
        var updates = 0;
        fluid.each(transRec, function (transEl) {
            // TODO: integrate the "source" if any into this computation, and fire the relay if it has changed - perhaps by adding a listener
            // to it that updates changeRecord.changes (assuming we can find it)
            if (transEl.options && transEl.transaction && transEl.transaction.changeRecord.changes > 0 && transEl.relayCount < 2 && transEl.options.update) {
                transEl.relayCount++;
                fluid.clearLinkCounts(transRec);
                transEl.options.update(transEl.transaction, transRec);
                ++updates;
            }
        });
        return updates;
    };

    fluid.establishModelRelay = function (that, optionsModel, optionsML, optionsMR, applier) {
        fluid.mergeModelListeners(that, optionsML);

        var enlist = fluid.enlistModelComponent(that);
        fluid.each(optionsMR, function (mrrec) {
            fluid.parseModelRelay(that, mrrec);
        });

        var initModels = fluid.transform(optionsModel, function (modelRec) {
            return fluid.parseImplicitRelay(that, modelRec, [], {refCount: 0});
        });
        enlist.initModels = initModels;

        var instantiator = fluid.getInstantiator(that);

        function updateRelays(transaction) {
            while (fluid.model.updateRelays(instantiator, transaction.id) > 0){}
        }

        function commitRelays(transaction, applier, code) {
            if (code !== "relay") { // don't commit relays if this commit is already a relay commit
                fluid.model.commitRelays(instantiator, transaction.id);
            }
        }

        function concludeTransaction(transaction, applier, code) {
            if (code !== "relay") {
                fluid.model.notifyExternal(instantiator.modelTransactions[transaction.id]);
                delete instantiator.modelTransactions[transaction.id];
            }
        }

        applier.preCommit.addListener(updateRelays);
        applier.preCommit.addListener(commitRelays);
        applier.postCommit.addListener(concludeTransaction);
        
        return null;
    };

    // supported, PUBLIC API grade
    fluid.defaults("fluid.modelComponent", {
        gradeNames: ["fluid.component"],
        changeApplierOptions: {
            relayStyle: true,
            cullUnchanged: true
        },
        members: {
            model: "@expand:fluid.initRelayModel({that}, {that}.modelRelay)",
            applier: "@expand:fluid.makeHolderChangeApplier({that}, {that}.options.changeApplierOptions)",
            modelRelay: "@expand:fluid.establishModelRelay({that}, {that}.options.model, {that}.options.modelListeners, {that}.options.modelRelay, {that}.applier)"
        },
        mergePolicy: {
            model: {
                noexpand: true,
                func: fluid.arrayConcatPolicy // TODO: bug here in case a model consists of an array
            },
            modelListeners: fluid.makeMergeListenersPolicy(fluid.arrayConcatPolicy),
            modelRelay: {
                noexpand: true,
                func: fluid.arrayConcatPolicy
            }
        }
    });

    fluid.modelChangedToChange = function (args) {
        return {
            value: args[0],
            oldValue: args[1],
            path: args[2]
        };
    };

    fluid.resolveModelListener = function (that, record) {
        var togo = function () {
            if (fluid.isDestroyed(that)) { // first guarding point to resolve FLUID-5592
                return;
            }
            var change = fluid.modelChangedToChange(arguments);
            var args = [change];
            var localRecord = {change: change, "arguments": args};
            if (record.args) {
                args = fluid.expandOptions(record.args, that, {}, localRecord);
            }
            fluid.event.invokeListener(record.listener, fluid.makeArray(args));
        };
        fluid.event.impersonateListener(record.listener, togo);
        return togo;
    };

    fluid.mergeModelListeners = function (that, listeners) {
        var listenerCount = 0;
        fluid.each(listeners, function (value, path) {
            if (typeof(value) === "string") {
                value = {
                    funcName: value
                };
            }
            var records = fluid.event.resolveListenerRecord(value, that, "modelListeners", null, false);
            var parsed = fluid.parseValidModelReference(that, "modelListeners entry", path);
            // Bypass fluid.event.dispatchListener by means of "standard = false" and enter our custom workflow including expanding "change":
            fluid.each(records.records, function (record) {
                var func = fluid.resolveModelListener(that, record);
                var spec = {
                    listener: func, // for initModelEvent
                    listenerIndex: listenerCount,
                    segs: parsed.modelSegs,
                    path: parsed.path,
                    includeSource: record.includeSource,
                    excludeSource: record.excludeSource,
                    priority: record.priority,
                    transactional: true
                };
                ++listenerCount;
                 // update "spec" so that we parse priority information just once
                spec = parsed.applier.modelChanged.addListener(spec, func, record.namespace, record.softNamespace);

                fluid.recordChangeListener(that, parsed.applier, func);
                function initModelEvent() {
                    if (fluid.isModelComplete(parsed.that)) {
                        var trans = parsed.applier.initiate("init");
                        fluid.initModelEvent(that, parsed.applier, trans, [spec]);
                        trans.commit();
                    }
                }
                if (that !== parsed.that && !fluid.isModelComplete(that)) { // TODO: Use FLUID-4883 "latched events" when available
                    // Don't confuse the end user by firing their listener before the component is constructed
                    // TODO: Better detection than this is requred - we assume that the target component will not be discovered as part
                    // of the initial transaction wave, but if it is, it will get a double notification - we really need "wave of explosions"
                    // since we are currently too early in initialisation of THIS component in order to tell if other will be found
                    // independently.
                    var onCreate = fluid.getForComponent(that, ["events", "onCreate"]);
                    onCreate.addListener(initModelEvent);
                }
            });
        });
    };


    /** CHANGE APPLIER **/

    /** Add a listener to a ChangeApplier event that only acts in the case the event
     * has not come from the specified source (typically ourself)
     * @param modelEvent An model event held by a changeApplier (typically applier.modelChanged)
     * @param path The path specification to listen to
     * @param source The source value to exclude (direct equality used)
     * @param func The listener to be notified of a change
     * @param [eventName] - optional - the event name to be listened to - defaults to "modelChanged"
     * @param [namespace] - optional - the event namespace
     */
     // TODO: Source guarding is not supported by the current ChangeApplier, these methods are no-ops
    fluid.addSourceGuardedListener = function(applier, path, source, func, eventName, namespace, softNamespace) {
        eventName = eventName || "modelChanged";
        var wrapped = function (newValue, oldValue, path, changes) { // TODO: adapt signature
            if (!applier.hasChangeSource(source, changes)) {
                return func.apply(null, arguments);
            }
        };
        fluid.event.impersonateListener(func, wrapped);
        return applier[eventName].addListener(path, wrapped, namespace, softNamespace);
    };

    /** Convenience method to fire a change event to a specified applier, including
     * a supplied "source" identified (perhaps for use with addSourceGuardedListener)
     */
    fluid.fireSourcedChange = function (applier, path, value, source) {
        applier.fireChangeRequest({
            path: path,
            value: value,
            source: source
        });
    };

    /** Dispatches a list of changes to the supplied applier */
    fluid.requestChanges = function (applier, changes) {
        for (var i = 0; i < changes.length; ++i) {
            applier.fireChangeRequest(changes[i]);
        }
    };


    // Automatically adapts requestChange onto fireChangeRequest
    fluid.bindRequestChange = function (that) {
        // The name "requestChange" will be deprecated in 1.5, removed in 2.0
        that.requestChange = that.change = function (path, value, type) {
            var changeRequest = {
                path: path,
                value: value,
                type: type
            };
            that.fireChangeRequest(changeRequest);
        };
    };

    fluid.identifyChangeListener = function (listener) {
        return fluid.event.identifyListener(listener) || listener;
    };


    fluid.model.isChangedPath = function (changeMap, segs) {
        for (var i = 0; i <= segs.length; ++ i) {
            if (typeof(changeMap) === "string") {
                return true;
            }
            if (i < segs.length && changeMap) {
                changeMap = changeMap[segs[i]];
            }
        }
        return false;
    };

    fluid.model.setChangedPath = function (options, segs, value) {
        var notePath = function (record) {
            segs.unshift(record);
            fluid.model.setSimple(options, segs, value);
            segs.shift();
        };
        if (!fluid.model.isChangedPath(options.changeMap, segs)) {
            ++options.changes;
            notePath("changeMap");
        }
        if (!fluid.model.isChangedPath(options.deltaMap, segs)) {
            ++options.deltas;
            notePath("deltaMap");
        }
    };

    fluid.model.fetchChangeChildren = function (target, i, segs, source, options) {
        fluid.each(source, function (value, key) {
            segs[i] = key;
            fluid.model.applyChangeStrategy(target, key, i, segs, value, options);
            segs.length = i;
        });
    };

    // Called with two primitives which are compared for equality. This takes account of "floating point slop" to avoid
    // continuing to propagate inverted values as changes
    // TODO: replace with a pluggable implementation
    fluid.model.isSameValue = function (a, b) {
        if (typeof(a) !== "number" || typeof(b) !== "number") {
            return a === b;
        } else {
            // Don't use isNaN because of https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/isNaN#Confusing_special-case_behavior
            if (a === b || a !== a && b !== b) { // Either the same concrete number or both NaN
                return true;
            } else {
                var relError = Math.abs((a - b) / b);
                return relError < 1e-12; // 64-bit floats have approx 16 digits accuracy, this should deal with most reasonable transforms
            }
        }
    };

    fluid.model.applyChangeStrategy = function (target, name, i, segs, source, options) {
        var targetSlot = target[name];
        var sourceCode = fluid.typeCode(source);
        var targetCode = fluid.typeCode(targetSlot);
        var changedValue = fluid.NO_VALUE;
        if (sourceCode === "primitive") {
            if (!fluid.model.isSameValue(targetSlot, source)) {
                changedValue = source;
                ++options.unchanged;
            }
        } else if (targetCode !== sourceCode || sourceCode === "array" && source.length !== targetSlot.length) {
            // RH is not primitive - array or object and mismatching or any array rewrite
            changedValue = fluid.freshContainer(source);
        }
        if (changedValue !== fluid.NO_VALUE) {
            target[name] = changedValue;
            if (options.changeMap) {
                fluid.model.setChangedPath(options, segs, options.inverse ? "DELETE" : "ADD");
            }
        }
        if (sourceCode !== "primitive") {
            fluid.model.fetchChangeChildren(target[name], i + 1, segs, source, options);
        }
    };

    fluid.model.stepTargetAccess = function (target, type, segs, startpos, endpos, options) {
        for (var i = startpos; i < endpos; ++ i) {
            if (!target) {
                continue;
            }
            var oldTrunk = target[segs[i]];
            target = fluid.model.traverseWithStrategy(target, segs, i, options[type === "ADD" ? "resolverSetConfig" : "resolverGetConfig"],
                segs.length - i - 1);
            if (oldTrunk !== target && options.changeMap) {
                fluid.model.setChangedPath(options, segs.slice(0, i + 1), "ADD");
            }
        }
        return {root: target, last: segs[endpos]};
    };

    fluid.model.defaultAccessorConfig = function (options) {
        options = options || {};
        options.resolverSetConfig = options.resolverSetConfig || fluid.model.escapedSetConfig;
        options.resolverGetConfig = options.resolverGetConfig || fluid.model.escapedGetConfig;
        return options;
    };

    // Changes: "MERGE" action abolished
    // ADD/DELETE at root can be destructive
    // changes tracked in optional final argument holding "changeMap: {}, changes: 0, unchanged: 0"
    fluid.model.applyHolderChangeRequest = function (holder, request, options) {
        options = fluid.model.defaultAccessorConfig(options);
        options.deltaMap = options.changeMap ? {} : null;
        options.deltas = 0;
        var length = request.segs.length;
        var pen, atRoot = length === 0;
        if (atRoot) {
            pen = {root: holder, last: "model"};
        } else {
            if (!holder.model) {
                holder.model = {};
                fluid.model.setChangedPath(options, [], options.inverse ? "DELETE" : "ADD");
            }
            pen = fluid.model.stepTargetAccess(holder.model, request.type, request.segs, 0, length - 1, options);
        }
        if (request.type === "ADD") {
            var value = request.value;
            var segs = fluid.makeArray(request.segs);
            fluid.model.applyChangeStrategy(pen.root, pen.last, length - 1, segs, value, options, atRoot);
        } else if (request.type === "DELETE") {
            if (pen.root && pen.root[pen.last] !== undefined) {
                delete pen.root[pen.last];
                if (options.changeMap) {
                    fluid.model.setChangedPath(options, request.segs, "DELETE");
                }
            }
        } else {
            fluid.fail("Unrecognised change type of " + request.type);
        }
        return options.deltas ? options.deltaMap : null;
    };
    
    /** Compare two models for equality using a deep algorithm. It is assumed that both models are JSON-equivalent and do
     * not contain circular links.
     * @param modela The first model to be compared
     * @param modelb The second model to be compared
     * @param options {Object} If supplied, will receive a map and summary of the change content between the objects. Structure is:
     *     changeMap: {Object/String} An isomorphic map of the object structures to values "ADD" or "DELETE" indicating
     * that values have been added/removed at that location. Note that in the case the object structure differs at the root, <code>changeMap</code> will hold
     * the plain String value "ADD" or "DELETE"
     *     changes: {Integer} Counts the number of changes between the objects - The two objects are identical iff <code>changes === 0</code>.
     *     unchanged: {Integer} Counts the number of leaf (primitive) values at which the two objects are identical. Note that the current implementation will
     * double-count, this summary should be considered indicative rather than precise.
     * @return <code>true</code> if the models are identical
     */
    // TODO: This algorithm is quite inefficient in that both models will be copied once each
    // supported, PUBLIC API function
    fluid.model.diff = function (modela, modelb, options) {
        options = options || {changes: 0, unchanged: 0, changeMap: {}}; // current algorithm can't avoid the expense of changeMap
        var typea = fluid.typeCode(modela);
        var typeb = fluid.typeCode(modelb);
        var togo;
        if (typea === "primitive" && typeb === "primitive") {
            togo = fluid.model.isSameValue(modela, modelb);
        } else if (typea === "primitive" ^ typeb === "primitive") {
            togo = false;
        } else {
            // Apply both forward and reverse changes - if no changes either way, models are identical
            // "ADD" reported in the reverse direction must be accounted as a "DELETE"
            var holdera = {
                model: fluid.copy(modela)
            };
            fluid.model.applyHolderChangeRequest(holdera, {value: modelb, segs: [], type: "ADD"}, options);
            var holderb = {
                model: fluid.copy(modelb)
            };
            options.inverse = true;
            fluid.model.applyHolderChangeRequest(holderb, {value: modela, segs: [], type: "ADD"}, options);
            togo = options.changes === 0;
        }
        if (togo === false && options.changes === 0) { // catch all primitive cases
            options.changes = 1;
            options.changeMap = modelb === undefined ? "DELETE" : "ADD";
        } else if (togo === true && options.unchanged === 0) {
            options.unchanged = 1;
        }
        return togo;
    };

    // Here we only support for now very simple expressions which have at most one
    // wildcard which must appear in the final segment
    fluid.matchChanges = function (changeMap, specSegs, newHolder) {
        var root = newHolder.model;
        var map = changeMap;
        var outSegs = ["model"];
        var wildcard = false;
        var togo = [];
        for (var i = 0; i < specSegs.length; ++ i) {
            var seg = specSegs[i];
            if (seg === "*") {
                if (i === specSegs.length - 1) {
                    wildcard = true;
                } else {
                    fluid.fail("Wildcard specification in modelChanged listener is only supported for the final path segment: " + specSegs.join("."));
                }
            } else {
                outSegs.push(seg);
                map = fluid.isPrimitive(map) ? map : map[seg];
                root = root ? root[seg] : undefined;
            }
        }
        if (map) {
            if (wildcard) {
                fluid.each(root, function (value, key) {
                    togo.push(outSegs.concat(key));
                });
            } else {
                togo.push(outSegs);
            }
        }
        return togo;
    };

    fluid.storeExternalChange = function (transRec, applier, invalidPath, spec, args) {
        var pathString = applier.composeSegments.apply(null, invalidPath);
        var keySegs = [applier.applierId, fluid.event.identifyListener(spec.listener), spec.listenerIndex, pathString];
        var keyString = keySegs.join("|");
        // These are unbottled in fluid.concludeTransaction
        transRec.externalChanges[keyString] = {listener: spec.listener, priority: spec.priority, args: args};
    };
    
    fluid.isExcludedChangeSource = function (transaction, spec) {
        if (!spec.excludeSource) { // mergeModelListeners initModelEvent fabricates a fake spec that bypasses processing
            return false;
        }
        var excluded = spec.excludeSource["*"];
        for (var source in transaction.sources) {
            if (spec.excludeSource[source]) {
                excluded = true;
            }
            if (spec.includeSource[source]) {
                excluded = false;
            }
        }
        return excluded;
    };

    fluid.notifyModelChanges = function (listeners, changeMap, newHolder, oldHolder, changeRequest, transaction, applier, that) {
        var instantiator = fluid.getInstantiator && fluid.getInstantiator(that); // may return nothing for non-component holder
        var transRec = transaction && fluid.getModelTransactionRec(instantiator, transaction.id);
        for (var i = 0; i < listeners.length; ++ i) {
            var spec = listeners[i];
            var invalidPaths = fluid.matchChanges(changeMap, spec.segs, newHolder);
            for (var j = 0; j < invalidPaths.length; ++ j) {
                if (applier.destroyed) { // 2nd guarding point for FLUID-5592
                    return;
                }
                var invalidPath = invalidPaths[j];
                spec.listener = fluid.event.resolveListener(spec.listener);
                // TODO: process namespace and softNamespace rules, and propagate "sources" in 4th argument
                var args = [fluid.model.getSimple(newHolder, invalidPath), fluid.model.getSimple(oldHolder, invalidPath), invalidPath.slice(1), changeRequest, transaction, applier];
                // FLUID-5489: Do not notify of null changes which were reported as a result of invalidating a higher path
                // TODO: We can improve greatly on efficiency by i) reporting a special code from fluid.matchChanges which signals the difference between invalidating a higher and lower path,
                // ii) improving fluid.model.diff to create fewer intermediate structures and no copies
                // TODO: The relay invalidation system is broken and must always be notified (branch 1) - since our old/new value detection is based on the wrong (global) timepoints in the transaction here,
                // rather than the "last received model" by the holder of the transform document
                if (!spec.isRelay) {
                    var isNull = fluid.model.diff(args[0], args[1]);
                    if (isNull) {
                        continue;
                    }
                    var sourceExcluded = fluid.isExcludedChangeSource(transaction, spec);
                    if (sourceExcluded) {
                        continue;
                    }
                }
                if (transRec && !spec.isRelay && spec.transactional) { // bottle up genuine external changes so we can sort and dedupe them later
                    fluid.storeExternalChange(transRec, applier, invalidPath, spec, args);
                } else {
                    spec.listener.apply(null, args);
                }
            }
        }
    };

    fluid.bindELMethods = function (applier) {
        applier.parseEL = function (EL) {
            return fluid.model.pathToSegments(EL, applier.options.resolverSetConfig);
        };
        applier.composeSegments = function () {
            return applier.options.resolverSetConfig.parser.compose.apply(null, arguments);
        };
    };

    fluid.initModelEvent = function (that, applier, trans, listeners) {
        fluid.notifyModelChanges(listeners, "ADD", trans.oldHolder, fluid.emptyHolder, null, trans, applier, that);
    };

    fluid.emptyHolder = { model: undefined };
    
    fluid.preFireChangeRequest = function (applier, changeRequest) {
        if (!changeRequest.type) {
            changeRequest.type = "ADD";
        }
        changeRequest.segs = changeRequest.segs || applier.parseEL(changeRequest.path);
    };
    
    fluid.ChangeApplier = function () {};

    fluid.makeHolderChangeApplier = function (holder, options) {
        options = fluid.model.defaultAccessorConfig(options);
        var applierId = fluid.allocateGuid();
        var that = new fluid.ChangeApplier();
        $.extend(that, {
            applierId: applierId,
            holder: holder,
            changeListeners: {
                listeners: [],
                transListeners: []
            },
            options: options,
            modelChanged: {},
            preCommit: fluid.makeEventFirer({name: "preCommit event for ChangeApplier " }),
            postCommit: fluid.makeEventFirer({name: "postCommit event for ChangeApplier "})
        });
        that.destroy = function () {
            that.preCommit.destroy();
            that.postCommit.destroy();
            that.destroyed = true;
        };
        that.modelChanged.addListener = function (spec, listener, namespace, softNamespace) {
            if (typeof(spec) === "string") {
                spec = {path: spec};
            } else {
                spec = fluid.copy(spec);
            }
            spec.id = fluid.event.identifyListener(listener);
            spec.namespace = namespace;
            spec.softNamespace = softNamespace;
            if (typeof(listener) === "string") { // The reason for "globalName" is so that listener names can be resolved on first use and not on registration
                listener = {globalName: listener};
            }
            spec.listener = listener;
            if (spec.transactional !== false) {
                spec.transactional = true;
            }
            spec.segs = spec.segs || that.parseEL(spec.path);
            var collection = that.changeListeners[spec.transactional ? "transListeners" : "listeners"];
            spec.excludeSource = fluid.arrayToHash(fluid.makeArray(spec.excludeSource || (spec.includeSource ? "*" : undefined)));
            spec.includeSource = fluid.arrayToHash(fluid.makeArray(spec.includeSource));
            spec.priority = fluid.parsePriority(spec.priority, collection.length, true, "model listener");
            collection.push(spec);
            return spec;
        };
        that.modelChanged.removeListener = function (listener) {
            var id = fluid.event.identifyListener(listener);
            var namespace = typeof(listener) === "string" ? listener: null;
            var removePred = function (record) {
                return record.id === id || record.namespace === namespace;
            };
            fluid.remove_if(that.changeListeners.listeners, removePred);
            fluid.remove_if(that.changeListeners.transListeners, removePred);
        };
        that.fireChangeRequest = function (changeRequest) {
            var ation = that.initiate();
            ation.fireChangeRequest(changeRequest);
            ation.commit();
        };

        that.initiate = function (source, transactionId) {
            source = source || "local";
            var defeatPost = source === "relay"; // defeatPost is supplied for all non-top-level transactions
            var trans = {
                instanceId: fluid.allocateGuid(), // for debugging only
                id: transactionId || fluid.allocateGuid(),
                sources: {},
                changeRecord: {
                    resolverSetConfig: options.resolverSetConfig, // here to act as "options" in applyHolderChangeRequest
                    resolverGetConfig: options.resolverGetConfig
                },
                reset: function () {
                    trans.oldHolder = holder;
                    trans.newHolder = { model: fluid.copy(holder.model) };
                    trans.changeRecord.changes = 0;
                    trans.changeRecord.unchanged = 0; // just for type consistency - we don't use these values in the ChangeApplier
                    trans.changeRecord.changeMap = {};
                },
                commit: function (code) {
                    that.preCommit.fire(trans, that, code);
                    if (trans.changeRecord.changes > 0) {
                        var oldHolder = {model: holder.model};
                        holder.model = trans.newHolder.model;
                        fluid.notifyModelChanges(that.changeListeners.transListeners, trans.changeRecord.changeMap, holder, oldHolder, null, trans, that, holder);
                    }
                    if (!defeatPost) {
                        that.postCommit.fire(trans, that, code);
                    }
                },
                fireChangeRequest: function (changeRequest) {
                    fluid.preFireChangeRequest(that, changeRequest);
                    changeRequest.transactionId = trans.id;
                    var deltaMap = fluid.model.applyHolderChangeRequest(trans.newHolder, changeRequest, trans.changeRecord);
                    fluid.notifyModelChanges(that.changeListeners.listeners, deltaMap, trans.newHolder, holder, changeRequest, trans, that, holder);
                }
            };
            trans.sources[source] = true;
            trans.reset();
            fluid.bindRequestChange(trans);
            return trans;
        };
        that.hasChangeSource = function (source, changes) { // compatibility for old API
            return changes ? changes[source] : false;
        };

        fluid.bindRequestChange(that);
        fluid.bindELMethods(that);
        return that;
    };

})(jQuery, fluid_2_0_0_beta_1);
;/*
 * Bergson Clocks
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
/*global require, performance*/
var fluid = fluid || require("infusion"),
    berg = fluid.registerNamespace("berg");

(function () {
    "use strict";

    /**
     * Clock is the base grade for all Clocks.
     */
    fluid.defaults("berg.clock", {
        gradeNames: ["fluid.component"],

        freq: 1, // Ticks per second.

        members: {
            /**
             * The clock's current time, in seconds.
             */
            time: 0,

            /**
             * The number of times per second that this clock will tick.
             * This value is not guaranteed to be precise for all clocks.
             */
            freq: "{that}.options.freq",

            /**
             * The duration, in seconds, between ticks.
             * This value is not guaranteed to be precise for all clocks.
             */
            tickDuration: {
                expander: {
                    funcName: "berg.clock.calcTickDuration",
                    args: "{that}.freq"
                }
            }
        },

        invokers: {
            start: "fluid.identity()",
            tick: "fluid.notImplemented()",
            stop: "fluid.identity()"
        },

        events: {
            onTick: null
        },

        listeners: {
            onDestroy: [
                "{that}.stop()"
            ]
        }
    });

    berg.clock.calcTickDuration = function (freq) {
        return 1.0 / freq;
    };

    /**
     * Offline Clock
     *
     * An Offline Clock tracks time relatively
     * (i.e. without reference to a "real" source of time
     * such as the system clock).
     *
     * This clock can be driven manually
     * (perhaps by an offline frame or audio sample renderer)
     * by invoking its tick() method.
     */
    fluid.defaults("berg.clock.offline", {
        gradeNames: ["berg.clock"],

        invokers: {
            tick: {
                funcName: "berg.clock.offline.tick",
                args: ["{that}"]
            }
        }
    });

    berg.clock.offline.tick = function (that) {
        that.time = that.time + that.tickDuration;
        that.events.onTick.fire(that.time, that.freq);
    };


    /**
     * A Realtime Clock tracks time based on actual system time
     * (i.e. performance.now)
     */
    fluid.defaults("berg.clock.realtime", {
        gradeNames: ["berg.clock"],

        members: {
            time: "@expand:berg.clock.realtime.now()"
        },

        invokers: {
            tick: {
                funcName: "berg.clock.realtime.tick",
                args: ["{that}"]
            }
        }
    });

    // TODO: Remove this in favour of a direct call
    // to performance.now() once Safari supports it
    // in Web Workers.
    berg.clock.realtime.now = function () {
        return performance.now() / 1000;
    };

    // Terrible hack to workaround Safari's lack of
    // support for performance.now().
    if (typeof performance === "undefined") {
        berg.clock.realtime.now = function () {
            return Date.now() / 1000;
        };
    }

    berg.clock.realtime.tick = function (that) {
        that.time = berg.clock.realtime.now();
        that.events.onTick.fire(that.time, that.freq);
    };

}());
;/* Bergson Priority Queue
 *
 * Based on Marijn Haverbeke's Binary Heap,
 * published in the 1st edition of Eloquent JavaScript
 * http://eloquentjavascript.net/1st_edition/appendix2.html
 *
 * License: Creative Commons Attribution 3.0 Unported
 * Copyright 2013 Marijn Haverbeke
 * Copyright 2015 Colin Clark
 */
/*global require*/
var fluid = fluid || require("infusion"),
    berg = fluid.registerNamespace("berg");

(function () {
    "use strict";

    fluid.registerNamespace("berg");

    /**
     * Priority Queue
     *
     * Stores elements sorted by their order of priority.
     * This implementation uses a binary heap algorithm in order to
     * efficiently keep items sorted.
     *
     * @return the new queue instance
     */
    berg.priorityQueue = function () {
        var that = {
            items: []
        };

        /**
         * Adds a new item to the queue.
         *
         * @param the item to add
         */
        that.push = function (item) {
            if (!item) {
                return;
            }

            if (item.priority === undefined) {
                throw new Error("An item without a priority cannot be added to the queue.");
            }

            // Add the new element to the end of the array.
            that.items.push(item);
            // Allow it to bubble up.
            that.bubbleUp(that.items.length - 1);
        };

        /**
         * Returns the highest-priority element from the queue.
         * This method will not remove the item from the queue.
         *
         * @return the highest-priority element
         */
        that.peek = function () {
            return that.items[0];
        };

        /**
         * Removes the highest-priority element from the queue and returns it.
         *
         * @return the highest-priority element in the queue
         */
        that.pop = function () {
            // Store the first element so we can return it later.
            var result = that.items[0],
                end = that.items.pop();

            // If there are any elements left, put the end element at the
            // start, and let it sink down.
            if (that.items.length > 0) {
                that.items[0] = end;
                that.sinkDown(0);
            }

            return result;
        };

        /**
         * Removes the specified item from the queue.
         *
         * @param item the item to remove
         */
        that.remove = function (item) {
            var len = that.items.length;
            // To remove a value, we must search through the array to find it.
            for (var i = 0; i < len; i++) {
                if (that.items[i] !== item) {
                    continue;
                }
                // When it is found, the process seen in 'pop' is repeated
                // to fill up the hole.
                var end = that.items.pop();
                // If the element we popped was the one we needed to remove,
                // we're done.
                if (i === len - 1) {
                    break;
                }
                // Otherwise, we replace the removed element with the popped
                // one, and allow it to float up or sink down as appropriate.
                that.items[i] = end;
                that.bubbleUp(i);
                that.sinkDown(i);

                break;
            }
        };

        /**
         * Returns the number of items in the queue.
         *
         * @return the number of items
         */
        that.size = function () {
            return that.items.length;
        };

        /**
         * Clears all items from the queue.
         */
        that.clear = function () {
            that.items.length = 0;
        };

        // Unsupported, non-API method.
        that.bubbleUp = function (n) {
            // Fetch the element that has to be moved.
            var item = that.items[n];

            // When at 0, an element can not go up any further.
            while (n > 0) {
                // Compute the parent element's index, and fetch it.
                var parentN = (n - 1) >> 1,
                    parent = that.items[parentN];
                // If the parent has a lesser score, things are in order and we
                // are done.
                if (parent.priority <= item.priority) {
                    break;
                }

                // Otherwise, swap the parent with the current element and
                // continue.
                that.items[parentN] = item;
                that.items[n] = parent;
                n = parentN;
            }
        };

        // Unsupported, non-API method.
        that.sinkDown = function (n) {
            // Look up the target element and its score.
            var length = that.items.length,
                item = that.items[n],
                child1;

            while (true) {
                // Compute the indices of the child elements.
                var child2N = (n + 1) * 2,
                    child1N = child2N - 1,
                    swap = null; // The new position of the item, if any.

                // If the first child exists (is inside the array)...
                if (child1N < length) {
                    // Look it up and compute its score.
                    child1 = that.items[child1N];

                    // If the score is less than our element's, we need to swap.
                    if (child1.priority < item.priority) {
                        swap = child1N;
                    }
                }

                // Do the same checks for the other child.
                if (child2N < length) {
                    var child2 = that.items[child2N],
                        right = swap === null ? item : child1;

                    if (child2.priority < right.priority) {
                        swap = child2N;
                    }
                }

                // No need to swap further, we are done.
                if (swap === null) {
                    break;
                }

                // Otherwise, swap and continue.
                that.items[n] = that.items[swap];
                that.items[swap] = item;
                n = swap;
            }
        };

        return that;
    };

}());
;/*
 * Bergson postMessage Components
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
/*global require, self*/
var fluid = fluid || require("infusion"),
    berg = fluid.registerNamespace("berg");

(function () {
    "use strict";

    // A function that returns "self",
    // in order to prevent Infusion from chewing it.
    // TODO: Will a mergePolicy address this?
    berg.getGlobalSelf = function () {
        return self;
    };

    fluid.defaults("berg.postMessageSender", {
        gradeNames: ["fluid.component"],

        members: {
            messageTarget: "@expand:berg.getGlobalSelf()"
        },

        invokers: {
            postMessage: "berg.postMessageSender.postMessage({arguments}.0, {arguments}.1, {that}.messageTarget)"
        }
    });

    berg.postMessageSender.postMessage = function (type, args, messageTarget) {
        if (typeof type !== "string") {
            throw new Error("Can't post a message without a message type.");
        }

        var message = {
            type: type,
            args: args
        };

        messageTarget.postMessage(message);
    };


    fluid.defaults("berg.postMessageListener", {
        gradeNames: ["fluid.component"],

        members: {
            messageSource: "@expand:berg.getGlobalSelf()"
        },

        events: {
            onError: null
        },

        listeners: {
            onCreate: [
                "berg.postMessageListener.bind({that})"
            ],

            onError: [
                {
                    namespace: "failOnError",
                    funcName: "fluid.fail"
                }
            ]
        }
    });

    berg.postMessageListener.bind = function (that) {
        that.messageSource.addEventListener("message", function (e) {
            var msg = e.data;

            if (!msg.type) {
                that.events.onError.fire("Received a remote message without a type. " +
                    fluid.prettyPrintJSON(msg));
            }

            var invoker = that[msg.type];
            if (!that.options.invokers[msg.type] || !invoker) {
                that.events.onError.fire("Received a message of type " + msg.type +
                    ", which did not resolve to a component invoker. Invokers: " +
                    fluid.prettyPrintJSON(that.options.invokers));
            }

            var args = fluid.makeArray(msg.args);
            invoker.apply(null, args);
        }, false);
    };

}());
;/*
 * Bergson Scheduler
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
/*global require*/
var fluid = fluid || require("infusion"),
    berg = fluid.registerNamespace("berg");

(function () {
    "use strict";

    /**
     * Scheduler
     *
     * Responsible for scheduling "score event specifications"
     * at defined moments in time.
     *
     * Schedulers are typically driven by a Clock instance.
     *
     * Bergson provides two primary scheduling primitives:
     *  1. "once", which will schedule a one-time event
     *  2. "repeat", which schedules a repeating event
     *
     * Score Event Specifications:
     *
     * One-time events:
     *    {
     *        type: "once",
     *
     *        // a future time in seconds when the callback should be invoked
     *        time: 2,
     *
     *        // a function to invoke at the specified time
     *        callback: function (time, this) {}
     *    }
     *
     * Repeating events:
     *    {
     *        type: "repeat",
     *
     *        // The frequency, in Hz, at which to repeat
     *        freq: 5,
     *
     *        // A future time in seconds at which to start repeating. Defaults to 0.
     *        time: 2,
     *
     *        // A future time in seconds at which to stop. Defaults to Infinity
     *        //(i.e. never stop)
     *        end: 20,
     *
     *        // A function to invoke repeatedly.
     *        callback: callback
     *    }
     *
     * Note: the Bergson scheduler operates a simple "rounding"
     * quantization scheme for changes that are finer-grained
     * than the resolution of its clock. So, for example, if the
     * clock is running at a freq of 1 tick/second, an event scheduled
     * at time 1.5 seconds or less will be invoked at the 1 second tick, while
     * events scheduled at a time greater than half a tick
     * will be invoked at the 2 second tick.
     *
     * The order of events scheduled for the same clock time is indeterminate.
     *
     */
    fluid.defaults("berg.scheduler", {
        gradeNames: ["fluid.modelComponent"],

        members: {
            queue: "@expand:berg.priorityQueue()",

            // By default, we schedule ahead by half a tick's duration.
            lookahead: "@expand:berg.scheduler.calcLookahead({clock})"
        },

        model: {
            timeScale: 1.0
        },

        components: {
            clock: { // Should be supplied by the user.
                type: "berg.clock.offline"
            }
        },

        invokers: {
            /**
             * Starts this scheduler's clock.
             */
            start: "{clock}.start()",

            /**
             * Stops this scheduler's clock.
             */
            stop: "{clock}.stop()",

            /**
             * Causes the scheduler to evaluate its
             * queue of scheduled callback and fire those that
             * are appropriate for the current clock time.
             *
             * This function is invoked automatically when the
             * scheduler's clock fires its onTick event.
             *
             * @param {Number} now - the current clock time, in seconds
             */
            tick: "berg.scheduler.tick({arguments}.0, {that})",

            /**
             * Schedules one or more score event specifications.
             *
             * @param {Object||Array} scoreSpecs - the score event specifications to schedule
             */
            schedule: "berg.scheduler.schedule({arguments}.0, {that})",

            /**
             * Schedules a callback to be fired once at the specified time.
             *
             * @param {Number} time - the time from now, in seconds, to schedule the callback
             * @param {Function} callback - the callback to schedule
             */
            once: "berg.scheduler.once({arguments}.0, {arguments}.1, {that})",

            /**
             * Schedules a callback to be fired repeatedly at the specified frequency.
             *
             * @param {Number} freq - the frequency (per second) to repeat at
             * @param {Function} callback - the callback to schedule
             * @param {Number} time - the time (in seconds) to start repeating at
             * @param {Number} end - the time (in seconds) to stop repeating at; this value is inclusive
             */
            repeat: {
                funcName: "berg.scheduler.repeat",
                args: [
                    "{arguments}.0",
                    "{arguments}.1",
                    "{arguments}.2",
                    "{arguments}.3",
                    "{that}"
                ]
            },

            /**
             * Clears a scheduled event,
             * causing it not to be evaluated by this scheduler
             * if it hasn't already fired or is repeating.
             *
             * @param {Object} eventSpec - the event specification to clear
             */
            clear: "{that}.queue.remove({arguments}.0)",

            /**
             * Clears all scheduled events.
             */
            clearAll: "{that}.queue.clear()",

            /**
             * Scales the scheduled time of all currently and future events.
             *
             * @param {Number} value - the timeScale value (default is 1.0)
             */
            setTimeScale: {
                changePath: "timeScale",
                value: "{arguments}.0"
            },

            // Unsupported, non-API function.
            scheduleEvent: {
                funcName: "berg.scheduler.scheduleEvent",
                args: ["{arguments}.0", "{that}"]
            },

            // Unsupported, non-API function.
            invokeCallback: {
                funcName: "berg.scheduler.invokeCallback",
                args: ["{arguments}.0", "{arguments}.1"]
            }
        },

        modelListeners: {
            timeScale: {
                funcName: "berg.scheduler.scaleEventTimes",
                args: ["{that}.queue", "{change}.value"],
                excludeSource: "init"
            }
        },

        listeners: {
            "{clock}.events.onTick": {
                func: "{scheduler}.tick"
            }
        }
    });

    berg.scheduler.calcLookahead = function (clock) {
        return clock.tickDuration / 2;
    };

    // Unsupported, non-API function.
    berg.scheduler.calcPriority = function (baseTime, timeOffset, timeScale) {
        return baseTime + (timeOffset * timeScale);
    };

    // Unsupported, non-API function.
    berg.scheduler.scaleEventTimes = function (queue, timeScale) {
        for (var i = 0; i < queue.items.length; i++) {
            var item = queue.items[i];
            item.priority = berg.scheduler.calcPriority(item.scheduledAt, item.time, timeScale);
        }
    };

    // Unsupported, non-API function.
    berg.scheduler.expandRepeatingEventSpec = function (now, eventSpec) {
        if (typeof eventSpec.time !== "number") {
            eventSpec.time = 0;
        }
        eventSpec.interval = 1.0 / eventSpec.freq;
        eventSpec.end = typeof eventSpec.end !== "number" ?
            Infinity : eventSpec.end + now;
    };

    // Unsupported, non-API function.
    berg.scheduler.validateEventSpec = function (eventSpec) {
        // TODO: Provide a means to perform implementation-specific validation.
        if (eventSpec.type === "repeat" && typeof eventSpec.freq !== "number") {
            throw new Error("No freq was specified for scheduled event: " +
                fluid.prettyPrintJSON(eventSpec));
        }

        if (typeof eventSpec.time !== "number") {
            throw new Error("No time was specified for scheduled event: " +
                fluid.prettyPrintJSON(eventSpec));
        }
    };

    berg.scheduler.invokeCallback = function (now, scoreEvent) {
        scoreEvent.callback(now, scoreEvent);
    };

    // Unsupported, non-API function.
    berg.scheduler.evaluateScoreEvent = function (now, scoreEvent, that) {
        that.invokeCallback(now, scoreEvent);

        // If it's a repeating event, queue it back up.
        if (scoreEvent.type === "repeat" && scoreEvent.end > now) {
            scoreEvent.priority = berg.scheduler.calcPriority(now, scoreEvent.interval, that.model.timeScale);
            that.queue.push(scoreEvent);
        }
    };

    berg.scheduler.expandEventSpec = function (eventSpec) {
        // TODO: Should we warn on omitted type?
        if (!eventSpec.type) {
            eventSpec.type = "once";
        }

        // Ensure all event specs have IDs (for debugging and complex scheduling cases).
        if (!eventSpec.id) {
            eventSpec.id = fluid.allocateGuid();
        }
    };

    // Unsupported, non-API function.
    berg.scheduler.scheduleEvent = function (eventSpec, that) {
        var now = that.clock.time,
            timeScale = that.model.timeScale;

        berg.scheduler.expandEventSpec(eventSpec);
        if (eventSpec.type === "repeat") {
            berg.scheduler.expandRepeatingEventSpec(now, eventSpec);
        }

        if (typeof eventSpec.scheduledAt !== "number") {
            eventSpec.scheduledAt = now;
        }

        berg.scheduler.validateEventSpec(eventSpec);
        eventSpec.priority = berg.scheduler.calcPriority(now, eventSpec.time, timeScale);

        if (eventSpec.priority <= now) {
            berg.scheduler.evaluateScoreEvent(now, eventSpec, that);
        } else {
            that.queue.push(eventSpec);
        }

        return eventSpec;
    };

    // Unsupported, non-API function.
    berg.scheduler.scheduleEvents = function (eventSpecs, that) {
        eventSpecs.forEach(function (eventSpec) {
            that.scheduleEvent(eventSpec);
        });

        return eventSpecs;
    };

    berg.scheduler.schedule = function (eventSpec, that) {
        return fluid.isArrayable(eventSpec) ?
            berg.scheduler.scheduleEvents(eventSpec, that) :
            that.scheduleEvent(eventSpec);
    };

    berg.scheduler.once = function (time, callback, that) {
        var eventSpec = {
            type: "once",
            time: time,
            callback: callback
        };

        return that.scheduleEvent(eventSpec);
    };

    berg.scheduler.repeat = function (freq, callback, time, end, that) {
        var eventSpec = {
            type: "repeat",
            freq: freq,
            time: time,
            end: end,
            callback: callback
        };

        return that.scheduleEvent(eventSpec);
    };

    berg.scheduler.tick = function (now, that) {
        var next = that.queue.peek();

        // Check to see if this event should fire now
        // (or should have fired earlier!)
        while (next && next.priority <= now + that.lookahead) {
            // Take it out of the queue and invoke its callback.
            that.queue.pop();
            berg.scheduler.evaluateScoreEvent(now, next, that);
            next = that.queue.peek();
        }
    };

}());
;/*
 * Bergson Worker-based Scheduler
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
/*global require*/
var fluid = fluid || require("infusion"),
    berg = fluid.registerNamespace("berg");

(function () {
    "use strict";

    /**
     * A Scheduler that runs in a Web Worker or other environment
     * where it delegates callback invocation to an out-of-thread proxy
     * using postMessage().
     */
    fluid.defaults("berg.scheduler.postMessage", {
        gradeNames: [
            "berg.postMessageListener",
            "berg.postMessageSender",
            "berg.scheduler"
        ],

        invokers: {
            invokeCallback: {
                funcName: "berg.scheduler.postMessage.post",
                args: ["invokeCallback", ["{arguments}.0", "{arguments}.1"], "{that}"]
            }
        }
    });

    // TODO: Apparent Infusion options merging bug.
    // Try with compact invoker syntax or "func",
    // and it will fail due to creating a merged invoker record
    // containing both "funcName" and "func".
    berg.scheduler.postMessage.post = function (type, args, that) {
        that.postMessage(type, args);
    };

    /**
     * A Proxy Scheduler that communicates with  a
     * Web Worker-based PostMessageScheduler via postMessage.
     *
     * The Proxy Scheduler is responsible for maintaining a map
     * of functions by id so that they can be invoked in the current thread.
     */
    fluid.defaults("berg.scheduler.workerProxy", {
        gradeNames: [
            "berg.scheduler",
            "berg.postMessageListener",
            "berg.postMessageSender"
        ],

        scriptPath: "../../dist/bergson-all-worker.js",

        remoteSchedulerOptions: {
            components: {
                clock: {
                    type: "berg.clock.setInterval",
                    options: {
                        freq: 1 / 100 // Tick every 10 ms by default.
                    }
                }
            }
        },

        members: {
            eventSpecMap: {},
            worker: "@expand:berg.scheduler.workerProxy.createWorker({that}.options.scriptPath)",
            messageTarget: "{that}.worker",
            messageSource: "{that}.worker"
        },

        components: {
            clock: {
                type: "berg.clock.offline" // The real clock is in the other universe.
            }
        },

        invokers: {
            start: "{that}.postMessage(start)",
            stop: "{that}.postMessage(stop)",
            tick: "fluid.identity()",
            invokeCallback: "berg.scheduler.workerProxy.invokeCallback({arguments}.0, {arguments}.1, {that})",
            scheduleEvent: "berg.scheduler.workerProxy.scheduleEvent({arguments}.0, {that})",
            clear: "{that}.postMessage(clear, {arguments}.0)",
            clearAll: "{that}.postMessage(clearAll)",
            setTimeScale: "{that}.postMessage(setTimeScale, {arguments}.0)"
        },

        listeners: {
            onCreate: [
                {
                    func: "{that}.postMessage",
                    args: ["create", ["berg.scheduler.postMessage", "{that}.options.remoteSchedulerOptions"]]
                }
            ],

            onDestroy: [
                {
                    this: "{that}.worker",
                    method: "terminate"
                }
            ]
        }
    });

    berg.scheduler.workerProxy.createWorker = function (scriptPath) {
        return new Worker(scriptPath);
    };

    berg.scheduler.workerProxy.invokeCallback = function (now, scoreEventSpecFromWorker, that) {
        var localEventSpec = that.eventSpecMap[scoreEventSpecFromWorker.id],
            callback = localEventSpec.callback;

        if (typeof callback === "function") {
            callback(now, scoreEventSpecFromWorker);
        } else {
            that.events.onError.fire("A callback function was not found for score event: " +
                fluid.prettyPrintJSON(localEventSpec));
        }
    };

    berg.scheduler.workerProxy.makeTransferrableCopy = function (eventSpec) {
        var toTransfer = fluid.copy(eventSpec);
        delete toTransfer.callback; // Functions can't survive the journey to the other universe.

        return toTransfer;
    };

    berg.scheduler.workerProxy.scheduleEvent = function (eventSpec, that) {
        berg.scheduler.expandEventSpec(eventSpec);
        that.eventSpecMap[eventSpec.id] = eventSpec;

        var toTransfer = berg.scheduler.workerProxy.makeTransferrableCopy(eventSpec);
        that.postMessage("scheduleEvent", toTransfer);
    };

}());
;/*
 * Bergson requestAnimationFrame Clock
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
/*global require, requestAnimationFrame, cancelAnimationFrame, performance*/
var fluid = fluid || require("infusion"),
    berg = fluid.registerNamespace("berg");

(function () {
    "use strict";

    /**
     * The RAF Clock is a realtime clock driven by
     * window.requestAnimationFrame()
     */
    fluid.defaults("berg.clock.raf", {
        gradeNames: ["berg.clock.realtime"],

        freq: 60, // This should be overridden by the user
                  // to match the refresh rate of their display.

        members: {
            requestID: null
        },

        invokers: {
            start: {
                funcName: "berg.clock.raf.requestNextTick",
                args: ["{that}"]
            },

            tick: {
                funcName: "berg.clock.raf.tick",
                args: ["{that}"]
            },

            stop: {
                funcName: "berg.clock.raf.stop",
                args: ["{that}"]
            }
        }
    });

    berg.clock.raf.requestNextTick = function (that) {
        that.requestID = requestAnimationFrame(that.tick);
    };

    berg.clock.raf.tick = function (that) {
        berg.clock.raf.requestNextTick(that);

        var now = performance.now() / 1000;
        that.time = now;
        that.events.onTick.fire(now, that.freq);
    };

    berg.clock.raf.stop = function (that) {
        cancelAnimationFrame(that.requestID);
    };

}());
;/*
 * Bergson setInterval Clock
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
/*global require*/
var fluid = fluid || require("infusion"),
    berg = fluid.registerNamespace("berg");

(function () {
    "use strict";

    fluid.defaults("berg.clock.setInterval", {
        gradeNames: ["berg.clock.realtime"],

        freq: 10,

        members: {
            intervalID: null
        },

        invokers: {
            start: {
                funcName: "berg.clock.setInterval.start",
                args: ["{that}"]
            },

            stop: {
                funcName: "berg.clock.setInterval.stop",
                args: ["{that}"]
            }
        }
    });

    berg.clock.setInterval.start = function (that) {
        that.intervalID = setInterval(that.tick, 1000 / that.freq);
    };

    berg.clock.setInterval.stop = function (that) {
        clearInterval(that.intervalID);
    };
}());
;/*
 * Bergson Clock Logger
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
 /*global require*/
var fluid = fluid || require("infusion"),
    berg = fluid.registerNamespace("berg");

(function () {
    "use strict";

    /**
     * Interval Logger logs the interval between ticks over time
     * into a typed array that can be used to analyse the realtime
     * performance of a clock instance (e.g. to determine definitively
     * if the clock is dropping frames).
     */
    fluid.defaults("berg.clock.logger", {
        gradeNames: ["fluid.component"],

        numTicksToLog: 60 * 60 * 20, // Twenty minutes at 60 fps by default.

        members: {
            tickCounter: 0,
            lastTickTime: null,
            interval: 0,
            intervalLog: "@expand:berg.clock.logger.initLog({that}.options.numTicksToLog)"
        },

        invokers: {
            log: "berg.clock.logger.log({that})"
        },

        listeners: {
            "{clock}.events.onTick": [
                "{that}.log()"
            ]
        }
    });

    berg.clock.logger.initLog = function (numTicksToLog) {
        return new Float32Array(numTicksToLog);
    };

    berg.clock.logger.log = function (that) {
        if (that.lastTickTime === null) {
            that.lastTickTime = that.time;
            return;
        }

        that.tickCounter++;
        that.interval = that.time - that.lastTickTime;

        if (that.tickCounter < that.options.numTicksToLog) {
            that.intervalLog[that.tickCounter] = that.interval;
        }
    };
}());
;/*
 * Bergson Web Worker-based setInterval Clock
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
/*global require, self*/
var fluid = fluid || require("infusion"),
    berg = fluid.registerNamespace("berg");

(function () {
    "use strict";

    berg.worker = function (code) {
        var type = typeof code,
            url,
            blob;

        if (type === "function") {
            code = "(" + code.toString() + ")();";
        } else if (type !== "string") {
            throw new Error("A berg.worker must be initialized with a String or a Function.");
        }

        if (window.Blob) {
            blob = new Blob([code], {
                type: "text/javascript"
            });
            url = (window.URL || window.webkitURL).createObjectURL(blob);
        } else {
            url = "data:text/javascript;base64," + window.btoa(code);
        }
        return new Worker(url);
    };

    fluid.defaults("berg.clock.workerSetInterval", {
        gradeNames: [
            "berg.clock.realtime",
            "berg.postMessageListener",
            "berg.postMessageSender"
        ],

        freq: 10,

        members: {
            worker: "@expand:berg.clock.workerSetInterval.createWorker()",
            messageTarget: "{that}.worker",
            messageSource: "{that}.worker"
        },

        invokers: {
            start: "{that}.events.onStart.fire",
            stop: "{that}.events.onStop.fire"
        },

        events: {
            onStart: null,
            onStop: null
        },

        listeners: {
            onStart: [
                {
                    func: "{that}.postMessage",
                    args: ["start", {
                        freq: "{that}.freq"
                    }]
                }
            ],

            onStop: [
                "{that}.postMessage(stop)",
                {
                    this: "{that}.worker",
                    method: "terminate"
                }
            ]
        }
    });

    berg.clock.workerSetInterval.createWorker = function () {
        return berg.worker(berg.clock.workerSetInterval.workerImpl);
    };


    // Note: This function is intended to be invoked as
    // an berg.worker only.
    berg.clock.workerSetInterval.workerImpl = function () {
        "use strict"; // jshint ignore:line

        var berg = {};

        berg.workerClock = function (options) {
            var that = {
                options: options || {},
                intervalID: null
            };

            that.start = function () {
                that.intervalID = setInterval(that.tick, 1000 / that.options.freq);
            };

            that.tick = function () {
                self.postMessage({
                    type: "tick"
                });
            };

            that.stop = function () {
                clearInterval(that.intervalID);
            };

            return that;
        };

        self.addEventListener("message", function (e) {
            if (e.data.type === "start") {
                berg.clock = berg.workerClock({
                    freq: e.data.value
                });
                berg.clock.start();
            } else if (e.data.type === "stop") {
                if (berg.clock) {
                    berg.clock.stop();
                }
                self.close();
            }
        }, false);
    };
}());
;/*
 * Bergson AudioContext Clock
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
/*global require*/
var fluid = fluid || require("infusion"),
    berg = fluid.registerNamespace("berg");

(function () {
    "use strict";

    /**
     * AudioContext Clock
     *
     * An AudioContext Clock takes its real time value
     * from a WebAudio API AudioContext instance.
     *
     * An AudioContext instance will created if one is not
     * provided as a member option when instaniating this clock.
     *
     * This clock needs to be ticked manually; you will typically
     * invoke its tick() method in a custom ScriptProcessorNode.onaudioprocess
     * implementation.
     */
    fluid.defaults("berg.clock.audioContext", {
        gradeNames: ["berg.clock.realtime"],

        blockSize: 256,

        mergePolicy: {
            "members.context": "noexpand"
        },

        members: {
            context: "@expand:berg.clock.audioContext.createContext()",
            freq: "@expand:berg.clock.audioContext.calcFreq({that}.context, {that}.options.blockSize)",
            time: "@expand:berg.clock.audioContext.now({that}.context)"
        },

        invokers: {
            tick: {
                funcName: "berg.clock.audioContext.tick",
                args: ["{that}"]
            }
        }
    });

    berg.clock.audioContext.createContext = function () {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        return new AudioContext();
    };

    berg.clock.audioContext.calcFreq = function (context, blockSize) {
        return context.sampleRate / blockSize;
    };

    berg.clock.audioContext.now = function (context) {
        return context.currentTime;
    };

    berg.clock.audioContext.tick = function (that) {
        that.time = that.context.currentTime;
        that.events.onTick.fire(that.time, that.freq);
    };

    /**
     * An AutoAudioContext Clock automatically creates
     * and configures a ScriptProcessorNode to drive the clock.
     */
    fluid.defaults("berg.clock.autoAudioContext", {
        gradeNames: ["berg.clock.audioContext"],

        mergePolicy: {
            "members.scriptNode": "noexpand"
        },

        members: {
            scriptNode: {
                expander: {
                    funcName: "berg.clock.autoAudioContext.createScriptNode",
                    args: ["{that}.context", "{that}.options.blockSize", "{that}.tick"]
                }
            }
        },

        invokers: {
            start: {
                funcName: "berg.clock.autoAudioContext.start",
                args: ["{that}.context", "{that}.scriptNode"]
            },

            stop: {
                funcName: "berg.clock.autoAudioContext.stop",
                args: ["{that}.context", "{that}.scriptNode"]
            }
        }
    });

    berg.clock.autoAudioContext.createScriptNode = function (context, blockSize, tick) {
        var sp = context.createScriptProcessor(blockSize, 1, 1);
        sp.onaudioprocess = tick;
        return sp;
    };

    berg.clock.autoAudioContext.start = function (context, scriptNode) {
        scriptNode.connect(context.destination);
    };

    berg.clock.autoAudioContext.stop = function (context, scriptNode) {
        scriptNode.disconnect(context.destination);
        scriptNode.onaudioprocess = undefined;
    };

}());
