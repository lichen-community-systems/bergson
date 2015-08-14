/*
 * Bergson Web Worker setInterval Clock Tests
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
/*global require*/
var fluid = fluid || require("infusion"),
    berg = fluid.registerNamespace("berg");

(function () {
    "use strict";

    fluid.defaults("berg.test.clock.tester.workerSetInterval", {
        gradeNames: [
            "berg.test.clock.tester.external",
            "berg.test.clock.tester.realtime"
        ],

        components: {
            clock: {
                type: "berg.clock.workerSetInterval"
            }
        }
    });

    fluid.defaults("berg.test.clock.tester.workerSetInterval.refreshfreq", {
        gradeNames: ["berg.test.clock.tester.workerSetInterval"],

        components: {
            testCase: {
                type: "berg.test.clock.realtime.averageTickDurationTestCase"
            }
        }
    });

    fluid.defaults("berg.test.clock.workerSetIntervalClockTestSuite", {
        gradeNames: ["berg.test.clock.testSuite"],

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
                            freq: 30
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
                            freq: 30
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
                            freq: 240
                        }
                    }
                }
            }
        ]
    });

    var testSuite = berg.test.clock.workerSetIntervalClockTestSuite();
    testSuite.run();
}());
