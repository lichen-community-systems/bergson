/*
 * Bergson Scheduler Tests
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
/*global require*/
var fluid = fluid || require("infusion"),
    jqUnit = jqUnit || require("node-jqunit"),
    berg = fluid.registerNamespace("berg");

(function () {
    "use strict";

    var QUnit = fluid.registerNamespace("QUnit");

    fluid.registerNamespace("berg.test.scheduler");

    berg.test.scheduler.scheduleTimeScale = function (atTick, timeScale, testSequencer) {
        if (testSequencer.model.tick === atTick) {
            testSequencer.scheduler.applier.change("timeScale", timeScale);
        }
    };

    berg.test.scheduler.runTest = function (testSequencerType, testSpec) {
        return fluid.invokeGlobalFunction(testSequencerType, [testSpec]);
    };

    berg.test.scheduler.runTests = function (testSequencerType, testSpecs) {
        fluid.each(testSpecs, function (testSpec) {
            berg.test.scheduler.runTest(testSequencerType, testSpec);
        });
    };

    berg.test.scheduler.testModule = function (moduleName, moduleSpec) {
        QUnit.module(moduleName);
        berg.test.scheduler.runTests(moduleSpec.testSequencerType, moduleSpec.testSpecs);
    };

    QUnit.test("Instantiation", function () {
        var s = berg.scheduler();
        berg.test.scheduler.testInitial(s);
    });

    berg.test.scheduler.onceTestSpecs = [
        {
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
        },
        {
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
                    time: 20,
                    queueSize: 0
                }
            ]
        },
        {
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
        },
        {
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
                    queueSize: 2
                },
                {
                    name: "scheduledSecondRunsLast",
                    time: 20,
                    queueSize: 1
                },
                {
                    name: "scheduledLastRunsSecond",
                    time: 40,
                    queueSize: 0
                }
            ]
        },
        {
            name: "scheduled immediately event before clock starts ticking",

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
        },
        {
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
    ];

    berg.test.scheduler.testModule("One-time events scheduled with once()", {
        testSequencerType: "berg.test.scheduler.onceTestSequencer",
        testSpecs: berg.test.scheduler.onceTestSpecs
    });

    berg.test.scheduler.testModule("One-time events scheduled with schedule()", {
        testSequencerType: "berg.test.scheduler.offlineTestSequencer",
        testSpecs: berg.test.scheduler.onceTestSpecs
    });


    berg.test.scheduler.repeatTestSpecs = [
        {
            name: "scheduled immediately, repeats infinitely every other tick",

            numTicks: 10,

            scoreEventSpecs: {
                immediately: {
                    type: "repeat",
                    time: 0,
                    freq: 1 / 20,
                    interval: 20,
                    end: Infinity
                }
            },

            registrationSequence: {
                1: ["immediately"]
            },

            expectedSequence: [
                {
                    name: "immediately",
                    time: 10,
                    queueSize: 0
                },
                {
                    name: "immediately",
                    time: 30,
                    queueSize: 0
                },
                {
                    name: "immediately",
                    time: 50,
                    queueSize: 0
                },
                {
                    name: "immediately",
                    time: 70,
                    queueSize: 0
                },
                {
                    name: "immediately",
                    time: 90,
                    queueSize: 0
                }
            ]
        },
        {
            name: "repeats three times",

            numTicks: 5,

            scoreEventSpecs: {
                repeatsThrice: {
                    type: "repeat",
                    time: 0,
                    freq: 1 / 10,
                    interval: 10,
                    end: 20
                }
            },

            registrationSequence: {
                0: ["repeatsThrice"]
            },

            expectedSequence: [
                {
                    name: "repeatsThrice",
                    time: 0,
                    queueSize: 0
                },
                {
                    name: "repeatsThrice",
                    time: 10,
                    queueSize: 0
                },
                {
                    name: "repeatsThrice",
                    time: 20,
                    queueSize: 0
                }
            ]
        }
    ];

    berg.test.scheduler.testModule("Repeating events scheduled with repeat()", {
        testSequencerType: "berg.test.scheduler.repeatTestSequencer",
        testSpecs: berg.test.scheduler.repeatTestSpecs
    });

    berg.test.scheduler.testModule("Repeating events scheduled with schedule()", {
        testSequencerType: "berg.test.scheduler.offlineTestSequencer",
        testSpecs: berg.test.scheduler.repeatTestSpecs
    });


    berg.test.scheduler.mixedTestSpecs = [
        {
            name: "drum beat",
            schedulerOptions: {
                components: {
                    clock: {
                        options: {
                            freq: 10
                        }
                    }
                }
            },

            numTicks: 30,

            // 60 bpm
            // Quarter note is 1 second - snare and kick
            // Eigth note, half a second - hihat
            scoreEventSpecs: {
                hihat: {
                    id: "hihat",
                    type: "repeat",
                    time: 0,
                    freq: 2,
                    interval: 0.5,
                    end: Infinity
                },

                kick: {
                    id: "kick",
                    type: "repeat",
                    time: 0,
                    freq: 1 / 2,
                    interval: 2,
                    end: Infinity
                },

                snare: {
                    id: "snare",
                    type: "repeat",
                    time: 1,
                    freq: 1 / 2,
                    interval: 2,
                    end: Infinity
                },

                splash: {
                    id: "splash",
                    type: "once",
                    time: 2.25
                }
            },

            registrationSequence: {
                0: ["kick", "snare", "hihat", "splash"]
            },

            // Note: Given the nature of a binary heap priority queue,
            // it's just completely impossible to assert the order of
            // simultaneous events; this test is thus highly implementation-specific.
            expectedSequence: [
                {
                    name: "kick",
                    time: 0,
                    queueSize: 0 // Evaluated immediately, before the others have been scheduled.
                },
                {
                    name: "hihat",
                    time: 0,
                    queueSize: 2
                },
                {
                    name: "hihat",
                    time: 0.5,
                    queueSize: 3
                },
                {
                    name: "snare",
                    time: 1,
                    queueSize: 3
                },
                {
                    name: "hihat",
                    time: 1,
                    queueSize: 3
                },
                {
                    name: "hihat",
                    time: 1.5,
                    queueSize: 3
                },
                {
                    name: "kick",
                    time: 2,
                    queueSize: 3
                },
                {
                    name: "hihat",
                    time: 2,
                    queueSize: 3
                },
                {
                    name: "splash",
                    time: 2.2,
                    queueSize: 3
                },
                {
                    name: "hihat",
                    time: 2.5,
                    queueSize: 2
                },
                {
                    name: "snare",
                    time: 3,
                    queueSize: 2
                },
                {
                    name: "hihat",
                    time: 3,
                    queueSize: 2
                }
            ]

        }
    ];

    berg.test.scheduler.testModule("Mixed events scheduled with schedule()", {
        testSequencerType: "berg.test.scheduler.offlineTestSequencer",
        testSpecs: berg.test.scheduler.mixedTestSpecs
    });


    berg.test.scheduler.timeScalingTestSpecs = [
        {
            name: "Half speed time scaling set from the beginning",
            schedulerOptions: {
                model: {
                    timeScale: 2
                },

                components: {
                    clock: {
                        options: {
                            freq: 1
                        }
                    }
                }
            },

            numTicks: 13,
            scoreEventSpecs: {
                repeating: {
                    type: "repeat",
                    time: 2,
                    freq: 1 / 2,
                    interval: 2,
                    end: Infinity
                },

                oneShot: {
                    type: "once",
                    time: 1,
                }
            },

            registrationSequence: {
                0: ["repeating", "oneShot"]
            },

            expectedSequence: [
                {
                    name: "oneShot",
                    time: 2,
                    queueSize: 1
                },
                {
                    name: "repeating",
                    time: 4,
                    queueSize: 0
                },
                {
                    name: "repeating",
                    time: 8,
                    queueSize: 0
                },
                {
                    name: "repeating",
                    time: 12,
                    queueSize: 0
                }
            ]
        },
        {
            name: "Changing timeScale in the middle of a schedule",
            schedulerOptions: {
                model: {
                    timeScale: 1
                },

                components: {
                    clock: {
                        options: {
                            freq: 2
                        }
                    }
                }
            },
            listeners: {
                "{scheduler}.clock.events.onTick": [
                    {
                        funcName: "berg.test.scheduler.scheduleTimeScale",
                        args: [5, 0.5, "{that}"],
                        priority: "first"
                    }
                ]
            },

            numTicks: 8,
            scoreEventSpecs: {
                repeating: {
                    type: "repeat",
                    time: 0,
                    freq: 1 / 2,
                    interval: 2,
                    end: Infinity
                },

                oneShot: {
                    type: "once",
                    time: 3,
                }
            },

            registrationSequence: {
                0: ["repeating", "oneShot"]
            },

            expectedSequence: [
                {
                    name: "repeating",
                    time: 0,
                    queueSize: 0
                },
                {
                    name: "repeating",
                    time: 2,
                    queueSize: 1
                },
                // Tempo change, so the oneShot fires now.
                {
                    name: "oneShot",
                    time: 3,
                    queueSize: 1
                },
                {
                    name: "repeating",
                    time: 3,
                    queueSize: 0
                },
                {
                    name: "repeating",
                    time: 4,
                    queueSize: 0
                }
            ]
        }
    ];

    berg.test.scheduler.testModule("Time scaling", {
        testSequencerType: "berg.test.scheduler.offlineTestSequencer",
        testSpecs: berg.test.scheduler.timeScalingTestSpecs
    });
})();
