(function () {

    "use strict";

    QUnit.module("Realtime clock");

    fluid.defaults("flock.test.clock.realtimeManual.tester", {
        gradeNames: [
            "flock.test.clock.tester.realtime",
            "flock.test.clock.tester.manual",
            "autoInit"
        ]
    });

    fluid.defaults("flock.test.clock.realtimeClockTestSuite", {
        gradeNames: ["flock.test.clock.testSuite", "autoInit"],

        dynamicComponents: {
            tester: {
                type: "flock.test.clock.realtimeManual.tester"
            }
        },

        tests: [
            {
                name: "Initialization, default options",
                initOnly: true
            },
            {
                name: "Initialization, 30 fps",
                initOnly: true,
                expected: {
                    rate: 30
                }
            },
            {
                name: "tick() time update",
                async: false,
                expected: {
                    rate: 30
                }
            }
        ]
    });

    var testSuite = flock.test.clock.realtimeClockTestSuite();
    testSuite.run();

}());
