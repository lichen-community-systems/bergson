/*
 * Bergson Realtime Clock Tester
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

    fluid.defaults("berg.test.clock.testCase.realtime", {
        gradeNames: ["berg.test.clock.testCase"],

        invokers: {
            testInitState: {
                funcName: "berg.test.clock.testCase.realtime.testInitial",
                args: ["{clock}", "{tester}", "{that}.options.maxJitter"]
            },

            testTick: {
                funcName: "berg.test.clock.testCase.realtime.testTick",
                args: ["{clock}", "{arguments}.0", "{that}.options.maxJitter"]
            }
        }
    });

    berg.test.clock.testCase.realtime.testInitial = function (clock, tester, maxJitter) {
        var now = berg.clock.realtime.now();

        QUnit.equal(clock.freq, tester.options.expected.freq,
            "The clock should be initialized with a freq of " +
            tester.options.expected.freq + ".");
        berg.test.assertTimeEqual(clock.time, now, maxJitter,
            "The clock should be initialized with the current time.");
    };

    berg.test.clock.testCase.realtime.testTick = function (clock, time, maxJitter) {
        var now = berg.clock.realtime.now();
        berg.test.assertTimeEqual(clock.time, now, maxJitter,
            "The clock's time should reflect the current real time.");
        QUnit.equal(time, clock.time,
            "The time passed to the onTick event should be the clock's time.");
    };


    fluid.defaults("berg.test.clock.tester.realtime", {
        gradeNames: ["berg.test.clock.tester"],

        maxJitter: 20,

        components: {
            testCase: {
                type: "berg.test.clock.testCase.realtime"
            },

            clock: {
                type: "berg.clock.realtime"
            }
        }
    });

    fluid.defaults("berg.test.clock.tester.realtimeManual", {
        gradeNames: [
            "berg.test.clock.tester.manual",
            "berg.test.clock.tester.realtime"
        ]
    });
}());
