/*
 * Bergson Clock Logger
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
(function () {
    "use strict";

    /**
     * Interval Logger logs the interval between ticks over time
     * into a typed array that can be used to analyse the realtime
     * performance of a clock instance (e.g. to determine definitively
     * if the clock is dropping frames).
     */
    fluid.defaults("berg.clock.logger", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],

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

    // TODO: This would be much better expressed as a
    // set of separate model listeners.
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
