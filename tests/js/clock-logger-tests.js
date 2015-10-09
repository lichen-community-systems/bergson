/*
 * Bergson Clock Logger Tests
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

    var QUnit = fluid.registerNamespace("QUnit");

    QUnit.module("Clock Logger");

    fluid.defaults("berg.test.clock.testCase.clockLogger", {
        gradeNames: ["berg.test.clock.testCase"]
    });


    fluid.defaults("berg.test.clock.tester.offlineClockLogger", {
        gradeNames: ["berg.test.clock.tester.offlineManual"],

        numTicks: 240,

        components: {
            testCase: {
                type: "berg.test.clock.testCase.clockLogger"
            },

            logger: {
                type: "berg.clock.logger",
                options: {
                    numTicksToLog: 240
                }
            }
        },

        listeners: {
            onStop: {
                funcName: "berg.test.clock.tester.offlineClockLogger.testLog",
                args: ["{logger}", "{that}.expected.tickDuration"]
            }
        }
    });

    berg.test.clock.tester.offlineClockLogger.testLog = function (logger, expectedTickDuration) {
        var allTicksOk = true;
        for (var i = 0; i < logger.numTicksToLog; i++) {
            if (logger.intervalLog[i] !== expectedTickDuration) {
                allTicksOk = false;
            }
        }

        QUnit.ok(allTicksOk, "The logger should have logged the durations of each clock tick.");
    };


    fluid.defaults("berg.test.clock.clockLoggerTestSuite", {
        gradeNames: ["berg.test.clock.testSuite"],

        tests: [
            {
                name: "Log ticks running at 240 Hz",
                async: false,
                tester: {
                    type: "berg.test.clock.tester.offlineClockLogger",
                    options: {
                        expected: {
                            freq: 240,
                            tickDuration: 1 / 240
                        }
                    }
                }
            }
        ]
    });

    var testSuite = berg.test.clock.clockLoggerTestSuite();
    testSuite.run();
}());
