(function () {

    "use strict";

    fluid.registerNamespace("flock.test.clock.raf");

    QUnit.module("requestAnimationFrame clock");

    QUnit.test("Initial state, default options", function () {
        var clock = flock.clock.raf();

        flock.test.clock.testRealtimeInitialState(clock, 60);
    });

    QUnit.test("Initial state, 30 fps", function () {
        var clock = flock.clock.raf({
            rate: 30
        });

        flock.test.clock.testRealtimeInitialState(clock, 30);
    });

    fluid.defaults("flock.test.clock.raf.tester", {
        gradeNames: ["fluid.standardRelayComponent", "autoInit"],

        numTicks: 60,

        model: {
            tickCount: 0
        },

        components: {
            clock: {
                type: "flock.clock.raf",
                options: {
                    events: {
                        onTick: "{tester}.events.onTick"
                    }
                }
            }
        },

        events: {
            onTick: "preventable",
            onStop: null
        },

        listeners: {
            onTick: [
                "flock.test.clock.raf.tester.tick({that}, {arguments}.0)",
                {
                    namespace: "tickTester",
                    funcName: "flock.test.clock.raf.tester.testTick",
                    args: ["{clock}", "{arguments}.0"]
                }
            ]
        }
    });

    flock.test.clock.raf.tester.tick = function (that, time) {
        that.applier.change("tickCount", that.model.tickCount + 1);
        if (that.model.tickCount >= that.options.numTicks) {
            that.events.onStop.fire();
            that.clock.stop();
            QUnit.start();

            return false;
        }
    };

    flock.test.clock.raf.tester.testTick = function (clock, time) {
        flock.test.assertTimeEqual(clock.time, performance.now(), 15, "The clock's time should reflect the current real time.");

        QUnit.equal(time, clock.time,
            "The time passed to the onTick event should be the clock's time.");
    };

    QUnit.asyncTest("tick() time update", function () {
        var tester = flock.test.clock.raf.tester();
        tester.clock.start();
    });


    fluid.defaults("flock.test.clock.raf.refreshRateTester", {
        gradeNames: ["flock.test.clock.raf.tester", "autoInit"],

        members: {
            durations: [],
            lastTime: null
        },

        listeners: {
            onTick: {
                namespace: "tickTester",
                funcName: "flock.test.clock.raf.logDuration",
                args: ["{that}"],
                priority: "last"
            },
            onStop: {
                funcName: "flock.test.clock.raf.testRefreshRate",
                args: ["{that}"]
            }
        }
    });

    flock.test.clock.raf.logDuration = function (that) {
        if (that.lastTime === null) {
            that.lastTime = that.clock.time;
            return;
        }

        that.durations.push(that.clock.time - that.lastTime);
        that.lastTime = that.clock.time;
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
        var tester = flock.test.clock.raf.refreshRateTester();
        tester.clock.start();
    });

}());
