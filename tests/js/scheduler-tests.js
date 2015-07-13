/*
 * Bergson Scheduler Tests
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
(function () {
    "use strict";

    fluid.registerNamespace("berg.test.scheduler");

    QUnit.test("Instantiation", function () {
        var s = berg.scheduler();
        berg.test.scheduler.testInitial(s);
    });

    QUnit.module("once");

    berg.test.scheduler.onceTestSequencer({
        name: "scheduled precisely on the tick interval",

        expectedCallbackTime: 30,

        scoreEventSpec: {
            type: "once",
            time: 20,     // As specified in the call to once()
            priority: 30, // Normalized to clock's "now" position
            callback: "{that}.events.onScheduledEvent.fire"
        }
    });

    berg.test.scheduler.onceTestSequencer({
        name: "scheduled midway between the clock's tick interval",

        expectedCallbackTime: 30,
        scoreEventSpec: {
            type: "once",
            time: 15,     // As specified in the call to once()
            priority: 25, // Normalized to clock's "now" position
            callback: "{that}.events.onScheduledEvent.fire"
        }
    });

    berg.test.scheduler.onceTestSequencer({
        name: "scheduled in the past",

        expectedCallbackTime: 20,

        scoreEventSpec: {
            type: "once",
            time: 0,      // As specified in the call to once()
            priority: 10, // Scheduler will normalize us to its current time.
            callback: "{that}.events.onScheduledEvent.fire"
        }
    });
}());
