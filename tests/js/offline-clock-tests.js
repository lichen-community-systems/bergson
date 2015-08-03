/*
 * Bergson Offline Clock Tests
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
/*global QUnit, fluid, berg*/
(function () {
    "use strict";

    QUnit.module("Offline clock");

    fluid.registerNamespace("berg.test.clock");

    berg.test.clock.roundTo15 = function (time) {
        return parseFloat(time.toPrecision(15));
    };

    fluid.defaults("berg.test.clock.offlineClockTestSuite", {
        gradeNames: ["berg.test.clock.testSuite", "autoInit"],

        tests: [
            {
                name: "Initialization, default options",
                initOnly: true,
                tester: {
                    type: "berg.test.clock.tester.offlineManual"
                }
            },
            {
                name: "Initialization, 30 Hz",
                initOnly: true,
                tester: {
                    type: "berg.test.clock.tester.offlineManual",
                    options: {
                        expected: {
                            freq: 30,
                            tickDuration: 1 / 30
                        }
                    }
                }
            },
            {
                name: "tick() time update, 30 Hz",
                async: false,
                tester: {
                    type: "berg.test.clock.tester.offlineManual",
                    options: {
                        expected: {
                            freq: 30,
                            tickDuration: 1 / 30
                        }
                    }
                }
            },
            {
                name: "tick() at 240 Hz",
                async: false,
                tester: {
                    type: "berg.test.clock.tester.offlineManual",
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

    var suite = berg.test.clock.offlineClockTestSuite();
    suite.run();

}());
