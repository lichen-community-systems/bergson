(function () {

    "use strict";

    QUnit.module("Realtime clock");

    var createRealtimeClock = function (rate) {
        return flock.clock.realtime({
            rate: rate
        });
    };

    var testClockTimeIncrement = function (numTicks, clock) {
        var time = performance.now();

        flock.test.clock.eachTick(numTicks, clock, function () {
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
        flock.test.clock.testRealtimeInitialState(clock, 1);
    });

    QUnit.test("Initialization, 30 fps", function () {
        var rate = 30,
            clock = createRealtimeClock(rate);

        flock.test.clock.testRealtimeInitialState(clock, rate);
    });

    QUnit.asyncTest("tick() time update", function () {
        var rate = 30,
            clock = createRealtimeClock(rate);

        testClockTimeIncrement(1000, clock);
        deferredTestClockTimeIncrement(100, 1, clock);
    });

}());
