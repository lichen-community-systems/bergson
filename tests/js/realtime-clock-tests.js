(function () {

    "use strict";

    QUnit.module("Realtime clock");

    var createRealtimeClock = function (rate) {
        return flock.clock.realtime({
            rate: rate
        });
    };

    var testClockInitialState = function (clock, expectedRate) {
        QUnit.equal(clock.options.rate, expectedRate,
            "The clock should be initialized to the default rate.");
        flock.test.assertTimeEqual(clock.time, performance.now(), 2,
            "The clock should be initialized with the current time.");
    };

    var testClockTimeIncrement = function (numTicks, clock) {
        var time = performance.now();

        flock.test.eachClockTick(numTicks, clock, function () {
            flock.test.assertTimeEqual(clock.time, performance.now(), 2,
                "The clock time should reflect the current real time.");
        });
    };

    var deferredTestClockTimeIncrement = function (time, numTicks, clock) {
        setTimeout(function () {
            testClockTimeIncrement(numTicks, clock);
            QUnit.start();
        }, time);
    };

    QUnit.test("Initialization, default options", function () {
        var clock = createRealtimeClock();
        testClockInitialState(clock, 1);
    });

    QUnit.test("Initialization, 30 fps", function () {
        var rate = 30,
            clock = createRealtimeClock(rate);

        testClockInitialState(clock, rate);
    });

    QUnit.asyncTest("tick() time update", function () {
        var rate = 30,
            clock = createRealtimeClock(rate);

        testClockTimeIncrement(1000, clock);
        deferredTestClockTimeIncrement(100, 1, clock);
    });

}());
