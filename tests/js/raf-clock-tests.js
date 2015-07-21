/*
 * Bergson requestAnimationFrame Clock Tests
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
/*global QUnit, fluid, berg*/
(function () {
    "use strict";

    QUnit.module("requestAnimationFrame clock");

    fluid.defaults("berg.test.clock.tester.raf", {
        gradeNames: [
            "berg.test.clock.tester.external",
            "berg.test.clock.tester.realtime",
            "autoInit"
        ],

        maxJitter: 20, // Anything calling back to the main thread
                       // is going to be jittery.
        components: {
            clock: {
                type: "berg.clock.raf"
            }
        }
    });

    fluid.defaults("berg.test.clock.raf.refreshRateTestCase", {
        gradeNames: [
            "fluid.standardRelayComponent",
            "berg.test.clock.testCase.realtime",
            "autoInit"
        ],

        members: {
            durations: [],
            lastTime: null
        },

        invokers: {
            testTick: {
                funcName: "berg.test.clock.raf.logDuration",
                args: ["{clock}", "{that}"]
            }
        },

        listeners: {
            "{tester}.events.onStop": {
                funcName: "berg.test.clock.raf.testRefreshRate",
                args: ["{that}"]
            }
        }
    });

    berg.test.clock.raf.logDuration = function (clock, that) {
        if (that.lastTime === null) {
            that.lastTime = clock.time;
            return;
        }

        that.durations.push(clock.time - that.lastTime);
        that.lastTime = clock.time;
    };

    berg.test.clock.raf.testRefreshRate = function (that) {
        var sum = 0;

        for (var i = 0; i < that.durations.length; i++) {
            sum += that.durations[i];
        }

        var avg = sum / that.durations.length,
            diffFromFrameRate = avg - 1000 / 60,
            threshold = 1;

        QUnit.ok(diffFromFrameRate < threshold,
            "THIS TEST MAY FAIL ON DISPLAYS RUNNING AT REFRESH RATES OTHER THAN 60 Hz." +
            " The clock should tick at 60 Hz. The average time between ticks was: " +
            avg);
    };


    fluid.defaults("berg.test.clock.tester.raf.refreshRate", {
        gradeNames: ["berg.test.clock.tester.raf", "autoInit"],

        components: {
            testCase: {
                type: "berg.test.clock.raf.refreshRateTestCase"
            }
        }
    });


    fluid.defaults("berg.test.clock.rafClockTestSuite", {
        gradeNames: ["berg.test.clock.testSuite", "autoInit"],

        tests: [
            {
                name: "Initial state, default options",
                initOnly: true,
                tester: {
                    type: "berg.test.clock.tester.raf"
                }
            },
            {
                name: "Initial state, 30 fps",
                initOnly: true,
                tester: {
                    type: "berg.test.clock.tester.raf",
                    options: {
                        expected: {
                            rate: 30
                        }
                    }
                }
            },
            {
                name: "tick() time update",
                tester: {
                    type: "berg.test.clock.tester.raf"
                }
            },
            {
                name: "tick runs at refresh rate",
                tester: {
                    type: "berg.test.clock.tester.raf.refreshRate",
                    options: {
                        numTicks: 240
                    }
                }
            }
        ]
    });

    var testSuite = berg.test.clock.rafClockTestSuite();
    testSuite.run();

}());
