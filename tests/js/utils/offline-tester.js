(function () {

    "use strict";

    fluid.defaults("flock.test.clock.testCase.offline", {
        gradeNames: ["flock.test.clock.testCase", "autoInit"],

        invokers: {
            testInitState: {
                funcName: "flock.test.clock.testCase.offline.testInitial",
                args: ["{clock}", "{tester}"]
            },

            testTick: {
                funcName: "flock.test.clock.testCase.offline.testTick",
                args: ["{clock}", "{tester}"]
            }
        }
    });

    flock.test.clock.testCase.offline.testInitial = function (clock, that) {
        QUnit.equal(clock.options.rate, that.options.expected.rate,
            "The clock should be initialized with a rate of " +
            that.options.expected.rate + ".");
        QUnit.equal(clock.time, 0,
            "The clock should be initialized with a time of 0.");

        QUnit.equal(clock.tickDuration, that.options.expected.tickDuration,
            "The clock should have been initialized with a tick duration of " +
            that.options.expected.tickDuration + " seconds.");
    };

    flock.test.clock.testCase.offline.testTick = function (clock, that) {
        that.applier.change("expectedTime",
            that.model.expectedTime + that.options.expected.tickDuration);

        QUnit.equal(clock.time, that.model.expectedTime,
            "The clock should have been incremented by 1/" +
            that.options.expected.rate + " of a second.");
    };


    fluid.defaults("flock.test.clock.tester.offline", {
        gradeNames: ["flock.test.clock.tester", "autoInit"],

        model: {
            expectedTime: 0
        },

        expected: {
            tickDuration: 1
        },

        components: {
            testCase: {
                type: "flock.test.clock.testCase.offline"
            },

            clock: {
                type: "flock.clock.offline"
            }
        }
    });

    fluid.defaults("flock.test.clock.tester.offlineManual", {
        gradeNames: [
            "flock.test.clock.tester.offline",
            "flock.test.clock.tester.manual",
            "autoInit"
        ]
    });

}());
