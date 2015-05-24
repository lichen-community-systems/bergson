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

    flock.test.clock.eachTick = function (numTicks, clock, fn) {
        for (var i = 0; i < numTicks; i++) {
            clock.tick();
            fn(clock);
        }
    };

    flock.test.clock.testRealtimeInitialState = function (clock, expectedRate) {
        QUnit.equal(clock.options.rate, expectedRate,
            "The clock should be initialized to the default rate.");
        flock.test.assertTimeEqual(clock.time, performance.now(), 3,
            "The clock should be initialized with the current time.");
    };
}());
