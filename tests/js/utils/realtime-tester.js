(function () {

    "use strict";

    fluid.defaults("berg.test.clock.testCase.realtime", {
        gradeNames: ["berg.test.clock.testCase", "autoInit"],

        maxJitter: 5,

        invokers: {
            testInitState: {
                funcName: "berg.test.clock.testCase.realtime.testInitial",
                args: ["{clock}", "{tester}", "{that}.options.maxJitter"]
            },

            testTick: {
                funcName: "berg.test.clock.testCase.realtime.testTick",
                args: ["{clock}", "{arguments}.0", "{that}.options.maxJitter"]
            }
        }
    });

    berg.test.clock.testCase.realtime.testInitial = function (clock, tester, maxJitter) {
        var now = performance.now();

        QUnit.equal(clock.options.rate, tester.options.expected.rate,
            "The clock should be initialized with a rate of " +
            tester.options.expected.rate + ".");
        berg.test.assertTimeEqual(clock.time, now, maxJitter,
            "The clock should be initialized with the current time.");
    };

    berg.test.clock.testCase.realtime.testTick = function (clock, time, maxJitter) {
        var now = performance.now();
        berg.test.assertTimeEqual(clock.time, now, maxJitter,
            "The clock's time should reflect the current real time.");
        QUnit.equal(time, clock.time,
            "The time passed to the onTick event should be the clock's time.");
    };


    fluid.defaults("berg.test.clock.tester.realtime", {
        gradeNames: ["berg.test.clock.tester", "autoInit"],

        components: {
            testCase: {
                type: "berg.test.clock.testCase.realtime"
            },

            clock: {
                type: "berg.clock.realtime"
            }
        }
    });

    fluid.defaults("berg.test.clock.tester.realtimeManual", {
        gradeNames: [
            "berg.test.clock.tester.manual",
            "berg.test.clock.tester.realtime",
            "autoInit"
        ]
    });
}());
