(function () {

    "use strict";

    fluid.defaults("flock.test.clock.tester.workerSetInterval", {
        gradeNames: [
            "flock.test.clock.tester.external",
            "flock.test.clock.tester.realtime",
            "autoInit"
        ],

        components: {
            clock: {
                type: "flock.clock.workerSetInterval"
            }
        }
    });

    fluid.defaults("flock.test.clock.tester.workerSetInterval.refreshRate", {
        gradeNames: ["flock.test.clock.tester.workerSetInterval", "autoInit"],

        components: {
            testCase: {
                type: "flock.test.clock.realtime.averageTickDurationTestCase"
            }
        }
    });

    fluid.defaults("flock.test.clock.workerSetIntervalClockTestSuite", {
        gradeNames: ["flock.test.clock.testSuite", "autoInit"],

        tests: [
            {
                name: "Initial state, default options",
                initOnly: true,
                tester: {
                    type: "flock.test.clock.tester.workerSetInterval"
                }
            },
            {
                name: "Initial state, 30 fps",
                initOnly: true,
                tester: {
                    type: "flock.test.clock.tester.workerSetInterval",
                    options: {
                        expected: {
                            rate: 30
                        }
                    }
                }
            },
            {
                name: "tick() time update, 30 fps",
                tester: {
                    type: "flock.test.clock.tester.workerSetInterval",
                    options: {
                        expected: {
                            rate: 30
                        }
                    }
                }
            },
            {
                name: "tick() at 240 Hz",
                tester: {
                    type: "flock.test.clock.tester.workerSetInterval",
                    options: {
                        expected: {
                            rate: 240
                        }
                    }
                }
            }
        ]
    });

    var testSuite = flock.test.clock.workerSetIntervalClockTestSuite();
    testSuite.run();
}());
