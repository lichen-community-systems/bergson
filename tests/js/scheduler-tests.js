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

    berg.test.scheduler.runTest = function (testSpec) {
        var testSequencer = fluid.invokeGlobalFunction(testSpec.type, [testSpec.options]);
    };

    berg.test.scheduler.runTests = function (testSpecs) {
        fluid.each(testSpecs, berg.test.scheduler.runTest);
    };


    QUnit.test("Instantiation", function () {
        var s = berg.scheduler();
        berg.test.scheduler.testInitial(s);
    });

    QUnit.module("once");

    berg.test.scheduler.onceTestSpecs = [
        {
            type: "berg.test.scheduler.onceTestSequencer",
            options: {
                name: "scheduled precisely on the tick interval",

                scoreEventSpecs: {
                    only: {
                        type: "once",
                        time: 20,     // As specified in the call to once()
                        priority: 30, // Normalized to clock's "now" position
                        callback: "{that}.events.onScheduledEvent.fire"
                    }
                },

                expectedSequence: [
                    {
                        name: "only",
                        time: 30
                    }
                ]
            }
        },
        {
            type: "berg.test.scheduler.onceTestSequencer",
            options: {
                name: "scheduled midway between the clock's tick interval",

                scoreEventSpecs: {
                    only: {
                        type: "once",
                        time: 15,     // As specified in the call to once()
                        priority: 25, // Normalized to clock's "now" position
                        callback: "{that}.events.onScheduledEvent.fire"
                    }
                },

                expectedSequence: [
                    {
                        name: "only",
                        time: 30
                    }
                ]
            }
        },
        {
            type: "berg.test.scheduler.onceTestSequencer",
            options: {
                name: "scheduled in the past",

                scoreEventSpecs: {
                    only: {
                        type: "once",
                        time: 0,      // As specified in the call to once()
                        priority: 10, // Scheduler will normalize us to its current time.
                        callback: "{that}.events.onScheduledEvent.fire"
                    }
                },

                expectedSequence: [
                    {
                        name: "only",
                        time: 20
                    }
                ]
            }
        },
        {
            type: "berg.test.scheduler.onceTestSequencer",
            options: {
                name: "multiple scheduled; only one should fire",

                scoreEventSpecs: {
                    first: {
                        type: "once",
                        time: 20,     // As specified in the call to once()
                        priority: 30, // Normalized to clock's "now" position
                        callback: "{that}.events.onScheduledEvent.fire"
                    },

                    later: {
                        type: "once",
                        time: 400,
                        priority: 410,
                        callback: "{that}.events.onScheduledEvent.fire"
                    }
                },

                expectedSequence: [
                    {
                        name: "first",
                        time: 30
                    }
                ]
            }
        },
        {
            type: "berg.test.scheduler.onceTestSequencer",
            options: {
                name: "multiple scheduled non-consecutively; all should fire",

                scoreEventSpecs: {
                    first: {
                        type: "once",
                        time: 10,     // As specified in the call to once()
                        priority: 20, // Normalized to clock's "now" position
                        callback: "{that}.events.onScheduledEvent.fire"
                    },

                    scheduledSecondRunsLast: {
                        type: "once",
                        time: 20,
                        priority: 30,
                        callback: "{that}.events.onScheduledEvent.fire"
                    },

                    scheduledLastRunsSecond: {
                        type: "once",
                        time: 31,
                        priority: 41,
                        callback: "{that}.events.onScheduledEvent.fire"
                    }
                },

                expectedSequence: [
                    {
                        name: "first",
                        time: 20
                    },
                    {
                        name: "scheduledSecondRunsLast",
                        time: 30
                    },
                    {
                        name: "scheduledLastRunsSecond",
                        time: 50
                    }
                ]
            }
        }
    ];

    berg.test.scheduler.runTests(berg.test.scheduler.onceTestSpecs);
}());
