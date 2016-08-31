/*
 * Bergson Clock Logger
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
 /*global require, Float32Array*/
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
            log: "berg.clock.logger.log({that}, {clock})"
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

    berg.clock.logger.log = function (that, clock) {
        // Don't log the first frame.
        if (that.lastTickTime === null) {
            that.lastTickTime = clock.time;
            return;
        }

        if (that.tickCounter < that.options.numTicksToLog) {
            that.tickCounter++;
            that.interval = clock.time - that.lastTickTime;
            that.lastTickTime = clock.time;

            that.intervalLog[that.tickCounter] = that.interval;
        }
    };
})();
