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

    QUnit.test("Initial state, default options", function () {
        flock.test.clock.raf.tester();
    });

    QUnit.test("Initial state, 30 fps", function () {
        flock.test.clock.raf.tester({
            expected: {
                rate: 30
            }
        });
    });

    QUnit.asyncTest("tick() time update", function () {
        var tester = flock.test.clock.raf.tester();
        tester.start();
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
            "THIS TEST WILL FAIL ON DISPLAYS RUNNING AT REFRESH RATES OTHER THAN 60 Hz." +
            " The clock should tick at 60 Hz. The average time between ticks was: " +
            avg);
    };

    QUnit.asyncTest("tick() should run at the refresh rate", function () {
        var tester = flock.test.clock.raf.tester({
            components: {
                testCase: {
                    type: "flock.test.clock.raf.refreshRateTestCase"
                }
            }
        });
        tester.clock.start();
    });

}());
