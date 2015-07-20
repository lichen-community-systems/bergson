/*
 * Bergson Clocks
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
(function () {
    "use strict";

    /**
     * Clock is the base grade for all Clocks.
     */
    fluid.defaults("berg.clock", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],

        // TODO: Consider renaming this to "freq" for consistency
        // with the scheduler and Flocking.
        rate: 1, // Ticks per second.

        members: {
            /**
             * The clock's current time, in seconds.
             */
            time: 0,

            /**
             * The rate (in cycles per second) that the clock is
             * running at.
             * This value is not guaranteed to be precise all clocks.
             */
            rate: "{that}.options.rate",

            /**
             * The duration, in seconds, between ticks.
             * This value is not guaranteed to be precise for all clocks.
             */
            tickDuration: {
                expander: {
                    funcName: "berg.clock.calcTickDuration",
                    args: "{that}.options.rate"
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
        }
    });

    berg.clock.calcTickDuration = function (rate) {
        return 1.0 / rate;
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
        gradeNames: ["berg.clock", "autoInit"],

        invokers: {
            tick: {
                funcName: "berg.clock.offline.tick",
                args: ["{that}"]
            }
        }
    });

    berg.clock.offline.round = function (time) {
        // 15 decimal places.
        return Math.round(time * 100000000000000) / 100000000000000;
    };

    berg.clock.offline.tick = function (that) {
        var time = that.time + that.tickDuration;
        that.time = berg.clock.offline.round(time); // TODO: Accuracy and performance issues.
        that.events.onTick.fire(that.time, that.rate);
    };


    /**
     * A Realtime Clock tracks time based on actual system time
     * (i.e. performance.now)
     */
    fluid.defaults("berg.clock.realtime", {
        gradeNames: ["berg.clock", "autoInit"],

        members: {
            time: {
                expander: {
                    "this": performance,
                    method: "now"
                }
            }
        },

        invokers: {
            tick: {
                funcName: "berg.clock.realtime.tick",
                args: ["{that}", "{arguments}.0"]
            }
        }
    });

    berg.clock.realtime.tick = function (that) {
        that.time = performance.now();
        that.events.onTick.fire(that.time, that.rate);
    };

}());
