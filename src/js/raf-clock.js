/*
 * Bergson requestAnimationFrame Clock
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
/*global fluid, berg, requestAnimationFrame, cancelAnimationFrame, performance*/
(function () {
    "use strict";

    /**
     * The RAF Clock is a realtime clock driven by
     * window.requestAnimationFrame()
     */
    fluid.defaults("berg.clock.raf", {
        gradeNames: ["berg.clock.realtime", "autoInit"],

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

        var now = performance.now();
        that.time = now;
        that.events.onTick.fire(now, that.freq);
    };

    berg.clock.raf.stop = function (that) {
        cancelAnimationFrame(that.requestID);
    };

}());
