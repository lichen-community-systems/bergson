/*
 * Bergson Scheduler
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
(function () {
    "use strict";

    fluid.defaults("berg.scheduler", {
        gradeNames: ["fluid.standardRelayComponent", "autoInit"],

        members: {
            queue: "@expand:berg.priorityQueue()"
        },

        components: {
            clock: { // Should be supplied by the user.
                type: "berg.clock.offline"
            }
        },

        invokers: {
            /**
             * Causes the scheduler to evaluate its
             * queue of scheduled callback and fire those that
             * are appropriate for the current clock time.
             *
             * This function is invoked automatically when the
             * scheduler's clock fires its onTick event.
             *
             * Note: the basic Bergson scheduler operates a "late"
             * scheduling algorithm for changes that are finer-grained
             * than the resolution of its clock. So, for example, if the
             * clock is running at a rate of 1 tick/second, an event scheduled
             * at time 1.1 seconds will be invoked at the 2 second tick.
             *
             * @param {Number} time - the current clock time, in seconds
             */
            tick: "berg.scheduler.tick({arguments}.0, {that}.queue)",

            /**
             * Schedules one or more score event specifications.
             *
             * @param {Object||Array} scoreSpecs - the score event specifications to schedule
             */
            schedule: "berg.scheduler.schedule({arguments}.0, {that}.clock)",

            /**
             * Schedules a callback to be fired once at the specified time.
             *
             * @param {Number} time - the time from now, in seconds, to schedule the callback
             * @param {Function} callback - the callback to schedule
             */
            once: "berg.scheduler.once({arguments}.0, {arguments}.1, {that})",

            /**
             * Schedules a callback to be fired repeatedly at the specified interval.
             *
             * @param {Number} interval - the interval to repeat at
             * @param {Function} callback - the callback to schedule
             */
            repeat: "berg.scheduler.repeat({arguments}.0, {arguments}.1, {that})",

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
            clearAll: "{that}.queue.clear()"
        },

        listeners: {
            "{clock}.events.onTick": {
                func: "{scheduler}.tick"
            }
        }
    });

    // Unsupported, non-API function.
    berg.scheduler.expandRepeatingEventSpec = function (now, eventSpec) {
        if (typeof eventSpec.time !== "number") {
            eventSpec.time = 0;
        }

        eventSpec.end = typeof eventSpec.end !== "number" ?
            Infinity : eventSpec.end + now;
    };

    // Unsupported, non-API function.
    berg.scheduler.evaluateScoreEvent = function (scoreEvent, time, queue) {
        scoreEvent.callback(time, scoreEvent);

        // If it's a repeating event, queue it back up.
        if (scoreEvent.type === "repeat" && scoreEvent.end > time) {
            scoreEvent.priority = time + scoreEvent.freq;
            queue.push(scoreEvent);
        }
    };

    // Unsupported, non-API function.
    berg.scheduler.validateEventSpec = function (eventSpec) {
        if (typeof eventSpec.callback !== "function") {
            throw new Error("No callback was specified for scheduled event: " +
                fluid.prettyPrintJSON(eventSpec));
        }

        if (eventSpec.type === "repeat" && typeof eventSpec.interval !== "number") {
            throw new Error("No interval was specified for scheduled event: " +
                fluid.prettyPrintJSON(eventSpec));
        }

        if (typeof eventSpec.time !== "number") {
            throw new Error("No time was specified for scheduled event: " +
                fluid.prettyPrintJSON(eventSpec));
        }
    };

    // Unsupported, non-API function.
    berg.scheduler.scheduleEvent = function (eventSpec, that) {
        var now = that.clock.time;

        // TODO: Should we warn on omitted type?
        if (!eventSpec.type) {
            eventSpec.type = "once";
        }

        if (eventSpec.type === "repeat") {
            berg.scheduler.expandRepeatingEventSpec(now, eventSpec);
        }

        berg.scheduler.validateEventSpec(eventSpec);
        eventSpec.priority = now + eventSpec.time;

        if (eventSpec.priority <= now) {
            berg.scheduler.evaluateScoreEvent(eventSpec, now, that.queue);
        } else {
            that.queue.push(eventSpec);
        }

        return eventSpec;
    };

    // Unsupported, non-API function.
    berg.scheduler.scheduleEvents = function (eventSpecs, that) {
        eventSpecs.forEach(function (eventSpec) {
            berg.scheduler.scheduleEvent(eventSpec, that);
        });

        return eventSpecs;
    };

    berg.scheduler.schedule = function (eventSpec, that) {
        if (fluid.isArrayable(eventSpec)) {
            return berg.scheduler.scheduleEvents(eventSpec, that);
        }

        return berg.scheduler.scheduleEvent(eventSpec, that);
    };

    berg.scheduler.once = function (time, callback, that) {
        var eventSpec = {
            type: "once",
            time: time,
            callback: callback
        };

        return berg.scheduler.scheduleEvent(eventSpec, that);
    };

    berg.scheduler.repeat = function (interval, callback, that) {
        var eventSpec = {
            type: "repeat",
            freq: interval,
            time: 0,
            end: Infinity,
            callback: callback
        };

        return berg.scheduler.scheduleEvent(eventSpec, that);
    };

    berg.scheduler.tick = function (time, queue) {
        var next = queue.peek();

        // Check to see if this event should fire now
        // (or should have fired earlier!)
        //
        // TODO: Consider the best semantic for hopelessly late events;
        // should they play immediately no matter what
        // (as in the current implementation),
        // or perhaps be thrown away if they're older than a certain threshold?
        while (next && next.priority <= time) {
            // Take it out of the queue and invoke its callback.
            queue.pop();
            berg.scheduler.evaluateScoreEvent(next, time, queue);
            next = queue.peek();
        }
    };

}());
