/*
 * Bergson Offline Clock Tester
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

    fluid.registerNamespace("berg.test.clock");

    fluid.defaults("berg.test.clock.testCase.offline", {
        gradeNames: ["berg.test.clock.testCase"],

        invokers: {
            testInitState: {
                funcName: "berg.test.clock.testCase.offline.testInitial",
                args: ["{clock}", "{tester}"]
            },

            testTick: {
                funcName: "berg.test.clock.testCase.offline.testTick",
                args: ["{clock}", "{tester}"]
            }
        }
    });

    berg.test.clock.testCase.offline.testInitial = function (clock, that) {
        QUnit.equal(clock.freq, that.options.expected.freq,
            "The clock should be initialized with a freq of " +
            that.options.expected.freq + ".");
        QUnit.equal(clock.time, 0,
            "The clock should be initialized with a time of 0.");

        QUnit.equal(clock.tickDuration, that.options.expected.tickDuration,
            "The clock should have been initialized with a tick duration of " +
            that.options.expected.tickDuration + " seconds.");
    };

    berg.test.clock.testCase.offline.testTick = function (clock, that) {
        var expectedTime = that.model.expectedTime + that.options.expected.tickDuration;

        QUnit.equal(clock.time, expectedTime,
            "The clock should have been incremented by 1/" +
            that.options.expected.freq + " of a second.");

        that.applier.change("expectedTime", expectedTime);

    };


    fluid.defaults("berg.test.clock.tester.offline", {
        gradeNames: ["berg.test.clock.tester"],

        model: {
            expectedTime: 0
        },

        expected: {
            tickDuration: 1
        },

        components: {
            testCase: {
                type: "berg.test.clock.testCase.offline"
            },

            clock: {
                type: "berg.clock.offline"
            }
        }
    });

    fluid.defaults("berg.test.clock.tester.offlineManual", {
        gradeNames: [
            "berg.test.clock.tester.offline",
            "berg.test.clock.tester.manual"
        ]
    });

}());
