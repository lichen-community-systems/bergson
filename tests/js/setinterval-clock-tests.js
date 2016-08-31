/*
 * Bergson setInterval Clock Tests
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

    fluid.defaults("berg.test.clock.tester.setInterval", {
        gradeNames: [
            "berg.test.clock.tester.external",
            "berg.test.clock.tester.realtime"
        ],

        maxJitter: 15, // setInterval is jittery at the best of times.

        components: {
            clock: {
                type: "berg.clock.setInterval"
            }
        }
    });

    fluid.defaults("berg.test.clock.setIntervalClockTestSuite", {
        gradeNames: ["berg.test.clock.testSuite"],

        tests: [
            {
                name: "Initial state, default options",
                initOnly: true,
                tester: {
                    type: "berg.test.clock.tester.setInterval"
                }
            },
            {
                name: "Initial state, 30 Hz",
                initOnly: true,
                tester: {
                    type: "berg.test.clock.tester.setInterval",
                    options: {
                        expected: {
                            freq: 30
                        }
                    }
                }
            },
            {
                name: "tick() time update",
                tester: {
                    type: "berg.test.clock.tester.setInterval",
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
                    type: "berg.test.clock.tester.setInterval",
                    options: {
                        expected: {
                            freq: 240
                        }
                    }
                }
            }
        ]
    });

    var testSuite = berg.test.clock.setIntervalClockTestSuite();
    testSuite.run();
})();
