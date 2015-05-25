(function () {

    "use strict";

    QUnit.module("requestAnimationFrame clock");

    fluid.defaults("flock.test.clock.tester.raf", {
        gradeNames: [
            "flock.test.clock.tester.external",
            "flock.test.clock.tester.realtime",
            "autoInit"
        ],

        components: {
            clock: {
                type: "flock.clock.raf"
            }
        }
    });

    fluid.defaults("flock.test.clock.tester.raf.refreshRate", {
        gradeNames: ["flock.test.clock.tester.raf", "autoInit"],

        components: {
            testCase: {
                type: "flock.test.clock.realtime.averageTickDurationTestCase"
            }
        }
    });

    fluid.defaults("flock.test.clock.rafClockTestSuite", {
        gradeNames: ["flock.test.clock.testSuite", "autoInit"],

        tests: [
            {
                name: "Initial state, default options",
                initOnly: true,
                tester: {
                    type: "flock.test.clock.tester.raf"
                }
            },
            {
                name: "Initial state, 30 fps",
                initOnly: true,
                tester: {
                    type: "flock.test.clock.tester.raf",
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
                    type: "flock.test.clock.tester.raf"
                }
            },
            {
                name: "tick runs at refresh rate",
                tester: {
                    type: "flock.test.clock.tester.raf.refreshRate",
                    options: {
                        numTicks: 240
                    }
                }
            }
        ]
    });

    var testSuite = flock.test.clock.rafClockTestSuite();
    testSuite.run();

}());
