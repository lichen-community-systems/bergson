(function () {

    "use strict";

    fluid.defaults("flock.test.clock.testCase.realtime", {
        gradeNames: ["flock.test.clock.testCase", "autoInit"],

        maxJitter: 5,

        invokers: {
            testInitState: {
                funcName: "flock.test.clock.testCase.realtime.testInitial",
                args: ["{clock}", "{tester}", "{that}.options.maxJitter"]
            },

            testTick: {
                funcName: "flock.test.clock.testCase.realtime.testTick",
                args: ["{clock}", "{arguments}.0", "{that}.options.maxJitter"]
            }
        }
    });

    flock.test.clock.testCase.realtime.testInitial = function (clock, tester, maxJitter) {
        var now = performance.now();

        QUnit.equal(clock.options.rate, tester.options.expected.rate,
            "The clock should be initialized with a rate of " +
            tester.options.expected.rate + ".");
        flock.test.assertTimeEqual(clock.time, now, maxJitter,
            "The clock should be initialized with the current time.");
    };

    flock.test.clock.testCase.realtime.testTick = function (clock, time, maxJitter) {
        var now = performance.now();
        flock.test.assertTimeEqual(clock.time, now, maxJitter,
            "The clock's time should reflect the current real time.");
        QUnit.equal(time, clock.time,
            "The time passed to the onTick event should be the clock's time.");
    };


    fluid.defaults("flock.test.clock.tester.realtime", {
        gradeNames: ["flock.test.clock.tester", "autoInit"],

        components: {
            testCase: {
                type: "flock.test.clock.testCase.realtime"
            },

            clock: {
                type: "flock.clock.realtime"
            }
        }
    });

    // Tester mixin grade for clocks that are driven externally and thus:
    //   a) run asynchronously and need to signal QUnit to resume.
    //   b) need to be explicitly stopped.
    fluid.defaults("flock.test.clock.tester.external", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],

        invokers: {
            start: "{clock}.start()"
        },

        listeners: {
            onStop: [
                {
                    priority: "first",
                    func: "{clock}.stop"
                },
                {
                    priority: "last",
                    func: "QUnit.start"
                }
            ]
        }
    });

    fluid.defaults("flock.test.clock.realtimeExternal.tester", {
        gradeNames: [
            "flock.test.clock.tester.external",
            "flock.test.clock.tester.realtime",
            "autoInit"
        ],

        expected: {
            rate: 60
        }
    });


    fluid.defaults("flock.test.clock.realtime.averageTickDurationTestCase", {
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
                funcName: "flock.test.clock.realtime.logDuration",
                args: ["{clock}", "{that}"]
            }
        },

        listeners: {
            "{tester}.events.onStop": {
                funcName: "flock.test.clock.realtime.testRefreshRate",
                args: ["{that}"]
            }
        }
    });

    flock.test.clock.realtime.logDuration = function (clock, that) {
        if (that.lastTime === null) {
            that.lastTime = clock.time;
            return;
        }

        that.durations.push(clock.time - that.lastTime);
        that.lastTime = clock.time;
    };

    flock.test.clock.realtime.testRefreshRate = function (that) {
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
}());
