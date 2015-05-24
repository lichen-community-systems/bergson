(function () {

    "use strict";

    fluid.registerNamespace("flock.test");

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

    flock.test.eachClockTick = function (numTicks, clock, fn) {
        for (var i = 0; i < numTicks; i++) {
            clock.tick();
            fn(clock);
        }
    };

}());
