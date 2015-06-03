(function () {

    "use strict";

    QUnit.module("Offline clock");

    fluid.defaults("flock.test.clock.offlineClockTestSuite", {
        gradeNames: ["flock.test.clock.testSuite", "autoInit"],

        tests: [
            {
                name: "Initialization, default options",
                initOnly: true,
                tester: {
                    type: "flock.test.clock.tester.offlineManual"
                }
            },
            {
                name: "Initialization, 30 Hz",
                initOnly: true,
                tester: {
                    type: "flock.test.clock.tester.offlineManual",
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
                    type: "flock.test.clock.tester.offlineManual",
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
                    type: "flock.test.clock.tester.offlineManual",
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

    var suite = flock.test.clock.offlineClockTestSuite();
    suite.run();

}());
