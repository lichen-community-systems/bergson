/*
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
            lookahead: "@expand:berg.scheduler.calcLookahead({clock})",

            deferredEvents: []
        },

        model: {
            timeScale: 1.0,
            stoppedAtTime: undefined
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
            start: "{that}.clock.start()",

            /**
             * Stops this scheduler's clock.
             */
            stop: "{that}.clock.stop()",

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
            clearAll: "{that}.events.onClearAll.fire()",

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

        events: {
            onTick: "{clock}.events.onTick",
            onStart: "{clock}.events.onStart",
            onStop: "{clock}.events.onStop",
            onClearAll: null
        },

        listeners: {
            "onStart.reprioritizeCurrentEvents": {
                priority: "after:startClock",
                funcName: "berg.scheduler.reprioritizeCurrentEvents",
                args: "{that}"
            },

            "onStart.scheduleDeferredEvents": {
                priority: "after:reprioritizeCurrentEvents",
                funcName: "berg.scheduler.scheduleDeferredEvents",
                args: "{that}"
            },

            "onStart.unmarkStopTime": {
                priority: "after:scheduleDeferredEvents",
                changePath: "stoppedAtTime",
                type: "DELETE"
            },

            "onTick.tick": {
                funcName: "berg.scheduler.tick",
                args: ["{arguments}.0", "{that}"]
            },

            "onStop.markStopTime": {
                priority: "after:stopClock",
                changePath: "stoppedAtTime",
                value: "{that}.clock.time"
            },

            "onClearAll.clearQueue": "{that}.queue.clear()",

            "onClearAll.clearDeferred": {
                funcName: "berg.scheduler.clearDeferredEvents",
                args: "{that}.deferredEvents"
            }
        }
    });

    // Unsupported, non-API function.
    berg.scheduler.calcLookahead = function (clock) {
        return clock.tickDuration / 2;
    };

    // Unsupported, non-API function.
    berg.scheduler.calcPriority = function (baseTime, timeOffset, timeScale) {
        return baseTime + (timeOffset * timeScale);
    };

    // Unsupported, non-API function.
    berg.scheduler.reprioritizeEvent = function (item, now, stoppedAtTime) {
        item.priority = berg.scheduler.recalcTime(now, stoppedAtTime, item.priority);
        if (item.end !== undefined && item.end !== Infinity) {
            item.end = berg.scheduler.recalcTime(now, stoppedAtTime, item.end);
        }
    };

    // Unsupported, non-API function.
    berg.scheduler.reprioritizeCurrentEvents = function (that) {
        var now = that.clock.time,
            stoppedAtTime = that.model.stoppedAtTime;

        // No reason to reprioritize if the clock wasn't stopped or
        // time hasn't passed.
        if (stoppedAtTime === undefined || stoppedAtTime === now) {
            return;
        }

        var reprioritized = fluid.transform(that.queue.items, function (item) {
            berg.scheduler.reprioritizeEvent(now, stoppedAtTime, item);
        });

        // TODO: The queue should still be ordered correctly
        // even if we didn't clear it and readd each item, right?
        // Verify and remove this if possible.
        that.queue.clear();
        fluid.each(reprioritized, that.queue.push);
    };

    // Unsupported, non-API function.
    berg.scheduler.recalcTime = function (clockStopTime, now, scheduledTime) {
        var timeRemaining = clockStopTime - scheduledTime;
        return timeRemaining > 0 ? now + timeRemaining : scheduledTime;
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

        if (typeof eventSpec.interval !== "number") {
            eventSpec.interval = 1.0 / eventSpec.freq;
        }

        eventSpec.end = typeof eventSpec.end !== "number" ?
            Infinity : eventSpec.end + now;
    };

    // Unsupported, non-API function.
    berg.scheduler.validateEventSpec = function (eventSpec) {
        // TODO: Provide a means to perform implementation-specific validation.
        if (eventSpec.type === "repeat") {
            if (typeof eventSpec.freq !== "number" && typeof eventSpec.interval !== "number") {
                throw new Error("No freq or interval was specified for a repeating event: " + fluid.prettyPrintJSON(eventSpec));
            }
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

    berg.scheduler.deferEvent = function (eventSpec, that) {
        that.deferredEvents.push(eventSpec);
    };

    berg.scheduler.scheduleDeferredEvents = function (that) {
        fluid.each(that.deferredEvents, function (eventSpec) {
            berg.scheduler.scheduleEvent(eventSpec, that);
        });

        berg.scheduler.clearDeferredEvents(that.deferredEvents);
    };

    // Unsupported, non-API function.
    berg.scheduler.scheduleEvent = function (eventSpec, that) {
        if (!that.clock.model.isPlaying) {
            berg.scheduler.deferEvent(eventSpec, that);
            return;
        }

        var now = that.clock.time,
            timeScale = that.model.timeScale;

        berg.scheduler.expandEventSpec(eventSpec);
        if (eventSpec.type === "repeat") {
            berg.scheduler.expandRepeatingEventSpec(now, eventSpec);
        }

        // TODO: Mutation of eventSpec!
        eventSpec.scheduledAt = now;
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

    berg.scheduler.clearDeferredEvents = function (deferredEvents) {
        deferredEvents.length = 0;
    };
})();
