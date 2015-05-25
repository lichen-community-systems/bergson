(function () {

    "use strict";

    fluid.defaults("flock.test.clock.tester.setInterval", {
        gradeNames: [
            "flock.test.clock.tester.external",
            "flock.test.clock.tester.realtime",
            "autoInit"
        ],

        components: {
            clock: {
                type: "flock.clock.setInterval"
            }
        }
    });

    fluid.defaults("flock.test.clock.setIntervalClockTestSuite", {
        gradeNames: ["flock.test.clock.testSuite", "autoInit"],

        tests: [
            {
                name: "Initial state, default options",
                initOnly: true,
                tester: {
                    type: "flock.test.clock.tester.setInterval"
                }
            },
            {
                name: "Initial state, 30 Hz",
                initOnly: true,
                tester: {
                    type: "flock.test.clock.tester.setInterval",
                    options: {
                        expected: {
                            rate: 30
                        }
                    }
                }
            },
            {
                name: "tick() time update",
                tester: {
                    type: "flock.test.clock.tester.setInterval",
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
                    type: "flock.test.clock.tester.setInterval",
                    options: {
                        expected: {
                            rate: 240
                        }
                    }
                }
            }
        ]
    });

    var testSuite = flock.test.clock.setIntervalClockTestSuite();
    testSuite.run();
}());
