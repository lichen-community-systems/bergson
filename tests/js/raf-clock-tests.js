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

    fluid.defaults("flock.test.clock.raf.refreshRateTestCase", {
        gradeNames: [
            "fluid.standardRelayComponent",
            "flock.test.clock.testCase.realtime",
            "autoInit"
        ],

        members: {
            durations: [],
            lastTime: null
        },

        invokers: {
            testTick: {
                funcName: "flock.test.clock.raf.logDuration",
                args: ["{clock}", "{that}"]
            }
        },

        listeners: {
            "{tester}.events.onStop": {
                funcName: "flock.test.clock.raf.testRefreshRate",
                args: ["{that}"]
            }
        }
    });

    flock.test.clock.raf.logDuration = function (clock, that) {
        if (that.lastTime === null) {
            that.lastTime = clock.time;
            return;
        }

        that.durations.push(clock.time - that.lastTime);
        that.lastTime = clock.time;
    };

    flock.test.clock.raf.testRefreshRate = function (that) {
        var sum = 0;

        for (var i = 0; i < that.durations.length; i++) {
            sum += that.durations[i];
        }

        var avg = sum / that.durations.length,
            diffFromFrameRate = avg - 1000 / 60,
            threshold = 1;

        QUnit.ok(diffFromFrameRate < threshold,
            "THIS TEST MAY FAIL ON DISPLAYS RUNNING AT REFRESH RATES OTHER THAN 60 Hz." +
            " The clock should tick at 60 Hz. The average time between ticks was: " +
            avg);
    };


    fluid.defaults("flock.test.clock.tester.raf.refreshRate", {
        gradeNames: ["flock.test.clock.tester.raf", "autoInit"],

        components: {
            testCase: {
                type: "flock.test.clock.raf.refreshRateTestCase"
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
