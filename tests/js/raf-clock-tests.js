(function () {

    "use strict";

    fluid.registerNamespace("flock.test.clock.raf");

    QUnit.module("requestAnimationFrame clock");

    fluid.defaults("flock.test.clock.raf.testCase", {
        gradeNames: ["flock.test.clock.testCase.realtime", "autoInit"],

        invokers: {
            testTick: {
                funcName: "flock.test.clock.raf.testCase.testTick",
                args: ["{clock}", "{arguments}.0"]
            }
        }
    });

    flock.test.clock.raf.testCase.testTick = function (clock, time) {
        var now = performance.now();
        flock.test.assertTimeEqual(clock.time, now, 5,
            "The clock's time should reflect the current real time.");
        QUnit.equal(time, clock.time,
            "The time passed to the onTick event should be the clock's time.");
    };


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
            "THIS TEST WILL FAIL ON DISPLAYS RUNNING AT REFRESH RATES OTHER THAN 60 Hz." +
            " The clock should tick at 60 Hz. The average time between ticks was: " +
            avg);
    };


    fluid.defaults("flock.test.clock.raf.tester", {
        gradeNames: [
            "flock.test.clock.tester.external",
            "flock.test.clock.tester.realtime",
            "autoInit"
        ],

        expected: {
            rate: 60
        },

        components: {
            testCase: {
                type: "flock.test.clock.raf.testCase"
            },

            clock: {
                type: "flock.clock.raf"
            }
        }
    });

    fluid.defaults("flock.test.clock.rafClockTestSuite", {
        gradeNames: ["flock.test.clock.testSuite", "autoInit"],

        dynamicComponents: {
            tester: {
                type: "flock.test.clock.raf.tester"
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
                testerOptions: {
                    expected: {
                        rate: 30
                    }
                }
            },
            {
                name: "tick() time update"
            },
            {
                name: "tick() should run at the refresh rate",
                testerOptions: {
                    components: {
                        testCase: {
                            type: "flock.test.clock.raf.refreshRateTestCase"
                        }
                    }
                }
            }
        ]
    });

    var testSuite = flock.test.clock.rafClockTestSuite();
    testSuite.run();
}());
