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

                numTicks: 5,

                scoreEventSpecs: {
                    only: {
                        type: "once",
                        time: 20,     // As specified in the call to once()
                        priority: 30 // Normalized to clock's "now" position
                    }
                },

                // Tick count to register at : [specification names]
                registrationSequence: {
                    1: ["only"]
                },

                expectedSequence: [
                    {
                        name: "only",
                        time: 30,
                        queueSize: 0
                    }
                ]
            }
        },
        {
            type: "berg.test.scheduler.onceTestSequencer",
            options: {
                name: "scheduled midway between the clock's tick interval",

                numTicks: 5,

                scoreEventSpecs: {
                    only: {
                        type: "once",
                        time: 15,
                        priority: 25
                    }
                },

                registrationSequence: {
                    1: ["only"]
                },

                expectedSequence: [
                    {
                        name: "only",
                        time: 30,
                        queueSize: 0
                    }
                ]
            }
        },
        {
            type: "berg.test.scheduler.onceTestSequencer",
            options: {
                name: "multiple scheduled; only one should fire",

                numTicks: 5,

                scoreEventSpecs: {
                    first: {
                        type: "once",
                        time: 20,
                        priority: 30
                    },

                    later: {
                        type: "once",
                        time: 400,
                        priority: 410
                    }
                },

                registrationSequence: {
                    1: ["first", "later"]
                },

                expectedSequence: [
                    {
                        name: "first",
                        time: 30,
                        queueSize: 1
                    }
                ]
            }
        },
        {
            type: "berg.test.scheduler.onceTestSequencer",
            options: {
                name: "multiple scheduled non-consecutively; all should fire",

                numTicks: 5,

                scoreEventSpecs: {
                    first: {
                        type: "once",
                        time: 10,
                        priority: 10
                    },

                    scheduledSecondRunsLast: {
                        type: "once",
                        time: 20,
                        priority: 20
                    },

                    scheduledLastRunsSecond: {
                        type: "once",
                        time: 31,
                        priority: 41
                    }
                },

                registrationSequence: {
                    0: ["first", "scheduledSecondRunsLast"],
                    1: ["scheduledLastRunsSecond"]
                },

                expectedSequence: [
                    {
                        name: "first",
                        time: 10,
                        queueSize: 1
                    },
                    {
                        name: "scheduledSecondRunsLast",
                        time: 20,
                        queueSize: 1
                    },
                    {
                        name: "scheduledLastRunsSecond",
                        time: 50,
                        queueSize: 0
                    }
                ]
            }
        },
        {
            type: "berg.test.scheduler.onceTestSequencer",
            options: {
                name: "scheduled immediately",

                numTicks: 2,

                scoreEventSpecs: {
                    immediately: {
                        type: "once",
                        time: 0,
                        priority: 0
                    }
                },

                registrationSequence: {
                    0: ["immediately"]
                },

                expectedSequence: [
                    {
                        name: "immediately",
                        time: 0,
                        queueSize: 0
                    }
                ]
            }
        },
        {
            type: "berg.test.scheduler.onceTestSequencer",
            options: {
                name: "scheduled immediately, after ticking for a bit",

                numTicks: 5,

                scoreEventSpecs: {
                    immediately: {
                        type: "once",
                        time: 0,
                        priority: 20
                    }
                },

                registrationSequence: {
                    2: ["immediately"]
                },

                expectedSequence: [
                    {
                        name: "immediately",
                        time: 20,
                        queueSize: 0
                    }
                ]
            }
        }
    ];

    berg.test.scheduler.runTests(berg.test.scheduler.onceTestSpecs);
}());
