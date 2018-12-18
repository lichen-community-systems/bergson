/*
 * Bergson requestAnimationFrame Clock
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
/*global require, requestAnimationFrame, cancelAnimationFrame*/
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
            tick: {
                funcName: "berg.clock.raf.tick",
                args: ["{that}", "{arguments}.0"]
            }
        },

        listeners: {
            "onStart.requestNextTick": {
                priority: "after:updateState",
                funcName: "berg.clock.raf.requestNextTick",
                args: ["{that}"]
            },

            "onStop.cancelNextTick": {
                priority: "after:updateState",
                funcName: "berg.clock.raf.cancelNextTick",
                args: ["{that}"]
            }
        }
    });

    berg.clock.raf.requestNextTick = function (that) {
        that.requestID = requestAnimationFrame(that.tick);
    };

    berg.clock.raf.tick = function (that, now) {
        berg.clock.raf.requestNextTick(that);

        var nowSecs = now / 1000;
        that.time = nowSecs;
        that.events.onTick.fire(nowSecs, that.freq);
    };

    berg.clock.raf.cancelNextTick = function (that) {
        cancelAnimationFrame(that.requestID);
    };
})();
