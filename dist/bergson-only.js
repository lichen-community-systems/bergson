/*! Bergson 0.9.3, Copyright 2015 Colin Clark | github.com/colinbdclark/bergson */

/*
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
             * The frequency (in Hz) that the clock is
             * running at.
             * This value is not guaranteed to be precise all clocks.
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
            tick: "fluid.identity()",
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
                type: "berg.clock" // The real clock is in the other universe.
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
