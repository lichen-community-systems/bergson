/*
 * Bergson Clock Test Utilities
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

    fluid.registerNamespace("berg.test.clock");

    berg.test.assertTimeEqual = function (actual, expected, tolerance, msg) {
        var larger = expected,
            smaller = actual;

        if (actual > expected) {
            larger = actual;
            smaller  = expected;
        }

        var diff = larger - smaller;

        QUnit.ok(diff <= tolerance, msg +
            " Expected time: " + expected +
            ", actual time was: " + actual +
            " Tolerance is " + tolerance +
            "; difference was: " + diff + "ms.");
    };

    berg.test.clock.manualTicker = function (numTicks, clock) {
        for (var i = 0; i < numTicks; i++) {
            clock.tick();
        }
    };

    fluid.defaults("berg.test.clock.tester.manual", {
        gradeNames: ["fluid.modelComponent"],

        invokers: {
            start: {
                funcName: "berg.test.clock.manualTicker",
                args: ["{that}.options.numTicks", "{clock}"]
            }
        }
    });

    // Tester mixin grade for clocks that are driven externally and thus:
    //   a) run asynchronously and need to signal QUnit to resume.
    //   b) need to be explicitly stopped.
    fluid.defaults("berg.test.clock.tester.external", {
        gradeNames: ["fluid.modelComponent"],

        invokers: {
            start: "{clock}.start()"
        },

        listeners: {
            onStop: [
                {
                    priority: "first",
                    func: "{clock}.stop"
                },
                {
                    priority: "last",
                    func: "QUnit.start"
                }
            ]
        }
    });

}());
