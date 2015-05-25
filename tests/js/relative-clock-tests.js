(function () {

    "use strict";

    QUnit.module("Relative clock");

    fluid.defaults("flock.test.clock.relativeManual.tester", {
        gradeNames: [
            "flock.test.clock.tester.relative",
            "flock.test.clock.tester.manual",
            "autoInit"
        ]
    });

    fluid.defaults("flock.test.clock.relativeClockTestSuite", {
        gradeNames: ["flock.test.clock.testSuite", "autoInit"],

        tests: [
            {
                name: "Initialization, default options",
                initOnly: true,
                tester: {
                    type: "flock.test.clock.relativeManual.tester"
                }
            },
            {
                name: "Initialization, 30 Hz",
                initOnly: true,
                tester: {
                    type: "flock.test.clock.relativeManual.tester",
                    options: {
                        expected: {
                            rate: 30,
                            tickDuration: 1/30
                        }
                    }
                }
            },
            {
                name: "tick() time update, 30 Hz",
                async: false,
                tester: {
                    type: "flock.test.clock.relativeManual.tester",
                    options: {
                        expected: {
                            rate: 30,
                            tickDuration: 1/30
                        }
                    }
                }
            },
            {
                name: "tick() at 240 Hz",
                async: false,
                tester: {
                    type: "flock.test.clock.relativeManual.tester",
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

    var suite = flock.test.clock.relativeClockTestSuite();
    suite.run();

}());
