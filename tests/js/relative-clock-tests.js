(function () {

    "use strict";

    var testClockInitialState = function (clock, expectedRate) {
        QUnit.equal(clock.options.rate, expectedRate,
            "The clock should be initialized to the default rate.");
        QUnit.equal(clock.time, 0,
            "The clock should be initialized with a time of 0.");

        var expectedTickDuration = 1 / expectedRate;
        QUnit.equal(clock.tickDuration, expectedTickDuration,
            "The clock should have been initialized with the correct tick duration");
    };

    QUnit.module("Relative clock");

    var createRelativeClock = function (rate) {
        return flock.clock.relative({
            rate: rate
        });
    };

    var testClockTimeIncrement = function (numTicks, clock, rate) {
        var time = clock.time,
            expectedTickDuration = 1 / rate;

        flock.test.eachClockTick(numTicks, clock, function () {
            time += expectedTickDuration;
            QUnit.equal(clock.time, time,
                "The clock should have been incremented by 1/" + rate + " of a second.");
        });
    };

    QUnit.test("Initialization, default options", function () {
        var clock = flock.clock.relative();
        testClockInitialState(clock, 1);
    });

    QUnit.test("Initialization, 30 fps", function () {
        var rate = 30,
            clock = createRelativeClock(rate);

        testClockInitialState(clock, rate);
    });

    QUnit.test("tick() time update", function () {
        var rate = 30,
            clock = createRelativeClock(rate);

        testClockTimeIncrement(10, clock, rate);
    });

}());
