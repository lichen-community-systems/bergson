(function () {

    "use strict";

    fluid.defaults("flock.test.clock.setIntervalClockTestSuite", {
        gradeNames: ["flock.test.clock.testSuite", "autoInit"],

        dynamicComponents: {
            tester: {
                type: "flock.test.clock.realtimeExternal.tester",
                options: {
                    components: {
                        clock: {
                            type: "flock.clock.setInterval"
                        }
                    }
                }
            }
        },

        tests: [
            {
                name: "Initial state, default options",
                initOnly: true
            },
            {
                name: "Initial state, 30 fps",
                initOnly: true,
                expected: {
                    rate: 30
                }
            },
            {
                name: "tick() time update",
                expected: {
                    rate: 30
                }
            }
        ]
    });

    var testSuite = flock.test.clock.setIntervalClockTestSuite();
    testSuite.run();
}());
