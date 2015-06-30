/*! Bergson 1.0, Copyright 2015 Colin Clark | flockingjs.org */

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

        rate: 1, // Ticks per second.

        members: {
            time: 0,
            rate: "{that}.options.rate"
        },

        invokers: {
            tick: "fluid.identity()"
        },

        events: {
            onTick: null
        }
    });


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

        members: {
            tickDuration: {
                expander: {
                    funcName: "berg.clock.offline.calcTickDuration",
                    args: "{that}.options.rate"
                }
            }
        },

        invokers: {
            tick: {
                funcName: "berg.clock.offline.tick",
                args: ["{that}"]
            }
        }
    });

    berg.clock.offline.calcTickDuration = function (rate) {
        return 1.0 / rate;
    };

    berg.clock.offline.tick = function (that) {
        that.time += that.tickDuration;
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
