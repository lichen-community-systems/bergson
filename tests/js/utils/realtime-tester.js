(function () {

    "use strict";

    fluid.defaults("flock.test.clock.testCase.realtime", {
        gradeNames: ["flock.test.clock.testCase", "autoInit"],

        maxJitter: 5,

        invokers: {
            testInitState: {
                funcName: "flock.test.clock.testCase.realtime.testInitial",
                args: ["{clock}", "{tester}", "{that}.options.maxJitter"]
            },

            testTick: {
                funcName: "flock.test.clock.testCase.realtime.testTick",
                args: ["{clock}", "{arguments}.0", "{that}.options.maxJitter"]
            }
        }
    });

    flock.test.clock.testCase.realtime.testInitial = function (clock, tester, maxJitter) {
        var now = performance.now();

        QUnit.equal(clock.options.rate, tester.options.expected.rate,
            "The clock should be initialized with a rate of " +
            tester.options.expected.rate + ".");
        flock.test.assertTimeEqual(clock.time, now, maxJitter,
            "The clock should be initialized with the current time.");
    };

    flock.test.clock.testCase.realtime.testTick = function (clock, time, maxJitter) {
        var now = performance.now();
        flock.test.assertTimeEqual(clock.time, now, maxJitter,
            "The clock's time should reflect the current real time.");
        QUnit.equal(time, clock.time,
            "The time passed to the onTick event should be the clock's time.");
    };


    fluid.defaults("flock.test.clock.tester.realtime", {
        gradeNames: ["flock.test.clock.tester", "autoInit"],

        components: {
            testCase: {
                type: "flock.test.clock.testCase.realtime"
            },

            clock: {
                type: "flock.clock.realtime"
            }
        }
    });

    fluid.defaults("flock.test.clock.tester.realtimeManual", {
        gradeNames: [
            "flock.test.clock.tester.manual",
            "flock.test.clock.tester.realtime",
            "autoInit"
        ]
    });
}());
