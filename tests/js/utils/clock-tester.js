/*
 * Bergson Clock Tester
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

    fluid.defaults("berg.test.clock.testCase", {
        gradeNames: ["fluid.component"],

        invokers: {
            testInitState: "fluid.identity()",
            testTick: "fluid.identity()"
        }
    });

    fluid.defaults("berg.test.clock.tester", {
        gradeNames: ["fluid.modelComponent"],

        numTicks: 60,

        maxJitter: 0,

        expected: {
            freq: 1
        },

        model: {
            tickCount: 0
        },

        invokers: {
            stop: "{that}.events.onStop.fire()"
        },

        components: {
            testCase: {
                type: "fluid.emptySubcomponent",
                options: {
                    maxJitter: "{tester}.options.maxJitter"
                }
            },

            clock: {
                type: "berg.clock",
                options: {
                    freq: "{tester}.options.expected.freq",

                    events: {
                        onTick: "{tester}.events.onTick"
                    }
                }
            }
        },

        events: {
            onTick: "preventable",
            onStop: null
        },

        listeners: {
            onCreate: [
                {
                    namespace: "initializationTest",
                    func: "{testCase}.testInitState"
                }
            ],

            onTick: [
                {
                    priority: "first",
                    funcName: "berg.test.clock.tester.tickGuard",
                    args: ["{that}"]
                },
                {
                    priority: "last",
                    func: "{testCase}.testTick",
                    args: ["{arguments}.0"]
                }
            ]
        }
    });

    berg.test.clock.tester.tickGuard = function (that) {
        that.model.tickCount++;
        that.applier.change("tickCount", that.model.tickCount);

        if (that.model.tickCount >= that.options.numTicks) {
            that.events.onStop.fire();
            return false;
        }
    };


    fluid.defaults("berg.test.clock.testSuite", {
        gradeNames: ["fluid.modelComponent"],

        tests: [],

        invokers: {
            run: "berg.test.clock.testSuite.runTests({that})"
        }
    });

    berg.test.clock.testSuite.runTests = function (that) {
        fluid.each(that.options.tests, function (test) {
            var testFnName = test.initOnly || test.async === false ? "test" : "asyncTest";
            QUnit[testFnName](test.name, function () {
                var tester = fluid.invokeGlobalFunction(test.tester.type, [test.tester.options]);
                if (!test.initOnly) {
                    tester.start();
                }
            });
        });
    };
})();
