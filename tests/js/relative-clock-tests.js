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

        dynamicComponents: {
            tester: {
                type: "flock.test.clock.relativeManual.tester"
            }
        },

        tests: [
            {
                name: "Initialization, default options",
                testerOptions: {},
                initOnly: true
            },
            {
                name: "Initialization, 30 fps",
                testerOptions: {
                    expected: {
                        rate: 30,
                        tickDuration: 1/30
                    }
                },
                initOnly: true
            },
            {
                name: "tick() time update",
                async: false,
                testerOptions: {
                    expected: {
                        rate: 30,
                        tickDuration: 1/30
                    }
                }
            }

        ]
    });

    var suite = flock.test.clock.relativeClockTestSuite();
    suite.run();

}());
