(function () {

    "use strict";

    QUnit.module("Clock Logger");

    fluid.defaults("flock.test.clock.testCase.clockLogger", {
        gradeNames: ["flock.test.clock.testCase", "autoInit"]
    });


    fluid.defaults("flock.test.clock.tester.offlineClockLogger", {
        gradeNames: ["flock.test.clock.tester.offlineManual", "autoInit"],

        numTicks: 240,

        components: {
            testCase: {
                type: "flock.test.clock.testCase.clockLogger"
            },

            logger: {
                type: "flock.clock.logger",
                options: {
                    numTicksToLog: 240
                }
            }
        },

        listeners: {
            onStop: {
                funcName: "flock.test.clock.tester.offlineClockLogger.testLog",
                args: ["{logger}", "{that}.expected.tickDuration"]
            }
        }
    });

    flock.test.clock.tester.offlineClockLogger.testLog = function (logger, expectedTickDuration) {
        var allTicksOk = true;
        for (var i = 0; i < logger.numTicksToLog; i++) {
            if (logger.intervalLog[i] !== expectedTickDuration) {
                allTicksOk = false;
            }
        }

        ok(allTicksOk, "The logger should have logged the durations of each clock tick.");
    };


    fluid.defaults("flock.test.clock.clockLoggerTestSuite", {
        gradeNames: ["flock.test.clock.testSuite", "autoInit"],

        tests: [
            {
                name: "Log ticks running at 240 Hz",
                async: false,
                tester: {
                    type: "flock.test.clock.tester.offlineClockLogger",
                    options: {
                        expected: {
                            rate: 240,
                            tickDuration: 1/240
                        }
                    }
                }
            }
        ]
    });

    var testSuite = flock.test.clock.clockLoggerTestSuite();
    testSuite.run();
}());
