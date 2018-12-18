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
        gradeNames: ["fluid.modelComponent"],

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

        model: {
            isPlaying: false
        },

        invokers: {
            start: "{that}.events.onStart.fire()",
            tick: "fluid.notImplemented()",
            stop: "{that}.events.onStop.fire()"
        },

        events: {
            onStart: null,
            onTick: null,
            onStop: null
        },

        listeners: {
            "onStart.updateState": {
                changePath: "isPlaying",
                value: true
            },

            "onStop.updateState": {
                changePath: "isPlaying",
                value: false
            },

            "onDestroy.stop": "{that}.stop()"
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

})();
