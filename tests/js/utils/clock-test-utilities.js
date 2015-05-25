(function () {

    "use strict";

    fluid.registerNamespace("flock.test.clock");

    flock.test.assertTimeEqual = function (actual, expected, tolerance, msg) {
        var larger = expected,
            smaller = actual;

        if (actual > expected) {
            larger = actual;
            smaller  = expected;
        }

        var diff = larger - smaller;

        ok(diff <= tolerance, msg + " Difference was: " + diff + "ms.");
    };

    flock.test.clock.manualTicker = function (numTicks, clock) {
        for (var i = 0; i < numTicks; i++) {
            clock.tick();
        }
    };

    fluid.defaults("flock.test.clock.tester.manual", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],

        invokers: {
            start: {
                funcName: "flock.test.clock.manualTicker",
                args: ["{that}.options.numTicks", "{clock}"]
            }
        }
    });
}());
