/*
 * Bergson Realtime Clock Tests
 * http://github.com/colinbdclark/bergson
 *
 * Copyright 2015, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */
/*global require*/
var fluid = fluid || require("infusion"),
    jqUnit = jqUnit || fluid.require("jqUnit"),
    berg = fluid.registerNamespace("berg");

(function () {
    "use strict";

    var QUnit = fluid.registerNamespace("QUnit");

    QUnit.module("Realtime clock");

    fluid.defaults("berg.test.clock.realtimeClockTestSuite", {
        gradeNames: ["berg.test.clock.testSuite", "autoInit"],

        tests: [
            {
                name: "Initialization, default options",
                initOnly: true,
                tester: {
                    type: "berg.test.clock.tester.realtimeManual"
                }
            },
            {
                name: "Initialization, 30 Hz",
                initOnly: true,
                tester: {
                    type: "berg.test.clock.tester.realtimeManual",
                    options: {
                        expected: {
                            freq: 30
                        }
                    }
                }
            },
            {
                name: "tick() time update, 30 Hz",
                async: false,
                tester: {
                    type: "berg.test.clock.tester.realtimeManual",
                    options: {
                        expected: {
                            freq: 30
                        }
                    }
                }
            },
            {
                name: "tick() at 240 Hz",
                async: false,
                tester: {
                    type: "berg.test.clock.tester.realtimeManual",
                    options: {
                        expected: {
                            freq: 240
                        }
                    }
                }
            }
        ]
    });

    var testSuite = berg.test.clock.realtimeClockTestSuite();
    testSuite.run();

}());
