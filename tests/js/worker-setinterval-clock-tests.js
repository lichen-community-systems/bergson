/*
 * Bergson Web Worker setInterval Clock Tests
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
/*global fluid, berg*/
(function () {
    "use strict";

    fluid.defaults("berg.test.clock.tester.workerSetInterval", {
        gradeNames: [
            "berg.test.clock.tester.external",
            "berg.test.clock.tester.realtime",
            "autoInit"
        ],

        components: {
            clock: {
                type: "berg.clock.workerSetInterval"
            }
        }
    });

    fluid.defaults("berg.test.clock.tester.workerSetInterval.refreshRate", {
        gradeNames: ["berg.test.clock.tester.workerSetInterval", "autoInit"],

        components: {
            testCase: {
                type: "berg.test.clock.realtime.averageTickDurationTestCase"
            }
        }
    });

    fluid.defaults("berg.test.clock.workerSetIntervalClockTestSuite", {
        gradeNames: ["berg.test.clock.testSuite", "autoInit"],

        tests: [
            {
                name: "Initial state, default options",
                initOnly: true,
                tester: {
                    type: "berg.test.clock.tester.workerSetInterval"
                }
            },
            {
                name: "Initial state, 30 fps",
                initOnly: true,
                tester: {
                    type: "berg.test.clock.tester.workerSetInterval",
                    options: {
                        expected: {
                            rate: 30
                        }
                    }
                }
            },
            {
                name: "tick() time update, 30 fps",
                tester: {
                    type: "berg.test.clock.tester.workerSetInterval",
                    options: {
                        expected: {
                            rate: 30
                        }
                    }
                }
            },
            {
                name: "tick() at 240 Hz",
                tester: {
                    type: "berg.test.clock.tester.workerSetInterval",
                    options: {
                        expected: {
                            rate: 240
                        }
                    }
                }
            }
        ]
    });

    var testSuite = berg.test.clock.workerSetIntervalClockTestSuite();
    testSuite.run();
}());
